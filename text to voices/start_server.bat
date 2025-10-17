@echo off
echo Starting Text-to-Voice Server...
echo.
echo Make sure you have installed the required dependencies:
echo - gTTS==2.3.2
echo - flask==2.3.3
echo - flask-cors==4.0.0
echo.
echo If not installed, run: pip install -r requirements.txt
echo.
python test_tts.py
pause