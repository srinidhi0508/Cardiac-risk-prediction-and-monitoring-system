from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from datetime import datetime
import numpy as np

app = FastAPI()

# ✅ Allow frontend (Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change later if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ MongoDB connection
client = MongoClient("mongodb+srv://srinidhivodnala05_db_user:jhaBxNMxGnneWqME@cluster0.dufqv6v.mongodb.net/?appName=Cluster0")
db = client["cardiac_db"]
collection = db["patients"]


# =========================================================
# 🧠 ANALYSIS FUNCTION
# =========================================================
def compute_analysis(heart_data):
    if not heart_data or len(heart_data) == 0:
        return {
            "avg_bpm": 0,
            "min_bpm": 0,
            "max_bpm": 0,
            "variability": 0,
            "risk_level": "Low",
        }

    values = [d["value"] for d in heart_data]

    avg_bpm = float(np.mean(values))
    min_bpm = int(np.min(values))
    max_bpm = int(np.max(values))
    variability = float(np.std(values))

    # 🎯 Risk logic (simple but effective)
    if avg_bpm > 100 or variability > 15:
        risk = "High"
    elif avg_bpm > 90:
        risk = "Medium"
    else:
        risk = "Low"

    return {
        "avg_bpm": round(avg_bpm, 2),
        "min_bpm": min_bpm,
        "max_bpm": max_bpm,
        "variability": round(variability, 2),
        "risk_level": risk,
    }


# =========================================================
# 📡 ESP32 DATA RECEIVER
# =========================================================
@app.post("/update")
def update_data(data: dict):
    bpm = data.get("bpm")
    patient_id = data.get("patient_id", "P001")

    if bpm is None:
        return {"error": "No BPM provided"}

    # Push new reading (keep last 20)
    collection.update_one(
        {"patient_id": patient_id},
        {
            "$push": {
                "heart_data": {
                    "$each": [
                        {
                            "value": int(bpm),
                            "timestamp": datetime.utcnow(),
                        }
                    ],
                    "$slice": -20,
                }
            }
        },
        upsert=True,
    )

    return {"status": "ok", "bpm": bpm}


# =========================================================
# 📊 GET PATIENT DATA + ANALYSIS
# =========================================================
@app.get("/patient/{patient_id}")
def get_patient(patient_id: str):
    patient = collection.find_one({"patient_id": patient_id})

    if not patient:
        return {"error": "Patient not found"}

    # Convert ObjectId to string
    patient["_id"] = str(patient["_id"])

    heart_data = patient.get("heart_data", [])

    # Compute analysis
    analysis = compute_analysis(heart_data)

    patient["analysis"] = analysis

    return patient


# =========================================================
# 🧪 OPTIONAL TEST ROUTE
# =========================================================
@app.get("/")
def root():
    return {"message": "Cardiac API running 🚀"}