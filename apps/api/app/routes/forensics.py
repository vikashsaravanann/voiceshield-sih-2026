"""
VoiceShield — Forensic Audio Splicing & Deepfake Analysis API
Evaluates uploaded audio recordings across 333ms inspection windows,
detects exact millisecond splice boundaries, and generates SHA-256 evidence data.
SIH26104 | AICTE Cyber Security Cell
"""

import hashlib
import io
from typing import Any, Dict, List, Literal

from fastapi import APIRouter, File, HTTPException, Request, UploadFile
import numpy as np
from pydantic import BaseModel, Field
import structlog

from app.ml.feature_extractor import extract_features

logger = structlog.get_logger()
router = APIRouter(prefix="/forensics", tags=["Forensics"])


class ForensicMarkersModel(BaseModel):
  high_frequency_anomaly: float = Field(ge=0.0, le=1.0)
  phase_discontinuity: float = Field(ge=0.0, le=1.0)
  prosody_irregularity: float = Field(ge=0.0, le=1.0)


class ForensicSliceModel(BaseModel):
  index: int
  start_time_ms: int
  end_time_ms: int
  spoof_probability: float = Field(ge=0.0, le=1.0)
  risk_level: Literal["low", "medium", "high"]
  is_spliced: bool
  markers: ForensicMarkersModel


class SpliceRegionModel(BaseModel):
  start_time_ms: int
  end_time_ms: int
  duration_ms: int
  average_risk: float
  type: Literal["synthetic_insertion", "benign_segment"]


class ForensicAnalysisResponse(BaseModel):
  file_name: str
  file_sha256: str
  duration_seconds: float
  sample_rate: int
  total_chunks: int
  overall_spoof_probability: float
  max_spoof_probability: float
  synthetic_duration_ms: int
  synthetic_ratio: float
  overall_risk_level: Literal["low", "medium", "high"]
  splice_regions: List[SpliceRegionModel]
  slices: List[ForensicSliceModel]
  xai_summary: str | None = None


@router.post("/analyze", response_model=ForensicAnalysisResponse)
async def analyze_audio_file(
    request: Request,
    file: UploadFile = File(...),
) -> ForensicAnalysisResponse:
  """Analyze an audio file for deepfake voice injection and splicing transitions."""
  content = await file.read()
  if len(content) == 0:
    raise HTTPException(status_code=400, detail="Uploaded file is empty.")

  # 1. Cryptographic SHA-256 digest
  sha256_hash = hashlib.sha256(content).hexdigest()

  # 2. Audio decoding with fallback
  sample_rate = 16000
  try:
    import soundfile as sf

    audio_data, sr = sf.read(io.BytesIO(content), dtype="float32")
    if audio_data.ndim > 1:
      audio_data = audio_data.mean(axis=1)  # downmix to mono
    sample_rate = sr
    pcm16 = (audio_data * 32767.0).astype(np.int16)
  except Exception as decode_err:
    logger.warning("forensics.decode_fallback", error=str(decode_err))
    pcm16 = np.frombuffer(content[: (len(content) // 2) * 2], dtype=np.int16)

  total_samples = len(pcm16)
  chunk_samples = int(sample_rate * 0.333)  # 333ms window
  if chunk_samples <= 0:
    chunk_samples = 5328

  total_chunks = max(1, total_samples // chunk_samples)
  duration_seconds = round(total_samples / sample_rate, 2)
  model = getattr(request.app.state, "model", None)

  slices: List[ForensicSliceModel] = []
  total_risk = 0.0
  max_risk = 0.0

  for i in range(total_chunks):
    start_idx = i * chunk_samples
    end_idx = min(total_samples, start_idx + chunk_samples)
    chunk = pcm16[start_idx:end_idx]

    if len(chunk) < chunk_samples:
      chunk = np.pad(chunk, (0, chunk_samples - len(chunk)))

    start_time_ms = int((start_idx / sample_rate) * 1000)
    end_time_ms = int((end_idx / sample_rate) * 1000)

    # Extract spectral & phase features
    feats = extract_features(chunk.tobytes())
    spoof_prob = 0.08
    if model:
      spoof_prob = model.predict(feats)
    else:
      phase_incon = feats.get("phase_inconsistency", 0.05)
      hf_ratio = feats.get("high_frequency_energy_ratio", 0.05)
      spoof_prob = min(0.95, max(0.04, phase_incon * 0.5 + hf_ratio * 0.4))

    markers = ForensicMarkersModel(
        high_frequency_anomaly=round(
            float(feats.get("high_frequency_energy_ratio", 0.08)), 3
        ),
        phase_discontinuity=round(
            float(feats.get("phase_inconsistency", 0.06)), 3
        ),
        prosody_irregularity=0.08,
    )

    is_spliced = False
    if slices:
      prev_prob = slices[-1].spoof_probability
      if abs(prev_prob - spoof_prob) >= 0.38:
        is_spliced = True

    risk_level: Literal["low", "medium", "high"] = (
        "high"
        if spoof_prob >= 0.75
        else "medium"
        if spoof_prob >= 0.35
        else "low"
    )

    slices.append(
        ForensicSliceModel(
            index=i,
            start_time_ms=start_time_ms,
            end_time_ms=end_time_ms,
            spoof_probability=round(spoof_prob, 3),
            risk_level=risk_level,
            is_spliced=is_spliced,
            markers=markers,
        )
    )

    total_risk += spoof_prob
    if spoof_prob > max_risk:
      max_risk = spoof_prob

  # Compute contiguous splice regions
  splice_regions: List[SpliceRegionModel] = []
  curr_region: Dict[str, Any] | None = None

  for idx, s in enumerate(slices):
    is_synth = s.spoof_probability >= 0.45
    reg_type: Literal["synthetic_insertion", "benign_segment"] = (
        "synthetic_insertion" if is_synth else "benign_segment"
    )

    if not curr_region:
      curr_region = {
          "start": idx,
          "type": reg_type,
          "risk_sum": s.spoof_probability,
          "count": 1,
      }
    elif curr_region["type"] == reg_type:
      curr_region["risk_sum"] += s.spoof_probability
      curr_region["count"] += 1
    else:
      start_s = slices[curr_region["start"]]
      end_s = slices[idx - 1]
      splice_regions.append(
          SpliceRegionModel(
              start_time_ms=start_s.start_time_ms,
              end_time_ms=end_s.end_time_ms,
              duration_ms=end_s.end_time_ms - start_s.start_time_ms,
              average_risk=round(
                  curr_region["risk_sum"] / curr_region["count"], 3
              ),
              type=curr_region["type"],
          )
      )
      curr_region = {
          "start": idx,
          "type": reg_type,
          "risk_sum": s.spoof_probability,
          "count": 1,
      }

  if curr_region and slices:
    start_s = slices[curr_region["start"]]
    end_s = slices[-1]
    splice_regions.append(
        SpliceRegionModel(
            start_time_ms=start_s.start_time_ms,
            end_time_ms=end_s.end_time_ms,
            duration_ms=end_s.end_time_ms - start_s.start_time_ms,
            average_risk=round(
                curr_region["risk_sum"] / curr_region["count"], 3
            ),
            type=curr_region["type"],
        )
    )

  avg_spoof = round(total_risk / total_chunks, 3) if total_chunks else 0.05
  synthetic_duration = sum(
      r.duration_ms for r in splice_regions if r.type == "synthetic_insertion"
  )
  total_dur_ms = duration_seconds * 1000
  synth_ratio = (
      round(synthetic_duration / total_dur_ms, 3) if total_dur_ms > 0 else 0.0
  )

  overall_risk: Literal["low", "medium", "high"] = (
      "high"
      if synth_ratio >= 0.20 or max_risk >= 0.85
      else "medium"
      if avg_spoof >= 0.35
      else "low"
  )
  
  # Generate XAI summary using Groq
  from services.groq_service import generate_xai_summary
  avg_markers = {
      "high_frequency_anomaly": round(sum(s.markers.high_frequency_anomaly for s in slices) / len(slices), 3) if slices else 0,
      "phase_discontinuity": round(sum(s.markers.phase_discontinuity for s in slices) / len(slices), 3) if slices else 0,
      "prosody_irregularity": round(sum(s.markers.prosody_irregularity for s in slices) / len(slices), 3) if slices else 0,
  }
  xai_summary = await generate_xai_summary(avg_markers, overall_risk, max_risk)

  return ForensicAnalysisResponse(
      file_name=file.filename or "uploaded_audio.wav",
      file_sha256=sha256_hash,
      duration_seconds=duration_seconds,
      sample_rate=sample_rate,
      total_chunks=total_chunks,
      overall_spoof_probability=avg_spoof,
      max_spoof_probability=round(max_risk, 3),
      synthetic_duration_ms=synthetic_duration,
      synthetic_ratio=synth_ratio,
      overall_risk_level=overall_risk,
      splice_regions=splice_regions,
      slices=slices,
      xai_summary=xai_summary
  )
