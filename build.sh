#!/bin/bash

# 🐥🐥🐥🐥🐥 Poetry를 사용하여 Python 패키지 설치
echo "🐥🐥🐥🐥🐥 Python 패키지 설치 시작..."

# 🐥🐥🐥🐥🐥 Poetry 설치 (이미 설치되어 있을 수 있음)
poetry install

# 🐥🐥🐥🐥🐥 playwright 브라우저 설치
echo "🐥🐥🐥🐥🐥 Playwright 브라우저 설치 시작..."

# 🐥🐥🐥🐥🐥 Poetry 환경에서 playwright 실행
poetry run playwright install chromium

# 🐥🐥🐥🐥🐥 설치 확인
echo "🐥🐥🐥🐥🐥 설치된 브라우저 확인:"
poetry run playwright --version

echo "🐥🐥🐥🐥🐥 Playwright 브라우저 설치 완료!"
