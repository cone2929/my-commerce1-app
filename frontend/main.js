const { app, BrowserWindow, ipcMain, globalShortcut, dialog, shell } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const BrowserManager = require('./src/utils/BrowserManager');
const CrawlingService = require('./src/utils/CrawlingService');
const isDev = !app.isPackaged;

let mainWindow = null;
const browserManager = new BrowserManager();
const crawlingService = new CrawlingService(browserManager);

// 헤드리스 모드 설정 (true = 브라우저 창 숨김)
const HEADLESS_MODE = true;

// 메인 윈도우 생성
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      allowRunningInsecureContent: true
    },
    icon: path.join(__dirname, 'public', 'logo192.png'),
    title: '',
    show: false,
    autoHideMenuBar: true
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.setMenu(null);
  mainWindow.maximize();
  
  // 항상 빌드된 파일 사용
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  
  return mainWindow;
}

// 앱 시작
app.whenReady().then(async () => {
  mainWindow = createWindow();
  console.log('✅ 앱 초기화 완료 - 시스템 브라우저 사용');

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.toggleDevTools();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 앱 종료 처리
app.on('before-quit', async () => {
  console.log('앱 종료 중... 브라우저 정리');
  await browserManager.cleanup();
});

app.on('window-all-closed', async () => {
  await browserManager.cleanup();
  if (process.platform !== 'darwin') app.quit();
});

// ========================= 크롤링 API =========================
// 상품 파싱 API
ipcMain.handle('parse-products', async (event, { url }) => {
  return await crawlingService.parseProducts(url);
});

// 이미지 추출 API
ipcMain.handle('extract-product-images', async (event, { 상품명목록, 검색URL }) => {
  return await crawlingService.extractProductImages(상품명목록, 검색URL);
});

// ========================= 브라우저 관리 API =========================
// 브라우저 정리 API
ipcMain.handle('cleanup-browsers', async () => {
  try {
    await browserManager.cleanup();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ========================= 데이터베이스 API =========================
// 데이터베이스 관련 핸들러들 (임시 비활성화)
ipcMain.handle('db-get-products', async () => {
  return [];
});

ipcMain.handle('db-create-product', async (event, product) => {
  return { id: Date.now(), ...product };
});

ipcMain.handle('db-update-product', async (event, { id, ...product }) => {
  return { id, ...product };
});

ipcMain.handle('db-delete-product', async (event, id) => {
  return { success: true };
});

ipcMain.handle('db-get-orders', async () => {
  return [];
});

ipcMain.handle('db-create-order', async (event, order) => {
  return { id: Date.now(), ...order };
});

ipcMain.handle('db-update-order', async (event, { id, ...order }) => {
  return { id, ...order };
});

ipcMain.handle('db-delete-order', async (event, id) => {
  return { success: true };
});

// ========================= 자동 업데이트 (근본적 해결) =========================
if (!isDev) {
  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'cone2929',
    repo: 'my-commerce1-app',
    private: false,
    releaseType: 'release'
  });

  // 🔥 근본적 해결: 업데이트 창 완전 제거, 메인 창에서 알림만
  autoUpdater.on('update-available', (info) => {
    console.log('업데이트 발견:', info.version);
    
    // 메인 창에 업데이트 알림만 표시
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('update-available', {
        version: info.version,
        message: '새로운 버전이 발견되었습니다. 백그라운드에서 다운로드 중...'
      });
    }
    
    // 자동 다운로드 시작
    autoUpdater.downloadUpdate();
  });

  autoUpdater.on('update-not-available', () => {
    console.log('최신 버전입니다.');
  });

  // 다운로드 진행 상황을 메인 창으로 전송
  autoUpdater.on('download-progress', (progressObj) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('update-progress', {
        percent: Math.round(progressObj.percent),
        transferred: progressObj.transferred,
        total: progressObj.total
      });
    }
  });

  // 다운로드 완료 후 즉시 자동 재시작
  autoUpdater.on('update-downloaded', (info) => {
    console.log('업데이트 다운로드 완료. 즉시 재시작...');
    
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('update-installing', {
        message: '업데이트를 설치하는 중입니다. 잠시만 기다려주세요...'
      });
    }
    
    // 2초 후 자동으로 설치 및 재시작 (강제)
    setTimeout(() => {
      autoUpdater.quitAndInstall(false, true);
    }, 2000);
  });

  // 에러 처리
  autoUpdater.on('error', (error) => {
    console.error('업데이트 에러:', error);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('update-error', {
        message: '업데이트 확인 중 오류가 발생했습니다.'
      });
    }
  });

  // 앱 시작시 업데이트 확인
  app.whenReady().then(() => {
    setTimeout(() => {
      autoUpdater.checkForUpdates();
    }, 3000);
  });
}
