import { Link, useLocation } from 'react-router-dom';
import { Package, ShoppingCart, Menu, X, Heart } from 'lucide-react';
import { useState } from 'react';

const 사이드바 = () => {
    const location = useLocation();
    const [모바일메뉴열림, set모바일메뉴열림] = useState(false);

    const 메뉴항목들 = [
        {
            이름: '상품 관리',
            경로: '/상품-관리',
            아이콘: Package,
        },
        {
            이름: '주문 관리',
            경로: '/주문-관리',
            아이콘: ShoppingCart,
        },
    ];

    return (
        <>
            {/* 상단 헤더 */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-bg-200 shadow-sm z-40" style={{fontFamily: 'var(--font-ui)', borderBottom: '1px solid #D5D3CD'}}>
                <div className="flex items-center justify-between h-full px-4">
                    {/* 로고 영역 */}
                    <div className="flex items-center">
                        <a className="flex flex-col justify-start items-top" aria-label="홈" href="/">
                            <h1 className="text-text-200 flex items-center gap-1 text-center max-md:hidden min-w-0 font-heading text-2xl font-semibold mt-3">
                                <div className="relative">
                                    <Heart size={24} className="text-red-500 fill-current transform rotate-45" style={{
                                        filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6)) brightness(1.2)'
                                    }} />
                                    <div className="absolute inset-0 transform rotate-45" style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)',
                                        mask: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\'/%3E%3C/svg%3E")',
                                        maskSize: 'contain',
                                        maskRepeat: 'no-repeat',
                                        maskPosition: 'center'
                                    }} />
                                </div>
                                <span className="truncate">Beautiful Commerce</span>
                            </h1>
                        </a>
                    </div>

                    {/* 데스크톱 메뉴 */}
                    <nav className="hidden md:flex items-center space-x-20">
                        {메뉴항목들.map((항목) => {
                            const 아이콘컴포넌트 = 항목.아이콘;
                            const 활성화됨 = location.pathname === 항목.경로;

                            return (
                                <Link
                                    key={항목.경로}
                                    to={항목.경로}
                                    className={`
                                        inline-flex items-center justify-center relative shrink-0 can-focus select-none
                                        disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:drop-shadow-none
                                        border-transparent transition font-ui tracking-tight duration-300
                                        ease-[cubic-bezier(0.165,0.85,0.45,1)] h-9 px-4 py-2 rounded-lg min-w-[5rem] 
                                        active:scale-[0.985] whitespace-nowrap
                                        ${활성화됨 
                                            ? 'bg-bg-400 text-text-100' 
                                            : 'text-text-300 hover:bg-bg-300 hover:text-text-100'
                                        }
                                    `}
                                >
                                    <div className="-mx-3 flex flex-row items-center gap-2">
                                        <div className="w-6 h-6 flex items-center justify-center">
                                            <아이콘컴포넌트 size={16} className="text-text-300" />
                                        </div>
                                        <div className="transition-all duration-200 text-text-300 font-medium text-sm tracking-tight">
                                            {항목.이름}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* 모바일 메뉴 버튼 */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => set모바일메뉴열림(!모바일메뉴열림)}
                            className="md:hidden inline-flex items-center justify-center relative shrink-0 can-focus select-none
                            disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:drop-shadow-none
                            border-transparent transition font-ui tracking-tight duration-300
                            ease-[cubic-bezier(0.165,0.85,0.45,1)] h-8 w-8 rounded-md active:scale-95
                            text-text-300 hover:bg-bg-300 hover:text-text-100"
                        >
                            {모바일메뉴열림 ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* 모바일 메뉴 드롭다운 */}
                {모바일메뉴열림 && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-bg-200 border-b border-border-300 shadow-lg">
                        <nav className="p-4 space-y-2">
                            {메뉴항목들.map((항목) => {
                                const 아이콘컴포넌트 = 항목.아이콘;
                                const 활성화됨 = location.pathname === 항목.경로;

                                return (
                                    <Link
                                        key={항목.경로}
                                        to={항목.경로}
                                        onClick={() => set모바일메뉴열림(false)}
                                        className={`
                                            inline-flex items-center justify-center relative shrink-0 can-focus select-none
                                            disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:drop-shadow-none
                                            border-transparent transition font-ui tracking-tight duration-300
                                            ease-[cubic-bezier(0.165,0.85,0.45,1)] h-9 px-4 py-2 rounded-lg min-w-[5rem] 
                                            active:scale-[0.985] whitespace-nowrap w-full overflow-hidden !min-w-0 group 
                                            active:bg-bg-400 active:scale-[1.0] px-4
                                            ${활성화됨 
                                                ? 'bg-bg-400 text-text-100' 
                                                : 'text-text-300 hover:bg-bg-300 hover:text-text-100'
                                            }
                                        `}
                                    >
                                        <div className="-translate-x-2 w-full flex flex-row items-center justify-start gap-3">
                                            <div className="size-4 flex items-center justify-center">
                                                <div className="flex items-center justify-center group" style={{width: '16px', height: '16px'}}>
                                                    <아이콘컴포넌트 size={20} className="shrink-0 group" />
                                                </div>
                                            </div>
                                            <span className="truncate text-sm whitespace-nowrap w-full">
                                                <div className="transition-all duration-200">{항목.이름}</div>
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                )}
            </header>

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
