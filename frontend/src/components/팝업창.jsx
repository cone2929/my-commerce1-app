import React, { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../supabase/클라이언트';

const 팝업창 = ({ 
    열림, 
    닫기, 
    제목 = "팝업창", 
    자식, 
    크기 = "medium", // small, medium, large, full
    닫기버튼표시 = true,
    배경클릭닫기 = false,
    검색기능 = false, // 🐥🐥🐥🐥🐥 검색 기능 활성화 옵션 추가
    선택된상품추가콜백 = null // 🐥🐥🐥🐥🐥 선택된 상품을 부모로 전달하는 콜백 함수 추가
}) => {
    // 🐥🐥🐥🐥🐥 검색 관련 상태
    const [검색어, set검색어] = useState('');
    const [상품목록, set상품목록] = useState([]);
    const [로딩중, set로딩중] = useState(false);
    const [에러, set에러] = useState('');
    const [현재페이지, set현재페이지] = useState(1);
    const [더보기로딩, set더보기로딩] = useState(false);
    const [더보기완료, set더보기완료] = useState(false);
    const [검색실행이_완료되었는지, set검색실행이_완료되었는지] = useState(false);
    
    // 🐥🐥🐥🐥🐥 전체선택 관련 상태 추가
    const [전체선택, set전체선택] = useState(false);
    const [선택된상품들, set선택된상품들] = useState(new Set());
    
    // 🐥🐥🐥🐥🐥 이미지 추출 로딩 상태 추가
    const [이미지추출로딩, set이미지추출로딩] = useState(false);
    
    // 🐥🐥🐥🐥🐥 진행 상황 표시 상태 추가
    const [진행상황, set진행상황] = useState({
        현재: 0,
        전체: 0,
        메시지: ''
    });
    
    // 🐥🐥🐥🐥🐥 팝업 내용 영역 ref
    const 팝업내용Ref = useRef(null);
    
    // 🐥🐥🐥🐥🐥 검색 입력창 ref 추가
    const 검색입력창Ref = useRef(null);
    
    // 🐥🐥🐥🐥🐥 구글 계정 기반 사용자 ID
    const [사용자ID, set사용자ID] = useState('');
    
    // 🐥🐥🐥🐥🐥 선택된 상품들을 상품관리 페이지 형식으로 변환하는 함수
    const 선택된상품변환 = () => {
        const 변환된상품들 = [];
        
        선택된상품들.forEach(인덱스 => {
            const 원본상품 = 상품목록[인덱스];
            if (원본상품) {
                // 🐥🐥🐥🐥🐥 상품명에서 카테고리 자동 추출 함수
                const 카테고리추출 = (상품명) => {
                    const 이름 = 상품명.toLowerCase();
                    if (이름.includes('가방') || 이름.includes('백') || 이름.includes('핸드백') || 이름.includes('클러치')) return '가방';
                    if (이름.includes('의류') || 이름.includes('옷') || 이름.includes('티셔츠') || 이름.includes('셔츠') || 이름.includes('바지') || 이름.includes('치마') || 이름.includes('원피스')) return '의류';
                    if (이름.includes('전자') || 이름.includes('폰') || 이름.includes('컴퓨터') || 이름.includes('노트북') || 이름.includes('태블릿') || 이름.includes('이어폰') || 이름.includes('헤드폰')) return '전자제품';
                    if (이름.includes('화장품') || 이름.includes('크림') || 이름.includes('로션') || 이름.includes('마스크') || 이름.includes('립스틱') || 이름.includes('파운데이션')) return '화장품';
                    if (이름.includes('식품') || 이름.includes('음식') || 이름.includes('과자') || 이름.includes('음료') || 이름.includes('커피') || 이름.includes('차')) return '식품';
                    if (이름.includes('가구') || 이름.includes('의자') || 이름.includes('테이블') || 이름.includes('소파') || 이름.includes('침대')) return '가구';
                    if (이름.includes('스포츠') || 이름.includes('운동') || 이름.includes('축구') || 이름.includes('농구') || 이름.includes('테니스') || 이름.includes('골프')) return '스포츠용품';
                    if (이름.includes('도서') || 이름.includes('책') || 이름.includes('잡지') || 이름.includes('소설')) return '도서';
                    return '기타';
                };

                // 🐥🐥🐥🐥🐥 상품관리 페이지 형식으로 변환
                const 변환된상품 = {
                    id: Date.now() + Math.random(), // 🐥🐥🐥🐥🐥 고유 ID 생성
                    상품명: 원본상품.제목 || '상품명 없음',
                    카테고리: 카테고리추출(원본상품.제목), // 🐥🐥🐥🐥🐥 자동 카테고리 추출
                    가격: 원본상품.가격 || '0',
                    재고: '100', // 🐥🐥🐥🐥🐥 기본 재고 설정
                    상태: '판매중',
                    등록일: new Date().toLocaleDateString('ko-KR'),
                    설명: 원본상품.제목 || '상품 설명',
                    이미지: 원본상품.이미지URL || '',
                    // 🐥🐥🐥🐥🐥 원본 데이터 보존
                    원본데이터: {
                        제목: 원본상품.제목,
                        가격: 원본상품.가격,
                        한국어가격: 원본상품.한국어가격,
                        이미지URL: 원본상품.이미지URL,
                        판매정보: 원본상품.판매정보,
                        라벨: 원본상품.라벨
                    }
                };
                변환된상품들.push(변환된상품);
            }
        });
        
        return 변환된상품들;
    };
    
    // 🐥🐥🐥🐥🐥 선택된 상품들을 순서대로 처리하는 함수
    const 순서별상품처리 = async () => {
        if (선택된상품들.size === 0) {
            alert('추가할 상품을 선택해주세요.');
            return;
        }
        
        // 🐥🐥🐥🐥🐥 선택된 상품들을 순서대로 배열로 변환
        const 선택된상품인덱스들 = Array.from(선택된상품들).sort((a, b) => a - b);
        const 선택된상품들배열 = 선택된상품인덱스들.map(인덱스 => 상품목록[인덱스]);
        
        if (선택된상품들배열.length === 0) {
            alert('선택된 상품의 정보를 가져올 수 없습니다.');
            return;
        }
        
        // 🐥🐥🐥🐥🐥 진행 상황 초기화
        set진행상황({
            현재: 0,
            전체: 선택된상품들배열.length,
            메시지: '상품 처리 준비 중...'
        });
        
        // 🐥🐥🐥🐥🐥 순서대로 상품 처리
        const 처리된상품들 = [];
        
        for (let i = 0; i < 선택된상품들배열.length; i++) {
            const 현재상품 = 선택된상품들배열[i];
            
            // 🐥🐥🐥🐥🐥 진행 상황 업데이트
            set진행상황({
                현재: i + 1,
                전체: 선택된상품들배열.length,
                메시지: `"${현재상품.제목}" 상세페이지 이동 중...`
            });
            
            try {
                // 🐥🐥🐥🐥🐥 현재 상품에 대한 이미지 추출
                                    set진행상황(prev => ({
                        ...prev,
                        메시지: `"${현재상품.제목}" 가져오는 중...`
                    }));
                
                const 이미지결과 = await 개별상품이미지추출(현재상품);
                
                if (이미지결과) {
                    처리된상품들.push(이미지결과);
                    set진행상황(prev => ({
                        ...prev,
                        메시지: `"${현재상품.제목}" 이미지 추출 완료 (${이미지결과.썸네일이미지들?.length || 0}개)`
                    }));
                }
                
                // 🐥🐥🐥🐥🐥 다음 상품 처리 전 잠시 대기 (서버 부하 방지)
                if (i < 선택된상품들배열.length - 1) {
                    set진행상황(prev => ({
                        ...prev,
                        메시지: '다음 상품 처리 준비 중...'
                    }));
                    await new Promise(resolve => setTimeout(resolve, 1000));  // 🐥🐥🐥🐥🐥 대기 시간 단축
                }
                
            } catch (error) {
        
                // 🐥🐥🐥🐥🐥 오류가 발생해도 기본 정보로 상품 추가
                const 기본상품 = 상품정보변환(현재상품);
                처리된상품들.push(기본상품);
            }
        }
        
        // 🐥🐥🐥🐥🐥 완료 메시지
        set진행상황({
            현재: 선택된상품들배열.length,
            전체: 선택된상품들배열.length,
            메시지: '상품 추가 완료!'
        });
        
        // 🐥🐥🐥🐥🐥 잠시 후 처리된 상품들을 상품관리 페이지에 추가
        setTimeout(() => {
            if (처리된상품들.length > 0) {
                if (선택된상품추가콜백) {
                    선택된상품추가콜백(처리된상품들);
                }
            }
            
            // 🐥🐥🐥🐥🐥 팝업창 완전 초기화 및 닫기
            팝업창초기화();
            닫기();
        }, 1000);
    };
    
    // 🐥🐥🐥🐥🐥 개별 상품 이미지 추출 함수
    const 개별상품이미지추출 = async (상품) => {
        if (!상품.제목) {
            return null;
        }
        
        try {
            
            // 🐥🐥🐥🐥🐥 Electron API 사용
            let data;
            if (window.electronAPI) {
                data = await window.electronAPI.extractProductImages({
                    상품명목록: [상품.제목], // 🐥🐥🐥🐥🐥 단일 상품만 전송
                    사용자ID: 사용자ID || "anonymous",
                    검색URL: `https://www.cninsider.co.kr/mall/#/product?keywords=${encodeURIComponent(검색어)}&type=text&imageAddress=&searchDiff=1`
                });
            } else {
                throw new Error('Electron API가 사용할 수 없습니다. Electron 앱에서 실행해주세요.');
            }
            

            
            if (data.success && data.결과 && data.결과.length > 0) {
                const 결과 = data.결과[0];

                
                if (결과.성공 && (결과.이미지들 || 결과.상세이미지들)) {

                    
                    // 🐥🐥🐥🐥🐥 썸네일 이미지 필터링: data:로 시작하는 값과 중복값 제외
                    const 필터된썸네일이미지들 = (결과.이미지들 || []).filter((이미지URL, 인덱스, 배열) => {
                        // 🐥🐥🐥🐥🐥 data:로 시작하는 이미지 제외
                        if (이미지URL.startsWith('data:')) {
                            return false;
                        }
                        // 🐥🐥🐥🐥🐥 빈 문자열 제외
                        if (!이미지URL || 이미지URL.trim() === '') {
                            return false;
                        }
                        // 🐥🐥🐥🐥🐥 중복값 제외
                        return 배열.indexOf(이미지URL) === 인덱스;
                    });
                    
                    // 🐥🐥🐥🐥🐥 상세 이미지 필터링: data:로 시작하는 값과 중복값 제외
                    const 필터된상세이미지들 = (결과.상세이미지들 || []).filter((이미지URL, 인덱스, 배열) => {
                        // 🐥🐥🐥🐥🐥 data:로 시작하는 이미지 제외
                        if (이미지URL.startsWith('data:')) {
                            return false;
                        }
                        // 🐥🐥🐥🐥🐥 빈 문자열 제외
                        if (!이미지URL || 이미지URL.trim() === '') {
                            return false;
                        }
                        // 🐥🐥🐥🐥🐥 중복값 제외
                        return 배열.indexOf(이미지URL) === 인덱스;
                    });
                    

                    
                    // 🐥🐥🐥🐥🐥 앞에서부터 5개만 사용
                    const 최종썸네일이미지들 = 필터된썸네일이미지들.slice(0, 5);
                    const 최종상세이미지들 = 필터된상세이미지들.slice(0, 5);
                    

                    
                    // 🐥🐥🐥🐥🐥 상품 정보 변환
                    const 변환된상품 = 상품정보변환(상품);
                    변환된상품.썸네일이미지들 = 최종썸네일이미지들;
                    변환된상품.상세이미지들 = 최종상세이미지들;
                    

                    return 변환된상품;
                } else {

                }
            } else {

            }
            
            // 🐥🐥🐥🐥🐥 이미지 추출 실패시 기본 정보로 반환
            const 기본상품 = 상품정보변환(상품);

            return 기본상품;
            
        } catch (error) {
    
            return 상품정보변환(상품);
        }
    };
    
    // 🐥🐥🐥🐥🐥 상품 정보 변환 함수 (공통 로직)
    const 상품정보변환 = (원본상품) => {
        // 🐥🐥🐥🐥🐥 상품명에서 카테고리 자동 추출 함수
        const 카테고리추출 = (상품명) => {
            const 이름 = 상품명.toLowerCase();
            if (이름.includes('가방') || 이름.includes('백') || 이름.includes('핸드백') || 이름.includes('클러치')) return '가방';
            if (이름.includes('의류') || 이름.includes('옷') || 이름.includes('티셔츠') || 이름.includes('셔츠') || 이름.includes('바지') || 이름.includes('치마') || 이름.includes('원피스')) return '의류';
            if (이름.includes('전자') || 이름.includes('폰') || 이름.includes('컴퓨터') || 이름.includes('노트북') || 이름.includes('태블릿') || 이름.includes('이어폰') || 이름.includes('헤드폰')) return '전자제품';
            if (이름.includes('화장품') || 이름.includes('크림') || 이름.includes('로션') || 이름.includes('마스크') || 이름.includes('립스틱') || 이름.includes('파운데이션')) return '화장품';
            if (이름.includes('식품') || 이름.includes('음식') || 이름.includes('과자') || 이름.includes('음료') || 이름.includes('커피') || 이름.includes('차')) return '식품';
            if (이름.includes('가구') || 이름.includes('의자') || 이름.includes('테이블') || 이름.includes('소파') || 이름.includes('침대')) return '가구';
            if (이름.includes('스포츠') || 이름.includes('운동') || 이름.includes('축구') || 이름.includes('농구') || 이름.includes('테니스') || 이름.includes('골프')) return '스포츠용품';
            if (이름.includes('도서') || 이름.includes('책') || 이름.includes('잡지') || 이름.includes('소설')) return '도서';
            return '기타';
        };
        
        // 🐥🐥🐥🐥🐥 한국원화 원금에 마진 30% 적용하는 함수
        const 가격변환 = (원본상품) => {
            // 🐥🐥🐥🐥🐥 한국원화 원금이 있으면 사용, 없으면 위안화 가격 사용
            let 한국원화원금 = 0;
            
            if (원본상품.한국어가격) {
                // 🐥🐥🐥🐥🐥 한국원화 원금에서 숫자만 추출
                const 한국원화숫자 = 원본상품.한국어가격.toString().replace(/[^0-9]/g, '');
                한국원화원금 = parseInt(한국원화숫자);
            } else if (원본상품.가격) {
                // 🐥🐥🐥🐥🐥 한국원화 원금이 없으면 위안화 가격에서 숫자만 추출
                const 위안화숫자 = 원본상품.가격.toString().replace(/[^0-9.]/g, '');
                const 위안화금액 = parseFloat(위안화숫자);
                
                if (!isNaN(위안화금액) && 위안화금액 > 0) {
                    // 🐥🐥🐥🐥🐥 위안화를 한국원화로 변환 (1위안 = 약 180원)
                    const 환율 = 180;
                    한국원화원금 = 위안화금액 * 환율;
                }
            }
            
            if (한국원화원금 <= 0) return '0';
            
            // 🐥🐥🐥🐥🐥 마진 30% 적용
            const 마진적용가격 = Math.round(한국원화원금 * 1.3);
            
            return 마진적용가격.toString();
        };
        
        // 🐥🐥🐥🐥🐥 상품관리 페이지 형식으로 변환
        const 변환된상품 = {
            id: Date.now() + Math.random(),
            상품명: 원본상품.제목 || '상품명 없음',
            카테고리: 카테고리추출(원본상품.제목),
            가격: 가격변환(원본상품), // 🐥🐥🐥🐥🐥 한국원화 원금에 마진 30% 적용
            재고: '100',
            상태: '판매중',
            등록일: new Date().toLocaleDateString('ko-KR'),
            설명: 원본상품.제목 || '상품 설명',
            이미지: 원본상품.이미지URL || '',
            // 🐥🐥🐥🐥🐥 원본 데이터 보존
            원본데이터: {
                제목: 원본상품.제목,
                가격: 원본상품.가격,
                한국어가격: 원본상품.한국어가격,
                이미지URL: 원본상품.이미지URL,
                판매정보: 원본상품.판매정보,
                라벨: 원본상품.라벨
            }
        };
        
        return 변환된상품;
    };
    
    // 🐥🐥🐥🐥🐥 선택된 상품들을 상품관리 페이지에 추가하는 함수 (기존 함수를 순서별 처리로 변경)
    const 선택된상품추가 = async () => {
        set이미지추출로딩(true);
        try {
            await 순서별상품처리();
        } catch (error) {
    
            alert('상품 처리 중 오류가 발생했습니다.');
        } finally {
            set이미지추출로딩(false);
        }
    };
    
    // 🐥🐥🐥🐥🐥 전체선택 처리 함수
    const 전체선택처리 = (선택됨) => {
        set전체선택(선택됨);
        if (선택됨) {
            // 모든 상품 선택
            const 모든상품ID = new Set(상품목록.map((_, index) => index));
            set선택된상품들(모든상품ID);
        } else {
            // 모든 상품 선택 해제
            set선택된상품들(new Set());
        }
    };
    
    // 🐥🐥🐥🐥🐥 개별 상품 선택 처리 함수
    const 개별상품선택처리 = (상품인덱스, 선택됨) => {
        const 새선택된상품들 = new Set(선택된상품들);
        if (선택됨) {
            새선택된상품들.add(상품인덱스);
        } else {
            새선택된상품들.delete(상품인덱스);
        }
        set선택된상품들(새선택된상품들);
        
        // 전체선택 상태 업데이트
        if (새선택된상품들.size === 상품목록.length) {
            set전체선택(true);
        } else {
            set전체선택(false);
        }
    };
    
    // 🐥🐥🐥🐥 사용자 ID 가져오기
    useEffect(() => {
        const 사용자확인 = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
                set사용자ID(user.email);
            }
        };
        사용자확인();
    }, []);

    // 🐥🐥🐥🐥🐥 팝업창이 열릴 때 검색 입력창에 포커스
    useEffect(() => {
        if (열림 && 검색기능 && 검색입력창Ref.current) {
            // 🐥🐥🐥🐥🐥 DOM이 완전히 렌더링된 후 포커스
            검색입력창Ref.current?.focus();
        }
    }, [열림, 검색기능]);

    // 🐥🐥🐥🐥🐥 팝업창 상태 초기화 함수
    const 팝업창초기화 = () => {
        set검색어('');
        set상품목록([]);
        set로딩중(false);
        set에러('');
        set현재페이지(1);
        set더보기로딩(false);
        set더보기완료(false);
        set검색실행이_완료되었는지(false);
        set전체선택(false);
        set선택된상품들(new Set());
        set이미지추출로딩(false);
        set진행상황({
            현재: 0,
            전체: 0,
            메시지: ''
        });
    };

    // 🐥🐥🐥🐥🐥 브라우저 정리 함수
    const 브라우저정리 = async () => {
        try {
            if (window.electronAPI && window.electronAPI.cleanupBrowsers) {
                const 결과 = await window.electronAPI.cleanupBrowsers();
                if (결과.success) {
                    console.log('✅ 팝업창 닫기 시 브라우저 정리 완료');
                } else {
                    console.log('⚠️ 팝업창 닫기 시 브라우저 정리 실패:', 결과.message);
                }
            }
        } catch (error) {
            console.error('❌ 브라우저 정리 중 오류:', error);
        }
    };

    // 🐥🐥🐥🐥🐥 팝업창 닫기 함수 (브라우저 정리 포함) - 실제 닫기 동작에서만 사용
    const 팝업창닫기 = async () => {
        await 브라우저정리();
        팝업창초기화();
        닫기();
    };

    // 🐥🐥🐥🐥🐥 ESC 키로 팝업 닫기
    useEffect(() => {
        const esc키처리 = (event) => {
            if (event.key === 'Escape' && 열림) {
                팝업창닫기();
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
    const 검색실행 = async (페이지 = 1) => {
        if (!검색어.trim()) return;

        if (페이지 === 1) {
            set로딩중(true);
            // 🐥🐥🐥🐥🐥 기존 상품 목록을 초기화하지 않고 유지
            set현재페이지(1);
            set더보기완료(false);
            set검색실행이_완료되었는지(false);
        } else {
            set더보기로딩(true);
        }
        
        set에러('');

        try {
            // 🐥🐥🐥🐥 검색어를 URL로 변환 (페이지 번호 추가)
            const 검색URL = `https://www.cninsider.co.kr/mall/#/product?keywords=${encodeURIComponent(검색어)}&type=text&imageAddress=&searchDiff=1`;
            
            // 🐥🐥🐥🐥🐥 안전한 JSON 직렬화를 위한 데이터 준비
            const requestData = {
                url: 검색URL,
                page: 페이지,
                user_id: (사용자ID && typeof 사용자ID === 'string') ? 사용자ID : "anonymous"
            };
            
            // 🐥🐥🐥🐥🐥 Electron API 사용
            let data;
            if (window.electronAPI) {
                data = await window.electronAPI.parseProducts(requestData);
            } else {
                throw new Error('Electron API가 사용할 수 없습니다. Electron 앱에서 실행해주세요.');
            }
            
            if (data.success) {
                if (페이지 === 1) {
                    set상품목록(data.products);
                    set검색실행이_완료되었는지(true);
                } else {
                    // 🐥🐥🐥🐥🐥 중복 제거 로직 추가
                    set상품목록(prev => {
                        const 기존상품들 = prev.map(item => item.제목 + item.이미지URL);
                        const 새로운상품들 = data.products.filter(item => 
                            !기존상품들.includes(item.제목 + item.이미지URL)
                        );
                        return [...prev, ...새로운상품들];
                    });
                }
                
                // 🐥🐥🐥🐥🐥 더보기 완료 체크 (상품이 없거나 중복만 있는 경우)
                if (data.products.length === 0) {
                    set더보기완료(true);
                }
            } else {
                set에러('상품 정보를 불러오는데 실패했습니다.');
                set검색실행이_완료되었는지(true);
            }
        } catch (error) {
            set에러('검색 중 오류가 발생했습니다.');
            set검색실행이_완료되었는지(true);
    
        } finally {
            set로딩중(false);
            set더보기로딩(false);
        }
    };





    // 🐥🐥🐥🐥🐥 엔터키로 검색 실행
    const 엔터키처리 = (event) => {
        if (event.key === 'Enter') {
            검색실행();
        }
    };

    // 🐥🐥🐥🐥🐥 팝업 크기 클래스 결정 (크기 증가)
    const 크기클래스 = {
        small: "max-w-md",
        medium: "max-w-6xl", 
        large: "max-w-7xl",
        full: "max-w-[95vw]"
    }[크기] || "max-w-6xl";

    // 🐥🐥🐥🐥🐥 배경 클릭 처리
    const 배경클릭처리 = (event) => {
        if (배경클릭닫기 && event.target === event.currentTarget) {
            팝업창닫기();
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
                            {제목 === "상품 검색 및 추가" ? "상품 검색" : 제목}
                        </h2>
                    </div>
                    {닫기버튼표시 && (
                        <button
                            onClick={() => {
                                팝업창닫기();
                            }}
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
                <div 
                    ref={팝업내용Ref}
                    className="p-6 max-h-[70vh] overflow-y-auto" 
                    style={{ backgroundColor: '#FAF9F5' }}
                >
                    {/* 🐥🐥🐥🐥🐥 검색창 (검색기능이 활성화된 경우에만 표시) */}
                    {검색기능 && (
                        <div className="mb-4">
                            <div className="relative flex-1">
                                <div className="!box-content flex flex-col bg-white mx-2 md:mx-0 items-stretch transition-all duration-200 relative cursor-text z-10 rounded-2xl border border-transparent shadow-[0_0.25rem_1.25rem_hsl(var(--always-black)/3.5%),0_0_0_0.5px_hsla(var(--border-300)/0.15)] hover:shadow-[0_0.25rem_1.25rem_hsl(var(--always-black)/3.5%),0_0_0_0.5px_hsla(var(--border-200)/0.3)] focus-within:shadow-[0_0.25rem_1.25rem_hsl(var(--always-black)/7.5%),0_0_0_0.5px_hsla(var(--border-200)/0.3)] hover:focus-within:shadow-[0_0.25rem_1.25rem_hsl(var(--always-black)/7.5%),0_0_0_0.5px_hsla(var(--border-200)/0.3)]">
                                    <div className="flex flex-col gap-3.5 m-3.5">
                                        <div className="relative">
                                            <div className="max-h-96 w-full overflow-y-auto font-large break-words transition-opacity duration-200 min-h-[2.5rem] pr-12">
                                                <input
                                                    ref={검색입력창Ref}
                                                    type="text"
                                                    value={검색어}
                                                    onChange={(e) => {
                                                        set검색어(e.target.value);
                                                        set검색실행이_완료되었는지(false);
                                                    }}
                                                    onKeyPress={엔터키처리}
                                                    placeholder="검색어를 입력하세요"
                                                    className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 resize-none text-base leading-6 focus:outline-none focus:ring-0"
                                                    style={{ minHeight: '1.5rem' }}
                                                    spellCheck="false"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* 🐥🐥🐥🐥🐥 검색 버튼 - 검색창 내부 우측하단에 배치 */}
                                    <div className="absolute bottom-2 right-2">
                                        <button 
                                            onClick={검색실행}
                                            disabled={로딩중 || !검색어.trim()}
                                            className={`inline-flex items-center justify-center relative shrink-0 can-focus select-none disabled:pointer-events-none disabled:shadow-none disabled:drop-shadow-none font-base-bold transition-all duration-200 h-8 w-8 rounded-md active:scale-95 !rounded-lg !h-8 !w-8 ${
                                                !검색어.trim() 
                                                    ? 'bg-accent-main-000 text-oncolor-100 opacity-50' 
                                                    : 'bg-accent-main-000 text-oncolor-100 hover:bg-accent-main-200'
                                            }`}
                                            type="button" 
                                            aria-label="검색 실행"
                                        >
                                            {로딩중 ? (
                                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                                    <path d="M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z"></path>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 🐥🐥🐥🐥🐥 전체선택 체크박스 */}
                    {검색기능 && 상품목록.length > 0 && (
                        <div className="flex items-center justify-end gap-2 mb-4">
                            <label className="select-none flex flex-row gap-2 cursor-pointer text-left shrink-0 items-center">
                                <span className="leading-none">전체 선택</span>
                                <input 
                                    type="checkbox" 
                                    checked={전체선택} 
                                    onChange={(e) => 전체선택처리(e.target.checked)} 
                                    className="sr-only peer"
                                />
                                <div className="shrink-0 w-5 h-5 flex items-center justify-center border rounded transition-colors duration-100 ease-in-out peer-focus-visible:ring-1 ring-offset-2 ring-offset-bg-300 ring-accent-main-100 bg-bg-000 cursor-pointer" style={{
                                    borderColor: '#BBBBBB',
                                    backgroundColor: 전체선택 ? '#5E92C6' : '#FFFFFF'
                                }}>
                                    {전체선택 && (
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </label>
                        </div>
                    )}



                    {/* 🐥🐥🐥🐥🐥 에러 메시지 */}
                    {에러 && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{에러}</p>
                        </div>
                    )}

                                         {/* 🐥🐥🐥🐥🐥 상품 목록 */}
                     {상품목록.length > 0 && (
                         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                             {상품목록.map((상품, index) => (
                                 <div key={index} className="product-item bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200 relative group cursor-pointer" onClick={() => 개별상품선택처리(index, !선택된상품들.has(index))}>
                                     {/* 🐥🐥🐥🐥🐥 체크박스 - 우측상단에 배치 */}
                                     <div className="absolute top-2 right-2 z-10">
                                         <div data-state="closed">
                                             <label className="select-none flex flex-row gap-3 cursor-pointer text-left shrink-0 items-center" onClick={(e) => e.stopPropagation()}>
                                                 <input 
                                                     type="checkbox" 
                                                     checked={선택된상품들.has(index)}
                                                     onChange={(e) => 개별상품선택처리(index, e.target.checked)}
                                                     className="sr-only peer" 
                                                 />
                                                 <div className="shrink-0 w-5 h-5 flex items-center justify-center border rounded transition-colors duration-100 ease-in-out peer-focus-visible:ring-1 ring-offset-2 ring-offset-bg-300 ring-accent-main-100 bg-bg-000 cursor-pointer" style={{
                                                     borderColor: '#BBBBBB',
                                                     backgroundColor: 선택된상품들.has(index) ? '#5E92C6' : '#FFFFFF'
                                                 }}>
                                                     {선택된상품들.has(index) && (
                                                         <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                         </svg>
                                                     )}
                                                 </div>
                                                 <span className="leading-none sr-only">상품 선택</span>
                                             </label>
                                         </div>
                                     </div>
                                     
                                     {/* 🐥🐥🐥🐥🐥 상품 이미지 */}
                                     <div className="relative h-48 bg-gray-100">
                                         {상품.이미지URL && !상품.이미지URL.startsWith('data:') ? (
                                             <img 
                                                 src={상품.이미지URL} 
                                                 alt={상품.제목} 
                                                 className="w-full h-full object-cover"
                                                 onError={(e) => {
                                                     e.target.style.display = 'none';
                                                 }}
                                             />
                                         ) : null}
                                     </div>
                                     
                                     {/* 🐥🐥🐥🐥🐥 상품 정보 */}
                                     <div className="p-4">
                                         {/* 🐥🐥🐥🐥🐥 제목 */}
                                         <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2" title={상품.제목}>
                                             {상품.제목}
                                         </h3>
                                         
                                         {/* 🐥🐥🐥🐥🐥 가격 정보 */}
                                         <div className="flex items-center gap-2 mb-2">
                                             <span className="text-lg font-bold text-red-600">{상품.가격}</span>
                                             <span className="text-sm text-gray-600">{상품.한국어가격}</span>
                                         </div>
                                         
                                         {/* 🐥🐥🐥🐥🐥 판매 정보 */}
                                         {상품.판매정보 && (
                                             <div className="text-xs text-gray-500">
                                                 {상품.판매정보}
                                             </div>
                                         )}
                                     </div>
                                 </div>
                             ))}
                             
                             {/* 🐥🐥🐥🐥🐥 더보기 로딩 */}
                             {더보기로딩 && (
                                 <div className="col-span-full flex justify-center py-6 bg-gray-50 rounded-lg border border-gray-200 mx-4">
                                     <div className="flex items-center gap-3">
                                         <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24" style={{ color: '#5E92C6' }}>
                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                         </svg>
                                         <span className="text-sm font-medium" style={{ color: '#5E92C6' }}>더 많은 상품을 불러오는 중...</span>
                                     </div>
                                 </div>
                             )}
                             
                             {/* 🐥🐥🐥🐥🐥 더보기 완료 */}
                             {더보기완료 && (
                                 <div className="col-span-full text-center py-6">
                                     <span className="text-sm text-gray-500">더 이상 상품이 없습니다.</span>
                                 </div>
                             )}
                         </div>
                     )}
                     
                     {/* 🐥🐥🐥🐥🐥 검색 결과 없음 */}
                     {!로딩중 && 상품목록.length === 0 && 검색어 && 검색실행이_완료되었는지 && (
                         <div className="text-center py-8">
                             <div className="text-gray-400 mb-2">
                                 <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                 </svg>
                             </div>
                             <p className="text-gray-500">"{검색어}"에 대한 검색 결과가 없습니다.</p>
                             <p className="text-sm text-gray-400 mt-1">다른 검색어를 시도해보세요.</p>
                         </div>
                     )}

                    {/* 🐥🐥🐥🐥🐥 기존 자식 컴포넌트 */}
                    {자식}
                </div>

                {/* 🐥🐥🐥🐥🐥 하단 액션 버튼 영역 - 선택된 상품 추가 기능 */}
                {검색기능 && (
                    <div className={`flex items-center p-6 border-t border-gray-100 bg-gray-50 ${이미지추출로딩 && 진행상황.전체 > 0 ? 'justify-between gap-9' : 'justify-end'}`}>
                        {/* 🐥🐥🐥🐥🐥 진행 상황 표시 - 왼쪽에 배치 */}
                        {이미지추출로딩 && 진행상황.전체 > 0 && (
                            <div className="flex-1 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg min-w-0">
                                <div className="flex items-center justify-between mb-1 min-w-0">
                                    <span className="text-sm font-medium text-gray-600 truncate flex-1 min-w-0">
                                        {진행상황.메시지}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                                        {진행상황.현재}/{진행상황.전체}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="h-2 rounded-full transition-all duration-300"
                                        style={{ 
                                            width: `${(진행상황.현재 / 진행상황.전체) * 100}%`,
                                            backgroundColor: '#5E92C6'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        )}
                        
                        {/* 🐥🐥🐥🐥🐥 버튼들 - 오른쪽에 배치 */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    팝업창닫기();
                                }}
                                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                취소
                            </button>
                            <button 
                                onClick={선택된상품추가}
                                disabled={선택된상품들.size === 0 || 이미지추출로딩}
                                className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" 
                            >
                                {이미지추출로딩 ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        가져오는 중...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        상품 추가 ({선택된상품들.size})
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default 팝업창;
