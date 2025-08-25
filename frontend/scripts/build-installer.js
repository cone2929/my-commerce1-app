const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 전문적인 설치 파일 생성 시작...');

// 버전 정보 업데이트
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;

console.log(`📦 현재 버전: ${version}`);

// 빌드 전 정리
console.log('🧹 이전 빌드 파일 정리 중...');
if (fs.existsSync('dist-electron')) {
  fs.rmSync('dist-electron', { recursive: true, force: true });
}

// React 앱 빌드
console.log('⚛️ React 앱 빌드 중...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ React 앱 빌드 완료');
} catch (error) {
  console.error('❌ React 앱 빌드 실패:', error);
  process.exit(1);
}

// Electron 앱 빌드
console.log('🔧 Electron 앱 빌드 중...');
try {
  execSync('npm run dist:win', { stdio: 'inherit' });
  console.log('✅ Electron 앱 빌드 완료');
} catch (error) {
  console.error('❌ Electron 앱 빌드 실패:', error);
  process.exit(1);
}

// 빌드 결과 확인
console.log('📋 빌드 결과 확인 중...');
if (fs.existsSync('dist-electron')) {
  const files = fs.readdirSync('dist-electron');
  console.log('📁 생성된 파일들:');
  files.forEach(file => {
    const stats = fs.statSync(path.join('dist-electron', file));
    const size = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`  - ${file} (${size} MB)`);
  });
} else {
  console.error('❌ 빌드 결과 폴더를 찾을 수 없습니다.');
  process.exit(1);
}

console.log('🎉 전문적인 설치 파일 생성 완료!');
console.log('📁 설치 파일 위치: dist-electron/');
console.log('💡 배포 방법:');
console.log('   1. GitHub에 코드 푸시');
console.log('   2. 태그 생성: git tag v1.0.0');
console.log('   3. 태그 푸시: git push origin v1.0.0');
console.log('   4. GitHub Actions가 자동으로 릴리스 생성');
