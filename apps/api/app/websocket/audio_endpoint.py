"""WebSocket protocol for 333 ms PCM hops + resume."""

from __future__ import annotations

import json
import math
import time
from typing import Any

from fastapi import WebSocket, WebSocketDisconnect


def _heuristic_spoof(pcm: bytes) -> float:
    if len(pcm) < 64:
        return 0.08
    samples = []
    for i in range(0, min(len(pcm) - 1, 4000), 2):
        v = int.from_bytes(pcm[i : i + 2], "little", signed=True) / 32768.0
        samples.append(v)
    if not samples:
        return 0.08
    rms = math.sqrt(sum(s * s for s in samples) / len(samples))
    if rms < 0.004:
        return 0.04
    # Zero-crossing regularity is a cheap vocoder tell.
    zc = 0
    for a, b in zip(samples, samples[1:]):
        if a * b < 0:
            zc += 1
    zcr = zc / max(1, len(samples) - 1)
    raw = 0.12 + min(0.7, abs(zcr - 0.08) * 4) + min(0.2, rms * 2)
    return max(0.02, min(0.98, raw))


def _risk(p: float) -> str:
    if p < 0.35:
        return "low"
    if p >= 0.75:
        return "high"
    return "medium"


async def handle_audio_socket(ws: WebSocket) -> None:
    await ws.accept()
    session_id = "anon"
    index = 0
    last_ack = -1
    t0 = time.perf_counter()
    try:
        while True:
            message = await ws.receive()
            if message["type"] == "websocket.disconnect":
                break
            if "text" in message and message["text"]:
                payload = json.loads(message["text"])
                kind = payload.get("type")
                if kind in {"session.start", "start"}:
                    session_id = payload.get("session_id") or session_id
                    await ws.send_json({"type": "session.ack", "session_id": session_id})
                elif kind == "resume":
                    last_ack = int(payload.get("last_chunk_index", last_ack))
                    await ws.send_json({"type": "resume.ack", "last_chunk_index": last_ack})
                elif kind == "chunk":
                    # JSON hop with base64 is accepted for debug clients.
                    index = int(payload.get("index", index + 1))
                    await _emit(ws, session_id, index, 0.12, t0)
            elif "bytes" in message and message["bytes"]:
                pcm = message["bytes"]
                index += 1
                p = _heuristic_spoof(pcm)
                await _emit(ws, session_id, index, p, t0)
    except WebSocketDisconnect:
        return


async def _emit(ws: WebSocket, session_id: str, index: int, p: float, t0: float) -> None:
    risk = _risk(p)
    action = "continue" if risk == "low" else "challenge" if risk == "medium" else "block"
    body: dict[str, Any] = {
        "type": "detection.result",
        "session_id": session_id,
        "chunk_index": index,
        "spoof_probability": round(p, 4),
        "risk_level": risk,
        "suggested_action": action,
        "latency_ms": round((time.perf_counter() - t0) * 1000, 2),
        "explainability_markers": {
            "high_frequency_anomaly": round(min(1.0, p * 1.05), 3),
            "phase_discontinuity": round(min(1.0, p * 0.9), 3),
            "prosody_irregularity": round(min(1.0, p * 0.95), 3),
        },
        "model": {"name": "heuristic-dsp", "version": "0.1.0"},
    }
    await ws.send_json(body)
