import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// ★★★★★ 인증 상태 관리를 위한 추가 import
import { useEffect, useState } from 'react';
import { supabase } from './supabase/클라이언트';
import 레이아웃 from './components/레이아웃';
import 상품관리 from './pages/상품관리';
import 주문관리 from './pages/주문관리';
// ★★★★★ 로그인 컴포넌트만 import (회원가입은 구글로 통합)
import 로그인 from './components/로그인';
// ★★★★★ 콜백 컴포넌트 import 추가
import 인증콜백 from './components/인증콜백';


function App() {
  // ★★★★★ 인증 상태 관리
  const [사용자, set사용자] = useState(null);
  const [로딩중, set로딩중] = useState(true);

  useEffect(() => {
    // ★★★★★ 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      set사용자(session?.user ?? null);
      set로딩중(false);
    });

    // ★★★★★ 인증 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      set사용자(session?.user ?? null);
      set로딩중(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ★★★★★ 로딩 중일 때 표시
  if (로딩중) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">로딩중...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* ★★★★★ 로그인 상태와 관계없이 레이아웃 사용 */}
        <Route path="/" element={<레이아웃 사용자={사용자} />}>
          {/* ★★★★★ 로그인하지 않은 경우 로그인 페이지 표시 */}
          {!사용자 ? (
            <>
              <Route index element={<로그인 />} />
              <Route path="*" element={<로그인 />} />
            </>
          ) : (
            <>
              <Route index element={<Navigate to="/상품-관리" replace />} />
              <Route path="상품-관리" element={<상품관리 />} />
              <Route path="주문-관리" element={<주문관리 />} />
            </>
          )}
        </Route>
        {/* ★★★★★ 구글 OAuth 콜백 라우트 */}
        <Route path="/auth/callback" element={<인증콜백 />} />
      </Routes>
    </Router>
  );
}

export default App;
