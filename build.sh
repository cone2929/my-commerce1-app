#!/bin/bash

# 🐥🐥🐥🐥🐥 Render 환경에서 playwright 브라우저 설치
echo "🐥🐥🐥🐥🐥 Playwright 브라우저 설치 시작..."

# 🐥🐥🐥🐥�� playwright 브라우저 설치 (chromium만)
playwright install chromium

# 🐥🐥🐥🐥🐥 설치 확인
echo "🐥🐥🐥🐥🐥 설치된 브라우저 확인:"
playwright --version

echo "🐥🐥🐥🐥🐥 Playwright 브라우저 설치 완료!"
