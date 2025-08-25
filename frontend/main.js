const { app, BrowserWindow, ipcMain, globalShortcut, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const isDev = !app.isPackaged;

// 🚀 자동 업데이트 설정
if (!isDev) {
  // 업데이트 서버 URL 설정 (GitHub Releases 사용)
  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'your-actual-github-username',
    repo: 'my-commerce1-app',
    private: false,
    releaseType: 'release'
  });

  // 업데이트 체크 주기 (1시간마다)
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 60 * 60 * 1000);

  // 업데이트 이벤트 처리
  autoUpdater.on('checking-for-update', () => {
    console.log('🔍 업데이트 확인 중...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('📦 업데이트가 있습니다:', info);
    dialog.showMessageBox({
      type: 'info',
      title: '업데이트 알림',
      message: '새로운 버전이 있습니다. 업데이트를 진행하시겠습니까?',
      buttons: ['지금 업데이트', '나중에'],
      defaultId: 0
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
  });

  autoUpdater.on('update-not-available', () => {
    console.log('✅ 최신 버전입니다.');
  });

  autoUpdater.on('error', (err) => {
    console.log('❌ 업데이트 오류:', err);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    console.log(`📥 다운로드 진행률: ${progressObj.percent}%`);
  });

  autoUpdater.on('update-downloaded', () => {
    console.log('✅ 업데이트 다운로드 완료');
    dialog.showMessageBox({
      type: 'info',
      title: '업데이트 준비 완료',
      message: '업데이트가 준비되었습니다. 앱을 재시작하시겠습니까?',
      buttons: ['지금 재시작', '나중에'],
      defaultId: 0
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  // 앱 시작 시 업데이트 체크
  app.whenReady().then(() => {
    autoUpdater.checkForUpdates();
  });
}

// 🚀 중복 실행 방지 - 개발 환경에서만
if (isDev) {
  const gotTheLock = app.requestSingleInstanceLock();
  
  if (!gotTheLock) {
    console.log('🚫 이미 실행 중인 앱이 있습니다. 종료합니다.');
    app.quit();
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      console.log('🚫 중복 실행 감지. 기존 앱을 종료합니다.');
      app.quit();
    });
  }
}

// 🚀 보안 경고 제거 설정
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-web-security');
app.commandLine.appendSwitch('disable-features', 'VizDisplayCompositor');
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('ignore-ssl-errors');
app.commandLine.appendSwitch('allow-running-insecure-content');

// 🚀 앱 권한 설정
app.setAsDefaultProtocolClient('commerce-app');

// 🚀 디바운싱 핫리로드 시스템 - 개발 환경에서만 활성화
if (isDev) {
  let reloadTimeout = null;
  let isReloading = false;
  
  try {
    require('electron-reloader')(module, {
      // 감시할 파일들
      watchRenderer: true,
      // 모든 파일 감시 (node_modules 제외)
      ignore: [
        'node_modules/**/*',
        'dist/**/*'
      ],
      // 디버그 모드
      debug: true,
      // 핫리로드 시 콘솔 출력
      overrideConsole: true,
      // 기존 앱 완전 종료 후 재시작
      hardResetMethod: 'exit',
      // 강제로 모든 프로세스 종료
      forceHardReset: true,
      // 디바운싱 설정
      reloadDelay: 5000, // 5초 지연
      // 커스텀 리로드 함수
      reload: () => {
        if (isReloading) {
          console.log('🔄 이미 재시작 중입니다. 대기...');
          return;
        }
        
        if (reloadTimeout) {
          clearTimeout(reloadTimeout);
        }
        
        reloadTimeout = setTimeout(() => {
          isReloading = true;
          console.log('🔄 디바운싱 완료. 앱 재시작 중...');
          
          // 실제 재시작
          process.exit(0);
        }, 5000);
      }
    });
    console.log('🔥 디바운싱 핫리로드 시스템이 활성화되었습니다! (5초 지연, 중복 방지)');
  } catch (err) {
    console.log('⚠️ electron-reloader 로드 실패 (정상적인 상황입니다):', err.message);
  }
}

// 터미널 인코딩 설정 (한글 깨짐 방지)
if (process.platform === 'win32') {
  process.env.LANG = 'ko_KR.UTF-8';
  // Windows에서 한글 출력을 위한 설정
  const { spawn } = require('child_process');
  spawn('chcp', ['65001'], { stdio: 'inherit' });
}

// 🐥🐥🐥🐥🐥 SQLite 데이터베이스 관리 (임시 비활성화)
// const Database = require('better-sqlite3');
// const dbPath = path.join(app.getPath('userData'), 'commerce.db');
// let db;

// 🐥🐥🐥🐥🐥 데이터베이스 초기화 (임시 비활성화)
function initializeDatabase() {

  return;
  /*
  try {
    db = new Database(dbPath);
    
    // 🐥🐥🐥🐥🐥 상품 테이블 생성
    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL,
        description TEXT,
        image_url TEXT,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 🐥🐥🐥🐥🐥 주문 테이블 생성
    db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        customer_name TEXT,
        customer_email TEXT,
        quantity INTEGER,
        total_price REAL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id)
      )
    `);
    

  } catch (error) {
    console.error('🐥🐥🐥🐥🐥 데이터베이스 초기화 실패:', error);
  }
  */
}

// 🐥🐥🐥🐥🐥 메인 윈도우 생성
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false, // 외부 이미지 로딩 허용
      allowRunningInsecureContent: true, // HTTP 이미지 허용
      experimentalFeatures: false,
      enableRemoteModule: false,
      spellcheck: false,
      autoplayPolicy: 'no-user-gesture-required'
    },
    icon: path.join(__dirname, 'public', 'logo192.png'),
    title: '해외구매대행 자동화 시스템',
    show: false, // 윈도우가 준비될 때까지 숨김
    autoHideMenuBar: true, // 메뉴바 자동 숨김
    titleBarStyle: 'default',
    frame: true,
    resizable: true,
    minimizable: true,
    maximizable: true,
    closable: true,
    skipTaskbar: false,
    alwaysOnTop: false,
    fullscreenable: true,
    webSecurity: false,
    allowRunningInsecureContent: true
  });

  // 윈도우가 준비되면 표시
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // 메뉴바 완전 제거
  mainWindow.setMenu(null);
  
  // 최대화된 상태로 시작
  mainWindow.maximize();
  
  // 개발자도구 단축키 활성화 (Ctrl+Shift+I) - 전역 단축키로 변경

  // 🐥🐥🐥🐥🐥 개발 환경에서는 로컬 서버, 프로덕션에서는 빌드된 파일 로드
  if (isDev) {
    mainWindow.loadURL('http://localhost:3001');
    // mainWindow.webContents.openDevTools(); // 개발자 도구 숨김
    
    // 🔥 완전한 핫리로드 시스템 - 서버 연결 실패 시 자동 재시도
    mainWindow.webContents.on('did-fail-load', () => {
      console.log('🔄 서버 연결 실패, 자동 재시도 중...');
      setTimeout(() => {
        mainWindow.loadURL('http://localhost:3001');
      }, 1000);
    });
    
    // 🔥 핫리로드 상태 모니터링
    mainWindow.webContents.on('did-finish-load', () => {
      console.log('✅ 렌더러 프로세스 로드 완료');
    });
    
    // 🔥 개발 환경에서 더 나은 에러 처리
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.log(`❌ 페이지 로드 실패: ${errorCode} - ${errorDescription}`);
    });
    
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  return mainWindow;
}

// 🐥🐥🐥🐥🐥 앱 준비 완료 시 실행
app.whenReady().then(() => {
  initializeDatabase();
  const mainWindow = createWindow();
  
  // 전역 단축키 등록 (Ctrl+Shift+I)
  const ret = globalShortcut.register('CommandOrControl+Shift+I', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.toggleDevTools();
      console.log('🔧 개발자 도구 토글됨');
    }
  });
  
  // 대체 단축키 등록 (Ctrl+Shift+D)
  const ret2 = globalShortcut.register('CommandOrControl+Shift+D', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.toggleDevTools();
      console.log('🔧 개발자 도구 토글됨 (대체 단축키)');
    }
  });
  
  if (!ret) {
    console.log('❌ Ctrl+Shift+I 단축키 등록 실패');
  } else {
    console.log('✅ Ctrl+Shift+I 단축키 등록 성공');
  }
  
  if (!ret2) {
    console.log('❌ Ctrl+Shift+D 단축키 등록 실패');
  } else {
    console.log('✅ Ctrl+Shift+D 단축키 등록 성공');
  }
  
  // 앱이 포커스를 잃을 때 단축키 재등록
  app.on('browser-window-blur', () => {
    if (!globalShortcut.isRegistered('CommandOrControl+Shift+I')) {
      globalShortcut.register('CommandOrControl+Shift+I', () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.toggleDevTools();
        }
      });
    }
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 🐥🐥🐥🐥🐥 모든 윈도우가 닫힐 때 앱 종료
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// 🐥🐥🐥🐥🐥 IPC 통신 설정 - 상품 관리 (임시 비활성화)
ipcMain.handle('db-get-products', async () => {

  return [];
  /*
  try {
    const stmt = db.prepare('SELECT * FROM products ORDER BY created_at DESC');
    return stmt.all();
  } catch (error) {
    console.error('상품 조회 실패:', error);
    throw error;
  }
  */
});

ipcMain.handle('db-create-product', async (event, product) => {

  return { id: Date.now(), ...product };
  /*
  try {
    const stmt = db.prepare(`
      INSERT INTO products (name, price, description, image_url, category)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(product.name, product.price, product.description, product.image_url, product.category);
    return { id: result.lastInsertRowid, ...product };
  } catch (error) {
    console.error('상품 생성 실패:', error);
    throw error;
  }
  */
});

ipcMain.handle('db-update-product', async (event, { id, ...product }) => {
  try {
    const stmt = db.prepare(`
      UPDATE products 
      SET name = ?, price = ?, description = ?, image_url = ?, category = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(product.name, product.price, product.description, product.image_url, product.category, id);
    return { id, ...product };
  } catch (error) {
    console.error('상품 수정 실패:', error);
    throw error;
  }
});

ipcMain.handle('db-delete-product', async (event, id) => {
  try {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    stmt.run(id);
    return { success: true };
  } catch (error) {
    console.error('상품 삭제 실패:', error);
    throw error;
  }
});

// 🐥🐥🐥🐥🐥 IPC 통신 설정 - 주문 관리
ipcMain.handle('db-get-orders', async () => {
  try {
    const stmt = db.prepare(`
      SELECT o.*, p.name as product_name 
      FROM orders o 
      LEFT JOIN products p ON o.product_id = p.id 
      ORDER BY o.created_at DESC
    `);
    return stmt.all();
  } catch (error) {
    console.error('주문 조회 실패:', error);
    throw error;
  }
});

ipcMain.handle('db-create-order', async (event, order) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO orders (product_id, customer_name, customer_email, quantity, total_price, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(order.product_id, order.customer_name, order.customer_email, order.quantity, order.total_price, order.status);
    return { id: result.lastInsertRowid, ...order };
  } catch (error) {
    console.error('주문 생성 실패:', error);
    throw error;
  }
});

ipcMain.handle('db-update-order', async (event, { id, ...order }) => {
  try {
    const stmt = db.prepare(`
      UPDATE orders 
      SET product_id = ?, customer_name = ?, customer_email = ?, quantity = ?, total_price = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(order.product_id, order.customer_name, order.customer_email, order.quantity, order.total_price, order.status, id);
    return { id, ...order };
  } catch (error) {
    console.error('주문 수정 실패:', error);
    throw error;
  }
});

ipcMain.handle('db-delete-order', async (event, id) => {
  try {
    const stmt = db.prepare('DELETE FROM orders WHERE id = ?');
    stmt.run(id);
    return { success: true };
  } catch (error) {
    console.error('주문 삭제 실패:', error);
    throw error;
  }
});

// 🐥🐥🐥🐥🐥 자동화 기능들 - Playwright 및 AI 기능
const { chromium } = require('playwright');

let browserInstance = null;

// 🐥🐥🐥🐥🐥 브라우저 생성 함수
async function createBrowserSafely() {
  try {
    if (browserInstance && !browserInstance.isConnected()) {
      browserInstance = null;
    }
    
    if (!browserInstance) {
      browserInstance = await chromium.launch({
        headless: true, // 헤드리스 모드 활성화 (브라우저 창 숨김)
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection'
        ]
      });
    }
    
    const page = await browserInstance.newPage();
    
    // 페이지 성능 최적화 설정
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.addInitScript(() => {
      // 불필요한 기능 비활성화
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, 'languages', { get: () => ['ko-KR', 'ko', 'en-US', 'en'] });
    });
    
    return { browser: browserInstance, page };
  } catch (error) {
    console.error('브라우저 생성 실패:', error);
    throw error;
  }
}

// 전역 변수로 브라우저와 페이지 저장
let globalBrowser = null;
let globalPage = null;

// 🐥🐥🐥🐥🐥 상품 정보 파싱 API
ipcMain.handle('parse-products', async (event, { url, page: pageNum = 1 }) => {
  try {

    
    // 기존 브라우저가 있으면 재사용, 없으면 새로 생성
    if (!globalBrowser || !globalPage) {
      const { browser, page } = await createBrowserSafely();
      globalBrowser = browser;
      globalPage = page;

    } else {

    }
    
    // 페이지 로드 (더 빠른 로드 대기)
    await globalPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // 상품 요소 동적 대기 (10초로 연장)
    try {
      await globalPage.waitForSelector('.product-eachone, [data-v-199934d4], .goods-item-animation', { 
        state: 'attached', 
        timeout: 10000 
      });
    } catch {
      // 요소가 없으면 바로 진행 (페이지 로드 완료 상태)

    }
    
    // 이미지 로딩 대기 (단축)
    await globalPage.waitForTimeout(2000);
    
    // 상품 정보 추출
    const 상품목록 = await globalPage.evaluate(() => {
      const products = [];
      
      let productElements = document.querySelectorAll('.product-eachone');
      if (productElements.length === 0) {
        productElements = document.querySelectorAll('[data-v-199934d4]');
      }
      if (productElements.length === 0) {
        productElements = document.querySelectorAll('.goods-item-animation');
      }
      
      productElements.forEach((element, index) => {
        try {
          // 상품 이미지
          let imgElement = element.querySelector('.prod-img img') || 
                          element.querySelector('.product-img img') || 
                          element.querySelector('img');
          const 이미지URL = imgElement ? imgElement.src : '';
          
          // 상품 제목
          let titleElement = element.querySelector('.product-title') || 
                            element.querySelector('[class*="title"]') || 
                            element.querySelector('div[class*="text"]');
          const 제목 = titleElement ? titleElement.textContent.trim() : '';
          
          // 가격 정보
          let priceElement = element.querySelector('.rmb') || 
                            element.querySelector('[class*="price"]') || 
                            element.querySelector('[class*="rmb"]');
          const 가격 = priceElement ? priceElement.textContent.trim() : '';
          
          // 한국어 가격
          let koreanPriceElement = element.querySelector('.korean') || 
                                  element.querySelector('[class*="won"]');
          const 한국어가격 = koreanPriceElement ? koreanPriceElement.textContent.trim() : '';
          
          if (제목 || 이미지URL) {
            products.push({
              이미지URL,
              제목: 제목 || `상품 ${index + 1}`,
              가격: 가격 || '',
              한국어가격: 한국어가격 || '',
              판매정보: '',
              라벨: ''
            });
          }
        } catch (error) {
          console.error('상품 정보 추출 오류:', error);
        }
      });
      
      return products;
    });
    
    // 브라우저를 닫지 않고 유지 (재활용을 위해)

    return { products: 상품목록, success: true, total: 상품목록.length };
    
  } catch (error) {
    console.error('상품 정보 파싱 오류:', error);
    return { error: error.message, success: false };
  }
});

// 상품 이미지 추출 API
ipcMain.handle('extract-product-images', async (event, { 상품명목록, 사용자ID, 검색URL }) => {
  try {

    
    // 기존 브라우저가 있으면 재사용, 없으면 새로 생성
    if (!globalBrowser || !globalPage) {
      const { browser, page } = await createBrowserSafely();
      globalBrowser = browser;
      globalPage = page;

    } else {

    }
    
    const 결과목록 = [];
    
    // 검색 결과 페이지로 이동
    if (검색URL) {
      await globalPage.goto(검색URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await globalPage.waitForTimeout(1000);
    }
    
    // 기존 검색 결과에서 상품명으로 매칭
    
    // 원래 검색 결과 페이지로 돌아가기
    
    // 현재 URL 확인
    const currentUrl = globalPage.url();
    
    // 검색 결과 페이지가 아니면 원래 페이지로 이동
    if (!currentUrl.includes('keywords=') && !currentUrl.includes('search')) {
      // 원래 검색 결과 페이지로 이동 (사용자 ID를 통해 저장된 URL 사용)
      // 임시로 하드코딩된 URL 사용
      await globalPage.goto('https://www.cninsider.co.kr/mall/#/product?keywords=12&type=text&imageAddress=&searchDiff=1', { 
        waitUntil: 'domcontentloaded', 
        timeout: 30000 
      });
      await globalPage.waitForTimeout(1000);
    }
    
    // 현재 페이지의 모든 상품 정보 가져오기 (이미지 추출 전에 다시 가져오기)
    
    // 상품 요소 조건부 대기 (준비되면 즉시 진행)
    try {
      await globalPage.waitForSelector('.product-eachone, [data-v-199934d4], .goods-item-animation', {
        state: 'attached',
        timeout: 5000
      });
    } catch {
      // 요소가 없으면 바로 진행
    }
    
    const 현재상품목록 = await globalPage.evaluate(() => {
      const products = [];
      const productElements = document.querySelectorAll('.product-eachone, [data-v-199934d4], .goods-item-animation');
      

      
      productElements.forEach((element, index) => {
        let titleElement = element.querySelector('.product-title');
        if (!titleElement) titleElement = element.querySelector('[class*="title"]');
        if (!titleElement) titleElement = element.querySelector('div[class*="text"]');
        
        const title = titleElement ? titleElement.textContent.trim() : '';
        
        if (title) {
          products.push({
            index: index,
            title: title,
            element: element
          });
        }
      });
      
      return products;
    });
    

    
    // 요청된 상품명들과 매칭
    for (const 상품명 of 상품명목록) {
      try {

        
        // 현재 페이지에서 상품명으로 매칭
        let 매칭된상품 = null;
        for (const 상품 of 현재상품목록) {
          if (상품.title === 상품명) {
            매칭된상품 = 상품;
            break;
          }
        }
        
        if (!매칭된상품) {
          결과목록.push({
            상품명: 상품명,
            성공: false,
            에러: "현재 페이지에서 상품을 찾을 수 없습니다"
          });
          continue;
        }
        
        // 매칭된 상품 클릭하여 상세페이지로 이동
        const 클릭성공 = await globalPage.evaluate((targetIndex) => {
          const products = document.querySelectorAll('.product-eachone, [data-v-199934d4], .goods-item-animation');
          
          if (products[targetIndex]) {
            products[targetIndex].click();
            return true;
          }
          
          return false;
        }, 매칭된상품.index);
        
        if (!클릭성공) {
          결과목록.push({
            상품명: 상품명,
            성공: false,
            에러: "상품 클릭에 실패했습니다"
          });
          continue;
        }
        
        // 새 창/탭이 열렸는지 확인하고 핸들 이동
        let currentPage = globalPage;
        
        // 현재 컨텍스트의 모든 페이지 확인
        const pages = globalBrowser.contexts()[0].pages();
        
        // 새로 열린 페이지가 있으면 해당 페이지로 이동
        if (pages.length > 1) {
          // 마지막에 열린 페이지로 이동
          const newPage = pages[pages.length - 1];
          await newPage.bringToFront();
          currentPage = newPage;
        } else {
          // 새 창이 열리기를 기다림
          try {
            const newPage = await globalPage.context().waitForEvent('page', { timeout: 10000 });
            await newPage.waitForLoadState('domcontentloaded');
            currentPage = newPage;
          } catch (e) {
            // 새 창 대기 시간 초과
          }
        }
        
        // 상세페이지 로딩 대기 (단축)
        await currentPage.waitForTimeout(1000);
        
        // 상세페이지 URL 확인
        const currentUrl = currentPage.url();
        
        // 상세페이지로 이동했는지 확인
        if (!currentUrl.toLowerCase().includes('product') && !currentUrl.toLowerCase().includes('detail')) {
          // 다시 클릭 시도 (새 창에서)
          const 재클릭성공 = await currentPage.evaluate((targetIndex) => {
            const products = document.querySelectorAll('.product-eachone, [data-v-199934d4], .goods-item-animation');
            
            if (products[targetIndex]) {
              const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
              products[targetIndex].dispatchEvent(clickEvent);
              return true;
            }
            
            return false;
          }, 매칭된상품.index);
          
          if (재클릭성공) {
            await currentPage.waitForTimeout(1000);
          }
        }
        
        // 이미지 요소들이 클릭 가능할 때까지 대기 (attached 상태) - 단축
        try {
          await currentPage.waitForSelector('img', { state: 'attached', timeout: 8000 });
        } catch (e) {
          // 이미지 요소 대기 시간 초과, 계속 진행
        }
        
        // 상세페이지에서 이미지 추출 (재시도 로직 포함)
        let 이미지결과 = { 썸네일이미지들: [], 상세이미지들: [] };
        let 재시도횟수 = 0;
        const 최대재시도 = 5;
        
        while (재시도횟수 < 최대재시도) {
          try {
            
            // 썸네일 컨테이너 존재 확인 및 대기
            let thumbnailContainerExists = false;
            try {
              await currentPage.waitForFunction(() => {
                const container = document.querySelector('#pro-content > div > div > div.product-main-img > div.product-img-container > div.img-switch.mt-20');
                return container !== null;
              }, { timeout: 15000 });
              thumbnailContainerExists = true;
            } catch (error) {
              thumbnailContainerExists = false;
            }
            
            // 썸네일 컨테이너가 있으면 내부 이미지들이 로드될 때까지 대기
            if (thumbnailContainerExists) {
              try {
                await currentPage.waitForFunction(() => {
                  const container = document.querySelector('#pro-content > div > div > div.product-main-img > div.product-img-container > div.img-switch.mt-20');
                  if (!container) return false;
                  
                  const images = container.querySelectorAll('img');
                  if (images.length === 0) return false;
                  
                  // 모든 이미지가 로드되었는지 확인 (안전한 방식)
                  const loadedImages = Array.from(images).filter(img => 
                    img.complete && img.naturalWidth > 0 && img.naturalHeight > 0
                  );
                  
                  const allLoaded = loadedImages.length === images.length;
                  return allLoaded;
                }, { timeout: 20000 });
                
                // 추가 대기 시간 (이미지가 완전히 렌더링될 때까지)
                await currentPage.waitForTimeout(1000);
                
                // 로드된 이미지 개수 확인
                const thumbnailImageCount = await currentPage.evaluate(() => {
                  const container = document.querySelector('#pro-content > div > div > div.product-main-img > div.product-img-container > div.img-switch.mt-20');
                  if (!container) return 0;
                  const images = container.querySelectorAll('img');
                  const loadedImages = Array.from(images).filter(img => 
                    img.complete && img.naturalWidth > 0 && img.naturalHeight > 0
                  );
                  return { total: images.length, loaded: loadedImages.length };
                });
                console.log(`[이미지추출] 썸네일 컨테이너 내 이미지 로드 완료 (${thumbnailImageCount.loaded}/${thumbnailImageCount.total}개)`);
              } catch (error) {
                // 타임아웃 무시하고 계속 진행
              }
            }
            
            // 상세 이미지 컨테이너 존재 확인 및 대기
            let detailContainerExists = false;
            try {
              await currentPage.waitForFunction(() => {
                const container = document.querySelector('#el-main > div > div > div:nth-child(4)');
                return container !== null;
              }, { timeout: 15000 });
              detailContainerExists = true;
            } catch (error) {
              detailContainerExists = false;
            }
            
            // 상세 이미지 컨테이너가 있으면 내부 이미지들이 로드될 때까지 대기
            if (detailContainerExists) {
              try {
                await currentPage.waitForFunction(() => {
                  const container = document.querySelector('#el-main > div > div > div:nth-child(4)');
                  if (!container) return false;
                  
                  const images = container.querySelectorAll('img');
                  if (images.length === 0) return false;
                  
                  // 모든 이미지가 로드되었는지 확인 (안전한 방식)
                  const loadedImages = Array.from(images).filter(img => 
                    img.complete && img.naturalWidth > 0 && img.naturalHeight > 0
                  );
                  
                  const allLoaded = loadedImages.length === images.length;
                  return allLoaded;
                }, { timeout: 20000 });
                
                // 추가 대기 시간 (이미지가 완전히 렌더링될 때까지)
                await currentPage.waitForTimeout(1000);
                
                // 로드된 이미지 개수 확인
                const detailImageCount = await currentPage.evaluate(() => {
                  const container = document.querySelector('#el-main > div > div > div:nth-child(4)');
                  if (!container) return 0;
                  const images = container.querySelectorAll('img');
                  const loadedImages = Array.from(images).filter(img => 
                    img.complete && img.naturalWidth > 0 && img.naturalHeight > 0
                  );
                  return { total: images.length, loaded: loadedImages.length };
                });
                console.log(`[이미지추출] 상세 이미지 컨테이너 내 이미지 로드 완료 (${detailImageCount.loaded}/${detailImageCount.total}개)`);
              } catch (error) {
                // 타임아웃 무시하고 계속 진행
              }
            }
            
            const 추출결과 = await currentPage.evaluate(() => {
              const 썸네일이미지들 = [];
              const 상세이미지들 = [];
              const currentUrl = window.location.href;
              
              // 검색 결과 페이지인지 확인
              if (window.location.href.includes('keywords=') || window.location.href.includes('search') || window.location.href.includes('list')) {
                return { 썸네일이미지들: [], 상세이미지들: [] };
              }
              
              // 썸네일 컨테이너에서 이미지 추출
              const 썸네일컨테이너 = document.querySelector('#pro-content > div > div > div.product-main-img > div.product-img-container > div.img-switch.mt-20');
              if (썸네일컨테이너) {
                const 추출된썸네일이미지들 = Array.from(썸네일컨테이너.querySelectorAll('img'))
                  .filter(img => {
                    const src = img.getAttribute('src');
                    return src && src.trim() !== '' && !src.startsWith('data:') && 
                           img.complete && img.naturalWidth > 0 && img.naturalHeight > 0 &&
                           (img.naturalWidth >= 150 || img.width >= 150) && 
                           (img.naturalHeight >= 150 || img.height >= 150);
                  })
                  .map(img => img.getAttribute('src'))
                  .filter((src, index, arr) => arr.indexOf(src) === index); // 중복 제거
                
                썸네일이미지들.push(...추출된썸네일이미지들);
              }
              
              // 상세 이미지 컨테이너에서 이미지 추출
              const 상세컨테이너 = document.querySelector('#el-main > div > div > div:nth-child(4)');
              if (상세컨테이너) {
                const 추출된상세이미지들 = Array.from(상세컨테이너.querySelectorAll('img'))
                  .filter(img => {
                    const src = img.getAttribute('src');
                    return src && src.trim() !== '' && !src.startsWith('data:') && 
                           img.complete && img.naturalWidth > 0 && img.naturalHeight > 0 &&
                           (img.naturalWidth >= 150 || img.width >= 150) && 
                           (img.naturalHeight >= 150 || img.height >= 150);
                  })
                  .map(img => img.getAttribute('src'))
                  .filter((src, index, arr) => arr.indexOf(src) === index); // 중복 제거
                
                상세이미지들.push(...추출된상세이미지들);
              }
              
              return { 썸네일이미지들, 상세이미지들 };
            });
            
            // 추출 결과를 이미지결과에 저장
            이미지결과 = 추출결과;
            
            const 썸네일이미지들 = 이미지결과.썸네일이미지들;
            const 상세이미지들 = 이미지결과.상세이미지들;
            
            // 이미지가 추출되었는지 확인
            if (썸네일이미지들.length > 0 || 상세이미지들.length > 0) {
              break;
            } else {
              재시도횟수 += 1;
              if (재시도횟수 < 최대재시도) {
                await currentPage.waitForTimeout(1000); // 재시도 전 대기
              }
            }
          } catch (e) {
            재시도횟수 += 1;
            if (재시도횟수 < 최대재시도) {
              await currentPage.waitForTimeout(1000); // 재시도 전 대기
            }
          }
        }
        
        // 이미지결과는 이미 초기화되어 있으므로 바로 사용
        const 썸네일이미지들 = 이미지결과.썸네일이미지들;
        const 상세이미지들 = 이미지결과.상세이미지들;
        
        // 디버깅: 실제 추출된 이미지 개수 확인
        console.log(`[디버깅] 상품 "${상품명}" 이미지 추출 결과:`, {
          썸네일: 썸네일이미지들.length + '개',
          상세: 상세이미지들.length + '개',
          썸네일URLs: 썸네일이미지들.slice(0, 3), // 처음 3개만
          상세URLs: 상세이미지들.slice(0, 3) // 처음 3개만
        });
        

        
        // 상세 이미지 필터링: data:로 시작하는 값과 중복값 제외, 앞에서 5개만
        const 필터된상세이미지들 = [];
        for (const 이미지URL of 이미지결과.상세이미지들) {
          if (!이미지URL.startsWith('data:') && !필터된상세이미지들.includes(이미지URL)) {
            필터된상세이미지들.push(이미지URL);
            if (필터된상세이미지들.length >= 5) {
              break;
            }
          }
        }
        

        
        // 썸네일 이미지도 앞에서 5개만
        const 최종썸네일이미지들 = 이미지결과.썸네일이미지들.slice(0, 5);
        

        
        // 기존 이미지들 변수명 변경
        const 이미지들 = 최종썸네일이미지들;
        

        
        // 뒤로가기 (검색 결과 페이지로 복귀)
        if (globalBrowser.contexts()[0].pages().length > 1) {
          // 새 창이 열려있으면 닫고 원래 페이지로 돌아가기
          await currentPage.close();
          currentPage = globalBrowser.contexts()[0].pages()[0]; // 첫 번째 페이지로 돌아가기
          await currentPage.bringToFront();
          // 원래 페이지로 복귀
        } else {
          // 같은 페이지에서 뒤로가기
          await currentPage.goBack();
        }
        
        결과목록.push({
          상품명: 상품명,
          성공: true,
          이미지들: 이미지들,
          상세이미지들: 필터된상세이미지들,
          메시지: `${이미지들.length}개 썸네일, ${필터된상세이미지들.length}개 상세 이미지 추출 완료`
        });
        
      } catch (error) {
        결과목록.push({
          상품명: 상품명,
          성공: false,
          에러: error.message
        });
      }
    }
    return {
      success: true,
      결과: 결과목록
    };
    
  } catch (error) {
    console.error('[이미지추출] 이미지 추출 API 오류:', error);
    return { success: false, error: error.message };
  }
});
