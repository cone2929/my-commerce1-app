import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// ★★★★★ 인증 상태 관리를 위한 추가 import
import { useEffect, useState } from 'react';
import { supabase } from './supabase/클라이언트';
import 레이아웃 from './components/레이아웃';
import 세특AI from './pages/세특AI';
import NEIS출결 from './pages/NEIS출결';
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

  // ★★★★★ 로그인하지 않은 경우 로그인 페이지로
  if (!사용자) {
    return <로그인 />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<레이아웃 사용자={사용자} />}>
          <Route index element={<Navigate to="/세특-ai" replace />} />
          <Route path="세특-ai" element={<세특AI />} />
          <Route path="neis-출결" element={<NEIS출결 />} />
        </Route>
        {/* ★★★★★ 구글 OAuth 콜백 라우트 */}
        <Route path="/auth/callback" element={<인증콜백 />} />
      </Routes>
    </Router>
  );
}

export default App;
