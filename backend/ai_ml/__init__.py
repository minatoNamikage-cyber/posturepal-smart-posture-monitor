"""
AI/ML Module for PosturePal
This module handles:
- Eye detection and drowsiness detection
- Posture detection and analysis
- Alert generation and analysis
- Camera streaming and processing
"""

from .eye_detection import detect_drowsiness
from .posture_detection import detect_posture
from .analysis_engine import analyze_results
from .backend_client import send_alert

__all__ = [
    'detect_drowsiness',
    'detect_posture',
    'analyze_results',
    'send_alert'
]
