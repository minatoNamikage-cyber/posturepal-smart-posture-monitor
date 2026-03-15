def analyze_results(eye_alert, posture_alert):

    result = {
        "eye_status": "open",
        "posture_status": "good",
        "alert": None,
        "recommendation": None
    }

    if eye_alert:
        result["eye_status"] = "closed"
        result["alert"] = "DROWSINESS DETECTED"
        result["recommendation"] = "Please take a short break"

    if posture_alert:
        result["posture_status"] = "bad"
        result["alert"] = "BAD POSTURE"
        result["recommendation"] = "Sit upright and align shoulders"

    if eye_alert and posture_alert:
        result["alert"] = "CRITICAL ALERT"
        result["recommendation"] = "Take break and fix posture"

    return result