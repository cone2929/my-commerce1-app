import { useState } from 'react';

const 세특AI = () => {
    const [데이터, set데이터] = useState([
        { 이름: '', 활동: '내용을 입력해주세요.', AI결과: '', 수정사항: '내용을 입력해주세요.' },
    ]);

    const [로딩중, set로딩중] = useState({});

    // 활동과 수정사항을 각각 따로 저장
    const [마지막활동내용, set마지막활동내용] = useState({});
    const [마지막수정내용, set마지막수정내용] = useState({});

    // ★★★★★ 이전 AI결과를 저장하는 상태 추가
    const [이전AI결과, set이전AI결과] = useState({});

    // 바이트수 계산 함수 추가
    const 바이트수계산 = (텍스트) => {
        let 바이트수 = 0;
        for (const 문자 of 텍스트) {
            if (문자 === '\n') {
                바이트수 += 2;
            } else if (/[가-힣]/.test(문자)) {
                바이트수 += 3;
            } else {
                바이트수 += 1;
            }
        }
        return 바이트수;
    };

    const 입력값변경 = (인덱스, 필드, 값) => {
        const 새데이터 = [...데이터];
        새데이터[인덱스][필드] = 값;
        set데이터(새데이터);
    };

    const 높이자동조정 = (element) => {
        element.style.height = 'auto';
        element.style.height = element.scrollHeight + 'px';
    };

    // ★★★★★ 되돌리기 함수 추가
    const AI결과되돌리기 = (인덱스) => {
        if (이전AI결과[인덱스]) {
            입력값변경(인덱스, 'AI결과', 이전AI결과[인덱스]);
            // 되돌린 후에는 이전 결과 삭제
            set이전AI결과(prev => {
                const 새상태 = { ...prev };
                delete 새상태[인덱스];
                return 새상태;
            });
        }
    };

    // 활동 전용 AI 결과 가져오기 함수 (기존 방식 유지)
    const 활동AI결과가져오기 = async (인덱스, 활동내용) => {
        const API_BASE_URL = 'http://localhost:8001';

        if (!활동내용.trim() || 활동내용 === '내용을 입력해주세요.') {
            return;
        }

        if (마지막활동내용[인덱스] === 활동내용) {
            return;
        }

        // ★★★★★ AI 요청 전에 현재 AI결과를 이전값으로 저장
        if (데이터[인덱스].AI결과.trim()) {
            set이전AI결과(prev => ({ ...prev, [인덱스]: 데이터[인덱스].AI결과 }));
        }

        set로딩중(prev => ({ ...prev, [인덱스]: true }));

        try {
            const response = await fetch(`${API_BASE_URL}/api/analyze-activity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    activity: 활동내용,
                    student_name: 데이터[인덱스].이름
                })
            });

            const 결과 = await response.json();
            입력값변경(인덱스, 'AI결과', 결과.result);
            set마지막활동내용(prev => ({ ...prev, [인덱스]: 활동내용 }));

        } catch (error) {
            console.error('AI 결과 가져오기 실패:', error);
            입력값변경(인덱스, 'AI결과', '입력내용을 다시 한번 검토해 주세요.');
        } finally {
            set로딩중(prev => ({ ...prev, [인덱스]: false }));
        }
    };

    // 수정사항 전용 AI 결과 가져오기 함수 (AI결과 + 수정사항 합쳐서 전달)
    const 수정사항AI결과가져오기 = async (인덱스, 수정사항내용) => {
        const API_BASE_URL = 'http://localhost:8001';

        if (!수정사항내용.trim() || 수정사항내용 === '내용을 입력해주세요.') {
            return;
        }

        if (마지막수정내용[인덱스] === 수정사항내용) {
            return;
        }

        const 현재AI결과 = 데이터[인덱스].AI결과;
        if (!현재AI결과.trim()) {
            alert('먼저 활동 내용을 입력하여 AI 결과를 생성해주세요.');
            return;
        }

        // ★★★★★ AI 요청 전에 현재 AI결과를 이전값으로 저장
        set이전AI결과(prev => ({ ...prev, [인덱스]: 현재AI결과 }));

        set로딩중(prev => ({ ...prev, [인덱스]: true }));

        try {
            const response = await fetch(`${API_BASE_URL}/api/modify-result`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    existing_result: 현재AI결과,
                    modifications: 수정사항내용,
                    student_name: 데이터[인덱스].이름
                })
            });

            const 결과 = await response.json();
            입력값변경(인덱스, 'AI결과', 결과.result);
            set마지막수정내용(prev => ({ ...prev, [인덱스]: 수정사항내용 }));

        } catch (error) {
            console.error('수정사항 적용 실패:', error);
            입력값변경(인덱스, 'AI결과', '입력내용을 다시 한번 검토해 주세요.');
        } finally {
            set로딩중(prev => ({ ...prev, [인덱스]: false }));
        }
    };

    const 포커스처리 = (인덱스, 필드) => {
        const 현재값 = 데이터[인덱스][필드];
        if (현재값 === '내용을 입력해주세요.') {
            입력값변경(인덱스, 필드, '');
        }
    };

    const 블러처리 = (인덱스, 필드) => {
        const 현재값 = 데이터[인덱스][필드];
        if (현재값.trim() === '') {
            입력값변경(인덱스, 필드, '내용을 입력해주세요.');
        } else {
            // 필드별로 다른 API 호출
            if (필드 === '활동') {
                활동AI결과가져오기(인덱스, 현재값);
            } else if (필드 === '수정사항') {
                수정사항AI결과가져오기(인덱스, 현재값);
            }
        }
    };

    const 키입력처리 = (e, 인덱스, 필드) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                return;
            }
            if (e.ctrlKey) {
                e.preventDefault();
                const 현재값 = 데이터[인덱스][필드];
                const 커서위치 = e.target.selectionStart;
                const 새값 = 현재값.slice(0, 커서위치) + '\n' + 현재값.slice(e.target.selectionEnd);
                입력값변경(인덱스, 필드, 새값);

                setTimeout(() => {
                    e.target.selectionStart = e.target.selectionEnd = 커서위치 + 1;
                    높이자동조정(e.target);
                }, 0);
                return;
            }
            e.preventDefault();
            e.target.blur();
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2 pl-10 md:pl-0">세특 AI</h1>
                <p className="text-gray-600">학생별 세부능력 및 특기사항을 관리합니다.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {/* 이름 칼럼 폭 고정 (4글자 기준) */}
                                <th className="w-16 min-w-[64px] px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    이름
                                </th>
                                <th className="min-w-[250px] px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    활동
                                </th>
                                <th className="min-w-[250px] px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    AI결과
                                </th>
                                <th className="min-w-[250px] px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    수정사항
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {데이터.map((항목, 인덱스) => (
                                <tr key={항목.이름} className="hover:bg-gray-50 transition-colors">
                                    {/* 이름 셀 폭 고정 및 여백 최소화 */}
                                    <td className="w-16 min-w-[64px] px-1 py-1 whitespace-nowrap text-sm text-gray-900">
                                        {항목.이름}
                                    </td>
                                    {/* 활동 칸 여백 최소화 */}
                                    <td className="min-w-[250px] px-1 py-1">
                                        <textarea
                                            value={항목.활동}
                                            onChange={(e) => {
                                                입력값변경(인덱스, '활동', e.target.value);
                                                높이자동조정(e.target);
                                            }}
                                            onFocus={() => 포커스처리(인덱스, '활동')}
                                            onBlur={() => 블러처리(인덱스, '활동')}
                                            onKeyDown={(e) => 키입력처리(e, 인덱스, '활동')}
                                            className={`w-full min-h-[60px] p-2 text-sm border border-gray-200 rounded-md resize-none focus:ring-2 focus:ring-gray-300 focus:border-transparent overflow-hidden ${항목.활동 === '내용을 입력해주세요.' ? 'text-gray-400' : 'text-gray-900'}`}
                                            placeholder="내용을 입력해주세요."
                                            style={{ height: '60px' }}
                                        />
                                    </td>
                                    {/* ★★★★★ AI결과 칸 - 되돌리기 버튼 위치 변경 */}
                                    <td className="min-w-[250px] px-1 py-1 relative">
                                        <textarea
                                            value={로딩중[인덱스] ? '' : 항목.AI결과}
                                            readOnly
                                            className={`w-full min-h-[60px] p-2 text-sm border border-gray-200 rounded-md resize-none overflow-hidden focus:outline-none focus:ring-0 focus:border-gray-200 ${로딩중[인덱스]
                                                ? 'bg-gray-200 animate-pulse text-transparent placeholder-transparent'
                                                : 'bg-gray-50 text-gray-900'
                                                }`}
                                            placeholder={로딩중[인덱스] ? '' : ''}
                                            style={{ height: 항목.AI결과 && !로딩중[인덱스] ? 'auto' : '60px' }}
                                            ref={(el) => {
                                                if (el && 항목.AI결과 && !로딩중[인덱스]) {
                                                    el.style.height = 'auto';
                                                    el.style.height = el.scrollHeight + 'px';
                                                }
                                            }}
                                        />
                                        {/* ★★★★★ 바이트수와 되돌리기 버튼을 함께 배치 */}
                                        {항목.AI결과 && !로딩중[인덱스] && (
                                            <div className="absolute bottom-1 right-1 flex items-center gap-0">
                                                <div className="bg-white text-xs text-gray-500 px-1 rounded border border-gray-200">
                                                    {바이트수계산(항목.AI결과)}바이트
                                                </div>
                                                {/* ★★★★★ 되돌리기 버튼을 바이트수 우측으로 이동 */}
                                                {이전AI결과[인덱스] && (
                                                    <button
                                                        onClick={() => AI결과되돌리기(인덱스)}
                                                        className="bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 px-1 py-0 rounded border border-gray-200 text-xs transition-colors"
                                                        title=""
                                                    >
                                                        ↶
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    {/* 수정사항 칸 여백 최소화 */}
                                    <td className="min-w-[250px] px-1 py-1">
                                        <textarea
                                            value={항목.수정사항}
                                            onChange={(e) => {
                                                입력값변경(인덱스, '수정사항', e.target.value);
                                                높이자동조정(e.target);
                                            }}
                                            onFocus={() => 포커스처리(인덱스, '수정사항')}
                                            onBlur={() => 블러처리(인덱스, '수정사항')}
                                            onKeyDown={(e) => 키입력처리(e, 인덱스, '수정사항')}
                                            className={`w-full min-h-[60px] p-2 text-sm border border-gray-200 rounded-md resize-none focus:ring-2 focus:ring-gray-300 focus:border-transparent overflow-hidden ${항목.수정사항 === '내용을 입력해주세요.' ? 'text-gray-400' : 'text-gray-900'}`}
                                            placeholder="내용을 입력해주세요."
                                            style={{ height: '60px' }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default 세특AI;
