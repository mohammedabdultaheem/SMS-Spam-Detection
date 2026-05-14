import requests
import json

url = "http://localhost:8000/classify"
payload = {"text": "Urgent: Your account has been suspended. Click here to verify: http://bit.ly/fake-link"}
headers = {"Content-Type": "application/json"}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
