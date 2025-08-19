import { Outlet } from 'react-router-dom';
import 사이드바 from './사이드바';
// ★★★★★ 로그아웃 import 제거 (사이드바에서 처리하므로)

const 레이아웃 = ({ 사용자 }) => {
    // ★★★★★ 로그아웃처리 함수 제거 (사이드바에서 처리하므로)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ★★★★★ 사이드바에 사용자 props 전달 */}
            <사이드바 사용자={사용자} />

            {/* ★★★★★ 데스크톱용 사용자 정보 영역 제거 (사이드바에서 처리하므로) */}

            {/* ★★★★★ 모바일용 상단 헤더 제거 (사이드바에서 처리하므로) */}

            {/* ★★★★★ pb-20 제거 (더이상 하단 고정 요소가 없으므로) */}
            <main className="md:ml-64 transition-all duration-300">
                <Outlet />
            </main>
        </div>
    );
};

export default 레이아웃;
