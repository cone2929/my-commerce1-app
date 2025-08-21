from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import Response
import base64
import asyncio

from supabase import create_client
from dotenv import load_dotenv
import os
load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase = create_client(supabase_url, supabase_key)

# 🐥🐥🐥🐥🐥 Playwright 관련 import (배포 타임아웃 방지를 위해 임시 주석 처리)
# from playwright.async_api import async_playwright






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

# 🐥🐥🐥🐥🐥 웹페이지 스크린샷 API
class 웹페이지요청(BaseModel):
    url: str
    width: int = 1200
    height: int = 800

@app.post("/api/screenshot")
async def 웹페이지스크린샷(요청: 웹페이지요청):
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page(viewport={'width': 요청.width, 'height': 요청.height})
            
            # 페이지 로드 대기
            await page.goto(요청.url, wait_until='networkidle', timeout=30000)
            
            # 스크린샷 촬영
            screenshot = await page.screenshot(full_page=True)
            await browser.close()
            
            # base64로 인코딩
            screenshot_base64 = base64.b64encode(screenshot).decode('utf-8')
            
            return {"screenshot": screenshot_base64, "success": True}
    except Exception as e:
        return {"error": str(e), "success": False}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
