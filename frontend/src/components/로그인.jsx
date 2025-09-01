import React from 'react';

const 로그인 = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        환영합니다
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        해외구매대행 자동화 시스템에 오신 것을 환영합니다
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="text-center text-sm text-gray-600 bg-gray-50 p-6 rounded-md">
                        <p>시스템에 자동으로 로그인되었습니다.</p>
                        <p className="mt-2">상단 메뉴를 통해 원하는 기능을 이용하세요.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default 로그인;
