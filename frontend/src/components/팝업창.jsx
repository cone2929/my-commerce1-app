import React, { useEffect, useState } from 'react';

const 팝업창 = ({ 
    열림, 
    닫기, 
    제목 = "팝업창", 
    자식, 
    크기 = "medium", // small, medium, large, full
    닫기버튼표시 = true,
    배경클릭닫기 = true,
    검색기능 = false // 🐥🐥🐥🐥🐥 검색 기능 활성화 옵션 추가
}) => {
    // 🐥🐥🐥🐥🐥 검색 관련 상태
    const [검색어, set검색어] = useState('');
    const [웹페이지이미지, set웹페이지이미지] = useState('');
    const [로딩중, set로딩중] = useState(false);
    const [에러, set에러] = useState('');

    // 🐥🐥🐥🐥🐥 ESC 키로 팝업 닫기
    useEffect(() => {
        const esc키처리 = (event) => {
            if (event.key === 'Escape' && 열림) {
                닫기();
            }
        };

        if (열림) {
            document.addEventListener('keydown', esc키처리);
            // 🐥🐥🐥🐥🐥 팝업 열릴 때 body 스크롤 방지
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', esc키처리);
            // 🐥🐥🐥🐥🐥 팝업 닫힐 때 body 스크롤 복원
            document.body.style.overflow = 'unset';
        };
    }, [열림, 닫기]);

    // 🐥🐥🐥🐥🐥 검색 실행 함수
    const 검색실행 = async () => {
        if (!검색어.trim()) return;

        set로딩중(true);
        set에러('');
        set웹페이지이미지('');

        try {
            // 🐥🐥🐥🐥🐥 검색어를 URL로 변환
            const 검색URL = `https://www.cninsider.co.kr/mall/#/product?keywords=${encodeURIComponent(검색어)}&type=text&imageAddress=&searchDiff=1`;
            
            const response = await fetch('http://localhost:8001/api/screenshot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: 검색URL,
                    width: 1200,
                    height: 800
                })
            });

            const data = await response.json();
            
            if (data.success) {
                set웹페이지이미지(`data:image/png;base64,${data.screenshot}`);
            } else {
                set에러('웹페이지를 불러오는데 실패했습니다.');
            }
        } catch (error) {
            set에러('검색 중 오류가 발생했습니다.');
            console.error('검색 오류:', error);
        } finally {
            set로딩중(false);
        }
    };

    // 🐥🐥🐥🐥🐥 엔터키로 검색 실행
    const 엔터키처리 = (event) => {
        if (event.key === 'Enter') {
            검색실행();
        }
    };

    // 🐥🐥🐥🐥🐥 팝업 크기 클래스 결정
    const 크기클래스 = {
        small: "max-w-md",
        medium: "max-w-2xl", 
        large: "max-w-4xl",
        full: "max-w-7xl"
    }[크기] || "max-w-2xl";

    // 🐥🐥🐥🐥🐥 배경 클릭 처리
    const 배경클릭처리 = (event) => {
        if (배경클릭닫기 && event.target === event.currentTarget) {
            닫기();
        }
    };

    if (!열림) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={배경클릭처리}
        >
            <div 
                className={`${크기클래스} w-full rounded-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200`}
                style={{ backgroundColor: '#FAF9F5' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 🐥🐥🐥🐥🐥 헤더 */}
                <div className="flex items-center justify-between py-2 px-6 border-b" style={{ borderColor: '#BABABA', backgroundColor: '#FAF9F5' }}>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'hsl(var(--text-300))' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h2 className="text-sm font-medium tracking-tight text-text-300">
                            {제목}
                        </h2>
                    </div>
                    {닫기버튼표시 && (
                        <button
                            onClick={닫기}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 group"
                            aria-label="팝업 닫기"
                        >
                            <svg 
                                className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M6 18L18 6M6 6l12 12" 
                                />
                            </svg>
                        </button>
                    )}
                </div>

                {/* 🐥🐥🐥🐥🐥 내용 */}
                <div className="p-6 max-h-[70vh] overflow-y-auto" style={{ backgroundColor: '#FAF9F5' }}>
                    {/* 🐥🐥🐥🐥🐥 검색창 (검색기능이 활성화된 경우에만 표시) */}
                    {검색기능 && (
                        <div className="flex gap-2 mb-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={검색어}
                                    onChange={(e) => set검색어(e.target.value)}
                                    onKeyPress={엔터키처리}
                                    placeholder="검색어를 입력하세요 (예: 가방)..."
                                    className="w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                    style={{ 
                                        borderColor: '#BABABA',
                                        '--tw-ring-color': '#5E92C6'
                                    }}
                                />
                            </div>
                            <button 
                                onClick={검색실행}
                                disabled={로딩중}
                                className="px-6 py-3 text-white rounded-lg transition-colors duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                                style={{ backgroundColor: '#5E92C6' }}
                            >
                                {로딩중 ? (
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                )}
                                {로딩중 ? '검색중...' : '검색'}
                            </button>
                        </div>
                    )}

                    {/* 🐥🐥🐥🐥🐥 에러 메시지 */}
                    {에러 && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{에러}</p>
                        </div>
                    )}

                    {/* 🐥🐥🐥🐥🐥 웹페이지 이미지 표시 */}
                    {웹페이지이미지 && (
                        <div className="mb-4">
                            <div className="border rounded-lg overflow-hidden shadow-sm">
                                <img 
                                    src={웹페이지이미지} 
                                    alt="검색 결과" 
                                    className="w-full h-auto"
                                    style={{ maxHeight: '60vh' }}
                                />
                            </div>
                        </div>
                    )}

                    {/* 🐥🐥🐥🐥🐥 기존 자식 컴포넌트 */}
                    {자식}
                </div>

                {/* 🐥🐥🐥🐥🐥 하단 액션 버튼 영역 (필요시 사용) */}
                {/* <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={닫기}
                        className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                        취소
                    </button>
                    <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                        확인
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default 팝업창;
