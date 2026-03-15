import requests

API_URL = "http://localhost:5000/alert"

def send_alert(data):

    try:
        requests.post(API_URL, json=data)
    except:
        print("Backend not running")