import { supabase } from './클라이언트.js'

// ★★★★★ 배포환경별 정확한 URL 처리
const 현재도메인 = import.meta.env.VITE_APP_URL || window.location.origin;

// ★★★★★ 구글 로그인 함수 - 배포환경 고려
export const 구글로그인 = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // ★★★★★ 하드코딩된 localhost 제거하고 동적 처리
                redirectTo: `${현재도메인}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })

        if (error) throw error
    } catch (error) {
        console.error('로그인 오류:', error)
        throw error; // ★★★★★ 에러를 다시 던져서 UI에서 처리할 수 있게
    }
}

// ★★★★★ 토큰 새로고침 함수 추가
export const 토큰새로고침 = async () => {
    try {
        const { data, error } = await supabase.auth.refreshSession();
        if (error) throw error;
    
        return data;
    } catch (error) {
        console.error('토큰 새로고침 실패:', error);
        throw error;
    }
};

// ★★★★★ 현재 사용자 정보 확인 함수 추가
export const 현재사용자확인 = async () => {
    try {
        const { data: user, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.error('사용자 정보 확인 실패:', error);
        throw error;
    }
};

// ★★★★★ 완전히 새로운 안전한 로그아웃 함수 (403 오류 완전 방지)
export const 로그아웃 = async () => {
    try {
        // ★★★★★ 1단계: 현재 세션 상태 확인
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        // ★★★★★ 2단계: 세션이 있고 유효한 경우에만 서버 로그아웃 시도
        if (sessionData?.session && !sessionError) {
            try {
                const { error: signOutError } = await supabase.auth.signOut();

                if (signOutError) {
            
                } else {
            
                }
            } catch (signOutErr) {
        
            }
        } else {
    
        }

        // ★★★★★ 3단계: 강제 로컬 세션 제거 (서버 결과와 무관하게 실행)
        try {
            // 로컬 스토리지에서 Supabase 관련 데이터 모두 제거
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('sb-')) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));

    
        } catch (localError) {

        }

        // ★★★★★ 4단계: React 상태 강제 업데이트 (핵심 추가!)
        try {
            // Auth 상태 변화를 강제로 트리거
            supabase.auth.onAuthStateChange.listeners?.forEach(listener => {
                if (typeof listener === 'function') {
                    listener('SIGNED_OUT', null);
                }
            });
        } catch (stateError) {

        }

        // ★★★★★ 5단계: 강제 페이지 새로고침 (최후의 보장)
        setTimeout(() => {
            window.location.reload();
        }, 100);



    } catch (overallError) {
        // ★★★★★ 모든 오류 무시하고 강제 정리


        try {
            // 강제로 모든 Supabase 로컬 데이터 제거
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('sb-')) {
                    localStorage.removeItem(key);
                }
            });

            // ★★★★★ 강제 새로고침
            setTimeout(() => {
                window.location.reload();
            }, 100);
        } catch (e) {
    
            window.location.reload();
        }
    }
}

