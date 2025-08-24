// 백엔드 URL 자동 감지 및 관리
class BackendManager {
    constructor() {
        this.baseURL = this.detectBackendURL();
        this.isLocal = this.baseURL.includes('localhost');
    }

    detectBackendURL() {
        // 개발 환경에서는 로컬 서버 사용
        if (process.env.NODE_ENV === 'development') {
            return 'http://localhost:8001';
        }
        
        // 프로덕션 환경에서는 로컬 서버 사용 (각 사용자 PC에서 실행)
        return 'http://localhost:8001';
    }

    getBaseURL() {
        return this.baseURL;
    }

    isLocalBackend() {
        return this.isLocal;
    }

    // 백엔드 서버 상태 확인
    async checkServerStatus() {
        try {
            const response = await fetch(`${this.baseURL}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 5000
            });
            
            if (response.ok) {
                const data = await response.json();
                return {
                    status: 'online',
                    data: data
                };
            } else {
                return {
                    status: 'error',
                    error: `HTTP ${response.status}`
                };
            }
        } catch (error) {
            return {
                status: 'offline',
                error: error.message
            };
        }
    }

    // 백엔드 서버 시작 안내
    getServerStartGuide() {
        return {
            title: '백엔드 서버가 실행되지 않았습니다',
            message: '백엔드 서버를 시작해주세요.',
            steps: [
                '1. backend 폴더로 이동',
                '2. Windows: start_server.bat 실행',
                '3. Mac/Linux: ./start_server.sh 실행',
                '4. 또는 수동으로: python main.py'
            ],
            note: '서버는 http://localhost:8001 에서 실행됩니다.'
        };
    }
}

// 전역 인스턴스
export const backendManager = new BackendManager();

// API 요청 헬퍼 함수
export const apiRequest = async (endpoint, options = {}) => {
    const url = `${backendManager.getBaseURL()}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(url, defaultOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API 요청 실패:', error);
        throw error;
    }
};

// 인증 토큰과 함께 API 요청
export const authenticatedApiRequest = async (endpoint, options = {}) => {
    // Supabase에서 현재 세션 가져오기
    const { supabase } = await import('../supabase/클라이언트');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        throw new Error('로그인이 필요합니다');
    }

    const authOptions = {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${session.access_token}`
        }
    };

    return apiRequest(endpoint, authOptions);
};
