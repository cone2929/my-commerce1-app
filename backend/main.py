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
import platform
import subprocess
import sys

# 🐥🐥🐥🐥🐥 사용자별 브라우저 관리
user_browsers = {}

# 🐥🐥🐥🐥🐥 Render 환경 감지
def is_render_environment():
    return os.getenv('RENDER') == 'true' or os.getenv('RENDER_EXTERNAL_URL') is not None

# 🐥🐥🐥🐥🐥 Render 환경에서 Playwright 브라우저 자동 설치
def install_playwright_browsers():
    try:
        if is_render_environment():
            print("🐥🐥🐥🐥🐥 Render 환경 감지: Playwright 브라우저 설치 시작...")
            # Render 환경에서 권한 문제 없이 브라우저 설치
            result = subprocess.run([
                sys.executable, "-m", "playwright", "install", "chromium"
            ], capture_output=True, text=True, timeout=300)
            print(f"🐥🐥🐥🐥🐥 설치 결과: {result.stdout}")
            if result.stderr:
                print(f"🐥🐥🐥🐥🐥 설치 에러: {result.stderr}")
            print("🐥🐥🐥🐥🐥 Playwright 브라우저 설치 완료!")
    except Exception as e:
        print(f"🐥🐥🐥🐥🐥 Playwright 브라우저 설치 실패: {e}")

# 🐥🐥🐥🐥🐥 앱 시작 시 브라우저 설치 (재배포 트리거)
install_playwright_browsers()


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
@app.head("/")
def root():
    return {"message": "Hello, FastAPI!"}

@app.get("/health")
def health():
    return {"status": "OK"}

import requests

PAT = "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"
url = "https://models.github.ai/inference/chat/completions"
headers = {
"Authorization": f"Bearer {PAT}",
"Content-Type": "application/json"
}

일차_첫프롬프트 = """
<최종 완성형 '올인원' 세특 자동 생성 프롬프트>

0. 핵심 정체성

나는 대한민국 최고의 입시 컨설턴트 AI이다. 나의 유일한 임무는 사용자가 제공한 학생의 활동 내용을 단 하나의 입력만으로 분석, 재구성, 심화시켜 대학 입학사정관의 눈길을 사로잡는 완벽한 학생부 세특 문장을 창조하는 것이다.

1. 절대 원칙: 나의 작동 방식

나는 질문하지 않는다. 나는 STAR@ 단계를 묻지 않는다. 사용자가 활동 내용(키워드, 문장, 메모, 보고서 내용 등)을 모두 한 번에 입력하면, 나는 그것을 '원본 데이터'로 간주하고 즉시 최종 결과물 생성에 착수한다.

나는 창조하는 서사 작가이다. 원본 데이터에 명시된 활동들은 나의 이야기 재료일 뿐이다. 나는 각 활동을 유기적으로 연결하는 논리적 '연결고리'와 '동기'를 부여하여, 한 편의 설득력 있는 '탐구 성장 서사'를 구축한다.

나는 역량을 드러내는 분석가이다. 나는 단순 활동 나열을 지양한다. 모든 문장은 학생의 핵심 역량(자기주도성, 지적 호기심, 문제 해결 능력, 융합적 사고, 비판적 사고력 등)이 왜, 어떻게 드러나는지를 교사의 관점에서 구체적으로 서술한다.

나는 심화 탐구를 설계하는 기획자이다. 원본 데이터에 후속 활동이 없다면, 나는 이전 활동을 기반으로 가장 논리적이고 인상적인 '심화 탐구 활동'을 자동으로 설계하고 추가하여 탐구의 지속성과 깊이를 보여준다.

2. 최종 결과물 생성 가이드 (내부 실행 명령)

입력: 사용자가 제공한 모든 학생 활동 원본 데이터 (형식 무관)

출력: 아래 규칙을 100% 준수하는, 순수한 세특 문단

지능형 서사 재구성 (Intelligent Narrative Reconstruction):

원본 데이터의 모든 활동 요소를 빠짐없이 식별하고, 시간 순서나 논리적 인과관계에 따라 재배열한다.

"왜 이 활동을 시작했을까?" (동기) → "그래서 무엇을 이루려 했는가?" (목표) → "어떤 구체적인 노력을 했는가?" (과정) → "그 결과 무엇을 배우고, 어디로 나아갔는가?" (결과 및 심화)의 기승전결 구조가 문단 전체에 자연스럽게 녹아 있도록 설계한다.

사용자가 제공한 구체적인 활동 내용은 단 하나도 빠짐없이, 더욱 정제되고 매끄러운 표현으로 최종 세특에 완벽하게 융합시킨다.

문체 및 형식 (Strict Formatting):

서술어: 모든 문장의 끝은 '~함.', '~됨.', '~보여줌.', '~사고함.', '~성장함.' 등 교사의 객관적 관찰자 시점을 드러내는 서술형 어미로 통일한다.

금지 표현: 교내·외 대회명, 수상 실적, 어학 점수, 인증, 기관명, 도서명/논문명의 직접적 나열(필요시 'OO 분야의 학술 보고서' 등으로 일반화) 등 기재 금지 사항은 흔적도 없이 제거하거나 순화한다. 학생의 순수 역량만 남긴다.

형태: 단 하나의 완성된 서술형 문단으로만 결과를 제시한다. STAR, 괄호, 번호 등 인위적인 구분자는 절대 사용하지 않는다.

부가 정보 완전 배제: 최종 결과물을 제시할 때, 글자 수를 포함한 그 어떤 부가 설명이나 제목도 덧붙이지 않는다. 오직 완성된 세특 문단 자체만을 출력한다.

내용 및 분량 (Content & Volume):

역량 중심 서술: 모든 문장은 '이 활동을 통해 학생의 어떤 우수성이 드러나는가?'라는 질문에 대한 답이 되어야 한다.

사실 기반 창작: 제공된 정보가 부족할 경우, 과학적·논리적 오류가 없는 선에서 타당한 과정과 결과를 '사실에 기반하여 창의적으로' 보강한다. (예: 실패 원인 분석, 데이터 해석, 대안 제시 등)

분량: 별도 요청이 없다면, 핵심 내용을 압축하여 400~500자(공백 포함) 내외의 가장 효과적인 분량으로 결과물을 생성한다.

※ 예시: 이 프롬프트의 작동 방식 ※

[사용자 입력 (원본 데이터)]

RCS(라면 국물 스토브) 아이디어 고안. 발열 반응 중 아세트산나트륨 과포화 용액의 발열 반응과 염화칼슘의 용해열을 이용한 발열 도시락 원리를 응용함. 친구들과 함께 제작했지만 원하는 만큼 온도가 오르지 않아 실패함. 실패 원인을 분석해보니 단열 문제와 반응량 계산 오류라는 것을 알게 됨.

[AI 최종 생성물 (위 입력에 대한 자동 변환 결과)]

화학 수업에서 배운 발열 반응의 원리를 실생활 문제 해결에 적용하고자 하는 지적 호기심에서 'RCS(휴대용 국물 가열기)' 제작을 기획함. 시중 발열 도시락에 사용되는 아세트산나트륨 과포화 용액과 염화칼슘의 용해열 원리를 융합하여 새로운 장치를 설계하는 창의성을 보여줌. 공동 탐구 과정에서 목표 온도에 도달하지 못하는 문제에 직면했으나, 이를 실패로 규정하지 않고 팀원들과 함께 문제의 본질을 파고드는 집요함을 보임. 실험 데이터와 변인들을 체계적으로 분석하여 실패 원인이 반응물의 양적 관계 계산 오류와 단열 구조의 비효율성에 있음을 논리적으로 규명함. 나아가 최적의 열효율을 위한 단열재의 재질과 구조에 대한 심화 탐구로 활동을 자발적으로 확장하는 등, 과학적 문제 해결 능력과 자기주도적 탐구 역량의 성장을 뚜렷하게 증명함.

활동 내용을 입력하면. 다른 어떤 정보제공하지 않고 위 내용 기반으로 최종 세특만 제공할 것. 위의 내용 설명할 필요 없음. 내용 적어주면 위 내용 바탕으로 멋진 최종세특을 바로 제공하도록. 세특을 제공한다 등 다른 내용은 일체 쓰지않고, 최종 세특 내용만을 답변으로 제시할것. 활동내용이 적은경우 내용을 지어내서라도 STAR@에 해당하는 구조의 완성된 최종 세특을 제공. 최종세특 작성 시 학생은, 교사는과 같은 주어는 사용하지 않으며, 서술어는 반드시 ~함.~임.의 형태로 현재시제의 서술어로 작성.

3.활동명은 작은 따옴표 안에 (ex. '모의 유엔'활동), 책은 '책제목(지은이)'의 형태로 작은 따옴표 안에 넣을 것. 최종 세특 작성 시, 지나치게 나열식으로 써지는 것을 지양할것. 반드시 기승전결의 구조가 갖추어 지도록 연결의 흐름을 신경 써서 최종 세특을 제시해야 함. 지나친 나열로 제시할 경우 좋은 세특이 아님.
"""


# 기존 활동요청 모델 (활동 전용)
class 활동요청(BaseModel):
    activity: str
    student_name: str

# ★★★★★ 수정사항 전용 요청 모델 추가
class 수정요청(BaseModel):
    existing_result: str  # 기존 AI결과
    modifications: str    # 수정사항
    student_name: str

# 기존 활동 분석 API (그대로 유지)
@app.post("/api/analyze-activity")
async def 활동분석(요청: 활동요청):
    
    활동 = 요청.activity
    
    data = {
    "model": "openai/gpt-4o",
    "messages": [
        {"role":"system", "content":일차_첫프롬프트},
        {"role":"user", "content":활동}
    ]
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        result = response.json()
        AI결과 = result['choices'][0]['message']['content']
    
    result = AI결과
    return {"result": result}

# ★★★★★ 수정사항 전용 API 엔드포인트 추가
@app.post("/api/modify-result")
async def 수정사항적용(요청: 수정요청):
    
    기존결과 = 요청.existing_result
    수정사항 = 요청.modifications
    
    # AI에게 전달할 통합 메시지
    통합메시지 = f"기존 세특: {기존결과}\n수정 요청: {수정사항}"
    
    data = {
    "model": "openai/gpt-4o",
    "messages": [
        {"role":"system", "content":일차_첫프롬프트},
        {"role":"user", "content":통합메시지}
    ]
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        result = response.json()
        AI결과 = result['choices'][0]['message']['content']
    
    result = AI결과
    return {"result": result}

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
            print(f"🐥🐥🐥🐥🐥 디버깅: 현재 브라우저 수: {len(user_browsers)}개")
            try:
                playwright = await async_playwright().start()
                
                # 🐥🐥🐥🐥🐥 Render 환경에서는 헤드리스 모드 필수
                browser_args = ['--no-sandbox', '--disable-dev-shm-usage']
                if is_render_environment():
                    browser_args.extend([
                        '--disable-gpu', 
                        '--disable-software-rasterizer',
                        '--disable-web-security',
                        '--disable-features=VizDisplayCompositor',
                        '--disable-extensions',
                        '--disable-plugins',
                        '--disable-background-timer-throttling',
                        '--disable-backgrounding-occluded-windows',
                        '--disable-renderer-backgrounding'
                    ])
                
                browser = await playwright.chromium.launch(
                    headless=is_render_environment(),  # 🐥🐥🐥🐥🐥 Render에서는 헤드리스 필수
                    args=browser_args,
                    timeout=120000  # 🐥🐥🐥🐥🐥 브라우저 시작 타임아웃 늘리기
                )
                page = await browser.new_page()
                print(f"🐥🐥🐥🐥🐥 디버깅: 브라우저 및 페이지 생성 완료")
                user_browsers[user_id] = {'browser': browser, 'page': page, 'playwright': playwright}
            except Exception as e:
                print(f"🐥🐥🐥🐥🐥 브라우저 생성 실패: {str(e)}")
                # 🐥🐥🐥🐥🐥 실패 시 기본 응답 반환
                return {"products": [], "success": False, "error": f"브라우저 생성 실패: {str(e)}"}
        else:
            # 🐥🐥🐥🐥🐥 기존 사용자: 브라우저 재사용
            print(f"🐥🐥🐥🐥🐥 디버깅: 기존 사용자 {user_id} 브라우저 재사용")
            print(f"🐥🐥🐥🐥🐥 디버깅: 현재 브라우저 수: {len(user_browsers)}개")
            browser = user_browsers[user_id]['browser']
            page = user_browsers[user_id]['page']
            
            # 🐥🐥🐥🐥🐥 브라우저 상태 확인
            try:
                is_closed = browser.is_closed()
                print(f"🐥🐥🐥🐥🐥 디버깅: 브라우저 상태 - is_closed: {is_closed}")
            except Exception as e:
                print(f"🐥🐥🐥🐥🐥 디버깅: 브라우저 상태 확인 실패: {e}")
                # 🐥🐥🐥🐥🐥 브라우저가 죽었다면 새로 생성
                del user_browsers[user_id]
                raise Exception("브라우저가 죽어서 새로 생성 필요")
        
        # 🐥🐥🐥🐥🐥 디버깅: 요청 정보 출력
        print(f"🐥🐥🐥🐥🐥 디버깅: 사용자 {user_id}, 페이지 {요청.page} 요청 시작")
        
        # 🐥🐥🐥🐥🐥 페이지 로드 (안정성 우선)
        print(f"🐥🐥🐥🐥🐥 디버깅: 페이지 로드 시작 - {요청.url}")
        await page.goto(요청.url, wait_until='domcontentloaded', timeout=30000)
        print(f"🐥🐥🐥🐥🐥 디버깅: 페이지 로드 완료")
        
        # 🐥🐥🐥🐥🐥 상품 요소 대기 (안정성 우선)
        print(f"🐥🐥🐥🐥🐥 디버깅: 상품 요소 대기 시작")
        try:
            await page.wait_for_selector('.product-eachone', state='attached', timeout=5000)
            print(f"🐥🐥🐥🐥🐥 디버깅: .product-eachone 요소 발견")
        except:
            try:
                await page.wait_for_selector('[data-v-199934d4]', state='attached', timeout=3000)
                print(f"🐥🐥🐥🐥🐥 디버깅: [data-v-199934d4] 요소 발견")
            except:
                try:
                    await page.wait_for_selector('.goods-item-animation', state='attached', timeout=2000)
                    print(f"🐥🐥🐥🐥🐥 디버깅: .goods-item-animation 요소 발견")
                except:
                    print(f"🐥🐥🐥🐥🐥 디버깅: 모든 셀렉터 실패, 기본 대기")
                    await page.wait_for_timeout(1000)
        
        # 🐥🐥🐥🐥🐥 이미지 로딩을 위한 대기 시간 증가
        await page.wait_for_timeout(3000)
        
        # 🐥🐥🐥🐥🐥 이미지 로딩 완료 대기
        try:
            await page.wait_for_function("""
                () => {
                    const images = document.querySelectorAll('img');
                    let loadedCount = 0;
                    let totalCount = images.length;
                    
                    if (totalCount === 0) return true;
                    
                    for (let img of images) {
                        if (img.complete && img.naturalHeight > 0) {
                            loadedCount++;
                        }
                    }
                    
                    console.log('🐥🐥🐥🐥🐥 디버깅: 이미지 로딩 상태', { loadedCount, totalCount });
                    return loadedCount >= Math.min(totalCount, 10);  // 최소 10개 또는 전체 이미지
                }
            """, timeout=10000)
            print("🐥🐥🐥🐥🐥 디버깅: 이미지 로딩 완료")
        except Exception as e:
            print(f"🐥🐥🐥🐥🐥 디버깅: 이미지 로딩 대기 실패: {e}")
        
        # 🐥🐥🐥🐥🐥 페이지 번호에 따라 스크롤 시뮬레이션 (최소 대기)
        if 요청.page > 1:
            print(f"🐥🐥🐥🐥🐥 디버깅: 페이지 {요청.page} 스크롤 시작")
            
            # 🐥🐥🐥🐥🐥 스크롤 전 상품 개수 확인
            스크롤전상품수 = await page.evaluate("document.querySelectorAll('.product-eachone, [data-v-199934d4], .goods-item-animation').length")
            print(f"🐥🐥🐥🐥🐥 디버깅: 스크롤 전 상품 수: {스크롤전상품수}개")
            
            # 🐥🐥🐥🐥🐥 현재 화면 기준 가장 아래로 스크롤
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            
            # 🐥🐥🐥🐥🐥 최소한의 대기만 (3초)
            await page.wait_for_timeout(3000)
            
            # 🐥🐥🐥🐥🐥 스크롤 후 상품 개수 확인
            스크롤후상품수 = await page.evaluate("document.querySelectorAll('.product-eachone, [data-v-199934d4], .goods-item-animation').length")
            print(f"🐥🐥🐥🐥🐥 디버깅: 스크롤 후 상품 수: {스크롤후상품수}개 (증가: {스크롤후상품수 - 스크롤전상품수}개)")
        else:
            # 🐥🐥🐥🐥🐥 첫 페이지는 대기 없음
            pass
        
        # 🐥🐥🐥🐥🐥 최종 상품 개수 확인
        최종상품수 = await page.evaluate("document.querySelectorAll('.product-eachone, [data-v-199934d4], .goods-item-animation').length")
        print(f"🐥🐥🐥🐥🐥 디버깅: 최종 상품 수: {최종상품수}개")
        
        # 🐥🐥🐥🐥🐥 상품 정보 추출 (즉시 실행)
        print(f"🐥🐥🐥🐥🐥 디버깅: 상품 정보 추출 시작")
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
                        if (!imgElement) {
                            console.log('🐥🐥🐥🐥🐥 디버깅: .prod-img img 찾기 실패');
                            imgElement = element.querySelector('.product-img img');
                        }
                        if (!imgElement) {
                            console.log('🐥🐥🐥🐥🐥 디버깅: .product-img img 찾기 실패');
                            imgElement = element.querySelector('img');
                        }
                        if (!imgElement) {
                            console.log('🐥🐥🐥🐥🐥 디버깅: img 찾기 실패');
                        } else {
                            console.log('🐥🐥🐥🐥🐥 디버깅: 이미지 요소 찾기 성공', { src: imgElement.src });
                        }
                        const 이미지URL = imgElement ? imgElement.src : '';
                        
                        // 🐥🐥🐥🐥🐥 이미지를 base64로 변환 (CORS 문제 해결)
                        let 이미지Base64 = '';
                        console.log('🐥🐥🐥🐥🐥 디버깅: 이미지 요소 확인', {
                            imgElement: !!imgElement,
                            src: imgElement ? imgElement.src : '없음',
                            complete: imgElement ? imgElement.complete : '없음',
                            naturalHeight: imgElement ? imgElement.naturalHeight : '없음',
                            naturalWidth: imgElement ? imgElement.naturalWidth : '없음'
                        });
                        
                        // 🐥🐥🐥🐥🐥 이미지를 base64로 변환 (CORS 문제 해결)
                        let 이미지Base64 = '';
                        console.log('🐥🐥🐥🐥🐥 디버깅: 이미지 요소 확인', {
                            imgElement: !!imgElement,
                            src: imgElement ? imgElement.src : '없음',
                            complete: imgElement ? imgElement.complete : '없음',
                            naturalHeight: imgElement ? imgElement.naturalHeight : '없음',
                            naturalWidth: imgElement ? imgElement.naturalWidth : '없음'
                        });
                        
                        // 🐥🐥🐥🐥🐥 이미지 변환 시도 (간단한 방법)
                        if (imgElement && imgElement.src) {
                            try {
                                console.log('🐥🐥🐥🐥🐥 디버깅: 이미지 변환 시도');
                                
                                // 🐥🐥🐥🐥🐥 이미지가 로딩되지 않았다면 강제로 로딩
                                if (!imgElement.complete || imgElement.naturalHeight === 0) {
                                    console.log('🐥🐥🐥🐥🐥 디버깅: 이미지 로딩되지 않음, 강제 로딩 시도');
                                    
                                    // 🐥🐥🐥🐥🐥 이미지 src를 다시 설정하여 강제 로딩
                                    const originalSrc = imgElement.src;
                                    imgElement.src = '';
                                    imgElement.src = originalSrc;
                                    
                                    // 🐥🐥🐥🐥🐥 잠시 대기 후 다시 확인
                                    setTimeout(() => {
                                        if (imgElement.complete && imgElement.naturalHeight > 0) {
                                            console.log('🐥🐥🐥🐥🐥 디버깅: 강제 로딩 성공');
                                        } else {
                                            console.log('🐥🐥🐥🐥🐥 디버깅: 강제 로딩 실패');
                                        }
                                    }, 100);
                                }
                                
                                // 🐥🐥🐥🐥🐥 이미지 변환 시도
                                if (imgElement.complete && imgElement.naturalHeight > 0) {
                                    console.log('🐥🐥🐥🐥🐥 디버깅: 이미지 변환 실행', {
                                        width: imgElement.naturalWidth,
                                        height: imgElement.naturalHeight
                                    });
                                    
                                    const canvas = document.createElement('canvas');
                                    const ctx = canvas.getContext('2d');
                                    canvas.width = imgElement.naturalWidth;
                                    canvas.height = imgElement.naturalHeight;
                                    ctx.drawImage(imgElement, 0, 0);
                                    이미지Base64 = canvas.toDataURL('image/jpeg', 0.7);
                                    console.log('🐥🐥🐥🐥🐥 디버깅: 이미지 변환 성공', { base64Length: 이미지Base64.length });
                                } else {
                                    console.log('🐥🐥🐥🐥🐥 디버깅: 이미지 변환 조건 불충족');
                                }
                            } catch (e) {
                                console.log('🐥🐥🐥🐥🐥 디버깅: 이미지 변환 실패:', e);
                            }
                        } else {
                            console.log('🐥🐥🐥🐥🐥 디버깅: 이미지 요소 또는 src 없음');
                        }
                        
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
                            console.log('🐥🐥🐥🐥🐥 디버깅: 상품 추가', {
                                index: index + 1,
                                제목: 제목 || `상품 ${index + 1}`,
                                이미지URL: 이미지URL,
                                이미지Base64길이: 이미지Base64 ? 이미지Base64.length : 0
                            });
                            products.push({
                                이미지URL,
                                이미지Base64,  // 🐥🐥🐥🐥🐥 base64 이미지 추가
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
        
        # 🐥🐥🐥🐥🐥 상품별 이미지 정보 디버깅
        for i, 상품 in enumerate(상품목록[:3]):  # 처음 3개만 확인
            print(f"🐥🐥🐥🐥🐥 디버깅: 상품 {i+1} 이미지 정보", {
                '제목': 상품.get('제목', '없음'),
                '이미지URL': 상품.get('이미지URL', '없음'),
                '이미지Base64길이': len(상품.get('이미지Base64', ''))
            })
        
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
                
                # 🐥🐥🐥🐥🐥 Render 환경에서 필요한 브라우저 옵션
                browser_args = [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-extensions'
                ]
                
                if is_render_environment():
                    print("🐥🐥🐥🐥🐥 Render 환경에서 브라우저 실행")
                    browser_args.extend([
                        '--disable-background-timer-throttling',
                        '--disable-backgrounding-occluded-windows',
                        '--disable-renderer-backgrounding',
                        '--disable-features=TranslateUI',
                        '--disable-ipc-flooding-protection'
                    ])
                
                browser = await playwright.chromium.launch(
                    headless=is_render_environment(),  # 🐥🐥🐥🐥🐥 Render에서는 헤드리스 필수
                    args=browser_args
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
    import os
    
    # 🐥🐥🐥🐥🐥 Render 환경에서는 포트를 환경변수에서 가져오기
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
