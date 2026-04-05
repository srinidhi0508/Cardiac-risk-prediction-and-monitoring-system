import requests
import random
import time

while True:
    bpm = random.randint(80, 100)

    data = {
        "patient_id": "P001",
        "value": bpm
    }

    requests.post("http://127.0.0.1:8000/sensor-data", json=data)

    print("Sent BPM:", bpm)

    time.sleep(3)