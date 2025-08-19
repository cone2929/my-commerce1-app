import { Link, useLocation } from 'react-router-dom';
import { Brain, Calendar, Menu, X } from 'lucide-react';
import { useState } from 'react';
// ★★★★★ 로그아웃 함수 import 추가
import { 로그아웃 } from '../supabase/인증';

// ★★★★★ 사용자 props 추가
const 사이드바 = ({ 사용자 }) => {
    const location = useLocation();
    const [모바일메뉴열림, set모바일메뉴열림] = useState(false);

    // ★★★★★ 로그아웃 처리 함수 추가
    const 로그아웃처리 = async () => {
        if (confirm('정말 로그아웃하시겠습니까?')) {
            await 로그아웃();
        }
    };

    const 메뉴항목들 = [
        {
            이름: '세특 AI',
            경로: '/세특-ai',
            아이콘: Brain,
        },
        {
            이름: 'NEIS 출결',
            경로: '/neis-출결',
            아이콘: Calendar,
        },
    ];

    return (
        <>
            {/* 모바일 메뉴 버튼 */}
            <button
                onClick={() => set모바일메뉴열림(!모바일메뉴열림)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
            >
                {모바일메뉴열림 ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* 사이드바 */}
            <div
                className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-40 transition-transform duration-300
          ${모바일메뉴열림 ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
            >
                {/* ★★★★★ flex flex-col로 변경하여 하단 고정 가능하게 함 */}
                <div className="flex flex-col h-full">
                    {/* 로고 영역 */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-2 ml-10 md:ml-0">
                            <span className="text-xl font-bold text-gray-600"></span>
                        </div>
                        <h1 className="text-lg font-semibold text-gray-800">OpenSchool</h1>
                    </div>

                    {/* ★★★★★ 메뉴 영역은 항상 표시 (로그인 상태와 관계없이) */}
                    <nav className="p-4 space-y-2 flex-1">
                        {메뉴항목들.map((항목) => {
                            const 아이콘컴포넌트 = 항목.아이콘;
                            const 활성화됨 = location.pathname === 항목.경로;

                            return (
                                <Link
                                    key={항목.경로}
                                    to={항목.경로}
                                    onClick={() => set모바일메뉴열림(false)}
                                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${활성화됨
                                            ? 'bg-gray-50 text-gray-900 border border-gray-200'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }
                    `}
                                >
                                    <아이콘컴포넌트 size={20} />
                                    <span className="font-medium">{항목.이름}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* ★★★★★ 사용자 정보는 로그인 상태일 때만 표시 */}
                    {사용자 && (
                        <div className="border-t border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {사용자?.user_metadata?.full_name || '사용자'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {사용자?.email}
                                    </p>
                                </div>
                                <button
                                    onClick={로그아웃처리}
                                    className="ml-2 text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                                >
                                    로그아웃
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 모바일 오버레이 */}
            {모바일메뉴열림 && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => set모바일메뉴열림(false)}
                />
            )}
        </>
    );
};




export default 사이드바;
