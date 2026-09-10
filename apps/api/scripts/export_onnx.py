import torch
import torch.nn as nn
import os
import argparse

class DummySpoofModel(nn.Module):
    def __init__(self):
        super().__init__()
        # 1D-CNN simple architecture
        self.conv1 = nn.Conv1d(in_channels=80, out_channels=32, kernel_size=3, padding=1)
        self.relu = nn.ReLU()
        self.pool = nn.AdaptiveAvgPool1d(1)
        self.fc = nn.Linear(32, 1)

    def forward(self, x):
        # x is (B, C, L) e.g. (1, 80, 32)
        x = self.conv1(x)
        x = self.relu(x)
        x = self.pool(x)
        x = x.squeeze(-1)
        x = self.fc(x)
        return x

def export_to_onnx(model_path: str, output_path: str):
    print(f"Loading model from {model_path} or using Dummy if not found...")
    try:
        model = torch.jit.load(model_path, map_location="cpu")
        model.eval()
    except Exception as e:
        print(f"Warning: Real model load failed ({e}), using DummySpoofModel for Edge SDK Export")
        model = DummySpoofModel()
        model.eval()
    
    # LFCC features shape (Batch, 80, SeqLength)
    dummy_input = torch.randn(1, 80, 32, requires_grad=True)
    
    # Export the model
    torch.onnx.export(model,               
                      dummy_input,         
                      output_path,   
                      export_params=True,  
                      opset_version=14,    
                      do_constant_folding=True, 
                      input_names = ['input_lfcc'], 
                      output_names = ['spoof_logits'],
                      dynamic_axes={'input_lfcc' : {0 : 'batch_size', 2: 'sequence_length'}, 
                                    'spoof_logits' : {0 : 'batch_size'}})
    print(f"ONNX Model successfully exported to {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export PyTorch Model to ONNX for Edge SDK")
    parser.add_argument("--model", type=str, default="weights/aasist.pt", help="Path to input PyTorch model")
    parser.add_argument("--output", type=str, default="weights/aasist_edge.onnx", help="Path to output ONNX model")
    args = parser.parse_args()
    
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    export_to_onnx(args.model, args.output)
