# AI/ML Module - PosturePal

This folder contains all AI/ML components for real-time posture and eye detection.

## Modules

### `eye_detection.py`
- **Function**: `detect_drowsiness(frame, rgb)`
- Detects eye closure using MediaPipe Face Mesh
- Returns alert if eyes closed for more than 5 seconds
- Uses Eye Aspect Ratio (EAR) threshold of 0.25

### `posture_detection.py`
- **Function**: `detect_posture(rgb)`
- Detects bad posture using MediaPipe Pose
- Checks neck angle and spine alignment
- Returns True if bad posture detected

### `analysis_engine.py`
- **Function**: `analyze_results(eye_alert, posture_alert)`
- Analyzes both eye and posture alerts
- Generates recommendations and alert messages
- Returns structured result with status, alert, and recommendation

### `backend_client.py`
- **Function**: `send_alert(data)`
- Sends alert data to backend API
- Posts to `http://localhost:5000/alert`

### `camera_stream.py`
- Basic camera streaming module
- Captures video from webcam (index 0)
- Press 'q' to quit

### `main_ai.py`
- Main orchestrator script
- Combines all modules for real-time monitoring
- Displays alerts on video and sends to backend
- Press 'ESC' to quit

## Dependencies
```
opencv-python (cv2)
mediapipe
numpy
requests
```

## Usage

Run the main AI monitoring:
```bash
python main_ai.py
```

## Features
- Real-time drowsiness detection
- Bad posture detection
- Combined alert analysis
- Backend integration for storing alerts
- Visual feedback on video stream
