import torch
import torch.nn as nn
import torch.onnx
import onnx
from onnx_tf.backend import prepare
import tensorflow as tf
import os

# ---------------------------------------------------------
# 1. Define the ResNet9 Architecture
# ---------------------------------------------------------
def conv_block(in_channels, out_channels, pool=False):
    layers = [
        nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
        nn.BatchNorm2d(out_channels),
        nn.ReLU(inplace=True)
    ]
    if pool:
        layers.append(nn.MaxPool2d(2))
    return nn.Sequential(*layers)

class ResNet9(nn.Module):
    def __init__(self, in_channels, num_classes):
        super().__init__()
        self.conv1 = conv_block(in_channels, 64)
        self.conv2 = conv_block(64, 128, pool=True)
        self.res1 = nn.Sequential(conv_block(128, 128), conv_block(128, 128))
        self.conv3 = conv_block(128, 256, pool=True)
        self.conv4 = conv_block(256, 512, pool=True)
        self.res2 = nn.Sequential(conv_block(512, 512), conv_block(512, 512))
        self.classifier = nn.Sequential(
            nn.AdaptiveMaxPool2d(1),
            nn.Flatten(),
            nn.Dropout(0.2), # Dropout might be present or not, usually harmless for inference if eval() is called
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        out = self.conv1(x)
        out = self.conv2(out)
        out = self.res1(out) + out
        out = self.conv3(out)
        out = self.conv4(out)
        out = self.res2(out) + out
        out = self.classifier(out)
        return out

def convert_pytorch_to_tflite(model_path, output_tflite_path, num_classes=35):
    print(f"Loading PyTorch model from {model_path}...")
    
    # Initialize model
    device = torch.device('cpu')
    model = ResNet9(in_channels=3, num_classes=num_classes)
    
    # Load state dict
    try:
        model.load_state_dict(torch.load(model_path, map_location=device))
    except Exception as e:
        print(f"Error loading state dict: {e}")
        print("Attempting to load as a full model object...")
        try:
            model = torch.load(model_path, map_location=device)
        except Exception as e2:
            print(f"Failed to load model: {e2}")
            return

    model.eval()
    
    # Dummy input for ONNX export (Batch Size, Channels, Height, Width)
    dummy_input = torch.randn(1, 3, 128, 128, device=device)
    
    onnx_path = model_path.replace('.pth', '.onnx')
    print(f"Exporting to ONNX: {onnx_path}...")
    
    torch.onnx.export(
        model,
        dummy_input,
        onnx_path,
        export_params=True,
        opset_version=11,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
    )
    
    # ---------------------------------------------------------
    # 2. Convert ONNX to TensorFlow SavedModel
    # ---------------------------------------------------------
    print("Converting ONNX to TensorFlow SavedModel...")
    onnx_model = onnx.load(onnx_path)
    tf_rep = prepare(onnx_model)
    
    tf_model_path = model_path.replace('.pth', '_saved_model')
    tf_rep.export_graph(tf_model_path)
    print(f"Saved TensorFlow model to {tf_model_path}")
    
    # ---------------------------------------------------------
    # 3. Convert SavedModel to TFLite with Quantization
    # ---------------------------------------------------------
    print("Converting to TFLite with quantization...")
    converter = tf.lite.TFLiteConverter.from_saved_model(tf_model_path)
    
    # Optimization (Dynamic Range Quantization)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    
    tflite_model = converter.convert()
    
    with open(output_tflite_path, 'wb') as f:
        f.write(tflite_model)
        
    print(f"Successfully created TFLite model: {output_tflite_path}")
    
    # Verify Input Shape
    try:
        interpreter = tf.lite.Interpreter(model_path=output_tflite_path)
        interpreter.allocate_tensors()
        input_details = interpreter.get_input_details()
        print("\nModel Input Details:")
        print(f"Shape: {input_details[0]['shape']}")
        print(f"Type: {input_details[0]['dtype']}")
        print("NOTE: If shape is [1, 3, 128, 128], you must transpose your image data to (C, H, W) in your mobile app.")
        print("      If shape is [1, 128, 128, 3], you can feed the image data directly (H, W, C).")
    except Exception as e:
        print(f"Could not verify input details: {e}")

if __name__ == "__main__":
    # Path to your .pth file
    # Assuming the user will place the file in the same directory or provide path
    MODEL_PATH = "ISN-2-custom-resnet.pth" 
    OUTPUT_PATH = "isl_hand2voice_model.tflite"
    
    if not os.path.exists(MODEL_PATH):
        print(f"WARNING: Model file {MODEL_PATH} not found in current directory.")
        print("Please ensure the file exists or update MODEL_PATH in the script.")
    else:
        convert_pytorch_to_tflite(MODEL_PATH, OUTPUT_PATH)
