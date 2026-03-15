import mediapipe as mp
import numpy as np

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)

    ba = a - b
    bc = c - b

    cosine = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    angle = np.degrees(np.arccos(cosine))

    return angle


def detect_posture(rgb):

    results = pose.process(rgb)

    bad_posture = False

    if results.pose_landmarks:

        lm = results.pose_landmarks.landmark

        nose = [lm[0].x, lm[0].y]
        shoulder = [lm[11].x, lm[11].y]
        hip = [lm[23].x, lm[23].y]

        neck_angle = calculate_angle(nose, shoulder, hip)

        if neck_angle < 40:
            bad_posture = True

        left_shoulder = lm[11]
        left_hip = lm[23]

        spine_slope = abs(left_shoulder.x - left_hip.x)

        if spine_slope > 0.1:
            bad_posture = True

    return bad_posture