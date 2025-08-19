import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 구글로그인 } from '../supabase/인증';

// ★★★★★ 컴포넌트 로드 전에 즉시 실행 (최고속)
const 유저에이전트 = navigator.userAgent.toLowerCase();
const 카카오톡인앱 = 유저에이전트.includes('kakaotalk');

if (카카오톡인앱) {
    const 현재URL = window.location.href;
    const iOS여부 = /iphone|ipad|ipod/.test(유저에이전트);

    if (iOS여부) {
        // ★★★★★ iOS: location.replace로 즉시 이동 (딜레이 최소화)
        window.location.replace(`kakaotalk://web/openExternal?url=${encodeURIComponent(현재URL)}`);
    } else {
        // ★★★★★ Android: location.replace로 intent 즉시 실행 (딜레이 최소화)
        window.location.replace(`intent://${현재URL.replace(/https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`);
    }

    // ★★★★★ 현재 페이지를 완전히 빈 페이지로 교체
    document.body.innerHTML = '';
    document.body.style.background = 'white';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

}

const 로그인 = () => {
    const [로딩, set로딩] = useState(false);
    const [메시지, set메시지] = useState('');
    const [searchParams] = useSearchParams();

    // ★★★★★ 카카오톡 인앱브라우저면 렌더링 하지 않음
    if (카카오톡인앱) {
        return null;
    }

    // URL에서 오류 메시지 확인
    useEffect(() => {
        const error = searchParams.get('error');
        if (error) {
            switch (error) {
                case 'auth_failed':
                    set메시지('인증에 실패했습니다. 다시 시도해주세요.');
                    break;
                case 'token_refresh_failed':
                    set메시지('토큰 새로고침에 실패했습니다. 다시 로그인해주세요.');
                    break;
                case 'callback_failed':
                    set메시지('로그인 처리 중 오류가 발생했습니다.');
                    break;
                default:
                    set메시지('로그인 중 문제가 발생했습니다.');
            }
        }
    }, [searchParams]);

    // 구글 로그인 처리
    const 구글로그인처리 = async () => {
        set로딩(true);
        set메시지('');

        try {
            await 구글로그인();
            // 성공하면 자동으로 리다이렉트됨
        } catch (error) {
            set메시지('로그인 중 오류가 발생했습니다: ' + error.message);
        }

        set로딩(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        로그인
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        구글 계정으로 간편하게 로그인하세요
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    {메시지 && (
                        <div className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
                            {메시지}
                        </div>
                    )}

                    {/* 구글 로그인 버튼 */}
                    <button
                        onClick={구글로그인처리}
                        disabled={로딩}
                        className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {/* 구글 아이콘 */}
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        {로딩 ? '로그인 중...' : 'Google로 로그인'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default 로그인;
