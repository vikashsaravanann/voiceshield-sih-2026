# VoiceShield ML assets

SIH default path (after export):

```
apps/api/models/voiceshield-spoof-v0.1.pt
```

Create it from the repo root:

```bash
pip3 install torch
python3 ml/export_spoof_head.py
```

This writes a ~36 KB TorchScript head. Input is 48-d float32 (40 LFCC + 8 scalars). Output is spoof probability in `[0, 1]`.

The generated head is a development asset, not a published AASIST or RawNet2 weight file. Do not commit ASVspoof datasets or credentials. Any replacement model must document its license, training data, calibration set, and evaluation protocol in `ml/model_cards/`.
