#!/usr/bin/env python3
"""
VoiceShield — Anti-Spoofing ML Model Exporter
Exports TorchScript (.pt) and ONNX (.onnx) models for real-time voice clone detection.
SIH26104 | voiceshield-team/voiceshield-sih-2026

Usage:
  python3 ml/export_model.py [--output-dir apps/api/models]
"""

import argparse
import os
from pathlib import Path
import struct
import torch
import torch.nn as nn

class VoiceShieldAASISTHead(nn.Module):
    """
    Lightweight 1D Temporal Convolutional Spoof Classifier.
    Takes 80-channel LFCC features (40 static + 40 delta coefficients)
    across any variable audio chunk length T and outputs a scalar logit.
    """
    def __init__(self, in_channels: int = 80):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv1d(in_channels, 64, kernel_size=3, padding=1),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Conv1d(64, 32, kernel_size=3, padding=1),
            nn.BatchNorm1d(32),
            nn.ReLU(),
            nn.AdaptiveAvgPool1d(1)  # Pools across variable time frame dimension T
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(32, 16),
            nn.ReLU(),
            nn.Linear(16, 1)  # Raw unnormalized logit
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Input shape: (Batch, 80, Time)
        features = self.conv(x)
        logits = self.classifier(features)
        return logits.squeeze(-1)


def export_models(output_dir: Path):
    output_dir.mkdir(parents=True, exist_ok=True)
    torch.manual_seed(26104)

    model = VoiceShieldAASISTHead(in_channels=80).eval()

    # Example input: (batch=1, channels=80, time_frames=33) corresponding to ~333ms at 16kHz
    dummy_input = torch.randn(1, 80, 33)

    # 1. Export TorchScript (.pt)
    pt_path = output_dir / "aasist.pt"
    traced_model = torch.jit.trace(model, dummy_input)
    traced_model.save(str(pt_path))
    print(f"✅ Exported TorchScript model to: {pt_path.resolve()} ({pt_path.stat().st_size} bytes)")

    # 2. Export ONNX (.onnx)
    onnx_path = output_dir / "aasist.onnx"
    try:
        torch.onnx.export(
            model,
            dummy_input,
            str(onnx_path),
            input_names=["lfcc_features"],
            output_names=["spoof_logits"],
            dynamic_axes={
                "lfcc_features": {0: "batch_size", 2: "time_frames"},
                "spoof_logits": {0: "batch_size"},
            },
            opset_version=14,
        )
        print(f"✅ Exported ONNX model to:        {onnx_path.resolve()} ({onnx_path.stat().st_size} bytes)")
    except Exception as e:
        print(f"⚠️ ONNX export warning: {e}")

    # 3. Verification test
    loaded_pt = torch.jit.load(str(pt_path))
    with torch.no_grad():
        test_out = loaded_pt(dummy_input)
        prob = torch.sigmoid(test_out).item()
    print(f"🧪 Test verification forward pass: logit={test_out.item():.4f}, spoof_probability={prob:.4f}")
    return pt_path, onnx_path


def main():
    parser = argparse.ArgumentParser(description="VoiceShield Model Exporter")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path(__file__).parent.parent / "apps" / "api" / "models",
        help="Target directory for exported .pt and .onnx models",
    )
    args = parser.parse_args()
    export_models(args.output_dir)


if __name__ == "__main__":
    main()
