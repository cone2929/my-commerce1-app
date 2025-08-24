import { useState, useEffect } from 'react';
import { backendManager } from '../utils/backend';

const 서버상태 = ({ children }) => {
    const [서버상태, set서버상태] = useState('checking');
    const [안내표시, set안내표시] = useState(false);

    useEffect(() => {
        checkServerStatus();
        
        // 주기적으로 서버 상태 확인 (30초마다)
        const interval = setInterval(checkServerStatus, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const checkServerStatus = async () => {
        try {
            const status = await backendManager.checkServerStatus();
            set서버상태(status.status);
            
            // 서버가 오프라인이면 안내 표시
            if (status.status === 'offline') {
                set안내표시(true);
            } else {
                set안내표시(false);
            }
        } catch (error) {
            set서버상태('offline');
            set안내표시(true);
        }
    };

    const handleRetry = () => {
        set서버상태('checking');
        checkServerStatus();
    };

    const handleStartServer = () => {
        const guide = backendManager.getServerStartGuide();
        alert(`${guide.title}\n\n${guide.message}\n\n${guide.steps.join('\n')}\n\n${guide.note}`);
    };

    if (서버상태 === 'checking') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-lg text-gray-600">백엔드 서버 상태 확인 중...</div>
                </div>
            </div>
        );
    }

    if (서버상태 === 'offline' && 안내표시) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                    <div className="text-center">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            백엔드 서버가 실행되지 않았습니다
                        </h2>
                        <p className="text-gray-600 mb-6">
                            웹앱을 사용하려면 백엔드 서버를 시작해야 합니다.
                        </p>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                            <h3 className="font-semibold text-blue-800 mb-2">서버 시작 방법:</h3>
                            <ol className="text-sm text-blue-700 space-y-1">
                                <li>1. backend 폴더로 이동</li>
                                <li>2. Windows: <code className="bg-blue-100 px-1 rounded">start_server.bat</code> 실행</li>
                                <li>3. Mac/Linux: <code className="bg-blue-100 px-1 rounded">./start_server.sh</code> 실행</li>
                                <li>4. 또는 수동으로: <code className="bg-blue-100 px-1 rounded">python main.py</code></li>
                            </ol>
                            <p className="text-xs text-blue-600 mt-2">
                                서버는 http://localhost:8001 에서 실행됩니다.
                            </p>
                        </div>
                        
                        <div className="flex space-x-3">
                            <button
                                onClick={handleStartServer}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                서버 시작 안내
                            </button>
                            <button
                                onClick={handleRetry}
                                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                다시 확인
                            </button>
                        </div>
                        
                        <button
                            onClick={() => set안내표시(false)}
                            className="text-sm text-gray-500 mt-4 hover:text-gray-700"
                        >
                            안내 숨기기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 서버가 온라인이거나 안내를 숨긴 경우 자식 컴포넌트 렌더링
    return children;
};

export default 서버상태;
