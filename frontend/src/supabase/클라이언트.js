import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// ★★★★★ 환경변수 체크
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase 환경변수가 없습니다!');
    console.error('URL:', supabaseUrl);
    console.error('Key:', supabaseAnonKey ? '존재함' : '없음');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        // ★★★★★ 해시 프래그먼트 토큰 감지 활성화
        detectSessionInUrl: true,
        // ★★★★★ 임시 플로우 타입 제거 (문제 해결 후 다시 추가 가능)
        // flowType: 'pkce'
    }
})

// ★★★★★ 인증 상태 리스너
supabase.auth.onAuthStateChange((event, session) => {


    if (event === 'SIGNED_IN') {
  
    }

    if (event === 'SIGNED_OUT') {
    
    }

    if (event === 'TOKEN_REFRESHED') {
    
    }
});
