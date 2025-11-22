# Flora Intel – ML Backend

This folder contains a **working template** for the plant disease prediction
machine learning backend using **FastAPI + PyTorch**.

## Structure

- `app.py` – FastAPI server exposing `/predict` endpoint
- `model.py` – Simple CNN model and `load_model` helper
- `train.py` – Template training loop (you must provide dataset)
- `requirements.txt` – Python dependencies

## How to Run

1. Create a virtual environment and install dependencies:

   ```bash
   cd ml_backend
   pip install -r requirements.txt
   ```

2. (Optional but recommended) Train the model:

   - Place your dataset as:

     ```text
     ml_backend/
       data/
         train/
           class_0/
           class_1/
           ...
         val/
           class_0/
           class_1/
           ...
     ```

   - Then run:

     ```bash
     python train.py
     ```

   This will create `weights/plant_cnn.pth`.

3. Start the API server:

   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

4. Integrate with the frontend (example):

   - From your React app, send a `multipart/form-data` POST request to
     `http://localhost:8000/predict` with an `image` file field.

## Notes

- If `weights/plant_cnn.pth` is missing, the API will still run, but
  predictions will be random because the model is not trained.
- Replace `CLASS_NAMES` in `model.py` with your real disease/plant labels.
