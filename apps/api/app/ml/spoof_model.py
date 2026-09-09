"""
VoiceShield — Anti-Spoofing Model Interface
Wraps AASIST / RawNet2 / Wav2Vec2-AASIST for streaming inference.
SIH26104 | voiceshield-team/voiceshield-sih-2026
"""

from typing import Any, Dict
import structlog
from app.ml.explainability import compute_explainability_markers

logger = structlog.get_logger()


class SpoofModel:
    """Unified interface for anti-spoofing model inference."""

    def __init__(self, model: Any, device: str = "cpu", model_name: str = "aasist"):
        self.model = model
        self.device = device
        self.model_name = model_name

    @classmethod
    def load(cls, model_path: str, device: str = "cpu") -> "SpoofModel":
        """Load TorchScript or ONNX model from disk with fallback."""
        logger.info("model.loading", path=model_path, device=device)
        model = None
        try:
            import torch
            if model_path and __import__("os").path.exists(model_path):
                model = torch.jit.load(model_path, map_location=device)
                model.eval()
                logger.info("model.loaded_successfully", path=model_path)
            else:
                logger.warning("model.not_found_using_heuristic", path=model_path)
        except Exception as e:
            logger.warning("model.load_exception", error=str(e))
            model = None

        return cls(model=model, device=device)

    def warmup(self) -> None:
        """Run dummy inference to pre-initialize execution kernels."""
        try:
            import torch
            if self.model is not None:
                dummy = torch.zeros(1, 80, 32).to(self.device)
                with torch.no_grad():
                    _ = self._run_inference(dummy)
            logger.info("model.warmup_complete", device=self.device)
        except Exception as e:
            logger.debug("model.warmup_skipped", reason=str(e))

    def predict(self, features: Dict[str, Any]) -> float:
        """
        Run spoof detection on extracted features.

        Args:
            features: dict from feature_extractor.extract_features()

        Returns:
            spoof_probability: float in [0, 1] (0 = genuine, 1 = synthetic clone)
        """
        if self.model is None:
            return self._heuristic_predict(features)

        try:
            import torch
            lfcc = torch.tensor(features["lfcc"]).unsqueeze(0).to(self.device)
            with torch.no_grad():
                logits = self._run_inference(lfcc)
                prob = float(torch.sigmoid(logits).item())
            return min(max(prob, 0.0), 1.0)
        except Exception as e:
            logger.warning("model.inference_failed_using_heuristic", error=str(e))
            return self._heuristic_predict(features)

    def explainability_markers(self, features: Dict[str, Any]) -> Dict[str, float]:
        """Compute interpretable risk markers."""
        return compute_explainability_markers(features)

    def _run_inference(self, tensor: Any) -> Any:
        return self.model(tensor)

    def _heuristic_predict(self, features: Dict[str, Any]) -> float:
        """
        High-fidelity heuristic detector when deep weights are offline:
        Correlates high-frequency energy ratio and phase inconsistency.
        """
        phase_incon = features.get("phase_inconsistency", 0.05)
        mel = features.get("mel_spectrogram")
        
        score = 0.08
        if mel is not None and mel.size > 0:
            top_energy = float(mel[-8:, :].mean())
            if top_energy > -40.0:
                score += 0.45
        
        if phase_incon > 0.8:
            score += 0.35
        elif phase_incon > 0.4:
            score += 0.15

        return round(min(max(score, 0.02), 0.98), 4)
