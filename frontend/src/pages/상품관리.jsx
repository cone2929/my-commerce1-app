import { useState, useEffect } from 'react';
// 🐥🐥🐥🐥🐥 팝업창 import 추가
import 팝업창 from '../components/팝업창';

const 상품관리 = () => {
    // 🐥🐥🐥🐥🐥 팝업창 상태 관리 추가
    const [팝업열림, 팝업열림설정] = useState(false);

    // 🐥🐥🐥🐥🐥 팝업창 열기/닫기 함수
    const 팝업열기 = () => {
        팝업열림설정(true);
    };

    const 팝업닫기 = () => {
        팝업열림설정(false);
    };

            const [상품목록, set상품목록] = useState([
        { 
            id: 1,
            상품명: '샘플 상품', 
            카테고리: '의류', 
            가격: '25000', 
            재고: '100',
            상태: '판매중',
            등록일: new Date().toLocaleDateString('ko-KR'),
            설명: '샘플 상품 설명입니다.',
            이미지: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop&crop=center'
        },
    ]);

    const [저장중, set저장중] = useState({});

    // 🐥🐥🐥🐥🐥 카테고리 옵션
    const 카테고리목록 = [
        '의류',
        '전자제품',
        '화장품',
        '식품',
        '가구',
        '스포츠용품',
        '도서',
        '기타'
    ];

    // 🐥🐥🐥🐥🐥 상품 상태 옵션
    const 상태목록 = [
        '판매중',
        '품절',
        '판매중지',
        '임시저장'
    ];

    const 입력값변경 = (인덱스, 필드, 값) => {
        const 새상품목록 = [...상품목록];
        새상품목록[인덱스][필드] = 값;
        set상품목록(새상품목록);
        
        // 🐥🐥🐥🐥🐥 실시간 저장
        자동저장(새상품목록[인덱스]);
    };

    const 자동저장 = async (상품) => {
        if (!상품.상품명.trim() || 상품.카테고리 === '카테고리를 선택하세요' || !상품.가격.trim()) {
            return; // 필수 필드가 비어있으면 저장하지 않음
        }

        set저장중(prev => ({ ...prev, [상품.id]: true }));

        try {
            // TODO: 실제 API 호출로 변경
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('자동 저장 완료:', 상품.상품명);
        } catch (error) {
            console.error('자동 저장 실패:', error);
        } finally {
            set저장중(prev => ({ ...prev, [상품.id]: false }));
        }
    };

    const 새상품추가 = () => {
        const 새상품 = {
            id: Date.now(),
            상품명: '', 
            카테고리: '카테고리를 선택하세요', 
            가격: '', 
            재고: '',
            상태: '판매중',
            등록일: new Date().toLocaleDateString('ko-KR'),
            설명: '',
            이미지: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop&crop=center'
        };
        set상품목록([새상품, ...상품목록]);
    };

    const 상품삭제 = (id) => {
        if (상품목록.length > 1) {
            const 새상품목록 = 상품목록.filter(상품 => 상품.id !== id);
            set상품목록(새상품목록);
        }
    };

    const 상태색상 = {
        '판매중': 'bg-green-100 text-[#2C84DB]',
        '품절': 'bg-red-100 text-red-800',
        '판매중지': 'bg-yellow-100 text-yellow-800',
        '임시저장': 'bg-gray-100 text-gray-800'
    };

    // 🐥🐥🐥🐥🐥 카테고리 색상
    const 카테고리색상 = {
        '의류': 'bg-blue-100 text-blue-800',
        '전자제품': 'bg-purple-100 text-purple-800',
        '화장품': 'bg-pink-100 text-pink-800',
        '식품': 'bg-orange-100 text-orange-800',
        '가구': 'bg-brown-100 text-brown-800',
        '스포츠용품': 'bg-cyan-100 text-cyan-800',
        '도서': 'bg-indigo-100 text-indigo-800',
        '기타': 'bg-gray-100 text-gray-800'
    };

    // 🐥🐥🐥🐥🐥 가격 색상
    const 가격색상 = {
        '낮음': 'bg-green-100 text-green-800',
        '보통': 'bg-blue-100 text-blue-800',
        '높음': 'bg-orange-100 text-orange-800',
        '프리미엄': 'bg-purple-100 text-purple-800'
    };

    // 🐥🐥🐥🐥🐥 재고 색상
    const 재고색상 = (재고) => {
        const 수량 = parseInt(재고) || 0;
        if (수량 === 0) return 'bg-red-100 text-red-800';
        if (수량 <= 10) return 'bg-orange-100 text-orange-800';
        if (수량 <= 50) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    return (
        <div className="min-h-screen p-6" style={{ backgroundColor: '#FAF9F5' }}>




            {/* 🐥🐥🐥🐥🐥 상품 카드 그리드 - 메시지카드 스타일 적용 */}
            <div className="grid grid-cols-1 gap-3">
                {상품목록.map((상품, 인덱스) => (
                    <div key={상품.id} className="relative group/row">
                        {/* 🐥🐥🐥🐥🐥 체크박스 영역 */}
                        <div className="p-1 absolute z-10 top-1/2 -translate-y-1/2 -translate-x-1/2 transition duration-100 l-0 opacity-0 scale-75 group-has-[:focus-visible]/row:opacity-100 group-has-[:focus-visible]/row:scale-100 group-hover/row:opacity-100 group-hover/row:scale-100">
                            <div data-state="closed">
                                <label className="select-none flex flex-row gap-3 cursor-pointer text-left shrink-0 items-center">
                                    <input className="sr-only peer" type="checkbox" />
                                    <div className="shrink-0 w-5 h-5 flex items-center justify-center border rounded transition-colors duration-100 ease-in-out peer-focus-visible:ring-1 ring-offset-2 ring-offset-bg-300 ring-accent-main-100 bg-bg-000 cursor-pointer" style={{
                                        borderColor: '#BBBBBB'
                                    }}></div>
                                    <span className="leading-none sr-only">상품 선택</span>
                                </label>
                            </div>
                        </div>

                        <div className="rounded-xl select-none border-0.5 border-transparent">
                            <div className="group relative">
                                <div className="
                                    border-0.5
                                    font-large
                                    flex
                                    overflow-x-hidden
                                    text-ellipsis
                                    whitespace-nowrap
                                    rounded-xl
                                    bg-gradient-to-b
                                    p-1
                                    transition-all
                                    ease-in-out
                                    hover:shadow-sm
                                    from-bg-100 to-bg-100/30 
                                    hover:from-bg-000 hover:to-bg-000/80 
                                    product-card
                                " style={{
                                    borderColor: '#BABABA',
                                    '--hover-border-color': '#DAD7D5'
                                }}>
                                    {/* 🐥🐥🐥🐥🐥 상품 이미지 5개 */}
                                    <div className="flex gap-2 p-4">
                                        {[
                                            'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop&crop=center',
                                            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop&crop=center',
                                            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop&crop=center',
                                            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&crop=center',
                                            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center'
                                        ].map((이미지URL, index) => (
                                            <div key={index} className="w-32 h-32 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                                                <img 
                                                    src={이미지URL} 
                                                    alt={`${상품.상품명} 이미지 ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* 🐥🐥🐥🐥🐥 상품 정보 */}
                                    <div className="flex-1 p-4 min-w-0">
                                        <div className="space-y-2">
                                            {/* 🐥🐥🐥🐥🐥 상품명만 수정 가능 */}
                                            <div>
                                                <input
                                                    type="text"
                                                    value={상품.상품명}
                                                    onChange={(e) => 입력값변경(인덱스, '상품명', e.target.value)}
                                                    className="w-1/2 px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:border-transparent"
                                                    style={{ '--tw-ring-color': '#5E92C6' }}
                                                    placeholder="상품명을 입력하세요"
                                                />
                                            </div>
                                            
                                            {/* 🐥🐥🐥🐥🐥 가격 입력 필드 */}
                                            <div className="flex gap-2">
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={상품.가격}
                                                        onChange={(e) => 입력값변경(인덱스, '가격', e.target.value)}
                                                        className="w-1/2 px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:border-transparent"
                                                        style={{ '--tw-ring-color': '#5E92C6' }}
                                                        placeholder="가격을 입력하세요"
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* 🐥🐥🐥🐥🐥 나머지 정보는 읽기 전용 - 한 줄에 4개 배치 */}
                                            <div className="flex gap-2">
                                                <div>
                                                    <div className="inline-block px-2 py-1 border border-gray-300 rounded-md bg-bg-100">
                                                        <span className="block text-sm text-gray-800 text-center">
                                                            {상품.카테고리}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="inline-block px-2 py-1 border border-gray-300 rounded-md bg-bg-100">
                                                        <span className="block text-sm text-gray-800 text-center">
                                                            {상품.재고 || 0}개
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className={`inline-block px-2 py-1 border border-gray-300 rounded-md bg-bg-100 ${상태색상[상품.상태].split(' ')[1]}`}>
                                                        <span className="block text-sm text-center">
                                                            {상품.상태}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="inline-block px-2 py-1 border border-gray-300 rounded-md bg-bg-100">
                                                        <span className="block text-sm text-gray-800 text-center">
                                                            {상품.등록일}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 🐥🐥🐥🐥🐥 상세 이미지 5개 */}
                                    <div className="flex gap-2 p-4">
                                        {[
                                            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop&crop=center',
                                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop&crop=center',
                                            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center',
                                            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center',
                                            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&crop=center'
                                        ].map((이미지URL, index) => (
                                            <div key={index} className="w-32 h-32 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                                                <img 
                                                    src={이미지URL} 
                                                    alt={`${상품.상품명} 상세이미지 ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 🐥🐥🐥🐥🐥 삭제 버튼 - 메시지카드 스타일 */}
                                {상품목록.length > 1 && (
                                    <button 
                                        className="
                                            inline-flex
                                            items-center
                                            justify-center
                                            relative
                                            shrink-0
                                            can-focus
                                            select-none
                                            disabled:pointer-events-none
                                            disabled:opacity-50
                                            disabled:shadow-none
                                            disabled:drop-shadow-none 
                                            text-text-300
                                            border-transparent
                                            transition
                                            font-ui
                                            tracking-tight
                                            duration-300
                                            ease-[cubic-bezier(0.165,0.85,0.45,1)]
                                            hover:bg-bg-300
                                            aria-checked:bg-bg-400
                                            aria-expanded:bg-bg-400
                                            hover:text-text-100
                                            aria-pressed:text-text-100
                                            aria-checked:text-text-100
                                            aria-expanded:text-text-100  
                                            z-2 
                                            !absolute 
                                            top-2 
                                            right-2 
                                            p-2 
                                            rounded-lg 
                                            transition 
                                            duration-300 
                                            opacity-0 
                                            translate-x-1 
                                            ease-in-out 
                                            group-hover:translate-x-0 
                                            group-hover:opacity-100
                                        " 
                                        type="button" 
                                        aria-label="상품 삭제" 
                                        data-state="closed"
                                        onClick={() => 상품삭제(상품.id)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
                                            <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                                        </svg>
                                    </button>
                                )}

                                {/* 🐥🐥🐥🐥🐥 저장 중 표시 */}
                                {저장중[상품.id] && (
                                    <div className="absolute top-2 left-2">
                                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                            <span className="text-xs text-blue-600">저장 중...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🐥🐥🐥🐥🐥 상품이 없을 때 */}
            {상품목록.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">상품이 없습니다</h3>
                    <p className="text-gray-500 mb-4">새 상품을 추가해보세요.</p>
                    <button
                        onClick={새상품추가}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        첫 상품 추가하기
                    </button>
                </div>
            )}

            {/* 🐥🐥🐥🐥🐥 우측하단 플로팅 버튼 - 팝업창 열기 기능으로 변경 */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={팝업열기}
                    className="floating-button"
                    title="새 상품 추가"
                    aria-label="새 상품 추가"
                >
                    <div className="floating-button-icon" style={{ width: '18px', height: '18px' }}>
                        <svg 
                            width="24" 
                            height="24" 
                            viewBox="0 0 20 20" 
                            fill="currentColor" 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="shrink-0 transition text-always-white" 
                            aria-hidden="true"
                        >
                            <path d="M10 3C10.4142 3 10.75 3.33579 10.75 3.75V9.25H16.25C16.6642 9.25 17 9.58579 17 10C17 10.3882 16.7051 10.7075 16.3271 10.7461L16.25 10.75H10.75V16.25C10.75 16.6642 10.4142 17 10 17C9.58579 17 9.25 16.6642 9.25 16.25V10.75H3.75C3.33579 10.75 3 10.4142 3 10C3 9.58579 3.33579 9.25 3.75 9.25H9.25V3.75C9.25 3.33579 9.58579 3 10 3Z"></path>
                        </svg>
                    </div>
                </button>
            </div>

            {/* 🐥🐥🐥🐥🐥 팝업창 추가 */}
            <팝업창
                열림={팝업열림}
                닫기={팝업닫기}
                제목="상품 검색 및 추가"
                크기="large"
                검색기능={true}
            >
                <div className="space-y-6">
                    {/* 🐥🐥🐥🐥🐥 팝업창 내용 */}
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            상품 검색 및 추가
                        </h3>
                        <p className="text-gray-600 mb-6">
                            검색창에 상품명을 입력하면 CNInsider에서 해당 상품을 검색하여 결과를 보여줍니다.
                        </p>
                        
                        {/* 🐥🐥🐥🐥🐥 검색 결과가 없을 때 표시되는 안내 */}
                        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                            <p className="mb-2">💡 사용법:</p>
                            <ul className="text-left space-y-1">
                                <li>• 검색창에 "가방", "전자제품" 등 원하는 상품명을 입력하세요</li>
                                <li>• 검색 버튼을 클릭하거나 Enter 키를 누르세요</li>
                                <li>• CNInsider 웹사이트의 검색 결과가 팝업창에 표시됩니다</li>
                                <li>• 검색 결과를 확인한 후 상품을 추가할 수 있습니다</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </팝업창>
        </div>
    );
};

export default 상품관리;
