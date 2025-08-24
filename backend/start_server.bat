@echo off
echo 🚀 백엔드 서버 시작 중...
echo.

REM Python 가상환경 활성화
if exist "venv\Scripts\activate.bat" (
    echo 📦 가상환경 활성화 중...
    call venv\Scripts\activate.bat
) else (
    echo ❌ 가상환경을 찾을 수 없습니다. 먼저 가상환경을 생성해주세요.
    echo python -m venv venv
    pause
    exit /b 1
)

REM 필요한 패키지 설치 확인
echo 📦 필요한 패키지 설치 확인 중...
pip install -r requirements.txt

REM SQLite 데이터베이스 초기화
echo 🗄️ SQLite 데이터베이스 초기화 중...
python init_database.py

REM 백엔드 서버 시작
echo 🌐 백엔드 서버 시작 중... (포트: 8001)
echo 📍 서버 주소: http://localhost:8001
echo.
python main.py

pause
