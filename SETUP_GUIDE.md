# My Commerce App - 설정 가이드

## 🏗️ 아키텍처 변경사항

### 기존 → 변경
- **기존**: 프론트엔드 + 백엔드 모두 Render 배포
- **변경**: 프론트엔드만 Render, 백엔드는 로컬 서버

### 새로운 구조
- **프론트엔드**: React + Vite (Render 배포)
- **백엔드**: FastAPI + SQLite (로컬 서버)
- **인증**: Supabase (기존 유지)

## 🚀 백엔드 서버 자동 실행

### Windows 사용자
1. `backend` 폴더로 이동
2. `start_server.bat` 파일을 더블클릭하여 실행
3. 또는 명령 프롬프트에서 `start_server.bat` 실행

### Mac/Linux 사용자
1. `backend` 폴더로 이동
2. 터미널에서 다음 명령어 실행:
```bash
chmod +x start_server.sh
./start_server.sh
```

### 수동 실행
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python init_database.py
python main.py
```

## 🗄️ SQLite 데이터베이스

### 특징
- **로컬 저장**: 각 사용자 PC에 개별 데이터베이스
- **자동 생성**: `commerce.db` 파일이 자동으로 생성됨
- **백업 가능**: 파일 복사로 간단한 백업/복원

### 테이블 구조
1. **users** - 사용자 정보 (Supabase 인증과 연동)
2. **products** - 상품 정보
3. **orders** - 주문 정보
4. **order_items** - 주문 상품 관계
5. **settings** - 사용자 설정

### 데이터베이스 관리 명령어
```bash
# 데이터베이스 초기화
python init_database.py

# 데이터베이스 백업
cp commerce.db commerce_backup.db

# 데이터베이스 복원
cp commerce_backup.db commerce.db
```

## 🌐 접속 방법

### 프론트엔드 접속
- **개발 환경**: http://localhost:3001
- **프로덕션**: https://my-commerce-frontend-uyt4.onrender.com

### 백엔드 서버
- **로컬 서버**: http://localhost:8001
- **상태 확인**: http://localhost:8001/health

## 🔧 주요 변경사항

### 1. 백엔드 URL 변경
- 모든 API 요청이 `http://localhost:8001`로 변경
- 환경별 URL 구분 제거 (모든 환경에서 로컬 서버 사용)

### 2. 자동 서버 감지
- 웹앱 접속 시 자동으로 백엔드 서버 상태 확인
- 서버가 실행되지 않으면 자동으로 안내 표시

### 3. SQLite 통합
- Supabase는 인증만 담당
- 모든 데이터는 로컬 SQLite에 저장

## 🛠️ 문제 해결

### 백엔드 서버가 시작되지 않는 경우
1. **Python 가상환경 확인**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Mac/Linux
   ```

2. **패키지 설치 확인**
   ```bash
   pip install -r requirements.txt
   ```

3. **포트 충돌 확인**
   - 포트 8001이 다른 프로그램에서 사용 중인지 확인
   - 작업 관리자에서 Python 프로세스 확인

4. **권한 문제**
   - Windows: 관리자 권한으로 실행
   - Mac/Linux: `chmod +x start_server.sh`

### 데이터베이스 오류
1. **데이터베이스 초기화**
   ```bash
   python init_database.py
   ```

2. **파일 권한 확인**
   - `commerce.db` 파일에 쓰기 권한이 있는지 확인

3. **디스크 공간 확인**
   - 충분한 디스크 공간이 있는지 확인

### 프론트엔드 연결 오류
1. **백엔드 서버 상태 확인**
   - http://localhost:8001/health 접속 테스트

2. **브라우저 개발자 도구 확인**
   - F12 → Console 탭에서 오류 메시지 확인
   - Network 탭에서 API 요청 상태 확인

3. **방화벽 설정**
   - Windows 방화벽에서 포트 8001 허용

## 📋 체크리스트

### 초기 설정
- [ ] Python 3.8+ 설치
- [ ] backend 폴더로 이동
- [ ] 가상환경 생성 및 활성화
- [ ] 패키지 설치: `pip install -r requirements.txt`
- [ ] 데이터베이스 초기화: `python init_database.py`

### 서버 시작
- [ ] `start_server.bat` (Windows) 또는 `./start_server.sh` (Mac/Linux) 실행
- [ ] 터미널에서 "서버 주소: http://localhost:8001" 메시지 확인
- [ ] 웹브라우저에서 http://localhost:8001/health 접속 테스트

### 웹앱 사용
- [ ] 프론트엔드 접속: http://localhost:3001 또는 Render URL
- [ ] Supabase 로그인
- [ ] 상품 관리 기능 테스트
- [ ] 주문 관리 기능 테스트

## 🔄 업데이트 방법

### 백엔드 업데이트
```bash
cd backend
git pull
pip install -r requirements.txt
python init_database.py
python main.py
```

### 프론트엔드 업데이트
- GitHub에 push하면 자동으로 Render에서 배포됩니다.

## 📞 지원

문제가 발생하면 다음을 확인해주세요:
1. 백엔드 서버 로그 (터미널 출력)
2. 브라우저 개발자 도구 콘솔
3. 데이터베이스 파일 상태
4. 네트워크 연결 상태
