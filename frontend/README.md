# 해외구매대행 자동화 시스템

해외구매대행 사업을 위한 전문적인 업무자동화 솔루션입니다.

## 🚀 주요 기능

- **전문적인 설치 파일**: 대기업 수준의 설치 경험
- **자동 업데이트**: 무료 GitHub 기반 자동 업데이트
- **보안 경고 제거**: Windows 보안 경고 없음
- **크로스 플랫폼**: Windows, macOS, Linux 지원

## 📦 설치 파일 생성

### 1. 로컬 빌드
```bash
# Windows 설치 파일 생성
npm run dist:win

# macOS 설치 파일 생성  
npm run dist:mac

# Linux 설치 파일 생성
npm run dist:linux

# 모든 플랫폼 빌드
npm run dist
```

### 2. 자동화된 빌드
```bash
# 전문적인 설치 파일 생성 (권장)
npm run build:installer
```

## 🔄 자동 업데이트 설정

### 1. GitHub 저장소 설정
`package.json`의 `build.publish` 섹션을 수정하세요:

```json
"publish": {
  "provider": "github",
  "owner": "your-github-username",
  "repo": "your-repo-name",
  "private": false,
  "releaseType": "release"
}
```

### 2. 자동 업데이트 활성화
- GitHub Actions가 자동으로 릴리스를 생성합니다
- 앱이 1시간마다 업데이트를 확인합니다
- 사용자에게 업데이트 알림을 표시합니다

## 🎯 배포 방법

### 1. 수동 배포
```bash
# 버전 업데이트 후
npm run release
```

### 2. 자동 배포 (GitHub Actions)
1. 코드를 GitHub에 푸시
2. 태그 생성: `git tag v1.0.0`
3. 태그 푸시: `git push origin v1.0.0`
4. GitHub Actions가 자동으로 릴리스 생성

## 🔧 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# Electron 앱 실행
npm run electron

# 개발 모드 (핫 리로드)
npm run start
```

## 📁 프로젝트 구조

```
frontend/
├── src/                    # React 소스 코드
├── public/                 # 정적 파일
├── build/                  # 빌드 설정 파일
│   ├── installer.nsh      # NSIS 설치 스크립트
│   └── entitlements.mac.plist # macOS 권한 설정
├── scripts/               # 빌드 스크립트
├── .github/workflows/     # GitHub Actions
├── main.js               # Electron 메인 프로세스
└── package.json          # 프로젝트 설정
```

## 🛡️ 보안 설정

- Windows 보안 경고 제거
- 코드 서명 준비 (선택사항)
- 안전한 권한 설정
- 네트워크 보안 강화

## 📋 시스템 요구사항

- **Windows**: Windows 10 이상 (x64, x86)
- **macOS**: macOS 10.14 이상
- **Linux**: Ubuntu 18.04 이상
- **메모리**: 최소 4GB RAM
- **저장공간**: 최소 500MB

## 🆘 문제 해결

### 설치 파일이 생성되지 않는 경우
1. Node.js 버전 확인 (18.x 이상 권장)
2. 의존성 재설치: `npm ci`
3. 캐시 정리: `npm run clean`

### 자동 업데이트가 작동하지 않는 경우
1. GitHub 저장소 설정 확인
2. GitHub Actions 권한 확인
3. 네트워크 연결 상태 확인

## 📞 지원

- **이메일**: support@commerce-app.com
- **웹사이트**: https://commerce-app.com
- **GitHub Issues**: 프로젝트 저장소에서 이슈 등록

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.
