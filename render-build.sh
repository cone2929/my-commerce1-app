#!/bin/bash

echo "🚀 Render 빌드 스크립트 시작..."

# Python 패키지 설치
echo "📦 Python 패키지 설치 중..."
pip install -r backend/requirements.txt

# Playwright 브라우저 설치
echo "🌐 Playwright 브라우저 설치 중..."
playwright install chromium

# 시스템 의존성 설치 (필요한 경우)
echo "🔧 시스템 의존성 설치 중..."
apt-get update -qq
apt-get install -y -qq \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    libnss3 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2

echo "✅ 빌드 완료!"
