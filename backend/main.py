from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import Response
import base64
import asyncio
import urllib.parse

from supabase import create_client
from dotenv import load_dotenv
import os
load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase = create_client(supabase_url, supabase_key)

# 🐥🐥🐥🐥🐥 Playwright 관련 import
from playwright.async_api import async_playwright

# 🐥🐥🐥🐥🐥 사용자별 브라우저 관리
user_browsers = {}






app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://my-commerce-frontend-uyt4.onrender.com", "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Hello, FastAPI!"}

@app.get("/health")
def health():
    return {"status": "OK"}



# 🐥🐥🐥🐥🐥 웹페이지 상품 정보 파싱 API
class 웹페이지요청(BaseModel):
    url: str
    page: int = 1
    user_id: str = "default"  # 🐥🐥🐥🐥🐥 사용자 ID 추가

@app.post("/api/parse-products")
async def 상품정보파싱(요청: 웹페이지요청):
    try:
        # 🐥🐥🐥🐥🐥 사용자별 브라우저 관리
        user_id = 요청.user_id
        
        if user_id not in user_browsers:
            # 🐥🐥🐥🐥🐥 새 사용자: 브라우저 생성
            print(f"🐥🐥🐥🐥🐥 디버깅: 새 사용자 {user_id} 브라우저 생성")
            try:
                playwright = await async_playwright().start()
                
                # 🐥🐥🐥🐥🐥 설치된 브라우저 경로 확인
                import os
                playwright_cache_dir = os.path.expanduser("~/.cache/ms-playwright")
                render_cache_dir = "/opt/render/.cache/ms-playwright"
                
                print(f"🐥🐥🐥🐥🐥 Playwright 캐시 디렉토리 확인:")
                print(f"🐥🐥🐥🐥🐥 사용자 캐시: {playwright_cache_dir}")
                print(f"🐥🐥🐥🐥🐥 Render 캐시: {render_cache_dir}")
                
                # 🐥🐥🐥🐥🐥 실제 설치된 브라우저 경로 확인
                if os.path.exists(render_cache_dir):
                    print(f"🐥🐥🐥🐥🐥 Render 캐시 디렉토리 존재: {render_cache_dir}")
                    for item in os.listdir(render_cache_dir):
                        item_path = os.path.join(render_cache_dir, item)
                        if os.path.isdir(item_path):
                            print(f"🐥🐥🐥🐥🐥 브라우저 디렉토리: {item}")
                            # 🐥🐥🐥🐥🐥 하위 디렉토리 확인
                            try:
                                for subitem in os.listdir(item_path):
                                    subitem_path = os.path.join(item_path, subitem)
                                    if os.path.isdir(subitem_path):
                                        print(f"🐥🐥🐥🐥🐥   - {subitem}/")
                                        # 🐥🐥🐥🐥🐥 실행 파일 찾기
                                        try:
                                            for file in os.listdir(subitem_path):
                                                if file in ['chrome', 'firefox', 'webkit']:
                                                    full_path = os.path.join(subitem_path, file)
                                                    print(f"🐥🐥🐥🐥🐥     실행 파일: {full_path}")
                                        except:
                                            pass
                            except:
                                pass
                else:
                    print(f"🐥🐥🐥🐥🐥 Render 캐시 디렉토리 없음: {render_cache_dir}")
                
                if os.path.exists(playwright_cache_dir):
                    print(f"🐥🐥🐥🐥🐥 사용자 캐시 디렉토리 존재: {playwright_cache_dir}")
                else:
                    print(f"🐥🐥🐥🐥🐥 사용자 캐시 디렉토리 없음: {playwright_cache_dir}")
                
                # 🐥🐥🐥🐥🐥 첫 번째 시도: 기본 설정으로 브라우저 실행
                try:
                    browser = await playwright.chromium.launch(
                        headless=True,
                        args=[
                            '--no-sandbox',
                            '--disable-dev-shm-usage',
                            '--disable-gpu',
                            '--disable-software-rasterizer',
                            '--disable-extensions',
                            '--disable-background-timer-throttling',
                            '--disable-backgrounding-occluded-windows',
                            '--disable-renderer-backgrounding',
                            '--disable-features=TranslateUI',
                            '--disable-ipc-flooding-protection'
                        ]
                    )
                except Exception as e1:
                    print(f"🐥🐥🐥🐥🐥 첫 번째 브라우저 실행 실패: {str(e1)}")
                    # 🐥🐥🐥🐥🐥 두 번째 시도: 최소 설정으로 브라우저 실행
                    try:
                        browser = await playwright.chromium.launch(
                            headless=True,
                            args=['--no-sandbox', '--disable-dev-shm-usage']
                        )
                    except Exception as e2:
                        print(f"🐥🐥🐥🐥🐥 두 번째 브라우저 실행 실패: {str(e2)}")
                        # 🐥🐥🐥🐥🐥 세 번째 시도: Firefox 사용
                        browser = await playwright.firefox.launch(
                            headless=True,
                            args=['--no-sandbox']
                        )
                
                page = await browser.new_page()
                user_browsers[user_id] = {'browser': browser, 'page': page, 'playwright': playwright}
            except Exception as e:
                print(f"🐥🐥🐥🐥🐥 브라우저 생성 실패: {str(e)}")
                # 🐥🐥🐥🐥🐥 실패 시 기본 응답 반환
                return {"products": [], "success": False, "error": "브라우저 생성 실패"}
        else:
            # 🐥🐥🐥🐥🐥 기존 사용자: 브라우저 재사용
            print(f"🐥🐥🐥🐥🐥 디버깅: 기존 사용자 {user_id} 브라우저 재사용")
            browser = user_browsers[user_id]['browser']
            page = user_browsers[user_id]['page']
        
        # 🐥🐥🐥🐥🐥 디버깅: 요청 정보 출력
        print(f"🐥🐥🐥🐥🐥 디버깅: 사용자 {user_id}, 페이지 {요청.page} 요청 시작")
        
        # 🐥🐥🐥🐥🐥 페이지 로드 대기 (최적화)
        await page.goto(요청.url, wait_until='domcontentloaded', timeout=30000)
        
        # 🐥🐥🐥🐥🐥 상품 요소가 클릭 가능할 때까지 조건부 대기 (attached 상태)
        try:
            await page.wait_for_selector('.product-eachone', state='attached', timeout=5000)
        except:
            try:
                await page.wait_for_selector('[data-v-199934d4]', state='attached', timeout=3000)
            except:
                try:
                    await page.wait_for_selector('.goods-item-animation', state='attached', timeout=2000)
                except:
                    # 🐥🐥🐥🐥🐥 모든 셀렉터가 실패해도 기본 대기
                    await page.wait_for_timeout(1000)
        
        # 🐥🐥🐥🐥🐥 클릭 가능 확인 후 무조건 대기 1초 추가
        await page.wait_for_timeout(1000)
        
        # 🐥🐥🐥🐥🐥 페이지 번호에 따라 스크롤 시뮬레이션
        if 요청.page > 1:
            print(f"🐥🐥🐥🐥🐥 디버깅: 페이지 {요청.page} 스크롤 시작")
            
            # 🐥🐥🐥🐥🐥 스크롤 전 상품 개수 확인
            스크롤전상품수 = await page.evaluate("document.querySelectorAll('.product-eachone, [data-v-199934d4], .goods-item-animation').length")
            print(f"🐥🐥🐥🐥🐥 디버깅: 스크롤 전 상품 수: {스크롤전상품수}개")
            
            # 🐥🐥🐥🐥🐥 현재 화면 기준 가장 아래로 스크롤
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            
            # 🐥🐥🐥🐥🐥 새로운 상품들이 로드될 때까지 조건부 대기
            try:
                await page.wait_for_function("""
                    () => {
                        const currentCount = document.querySelectorAll('.product-eachone, [data-v-199934d4], .goods-item-animation').length;
                        return currentCount > """ + str(스크롤전상품수) + """;
                    }
                """, timeout=15000)
                
                # 🐥🐥🐥🐥🐥 스크롤 후 상품 개수 확인
                스크롤후상품수 = await page.evaluate("document.querySelectorAll('.product-eachone, [data-v-199934d4], .goods-item-animation').length")
                print(f"🐥🐥🐥🐥🐥 디버깅: 스크롤 후 상품 수: {스크롤후상품수}개 (증가: {스크롤후상품수 - 스크롤전상품수}개)")
                
            except:
                print(f"🐥🐥🐥🐥🐥 디버깅: 새로운 상품 로딩 대기 실패")
            
            # 🐥🐥🐥🐥🐥 이미지 로딩 완료까지 대기 (최적화)
            try:
                await page.wait_for_function("""
                    () => {
                        const images = document.querySelectorAll('img');
                        let loadedCount = 0;
                        let totalCount = 0;
                        
                        for (let img of images) {
                            totalCount++;
                            if (img.complete && img.naturalHeight > 0) {
                                loadedCount++;
                            }
                        }
                        
                        // 🐥🐥🐥🐥🐥 70% 이상의 이미지가 로드되면 완료로 간주 (속도 우선)
                        return totalCount > 0 && (loadedCount / totalCount) >= 0.7;
                    }
                """, timeout=10000)
                print(f"🐥🐥🐥🐥🐥 디버깅: 이미지 로딩 완료")
            except:
                print(f"🐥🐥🐥🐥🐥 디버깅: 이미지 로딩 대기 실패")
        else:
            # 🐥🐥🐥🐥🐥 첫 페이지는 조건부 대기만으로 충분
            pass
        
        # 🐥🐥🐥🐥🐥 최종 상품 개수 확인
        최종상품수 = await page.evaluate("document.querySelectorAll('.product-eachone, [data-v-199934d4], .goods-item-animation').length")
        print(f"🐥🐥🐥🐥🐥 디버깅: 최종 상품 수: {최종상품수}개")
        
        # 🐥🐥🐥🐥🐥 상품 정보 추출 (즉시 실행)
        상품목록 = await page.evaluate("""
            () => {
                const products = [];
                
                // 🐥🐥🐥🐥🐥 여러 셀렉터 시도
                let productElements = document.querySelectorAll('.product-eachone');
                if (productElements.length === 0) {
                    productElements = document.querySelectorAll('[data-v-199934d4]');
                }
                if (productElements.length === 0) {
                    productElements = document.querySelectorAll('.goods-item-animation');
                }
                
                console.log('🐥🐥🐥🐥🐥 디버깅: 찾은 상품 요소 수:', productElements.length);
                
                productElements.forEach((element, index) => {
                    try {
                        // 🐥🐥🐥🐥🐥 상품 이미지 (최적화)
                        let imgElement = element.querySelector('.prod-img img');
                        if (!imgElement) imgElement = element.querySelector('.product-img img');
                        if (!imgElement) imgElement = element.querySelector('img');
                        const 이미지URL = imgElement ? imgElement.src : '';
                        
                        // 🐥🐥🐥🐥🐥 상품 제목
                        let titleElement = element.querySelector('.product-title');
                        if (!titleElement) titleElement = element.querySelector('[class*="title"]');
                        if (!titleElement) titleElement = element.querySelector('div[class*="text"]');
                        const 제목 = titleElement ? titleElement.textContent.trim() : '';
                        
                        // 🐥🐥🐥🐥🐥 가격 정보
                        let priceElement = element.querySelector('.rmb');
                        if (!priceElement) priceElement = element.querySelector('[class*="price"]');
                        if (!priceElement) priceElement = element.querySelector('[class*="rmb"]');
                        const 가격 = priceElement ? priceElement.textContent.trim() : '';
                        
                        // 🐥🐥🐥🐥🐥 한국어 가격
                        let koreanPriceElement = element.querySelector('.korean');
                        if (!koreanPriceElement) koreanPriceElement = element.querySelector('[class*="won"]');
                        const 한국어가격 = koreanPriceElement ? koreanPriceElement.textContent.trim() : '';
                        
                        // 🐥🐥🐥🐥🐥 판매 정보
                        let salesElement = element.querySelector('.sales-info');
                        if (!salesElement) salesElement = element.querySelector('[class*="sales"]');
                        const 판매정보 = salesElement ? salesElement.textContent.trim() : '';
                        
                        // 🐥🐥🐥🐥🐥 라벨 정보
                        let labelElement = element.querySelector('.product-lable span');
                        if (!labelElement) labelElement = element.querySelector('[class*="label"] span');
                        const 라벨 = labelElement ? labelElement.textContent.trim() : '';
                        
                        // 🐥🐥🐥🐥🐥 최소한의 정보가 있는 경우만 추가
                        if (제목 || 이미지URL) {
                            products.push({
                                이미지URL,
                                제목: 제목 || `상품 ${index + 1}`,
                                가격: 가격 || '',
                                한국어가격: 한국어가격 || '',
                                판매정보: 판매정보 || '',
                                라벨: 라벨 || ''
                            });
                        }
                    } catch (error) {
                        console.error('상품 정보 추출 오류:', error);
                    }
                });
                
                console.log('🐥🐥🐥🐥🐥 디버깅: 추출된 상품 수:', products.length);
                return products;
            }
        """)
        
        print(f"🐥🐥🐥🐥🐥 디버깅: 파싱 완료 - 상품 {len(상품목록)}개 추출")
        
        # 🐥🐥🐥🐥🐥 브라우저는 닫지 않음 (재사용을 위해)
        # await browser.close()
        
        return {"products": 상품목록, "success": True, "total": len(상품목록)}
    except Exception as e:
        print(f"상품 정보 파싱 오류: {str(e)}")
        return {"error": str(e), "success": False}

# 🐥🐥🐥🐥🐥 상품 상세페이지 이미지 추출을 위한 모델
class 상품이미지요청(BaseModel):
    상품명목록: list[str]
    사용자ID: str

# 🐥🐥🐥🐥🐥 상품 상세페이지 이미지 추출 API
@app.post("/api/extract-product-images")
async def 상품이미지추출(요청: 상품이미지요청):
    try:
        print(f"🐥🐥🐥🐥🐥 상품 이미지 추출 시작: {len(요청.상품명목록)}개 상품")
        
        # 🐥🐥🐥🐥🐥 사용자별 브라우저 확인
        if 요청.사용자ID not in user_browsers:
            print(f"🐥🐥🐥🐥🐥 새 사용자 {요청.사용자ID} 브라우저 생성")
            try:
                playwright = await async_playwright().start()
                
                # 🐥🐥🐥🐥🐥 첫 번째 시도: 기본 설정으로 브라우저 실행
                try:
                    browser = await playwright.chromium.launch(
                        headless=True,
                        args=[
                            '--no-sandbox',
                            '--disable-setuid-sandbox',
                            '--disable-gpu',
                            '--disable-software-rasterizer',
                            '--disable-extensions',
                            '--disable-background-timer-throttling',
                            '--disable-backgrounding-occluded-windows',
                            '--disable-renderer-backgrounding',
                            '--disable-features=TranslateUI',
                            '--disable-ipc-flooding-protection'
                        ]
                    )
                except Exception as e1:
                    print(f"🐥🐥🐥🐥🐥 첫 번째 브라우저 실행 실패: {str(e1)}")
                    # 🐥🐥🐥🐥🐥 두 번째 시도: 최소 설정으로 브라우저 실행
                    try:
                        browser = await playwright.chromium.launch(
                            headless=True,
                            args=['--no-sandbox', '--disable-setuid-sandbox']
                        )
                    except Exception as e2:
                        print(f"🐥🐥🐥🐥🐥 두 번째 브라우저 실행 실패: {str(e2)}")
                        # 🐥🐥🐥🐥🐥 세 번째 시도: Firefox 사용
                        browser = await playwright.firefox.launch(
                            headless=True,
                            args=['--no-sandbox']
                        )
                
                page = await browser.new_page()
                
                # 🐥🐥🐥🐥🐥 사용자별 브라우저 저장
                user_browsers[요청.사용자ID] = {
                    'browser': browser,
                    'page': page,
                    'playwright': playwright
                }
            except Exception as e:
                print(f"🐥🐥🐥🐥🐥 브라우저 생성 실패: {str(e)}")
                return {"success": False, "error": "브라우저 생성 실패"}
        else:
            # 🐥🐥🐥🐥🐥 기존 사용자: 브라우저 재사용
            print(f"🐥🐥🐥🐥🐥 기존 사용자 {요청.사용자ID} 브라우저 재사용")
            browser = user_browsers[요청.사용자ID]['browser']
            page = user_browsers[요청.사용자ID]['page']
        
        결과목록 = []
        
        # 🐥🐥🐥🐥🐥 기존 검색 결과에서 상품명으로 매칭
        print(f"🐥🐥🐥🐥🐥 기존 검색 결과에서 {len(요청.상품명목록)}개 상품 매칭 시작")
        
        # 🐥🐥🐥🐥🐥 현재 페이지의 모든 상품 정보 가져오기
        현재상품목록 = await page.evaluate("""
            () => {
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
            }
        """)
        
        print(f"🐥🐥🐥🐥🐥 현재 페이지에서 {len(현재상품목록)}개 상품 발견")
        
        # 🐥🐥🐥🐥🐥 요청된 상품명들과 매칭
        for 상품명 in 요청.상품명목록:
            try:
                print(f"🐥🐥🐥🐥🐥 상품 매칭 중: {상품명}")
                
                # 🐥🐥🐥🐥🐥 현재 페이지에서 상품명으로 매칭
                매칭된상품 = None
                for 상품 in 현재상품목록:
                    if 상품['title'] == 상품명:
                        매칭된상품 = 상품
                        break
                
                if not 매칭된상품:
                    print(f"🐥🐥🐥🐥🐥 상품 매칭 실패: {상품명}")
                    결과목록.append({
                        "상품명": 상품명,
                        "성공": False,
                        "에러": "현재 페이지에서 상품을 찾을 수 없습니다"
                    })
                    continue
                
                print(f"🐥🐥🐥🐥🐥 상품 매칭 성공: {상품명}")
                
                # 🐥🐥🐥🐥🐥 매칭된 상품 클릭하여 상세페이지로 이동
                클릭성공 = await page.evaluate(f"""
                    () => {{
                        const products = document.querySelectorAll('.product-eachone, [data-v-199934d4], .goods-item-animation');
                        const targetIndex = {매칭된상품['index']};
                        
                        if (products[targetIndex]) {{
                            products[targetIndex].click();
                            return true;
                        }}
                        
                        return false;
                    }}
                """)
                
                if not 클릭성공:
                    print(f"🐥🐥🐥🐥🐥 상품 클릭 실패: {상품명}")
                    결과목록.append({
                        "상품명": 상품명,
                        "성공": False,
                        "에러": "상품 클릭에 실패했습니다"
                    })
                    continue
                
                print(f"🐥🐥🐥🐥🐥 상품 클릭 완료: {상품명}")
                
                # 🐥🐥🐥🐥🐥 새 창/탭이 열렸는지 확인하고 핸들 이동
                
                # 🐥🐥🐥🐥🐥 현재 컨텍스트의 모든 페이지 확인
                pages = browser.contexts[0].pages
                print(f"🐥🐥🐥🐥🐥 현재 컨텍스트의 페이지 수: {len(pages)}")
                
                # 🐥🐥🐥🐥🐥 새로 열린 페이지가 있으면 해당 페이지로 이동
                if len(pages) > 1:
                    # 🐥🐥🐥🐥🐥 마지막에 열린 페이지로 이동
                    new_page = pages[-1]
                    await new_page.bring_to_front()
                    page = new_page
                    print(f"🐥🐥🐥🐥🐥 새 페이지로 이동: {page.url}")
                else:
                    # 🐥🐥🐥🐥🐥 새 창이 열리기를 기다림
                    try:
                        new_page = await page.context.wait_for_event('page', timeout=10000)
                        await new_page.wait_for_load_state('domcontentloaded')
                        page = new_page
                        print(f"🐥🐥🐥🐥🐥 새 창으로 이동: {page.url}")
                    except Exception as e:
                        print(f"🐥🐥🐥🐥🐥 새 창 대기 시간 초과: {str(e)}")
                
                # 🐥🐥🐥🐥🐥 상세페이지 로딩 대기
                
                # 🐥🐥🐥🐥🐥 상세페이지 URL 확인
                current_url = page.url
                print(f"🐥🐥🐥🐥🐥 현재 페이지 URL: {current_url}")
                
                # 🐥🐥🐥🐥🐥 상세페이지로 이동했는지 확인
                if 'product' not in current_url.lower() and 'detail' not in current_url.lower():
                    print(f"🐥🐥🐥🐥🐥 상세페이지로 이동하지 않음: {current_url}")
                    # 🐥🐥🐥🐥🐥 다시 클릭 시도 (새 창에서)
                    재클릭성공 = await page.evaluate(f"""
                        () => {{
                            const products = document.querySelectorAll('.product-eachone, [data-v-199934d4], .goods-item-animation');
                            const targetIndex = {매칭된상품['index']};
                            
                            if (products[targetIndex]) {{
                                const clickEvent = new MouseEvent('click', {{ bubbles: true, cancelable: true, view: window }});
                                products[targetIndex].dispatchEvent(clickEvent);
                                return true;
                            }}
                            
                            return false;
                        }}
                    """)
                    
                    if 재클릭성공:
                        print(f"🐥🐥🐥🐥🐥 재클릭 완료")
                        current_url = page.url
                        print(f"🐥🐥🐥🐥🐥 재클릭 후 URL: {current_url}")
                
                # 🐥🐥🐥🐥🐥 이미지 요소들이 클릭 가능할 때까지 대기 (attached 상태)
                try:
                    await page.wait_for_selector('img', state='attached', timeout=15000);
                    print(f"🐥🐥🐥🐥🐥 이미지 요소 로드 완료: {상품명}")
                except:
                    print(f"🐥🐥🐥🐥🐥 이미지 요소 대기 시간 초과, 계속 진행: {상품명}")
                
                # 🐥🐥🐥🐥🐥 추가 대기 시간 (이미지 렌더링 완료를 위해)
                
                # 🐥🐥🐥🐥🐥 이미지 로딩 대기 제거 - 즉시 이미지 추출 진행
                
                # 🐥🐥🐥🐥🐥 추가 안정화 대기 시간
                
                # 🐥🐥🐥🐥🐥 상세페이지에서 이미지 추출 (재시도 로직 포함)
                이미지결과 = None
                재시도횟수 = 0
                최대재시도 = 3
                
                while 재시도횟수 < 최대재시도:
                    try:
                        이미지결과 = await page.evaluate("""
                    () => {
                        const 썸네일이미지들 = [];
                        const 상세이미지들 = [];
                        const currentUrl = window.location.href;
                        console.log('🐥🐥🐥🐥🐥 현재 페이지:', currentUrl);
                        
                        // 🐥🐥🐥🐥🐥 검색 결과 페이지인지 확인
                        if (currentUrl.includes('keywords=') || currentUrl.includes('search') || currentUrl.includes('list')) {
                            console.log('🐥🐥🐥🐥🐥 검색 결과 페이지에서 이미지 추출 중단');
                            return { 썸네일이미지들: [], 상세이미지들: [] };
                        }
                        
                        // 🐥🐥🐥🐥🐥 제외할 패턴들 (더 엄격하게)
                        const excludePatterns = [
                            'search', 'list', 'thumb', 'small', 'mini', 'icon', 'logo', 'banner', 'ad',
                            'nav', 'menu', 'header', 'footer', 'sidebar', 'btn', 'button', 'related',
                            'recommend', 'suggest', 'similar', 'other', 'more', 'prev', 'next'
                        ];
                        
                        // 🐥🐥🐥🐥🐥 모든 이미지 요소 확인
                        const allImages = document.querySelectorAll('img');
                        console.log('🐥🐥🐥🐥🐥 전체 이미지 개수:', allImages.length);
                        
                        allImages.forEach((img, index) => {
                            const src = img.getAttribute('src');
                            if (!src || src.trim() === '' || src.startsWith('data:')) return;
                            
                            // 🐥🐥🐥🐥🐥 이미지가 실제로 로드되었는지 확인
                            if (!img.complete || img.naturalWidth === 0) {
                                console.log(`🐥🐥🐥🐥🐥 이미지가 로드되지 않음 ${index}:`, src);
                                return;
                            }
                            
                            // 🐥🐥🐥🐥🐥 이미지 URL과 클래스명, alt 텍스트 확인
                            const className = img.className || '';
                            const altText = img.alt || '';
                            const parentClassName = img.parentElement ? img.parentElement.className : '';
                            const style = img.getAttribute('style') || '';
                            
                            // 🐥🐥🐥🐥🐥 제외 패턴 확인
                            const isExcluded = excludePatterns.some(pattern => 
                                src.toLowerCase().includes(pattern) || 
                                className.toLowerCase().includes(pattern) ||
                                altText.toLowerCase().includes(pattern) ||
                                parentClassName.toLowerCase().includes(pattern)
                            );
                            
                            if (isExcluded) {
                                console.log(`🐥🐥🐥🐥🐥 제외된 이미지 ${index}:`, src);
                                return;
                            }
                            
                            // 🐥🐥🐥🐥🐥 이미지 크기 확인 (너무 작은 이미지 제외)
                            const width = img.naturalWidth || img.width || 0;
                            const height = img.naturalHeight || img.height || 0;
                            
                            if (width < 150 || height < 150) {
                                console.log(`🐥🐥🐥🐥🐥 크기가 작은 이미지 제외 ${index} (${width}x${height}):`, src);
                                return;
                            }
                            
                                                    // 🐥🐥🐥🐥🐥 썸네일 이미지 조건 확인 (#pro-content > div > div > div.product-main-img > div.product-img-container > div.img-switch.mt-20 내부)
                        const 썸네일컨테이너 = document.querySelector('#pro-content > div > div > div.product-main-img > div.product-img-container > div.img-switch.mt-20');
                        const is썸네일이미지 = 썸네일컨테이너 && 썸네일컨테이너.contains(img);
                        
                        // 🐥🐥🐥🐥🐥 상세 이미지 조건 확인 (#el-main > div > div > div:nth-child(4) 내부)
                        const elMainContainer = document.querySelector('#el-main > div > div > div:nth-child(4)');
                        const is상세이미지 = elMainContainer && elMainContainer.contains(img);
                        
                        if (is썸네일이미지) {
                            // 🐥🐥🐥🐥🐥 썸네일 이미지 (지정된 컨테이너 내부)
                            if (!썸네일이미지들.includes(src)) {
                                console.log(`🐥🐥🐥🐥🐥 썸네일 이미지 추가 ${index} (${width}x${height}):`, src);
                                썸네일이미지들.push(src);
                            }
                        } else if (is상세이미지) {
                            // 🐥🐥🐥🐥🐥 상세 이미지
                            if (!상세이미지들.includes(src)) {
                                console.log(`🐥🐥🐥🐥🐥 상세 이미지 추가 ${index} (${width}x${height}):`, src);
                                상세이미지들.push(src);
                            }
                        }
                        });
                        
                        console.log('🐥🐥🐥🐥🐥 최종 추출된 썸네일 이미지들:', 썸네일이미지들);
                        console.log('🐥🐥🐥🐥🐥 최종 추출된 상세 이미지들:', 상세이미지들);
                        return { 썸네일이미지들, 상세이미지들 };
                    }
                """)
                        
                        썸네일이미지들 = 이미지결과['썸네일이미지들']
                        상세이미지들 = 이미지결과['상세이미지들']
                        
                        # 🐥🐥🐥🐥🐥 이미지가 추출되었는지 확인
                        if (썸네일이미지들.length > 0 or 상세이미지들.length > 0):
                            print(f"🐥🐥🐥🐥🐥 이미지 추출 성공 (재시도 {재시도횟수 + 1}): {상품명}")
                            break
                        else:
                            print(f"🐥🐥🐥🐥🐥 이미지 추출 실패 (재시도 {재시도횟수 + 1}): {상품명}")
                            재시도횟수 += 1
                            if 재시도횟수 < 최대재시도:
                                print(f"🐥🐥🐥🐥🐥 재시도 대기 중... ({재시도횟수}/{최대재시도})")
                                await page.wait_for_timeout(1000)  # 🐥🐥🐥🐥🐥 재시도 전 대기 (단축)
                    except Exception as e:
                        print(f"🐥🐥🐥🐥🐥 이미지 추출 중 오류 (재시도 {재시도횟수 + 1}): {str(e)}")
                        재시도횟수 += 1
                        if 재시도횟수 < 최대재시도:
                            await page.wait_for_timeout(1000)  # 🐥🐥🐥🐥🐥 재시도 전 대기 (단축)
                
                # 🐥🐥🐥🐥🐥 재시도 후에도 이미지가 없으면 빈 배열로 설정
                if not 이미지결과:
                    썸네일이미지들 = []
                    상세이미지들 = []
                    print(f"🐥🐥🐥🐥🐥 모든 재시도 실패: {상품명}")
                else:
                    썸네일이미지들 = 이미지결과['썸네일이미지들']
                    상세이미지들 = 이미지결과['상세이미지들']
                
                print(f"🐥🐥🐥🐥🐥 썸네일 이미지 추출 완료: {상품명} - {len(썸네일이미지들)}개 이미지")
                print(f"🐥🐥🐥🐥🐥 상세 이미지 추출 완료: {상품명} - {len(상세이미지들)}개 이미지")
                
                # 🐥🐥🐥🐥🐥 상세 이미지 필터링: data:로 시작하는 값과 중복값 제외, 앞에서 5개만
                필터된상세이미지들 = []
                for 이미지URL in 상세이미지들:
                    if not 이미지URL.startswith('data:') and 이미지URL not in 필터된상세이미지들:
                        필터된상세이미지들.append(이미지URL)
                        if len(필터된상세이미지들) >= 5:
                            break
                
                print(f"🐥🐥🐥🐥🐥 필터링된 상세 이미지들 (최대 5개): {필터된상세이미지들}")
                
                # 🐥🐥🐥🐥🐥 썸네일 이미지도 앞에서 5개만
                최종썸네일이미지들 = 썸네일이미지들[:5]
                
                print(f"🐥🐥🐥🐥🐥 최종 썸네일 이미지들 (5개): {최종썸네일이미지들}")
                
                # 🐥🐥🐥🐥🐥 기존 이미지들 변수명 변경
                이미지들 = 최종썸네일이미지들
                
                print(f"🐥🐥🐥🐥🐥 이미지 추출 완료: {상품명} - {len(이미지들)}개 이미지")
                
                # 🐥🐥🐥🐥🐥 뒤로가기 (검색 결과 페이지로 복귀)
                if len(browser.contexts[0].pages) > 1:
                    # 🐥🐥🐥🐥🐥 새 창이 열려있으면 닫고 원래 페이지로 돌아가기
                    await page.close()
                    page = browser.contexts[0].pages[0]  # 🐥🐥🐥🐥🐥 첫 번째 페이지로 돌아가기
                    await page.bring_to_front()
                    print(f"🐥🐥🐥🐥🐥 원래 페이지로 복귀: {page.url}")
                else:
                    # 🐥🐥🐥🐥🐥 같은 페이지에서 뒤로가기
                    await page.go_back()
                    print(f"🐥🐥🐥🐥🐥 뒤로가기 완료: {page.url}")
                
                결과목록.append({
                    "상품명": 상품명,
                    "성공": True,
                    "이미지들": 이미지들,
                    "상세이미지들": 필터된상세이미지들,
                    "메시지": f"{len(이미지들)}개 썸네일, {len(필터된상세이미지들)}개 상세 이미지 추출 완료"
                })
                
            except Exception as e:
                print(f"🐥🐥🐥🐥🐥 상품 이미지 추출 실패: {상품명} - {str(e)}")
                결과목록.append({
                    "상품명": 상품명,
                    "성공": False,
                    "에러": str(e)
                })
        
        print(f"🐥🐥🐥🐥🐥 전체 이미지 추출 완료: {len(결과목록)}개 상품")
        return {
            "success": True,
            "결과": 결과목록
        }
        
    except Exception as e:
        print(f"🐥🐥🐥🐥🐥 이미지 추출 API 오류: {str(e)}")
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
