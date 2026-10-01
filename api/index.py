from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os


# ==========================================
# CREATE FASTAPI APP
# ==========================================

app = FastAPI(
    title="Heart Disease Prediction API",
    description="Machine Learning API for heart disease prediction",
    version="1.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# MODEL PATH
# ==========================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "heart_model.pkl"
)

SCALER_PATH = os.path.join(
    BASE_DIR,
    "model",
    "scaler.pkl"
)


# ==========================================
# LOAD MODEL
# ==========================================

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)


# ==========================================
# INPUT DATA MODEL
# ==========================================

class HeartData(BaseModel):

    age: float
    sex: float
    cp: float
    trestbps: float
    chol: float
    fbs: float
    restecg: float
    thalach: float
    exang: float
    oldpeak: float
    slope: float
    ca: float
    thal: float


# ==========================================
# HOME API
# ==========================================

@app.get("/")
def home():

    return {
        "message": "Heart Disease Prediction API",
        "status": "running"
    }


# ==========================================
# PREDICTION API
# ==========================================

@app.post("/api/predict")
def predict(data: HeartData):

    input_data = pd.DataFrame(
        [[
            data.age,
            data.sex,
            data.cp,
            data.trestbps,
            data.chol,
            data.fbs,
            data.restecg,
            data.thalach,
            data.exang,
            data.oldpeak,
            data.slope,
            data.ca,
            data.thal
        ]],
        columns=[
            "age",
            "sex",
            "cp",
            "trestbps",
            "chol",
            "fbs",
            "restecg",
            "thalach",
            "exang",
            "oldpeak",
            "slope",
            "ca",
            "thal"
        ]
    )


    # Scale input
    input_scaled = scaler.transform(input_data)


    # Prediction
    prediction = model.predict(input_scaled)[0]


    # Probability
    probabilities = model.predict_proba(input_scaled)[0]

    probability = max(probabilities) * 100


    # Result
    if int(prediction) == 1:

        result = "Higher predicted risk"

    else:

        result = "Lower predicted risk"


    return {
        "prediction": int(prediction),
        "result": result,
        "confidence": round(float(probability), 2)
    }