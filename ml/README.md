# ML

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

This is **not** a published AASIST / RawNet2 weight file. Do not commit ASVspoof datasets. Swap the `.pt` after a real fine-tune.
