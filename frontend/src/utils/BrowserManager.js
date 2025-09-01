const { chromium } = require('playwright');
const { dialog } = require('electron');

class BrowserManager {
  constructor() {
    this.browser = null;
    this.context = null; // context 추가
    this.page = null;
    this.isInitializing = false;
  }

  async initialize(createDefaultPage = true) {
    if (this.isInitializing) {
      while (this.isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return { browser: this.browser, context: this.context, page: this.page };
    }

    if (this.browser && this.browser.isConnected()) {
      return { browser: this.browser, context: this.context, page: this.page };
    }

    this.isInitializing = true;
    console.log('🚀 브라우저 초기화 시작...');

    const launchOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    };

    for (const channel of ['chrome', 'msedge']) {
      try {
        this.browser = await chromium.launch({ ...launchOptions, channel });
        this.context = await this.browser.newContext(); // context 생성
        
        if (createDefaultPage) {
          this.page = await this.context.newPage();
          await this.page.setViewportSize({ width: 1280, height: 720 });
          await this.page.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
            Object.defineProperty(navigator, 'languages', { get: () => ['ko-KR', 'ko', 'en-US', 'en'] });
          });
        }
        
        console.log(`✅ ${channel} 브라우저로 초기화 완료`);
        this.isInitializing = false;
        return { browser: this.browser, context: this.context, page: this.page };
      } catch (error) {
        console.log(`⚠️ ${channel} 실행 실패:`, error.message);
      }
    }

    this.isInitializing = false;
    this.showBrowserInstallDialog();
    throw new Error('Chrome 또는 Edge가 설치되어 있지 않습니다');
  }

  async getBrowser() {
    if (!this.browser || !this.browser.isConnected()) {
      await this.initialize(false);
    }
    return this.browser;
  }

  async getContext() {
    if (!this.context || !this.browser?.isConnected()) {
      await this.initialize(false);
    }
    return this.context;
  }

  async createNewPage() {
    const context = await this.getContext();
    const newPage = await context.newPage();
    
    await newPage.setViewportSize({ width: 1280, height: 720 });
    await newPage.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
      Object.defineProperty(navigator, 'languages', { get: () => ['ko-KR', 'ko', 'en-US', 'en'] });
    });
    
    return newPage;
  }

  // 새 페이지 이벤트 대기 (새탭/새창 처리용)
  async waitForNewPage() {
    const context = await this.getContext();
    return context.waitForEvent('page');
  }

  async closePage(page) {
    try {
      if (page && !page.isClosed()) {
        await page.close();
        console.log('✅ 페이지 닫기 완료');
      }
    } catch (error) {
      console.error('❌ 페이지 닫기 실패:', error);
    }
  }

  async closePages(pages) {
    const closePromises = pages.map(page => this.closePage(page));
    await Promise.allSettled(closePromises);
  }

  async getAllPages() {
    if (!this.context) {
      return [];
    }
    return this.context.pages();
  }

  async cleanupUnusedPages() {
    try {
      const pages = await this.getAllPages();
      const pagesToClose = pages.filter(page => page !== this.page);
      
      if (pagesToClose.length > 0) {
        await this.closePages(pagesToClose);
        console.log(`🗂️ ${pagesToClose.length}개 사용하지 않는 페이지 정리 완료`);
      }
    } catch (error) {
      console.error('❌ 페이지 정리 실패:', error);
    }
  }

  showBrowserInstallDialog() {
    dialog.showMessageBox({
      type: 'info',
      title: '브라우저 설치 필요',
      message: 'Chrome 또는 Edge 브라우저가 필요합니다',
      detail: 'Google Chrome 또는 Microsoft Edge를 설치한 후 앱을 다시 실행해주세요.',
      buttons: ['Chrome 다운로드 페이지 열기', '확인'],
      defaultId: 0
    }).then((result) => {
      if (result.response === 0) {
        require('electron').shell.openExternal('https://www.google.com/chrome/');
      }
    });
  }

  async cleanup() {
    try {
      if (this.context) {
        const pages = await this.context.pages();
        await this.closePages(pages);
        await this.context.close();
        this.context = null;
      }
      
      if (this.page) {
        this.page = null;
      }
      
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
      console.log('✅ 브라우저 정리 완료');
    } catch (error) {
      console.error('❌ 브라우저 정리 실패:', error);
    }
  }

  handleError(error, context = '') {
    console.error(`브라우저 에러 [${context}]:`, error);
    
    const errorMessages = {
      'ECONNREFUSED': '네트워크 연결을 확인해주세요',
      'TimeoutError': '페이지 로딩 시간이 초과되었습니다',
      'Browser closed': '브라우저가 예상치 못하게 종료되었습니다'
    };
    
    const userMessage = errorMessages[error.code] || 
                       errorMessages[error.name] || 
                       '브라우저 작업 중 오류가 발생했습니다';
    
    return userMessage;
  }
}

module.exports = BrowserManager;
