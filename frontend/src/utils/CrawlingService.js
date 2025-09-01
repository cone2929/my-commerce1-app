class CrawlingService {
  constructor(browserManager) {
    this.browserManager = browserManager;
  }
  
  async parseProducts(url) {
    try {
      const { page } = await this.browserManager.initialize();
      
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      try {
        await page.waitForSelector('.product-eachone, [data-v-199934d4], .goods-item-animation', { 
          timeout: 10000 
        });
      } catch {
        // 요소가 없으면 계속 진행
      }
      
      await page.waitForTimeout(2000);
      
      const products = await page.evaluate(() => {
        const results = [];
        
        const selectors = [
          '.product-eachone',
          '[data-v-199934d4]',
          '.goods-item-animation',
          '.product-item',
          '.item',
          '.goods',
          '[class*="product"]',
          '[class*="item"]'
        ];
        
        let elements = [];
        for (const selector of selectors) {
          elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            console.log(`상품 요소 발견: ${selector} - ${elements.length}개`);
            break;
          }
        }
        
        console.log(`총 상품 요소 수: ${elements.length}`);
        
        elements.forEach((element, index) => {
          try {
            let imgElement = null;
            const imageSelectors = [
              '.prod-img img',
              '.product-img img', 
              '.goods-image img',
              '.item-image img',
              'img[src*="http"]',
              'img[src*="://"]',
              'img'
            ];
            
            for (const imgSelector of imageSelectors) {
              imgElement = element.querySelector(imgSelector);
              if (imgElement && imgElement.src && !imgElement.src.startsWith('data:') && imgElement.src.includes('http')) {
                break;
              }
            }
            
            let titleElement = null;
            const titleSelectors = [
              '.product-title',
              '.goods-name', 
              '.item-name',
              '[class*="title"]',
              '[class*="name"]',
              'h1, h2, h3, h4, h5, h6',
              '.text-content',
              '[class*="text"]'
            ];
            
            for (const titleSelector of titleSelectors) {
              titleElement = element.querySelector(titleSelector);
              if (titleElement && titleElement.textContent.trim().length > 1) {
                break;
              }
            }
            
            let priceElement = null;
            const priceSelectors = [
              '.rmb',
              '.price',
              '[class*="price"]',
              '[class*="rmb"]',
              '[class*="cost"]',
              '[class*="money"]'
            ];
            
            for (const priceSelector of priceSelectors) {
              priceElement = element.querySelector(priceSelector);
              if (priceElement && priceElement.textContent.trim()) {
                break;
              }
            }
            
            const imageUrl = imgElement ? imgElement.src : '';
            const title = titleElement ? titleElement.textContent.trim() : `상품 ${index + 1}`;
            const price = priceElement ? priceElement.textContent.trim() : '';
            
            console.log(`상품 ${index + 1}:`, { title, imageUrl: imageUrl.substring(0, 50) + '...', price });
            
            if (title && title.length > 3 && imageUrl && imageUrl.startsWith('http')) {
              results.push({
                이미지URL: imageUrl,
                제목: title,
                가격: price,
                한국어가격: '',
                판매정보: '',
                라벨: ''
              });
            }
          } catch (error) {
            console.error(`상품 ${index + 1} 정보 추출 오류:`, error);
          }
        });
        
        console.log(`추출된 상품 수: ${results.length}`);
        return results.slice(0, 20);
      });
      
      return { products, success: true, total: products.length };
      
    } catch (error) {
      console.error('상품 파싱 오류:', error);
      return { error: error.message, success: false };
    }
  }

  // 이미지 추출 기능 (수정된 버전 - 새탭 처리 개선)
  async extractProductImages(상품명목록, 검색URL) {
    try {
      const { page } = await this.browserManager.initialize();
      const results = [];
      
      for (const productName of 상품명목록) {
        let newPage = null;
        try {
          console.log(`🔍 "${productName}" 상품 처리 시작`);
          
          // 검색 페이지로 이동 (매번 새로 이동)
          if (검색URL) {
            await page.goto(검색URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForTimeout(1000);
          }
          
          // 새 페이지 이벤트 리스너 설정 (클릭하기 전에!)
          const newPagePromise = this.browserManager.waitForNewPage();
          
          // 상품 찾기 및 클릭
          const productClickResult = await page.evaluate((name) => {
            console.log(`상품 "${name}" 검색 중...`);
            
            const selectors = [
              '.product-eachone', 
              '[data-v-199934d4]', 
              '.goods-item-animation',
              '.product-item',
              '.item'
            ];
            
            let targetElement = null;
            
            for (const selector of selectors) {
              const products = document.querySelectorAll(selector);
              console.log(`${selector}: ${products.length}개 상품 발견`);
              
              for (let i = 0; i < products.length; i++) {
                const product = products[i];
                const titleSelectors = [
                  '.product-title',
                  '.goods-name', 
                  '.item-name',
                  '[class*="title"]',
                  '[class*="name"]'
                ];
                
                for (const titleSelector of titleSelectors) {
                  const titleElement = product.querySelector(titleSelector);
                  if (titleElement && titleElement.textContent.trim() === name) {
                    console.log(`✅ 상품 "${name}" 발견! 클릭 시도...`);
                    targetElement = product;
                    
                    // 스크롤해서 요소가 보이도록 함
                    product.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // 잠시 대기 후 클릭
                    setTimeout(() => {
                      try {
                        product.click();
                        console.log(`✅ 상품 "${name}" 클릭 완료`);
                      } catch (clickError) {
                        console.error('클릭 오류:', clickError);
                      }
                    }, 500);
                    
                    return true;
                  }
                }
              }
              
              if (targetElement) break;
            }
            
            if (!targetElement) {
              console.log(`❌ 상품 "${name}"을 찾을 수 없습니다.`);
            }
            
            return false;
          }, productName);
          
          if (!productClickResult) {
            results.push({
              상품명: productName,
              성공: false,
              에러: "상품을 찾을 수 없습니다"
            });
            continue;
          }
          
          // 새 페이지가 열릴 때까지 대기 (최대 15초)
          try {
            newPage = await Promise.race([
              newPagePromise,
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('새 페이지 열기 타임아웃')), 15000)
              )
            ]);
            
            console.log(`📄 "${productName}" 새 탭 열기 완료`);
            
            // 새 페이지 로딩 대기
            await newPage.waitForLoadState('domcontentloaded', { timeout: 15000 });
            await newPage.waitForTimeout(2000);
            
            console.log(`📄 "${productName}" 상세페이지 로딩 완료`);
            
          } catch (error) {
            console.error(`❌ "${productName}" 새 페이지 열기 실패:`, error);
            results.push({
              상품명: productName,
              성공: false,
              에러: `새 페이지 열기 실패: ${error.message}`
            });
            continue;
          }
          
          // 이미지 추출
          const images = await newPage.evaluate((productName) => {
            console.log(`🖼️ "${productName}" 이미지 추출 시작`);
            
            const thumbnails = new Set();
            const details = new Set();
            
            // 썸네일 이미지 추출 (특정 컨테이너에서)
            const thumbnailContainer = document.querySelector('#pro-content > div > div > div.product-main-img > div.product-img-container > div.img-switch.mt-20');
            if (thumbnailContainer) {
              const imgs = thumbnailContainer.querySelectorAll('img[src]');
              console.log(`썸네일 컨테이너에서 ${imgs.length}개 이미지 발견`);
              
              imgs.forEach(img => {
                if (img.src && 
                    img.src.startsWith('http') && 
                    !img.src.includes('data:')) {
                  
                  console.log('썸네일 이미지 추가:', img.src.substring(0, 80));
                  thumbnails.add(img.src);
                }
              });
            }
            
            // 상세 이미지 추출 (특정 컨테이너에서)
            const detailContainer = document.querySelector('#el-main > div > div > div:nth-child(4) > div > div');
            if (detailContainer) {
              const imgs = detailContainer.querySelectorAll('img[src]');
              console.log(`상세 컨테이너에서 ${imgs.length}개 이미지 발견`);
              
              imgs.forEach(img => {
                if (img.src && 
                    img.src.startsWith('http') && 
                    !img.src.includes('data:') &&
                    !thumbnails.has(img.src)) {
                  
                  console.log('상세 이미지 추가:', img.src.substring(0, 80));
                  details.add(img.src);
                }
              });
            }
            
            const thumbnailArray = Array.from(thumbnails).slice(0, 5);
            const detailArray = Array.from(details).slice(0, 10);
            
            console.log(`✅ "${productName}" 이미지 추출 완료: 썸네일 ${thumbnailArray.length}개, 상세 ${detailArray.length}개`);
            
            return { 
              thumbnails: thumbnailArray, 
              details: detailArray 
            };
          }, productName);
          
          results.push({
            상품명: productName,
            성공: true,
            이미지들: images.thumbnails,
            상세이미지들: images.details,
            메시지: `${images.thumbnails.length}개 썸네일, ${images.details.length}개 상세 이미지 추출`
          });
          
          console.log(`✅ "${productName}" 처리 완료`);
          
        } catch (error) {
          console.error(`❌ 상품 "${productName}" 처리 중 오류:`, error);
          results.push({
            상품명: productName,
            성공: false,
            에러: error.message
          });
        } finally {
          // 새 페이지가 있으면 닫기
          if (newPage) {
            await this.browserManager.closePage(newPage);
            console.log(`🗂️ "${productName}" 탭 닫기 완료`);
          }
        }
      }
      
      return { success: true, 결과: results };
      
    } catch (error) {
      console.error('이미지 추출 전체 오류:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = CrawlingService;
