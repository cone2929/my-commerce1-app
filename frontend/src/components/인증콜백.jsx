import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/클라이언트';

const 인증콜백 = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const 콜백처리 = async () => {
            try {


                // ★★★★★ URL 해시에서 토큰 수동 추출
                const hash = window.location.hash;


                if (hash && hash.includes('access_token')) {
                    // ★★★★★ URL 해시에서 토큰 파싱
                    const hashParams = new URLSearchParams(hash.substring(1)); // # 제거
                    const accessToken = hashParams.get('access_token');
                    const refreshToken = hashParams.get('refresh_token');
                    const tokenType = hashParams.get('token_type');



                    if (accessToken && refreshToken) {
                        try {
                            // ★★★★★ 수동으로 세션 설정

                            const { data, error } = await supabase.auth.setSession({
                                access_token: accessToken,
                                refresh_token: refreshToken
                            });



                            if (error) {
                                console.error('❌ 세션 설정 실패:', error);
                                navigate('/로그인?error=session_set_failed');
                                return;
                            }

                            if (data.session) {


                                // ★★★★★ URL 정리 (토큰 제거)
                                window.history.replaceState({}, document.title, '/auth/callback');

                                navigate('/');
                                return;
                            }
                        } catch (setSessionError) {
                            console.error('❌ setSession 오류:', setSessionError);
                        }
                    }
                }

                // ★★★★★ 일반적인 세션 확인 (토큰이 URL에 없는 경우)
                const { data, error } = await supabase.auth.getSession();


                if (error) {
                    console.error('❌ 세션 오류:', error);
                    navigate('/로그인?error=session_failed');
                    return;
                }

                if (data.session) {

                    navigate('/');
                } else {

                    navigate('/로그인?error=no_session');
                }
            } catch (error) {
                console.error('❌ 콜백 오류:', error);
                navigate('/로그인?error=callback_failed');
            }
        };

        // ★★★★★ 약간의 지연 후 처리
        setTimeout(콜백처리, 100);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-lg text-gray-600">로그인 처리 중...</p>
                <p className="mt-2 text-sm text-gray-400">토큰을 세션으로 변환하는 중...</p>
            </div>
        </div>
    );
};

export default 인증콜백;
