import cv2
from eye_detection import detect_drowsiness
from posture_detection import detect_posture
from analysis_engine import analyze_results
from backend_client import send_alert

cap = cv2.VideoCapture(0)

while True:

    ret, frame = cap.read()

    if not ret:
        break

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    eye_alert = detect_drowsiness(frame, rgb)
    posture_alert = detect_posture(rgb)

    result = analyze_results(eye_alert, posture_alert)

    if result["alert"]:

        # show alert on screen
        cv2.putText(frame,
                    result["alert"],
                    (50,50),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    (0,0,255),
                    3)

        # send alert to backend
        send_alert(result)

    cv2.imshow("AI Monitor", frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()