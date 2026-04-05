# 💓 Cardiac Risk Prediction & Monitoring System

A real-time IoT-based healthcare monitoring system that collects heart rate (BPM) data using an ESP32 and PPG sensor, processes it using a FastAPI backend, stores it in MongoDB, and visualizes it on a live dashboard built with Next.js.

---

## 🚀 Features

- 📡 Real-time heart rate monitoring using ESP32 + PPG sensor  
- ⚡ Live data streaming to backend (FastAPI)  
- 💾 MongoDB database for storing time-series health data  
- 📊 Interactive dashboard with live graphs  
- 🧠 Risk prediction based on heart rate analysis  
- 🔄 Automatic UI updates (real-time without refresh)  
- 📄 PDF report generation  

---

## 🧠 System Architecture
ESP32 + PPG Sensor
↓
FastAPI Backend (API)
↓
MongoDB Database
↓
Next.js Frontend Dashboard


---

## 🛠️ Tech Stack

### 🔹 Hardware
- ESP32
- SKU SEN0203 Pulse Sensor (PPG)

### 🔹 Backend
- FastAPI (Python)
- MongoDB Atlas
- Uvicorn

### 🔹 Frontend
- Next.js
- React
- Recharts (for graphs)
- Tailwind CSS

---

## 📊 How It Works 

1. ESP32 reads pulse sensor data (BPM)
2. Sends BPM to FastAPI via HTTP POST
3. Backend stores data in MongoDB
4. Backend computes:
   - Average BPM
   - Min / Max BPM
   - Variability (HRV approx)
   - Risk level
5. Frontend fetches updated data every second
6. Dashboard updates in real-time

---

## ⚙️ Setup Instructions

### 🔹 Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt

Run server:
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

### 🔹 Frontend Setup
cd cardio-ai-frontend
npm install
npm run dev

const char* serverUrl = "http://<YOUR_IP>:8000/update";
Upload code to ESP32


## 📊 Example Data
{
  "patient_id": "P001",
  "heart_data": [
    { "value": 88 },
    { "value": 92 }
  ],
  "analysis": {
    "avg_bpm": 90,
    "risk_level": "Medium"
  }
}

## 🚨 Future Improvements
WebSocket-based real-time streaming
Abnormal BPM detection & alerts 🚨
Mobile app integration
Multi-patient support
Cloud deployment

## 👩‍💻 Author
Srinidhi Vodnala
BTech ECE | Embedded Systems & AI Enthusiast


