import torch
import torch.nn as nn

# Example set of classes – replace with your actual disease labels
CLASS_NAMES = [
    "Healthy",
    "Bacterial_spot",
    "Early_blight",
    "Late_blight",
    "Leaf_mold",
    "Septoria_leaf_spot",
    "Spider_mites",
    "Target_spot",
    "Yellow_leaf_curl_virus",
    "Mosaic_virus",
]

class SimpleCNN(nn.Module):
    def __init__(self, num_classes: int = len(CLASS_NAMES)):
        super(SimpleCNN, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 16, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),

            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),

            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 28 * 28, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(256, num_classes),
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x

def load_model(weights_path: str = "weights/plant_cnn.pth") -> nn.Module:
    """
    Loads the CNN model. If weights are not found,
    returns a randomly initialised model so that the code still runs.
    """
    import os

    model = SimpleCNN(num_classes=len(CLASS_NAMES))
    if os.path.exists(weights_path):
        state_dict = torch.load(weights_path, map_location="cpu")
        model.load_state_dict(state_dict)
        print(f"Loaded model weights from {weights_path}")
    else:
        print(
            f"[WARN] Weights file '{weights_path}' not found. "
            "Using randomly initialised model. "
            "Train the model and save weights to enable real predictions."
        )
    return model
