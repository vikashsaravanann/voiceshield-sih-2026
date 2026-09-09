#!/usr/bin/env python3
"""Export VoiceShield SIH bootstrap spoof head as TorchScript.

Not a published AASIST / RawNet2 checkpoint. Swap after ASVspoof fine-tune.

Usage (from repo root):
  python3 ml/export_spoof_head.py
"""
from __future__ import annotations

import argparse
from pathlib import Path

import torch
import torch.nn as nn

FEATURE_DIM = 48  # LFCC(40) + rms, zcr, f0, harm, centroid, rolloff, slope, flatness


class VoiceShieldSpoofNet(nn.Module):
    def __init__(self, dim: int = FEATURE_DIM) -> None:
        super().__init__()
        self.net = nn.Sequential(
            nn.LayerNorm(dim),
            nn.Linear(dim, 64),
            nn.GELU(),
            nn.Linear(64, 32),
            nn.GELU(),
            nn.Linear(32, 1),
        )

    def forward(self, features: torch.Tensor) -> torch.Tensor:
        return torch.sigmoid(self.net(features).squeeze(-1))


def export(out: Path) -> Path:
    torch.manual_seed(26104)
    model = VoiceShieldSpoofNet().eval()
    example = torch.zeros(1, FEATURE_DIM)
    example[0, 40] = 0.08
    example[0, 41] = 0.07
    example[0, 43] = 0.70
    out.parent.mkdir(parents=True, exist_ok=True)
    scripted = torch.jit.trace(model, example)
    scripted.save(str(out))
    print(f"wrote {out} ({out.stat().st_size} bytes)")
    print(f"probe_prob={model(example).item():.4f}")
    print("MODEL_PATH=" + str(out.resolve()))
    return out


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--out",
        default="apps/api/models/voiceshield-spoof-v0.1.pt",
        help="TorchScript output path",
    )
    args = parser.parse_args()
    export(Path(args.out))


if __name__ == "__main__":
    main()
