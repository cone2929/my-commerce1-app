import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import 사이드바 from './사이드바';

const 레이아웃 = () => {
    return (
        <div className="min-h-screen bg-gray-50 relative">
            <사이드바 />

            {/* 상단 헤더 높이만큼 여백 추가 */}
            <main className="pt-16 transition-all duration-300">
                <Outlet />
            </main>
        </div>
    );
};

export default 레이아웃;
