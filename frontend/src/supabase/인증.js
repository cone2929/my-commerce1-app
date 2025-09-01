import { supabase } from './클라이언트.js'

// 기본적인 인증 관련 함수들
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

// 로그아웃 함수 (간단한 버전)
export const 로그아웃 = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('로그아웃 오류:', error);
        }
        
        // 로컬 스토리지 정리
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('sb-')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // 페이지 새로고침
        window.location.reload();
    } catch (error) {
        console.error('로그아웃 중 오류:', error);
        window.location.reload();
    }
};

