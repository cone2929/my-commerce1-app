#!/bin/bash

echo "🚀 백엔드 서버 시작 중..."
echo

# Python 가상환경 활성화
if [ -d "venv" ]; then
    echo "📦 가상환경 활성화 중..."
    source venv/bin/activate
else
    echo "❌ 가상환경을 찾을 수 없습니다. 먼저 가상환경을 생성해주세요."
    echo "python -m venv venv"
    exit 1
fi

# 필요한 패키지 설치 확인
echo "📦 필요한 패키지 설치 확인 중..."
pip install -r requirements.txt

# SQLite 데이터베이스 초기화
echo "🗄️ SQLite 데이터베이스 초기화 중..."
python init_database.py

# 백엔드 서버 시작
echo "🌐 백엔드 서버 시작 중... (포트: 8001)"
echo "📍 서버 주소: http://localhost:8001"
echo
python main.py
