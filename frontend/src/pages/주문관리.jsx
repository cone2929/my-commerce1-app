import { useState, useEffect } from 'react';
import { logger } from '../utils/로깅';

const 주문관리 = () => {
    const [주문목록, set주문목록] = useState([]);
    const [로딩중, set로딩중] = useState(true);

    // 🐥🐥🐥🐥🐥 Electron API를 통한 주문 데이터 로드
    useEffect(() => {
        const 주문데이터로드 = async () => {
            try {
                if (window.electronAPI) {
                    const 주문들 = await window.electronAPI.getOrders();
                    set주문목록(주문들);
                }
            } catch (error) {
                logger.error('주문 데이터 로드 실패:', error);
            } finally {
                set로딩중(false);
            }
        };

        주문데이터로드();
    }, []);

    const 주문상태변경 = async (주문id, 새상태) => {
        try {
            if (window.electronAPI) {
                const 업데이트할주문 = 주문목록.find(주문 => 주문.id === 주문id);
                if (업데이트할주문) {
                    await window.electronAPI.updateOrder({
                        ...업데이트할주문,
                        status: 새상태
                    });
                    
                    // 🐥🐥🐥🐥🐥 UI 업데이트
                    set주문목록(prev => prev.map(주문 => 
                        주문.id === 주문id ? { ...주문, status: 새상태 } : 주문
                    ));
                }
            }
        } catch (error) {
            logger.error('주문 상태 변경 실패:', error);
        }
    };

    const 주문삭제 = async (주문id) => {
        try {
            if (window.electronAPI) {
                await window.electronAPI.deleteOrder(주문id);
                set주문목록(prev => prev.filter(주문 => 주문.id !== 주문id));
            }
        } catch (error) {
            logger.error('주문 삭제 실패:', error);
        }
    };

    const 상태색상 = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'confirmed': 'bg-blue-100 text-blue-800',
        'shipped': 'bg-purple-100 text-purple-800',
        'delivered': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
    };

    const 상태한글 = {
        'pending': '대기중',
        'confirmed': '확인됨',
        'shipped': '배송중',
        'delivered': '배송완료',
        'cancelled': '취소됨'
    };

    if (로딩중) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg text-gray-600">주문 데이터 로딩중...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6" style={{ backgroundColor: '#FAF9F5' }}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">주문 관리</h1>
                    <p className="text-gray-600">고객 주문을 관리하고 배송 상태를 업데이트합니다.</p>
                </div>

                {/* 🐥🐥🐥🐥🐥 주문 목록 */}
                <div className="space-y-4">
                    {주문목록.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📦</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">주문이 없습니다</h3>
                            <p className="text-gray-600">새로운 주문이 들어오면 여기에 표시됩니다.</p>
                        </div>
                    ) : (
                        주문목록.map((주문) => (
                            <div key={주문.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                주문 #{주문.id}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${상태색상[주문.status]}`}>
                                                {상태한글[주문.status]}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">상품명:</span>
                                                <p className="font-medium">{주문.product_name || '알 수 없음'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">고객명:</span>
                                                <p className="font-medium">{주문.customer_name}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">수량:</span>
                                                <p className="font-medium">{주문.quantity}개</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">총 금액:</span>
                                                <p className="font-medium">₩{주문.total_price?.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-3 text-sm text-gray-500">
                                            <span>주문일: {new Date(주문.created_at).toLocaleDateString('ko-KR')}</span>
                                            {주문.customer_email && (
                                                <span className="ml-4">이메일: {주문.customer_email}</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 ml-4">
                                        {/* 🐥🐥🐥🐥🐥 상태 변경 버튼들 */}
                                        {주문.status === 'pending' && (
                                            <button
                                                onClick={() => 주문상태변경(주문.id, 'confirmed')}
                                                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                                            >
                                                확인
                                            </button>
                                        )}
                                        {주문.status === 'confirmed' && (
                                            <button
                                                onClick={() => 주문상태변경(주문.id, 'shipped')}
                                                className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-sm"
                                            >
                                                배송시작
                                            </button>
                                        )}
                                        {주문.status === 'shipped' && (
                                            <button
                                                onClick={() => 주문상태변경(주문.id, 'delivered')}
                                                className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                                            >
                                                배송완료
                                            </button>
                                        )}
                                        <button
                                            onClick={() => 주문삭제(주문.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default 주문관리;
