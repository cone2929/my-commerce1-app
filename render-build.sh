#!/bin/bash

echo "🚀 Render 빌드 스크립트 시작..."

# Python 패키지 설치
echo "📦 Python 패키지 설치 중..."
pip install -r backend/requirements.txt

# Playwright 브라우저 설치
echo "🌐 Playwright 브라우저 설치 중..."
playwright install chromium

echo "✅ 빌드 완료!"
