// 🐥🐥🐥🐥🐥 로깅 유틸리티
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
  
    }
  },
  
  error: (...args) => {
    if (isDevelopment) {
  
    }
  },
  
  warn: (...args) => {
    if (isDevelopment) {
  
    }
  },
  
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  }
};

// 🐥🐥🐥🐥🐥 성능 측정 유틸리티
export const performance = {
  start: (label) => {
    if (isDevelopment) {
      console.time(label);
    }
  },
  
  end: (label) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  }
};

// Playwright 설치 과정 전용 로깅 시스템
class Playwright설치로거 {
  constructor() {
    this.로그파일경로 = null;
    this.설치단계 = 0;
    this.시작시간 = Date.now();
    this.단계별시간 = {};
    this.에러목록 = [];
    this.경고목록 = [];
    this.성공단계 = [];
    
    // 로그 파일 경로 설정
    this.로그파일경로 = this.로그파일경로생성();
    
    // 초기 로그 시작
    this.로그파일에쓰기('🚀 Playwright 설치 과정 로깅 시작');
    this.로그파일에쓰기(`📅 시작 시간: ${new Date().toLocaleString('ko-KR')}`);
    this.로그파일에쓰기(`💻 플랫폼: ${process.platform}`);
    this.로그파일에쓰기(`🔧 Node.js 버전: ${process.version}`);
    this.로그파일에쓰기(`📁 작업 디렉토리: ${process.cwd()}`);
    this.로그파일에쓰기('─'.repeat(80));
  }

  로그파일경로생성() {
    try {
      const { app } = require('electron');
      const path = require('path');
      const fs = require('fs');
      
      // 앱 데이터 폴더에 로그 디렉토리 생성
      const 로그디렉토리 = path.join(app.getPath('userData'), 'logs');
      if (!fs.existsSync(로그디렉토리)) {
        fs.mkdirSync(로그디렉토리, { recursive: true });
      }
      
      // 현재 시간으로 로그 파일명 생성
      const 현재시간 = new Date().toISOString().replace(/[:.]/g, '-');
      const 로그파일명 = `playwright-installation-${현재시간}.log`;
      
      return path.join(로그디렉토리, 로그파일명);
    } catch (error) {
      console.error('로그 파일 경로 생성 실패:', error);
      return null;
    }
  }

  로그파일에쓰기(메시지, 레벨 = 'INFO') {
    try {
      if (!this.로그파일경로) return;
      
      const fs = require('fs');
      const 타임스탬프 = new Date().toISOString();
      const 로그메시지 = `[${타임스탬프}] [${레벨}] ${메시지}\n`;
      
      fs.appendFileSync(this.로그파일경로, 로그메시지, 'utf8');
      
      // 콘솔에도 출력
      console.log(`[${레벨}] ${메시지}`);
    } catch (error) {
      console.error('로그 파일 쓰기 실패:', error);
    }
  }

  단계시작(단계명, 설명 = '') {
    this.설치단계++;
    const 단계번호 = this.설치단계;
    const 시작시간 = Date.now();
    
    this.단계별시간[단계번호] = { 시작시간, 단계명 };
    
    this.로그파일에쓰기(`📋 단계 ${단계번호} 시작: ${단계명}`);
    if (설명) {
      this.로그파일에쓰기(`   📝 설명: ${설명}`);
    }
    
    return 단계번호;
  }

  단계완료(단계번호, 결과 = '성공', 추가정보 = '') {
    if (!this.단계별시간[단계번호]) {
      this.로그파일에쓰기(`⚠️ 경고: 단계 ${단계번호}가 시작되지 않았습니다.`, 'WARN');
      return;
    }
    
    const { 시작시간, 단계명 } = this.단계별시간[단계번호];
    const 소요시간 = Date.now() - 시작시간;
    
    this.로그파일에쓰기(`✅ 단계 ${단계번호} 완료: ${단계명} (${소요시간}ms)`);
    this.로그파일에쓰기(`   🎯 결과: ${결과}`);
    if (추가정보) {
      this.로그파일에쓰기(`   📊 추가정보: ${추가정보}`);
    }
    
    if (결과 === '성공') {
      this.성공단계.push(단계번호);
    }
    
    // 단계별 시간 정보 정리
    delete this.단계별시간[단계번호];
  }

  단계실패(단계번호, 에러메시지, 에러상세 = '') {
    if (!this.단계별시간[단계번호]) {
      this.로그파일에쓰기(`⚠️ 경고: 단계 ${단계번호}가 시작되지 않았습니다.`, 'WARN');
      return;
    }
    
    const { 시작시간, 단계명 } = this.단계별시간[단계번호];
    const 소요시간 = Date.now() - 시작시간;
    
    this.로그파일에쓰기(`❌ 단계 ${단계번호} 실패: ${단계명} (${소요시간}ms)`, 'ERROR');
    this.로그파일에쓰기(`   💥 에러: ${에러메시지}`);
    if (에러상세) {
      this.로그파일에쓰기(`   🔍 상세: ${에러상세}`);
    }
    
    // 에러 정보 저장
    this.에러목록.push({
      단계번호,
      단계명,
      에러메시지,
      에러상세,
      소요시간,
      타임스탬프: new Date().toISOString()
    });
    
    // 단계별 시간 정보 정리
    delete this.단계별시간[단계번호];
  }

  경고기록(메시지, 상세정보 = '') {
    this.로그파일에쓰기(`⚠️ 경고: ${메시지}`, 'WARN');
    if (상세정보) {
      this.로그파일에쓰기(`   📋 상세: ${상세정보}`);
    }
    
    this.경고목록.push({
      메시지,
      상세정보,
      타임스탬프: new Date().toISOString()
    });
  }

  정보기록(메시지, 추가정보 = '') {
    this.로그파일에쓰기(`ℹ️ 정보: ${메시지}`);
    if (추가정보) {
      this.로그파일에쓰기(`   📊 추가: ${추가정보}`);
    }
  }

  디버그정보(메시지, 데이터 = null) {
    this.로그파일에쓰기(`🔍 디버그: ${메시지}`, 'DEBUG');
    if (데이터) {
      try {
        const 데이터문자열 = typeof 데이터 === 'object' ? JSON.stringify(데이터, null, 2) : String(데이터);
        this.로그파일에쓰기(`   📋 데이터: ${데이터문자열}`);
      } catch (error) {
        this.로그파일에쓰기(`   📋 데이터: [직렬화 실패] ${error.message}`);
      }
    }
  }

  설치완료() {
    const 총소요시간 = Date.now() - this.시작시간;
    
    this.로그파일에쓰기('─'.repeat(80));
    this.로그파일에쓰기('🎉 Playwright 설치 과정 완료 요약');
    this.로그파일에쓰기(`⏱️ 총 소요 시간: ${총소요시간}ms (${Math.round(총소요시간 / 1000)}초)`);
    this.로그파일에쓰기(`✅ 성공한 단계: ${this.성공단계.length}개`);
    this.로그파일에쓰기(`❌ 실패한 단계: ${this.에러목록.length}개`);
    this.로그파일에쓰기(`⚠️ 경고: ${this.경고목록.length}개`);
    
    if (this.성공단계.length > 0) {
      this.로그파일에쓰기(`   🎯 성공 단계: ${this.성공단계.join(', ')}`);
    }
    
    if (this.에러목록.length > 0) {
      this.로그파일에쓰기(`   💥 에러 목록:`);
      this.에러목록.forEach((에러, 인덱스) => {
        this.로그파일에쓰기(`      ${인덱스 + 1}. 단계 ${에러.단계번호} (${에러.단계명}): ${에러.에러메시지}`);
      });
    }
    
    if (this.경고목록.length > 0) {
      this.로그파일에쓰기(`   ⚠️ 경고 목록:`);
      this.경고목록.forEach((경고, 인덱스) => {
        this.로그파일에쓰기(`      ${인덱스 + 1}. ${경고.메시지}`);
      });
    }
    
    this.로그파일에쓰기('─'.repeat(80));
    this.로그파일에쓰기(`📁 로그 파일 위치: ${this.로그파일경로}`);
    this.로그파일에쓰기('🚀 로깅 완료');
  }

  로그파일경로가져오기() {
    return this.로그파일경로;
  }

  로그내용가져오기() {
    try {
      if (!this.로그파일경로) return null;
      
      const fs = require('fs');
      if (fs.existsSync(this.로그파일경로)) {
        return fs.readFileSync(this.로그파일경로, 'utf8');
      }
      return null;
    } catch (error) {
      console.error('로그 내용 읽기 실패:', error);
      return null;
    }
  }
}

// 전역 Playwright 설치 로거 인스턴스
let playwright설치로거 = null;

// 로거 초기화 함수
function Playwright설치로거초기화() {
  if (!playwright설치로거) {
    playwright설치로거 = new Playwright설치로거();
  }
  return playwright설치로거;
}

// 로거 가져오기 함수
function Playwright설치로거가져오기() {
  return playwright설치로거;
}

export {
  // Playwright 설치 과정 전용 로깅 시스템
  Playwright설치로거,
  Playwright설치로거초기화,
  Playwright설치로거가져오기
};
