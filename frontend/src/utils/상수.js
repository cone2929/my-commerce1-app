// 🐥🐥🐥🐥🐥 애플리케이션 상수
export const APP_CONSTANTS = {
  // 🐥🐥🐥🐥🐥 API 관련
  API_BASE_URL: 'http://localhost:3001', // 일렉트론 앱은 로컬에서만 실행
  
  // 🐥🐥🐥🐥🐥 페이지네이션
  ITEMS_PER_PAGE: 20,
  MAX_PAGES: 10,
  
  // 🐥🐥🐥🐥🐥 이미지 관련
  MAX_IMAGES_PER_PRODUCT: 5,
  IMAGE_QUALITY: 0.8,
  THUMBNAIL_SIZE: 300,
  DETAIL_SIZE: 800,
  
  // 🐥🐥🐥🐥🐥 애니메이션
  ANIMATION_DURATION: 200,
  HOVER_DELAY: 150,
  
  // 🐥🐥🐥🐥🐥 검색 관련
  SEARCH_DELAY: 500,
  MIN_SEARCH_LENGTH: 2,
  
  // 🐥🐥🐥🐥🐥 상품 상태
  PRODUCT_STATUS: {
    판매중: '판매중',
    품절: '품절',
    판매중지: '판매중지',
    임시저장: '임시저장'
  },
  
  // 🐥🐥🐥🐥🐥 카테고리
  CATEGORIES: [
    '가방', '의류', '전자제품', '화장품', '식품', 
    '가구', '스포츠용품', '도서', '기타'
  ],
  
  // 🐥🐥🐥🐥🐥 주문 상태
  ORDER_STATUS: {
    주문접수: '주문접수',
    결제완료: '결제완료',
    배송준비: '배송준비',
    배송중: '배송중',
    배송완료: '배송완료',
    취소: '취소',
    반품: '반품'
  }
};

// 🐥🐥🐥🐥🐥 로컬 스토리지 키
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  CART_ITEMS: 'cart_items',
  RECENT_SEARCHES: 'recent_searches',
  THEME: 'theme'
};

// 🐥🐥🐥🐥🐥 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  AUTH_REQUIRED: '로그인이 필요합니다.',
  PERMISSION_DENIED: '권한이 없습니다.',
  DATA_NOT_FOUND: '데이터를 찾을 수 없습니다.',
  VALIDATION_ERROR: '입력 정보를 확인해주세요.',
  SERVER_ERROR: '서버 오류가 발생했습니다.'
};
