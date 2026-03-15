import mediapipe as mp
import numpy as np
import time

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh()

EAR_THRESHOLD = 0.25
EYE_CLOSE_TIME = 5

eye_closed_start = None


def distance(p1, p2):
    return np.linalg.norm(np.array(p1) - np.array(p2))


def detect_drowsiness(frame, rgb):

    global eye_closed_start

    results = face_mesh.process(rgb)

    alert = False

    if results.multi_face_landmarks:

        for face_landmarks in results.multi_face_landmarks:

            lm = face_landmarks.landmark

            top = lm[159]
            bottom = lm[145]
            left = lm[33]
            right = lm[133]

            vertical = distance((top.x, top.y), (bottom.x, bottom.y))
            horizontal = distance((left.x, left.y), (right.x, right.y))

            ear = vertical / horizontal

            if ear < EAR_THRESHOLD:

                if eye_closed_start is None:
                    eye_closed_start = time.time()

                if time.time() - eye_closed_start > EYE_CLOSE_TIME:
                    alert = True

            else:
                eye_closed_start = None

    return alert