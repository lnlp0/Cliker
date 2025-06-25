import React, { useEffect, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, ArrowUpRight } from 'lucide-react';

/**
 * 클리커 메인 컴포넌트
 * - 화면 중앙의 버튼을 클릭하여 돈을 벌 수 있는 기능 제공
 * - 자동 수익 발생 기능 포함
 * - 애니메이션 효과가 있는 UI 제공
 */
const Clicker = () => {
  // 전역 상태 및 디스패치 함수 가져오기
  const { state, dispatch } = useApp();
  const { user, clickLevel, autoLevel } = state;
  
  // 클릭 시 표시될 수익 애니메이션을 위한 상태
  const [clickEarnings, setClickEarnings] = useState([]);
  
  /**
   * 클릭 이벤트 핸들러
   * - 클릭 시 수익을 증가시키고 애니메이션 효과를 생성
   * @param {Object} e - 클릭 이벤트 객체
   */
  const handleClick = (e) => {
    // 클릭 수익 증가 액션 디스패치
    dispatch({ type: 'EARN_CLICK' });
    
    // 클릭한 위치 계산 (클릭 가능 영역 기준)
    const rect = e.currentTarget.getBoundingClientRect();
    const baseX = e.clientX - rect.left; // 요소 내부의 X 좌표
    const baseY = e.clientY - rect.top;  // 요소 내부의 Y 좌표
    
    // 클릭 위치 주변에 랜덤 오프셋 생성 (-30px ~ 30px)
    const randomOffsetX = (Math.random() - 0.5) * 60;
    const randomOffsetY = (Math.random() - 0.5) * 60;
    
    // 새로운 수익 표시기 생성 (클릭 위치 주변에 랜덤하게 배치)
    const newEarning = {
      id: Date.now(),         // 고유 ID (타임스탬프 사용)
      amount: clickLevel,     // 클릭당 수익 금액
      x: baseX + randomOffsetX, // X 위치 (클릭 위치 + 랜덤 오프셋)
      y: baseY + randomOffsetY, // Y 위치 (클릭 위치 + 랜덤 오프셋)
    };
    
    // 수익 표시기 목록에 추가
    setClickEarnings(prev => [...prev, newEarning]);
    
    // 애니메이션 종료 후 수익 표시기 제거 (1초 후)
    setTimeout(() => {
      setClickEarnings(prev => prev.filter(earning => earning.id !== newEarning.id));
    }, 1000);
  };

  /**
   * 자동 수익 발생 효과
   * - autoLevel이 0보다 클 때 1초마다 자동으로 수익 발생
   */
  useEffect(() => {
    if (autoLevel > 0) {
      // 1초마다 자동 수익 발생
      const interval = setInterval(() => {
        dispatch({ type: 'EARN_AUTO' });
      }, 1000);
      
      // 컴포넌트 언마운트 시 인터벌 정리
      return () => clearInterval(interval);
    }
  }, [autoLevel, dispatch]);

  /**
   * 숫자 포맷팅 함수
   * - 3자리마다 콤마를 추가하여 문자열로 변환
   * @param {number} num - 포맷팅할 숫자
   * @returns {string} 포맷팅된 문자열
   */
  const formatNumber = (num) => num.toLocaleString();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cliker!</h1>
          <p className="text-lg text-gray-600">버튼을 클릭해서 돈을 벌고, 강화해서 더 많이 벌어보세요!</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Clicker Area */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
            <div className="relative w-full max-w-md h-64 mb-8">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-full h-full bg-transparent focus:outline-none relative"
                onClick={handleClick}
                aria-label="클릭해서 돈 벌기"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-contain bg-no-repeat bg-center"
                       style={{
                         backgroundImage: 'url(/click-btn.png)',
                         backgroundSize: 'contain',
                         backgroundPosition: 'center',
                         backgroundRepeat: 'no-repeat',
                       }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      {/* No text on the button */}
                    </div>
                  </div>
                </div>
                
                {/* 클릭 효과 애니메이션 */}
                <AnimatePresence>
                  {clickEarnings.map(earning => (
                    <motion.div
                      key={earning.id}
                      className="absolute text-green-500 font-bold text-2xl pointer-events-none whitespace-nowrap"
                      style={{
                        left: `${earning.x}px`,  // X 위치 설정
                        top: `${earning.y}px`,    // Y 위치 설정
                      }}
                      // 초기 상태
                      initial={{ 
                        y: 0,  // 시작 Y 위치
                        opacity: 1,  // 시작 투명도
                        scale: 1,    // 시작 크기
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'  // 텍스트 그림자
                      }}
                      // 애니메이션 종료 상태
                      animate={{ 
                        y: -80,  // 위로 80px 이동
                        opacity: 0,  // 서서히 사라짐
                        scale: 1.8,  // 크기 증가
                        textShadow: '0 0 20px rgba(255, 255, 255, 1)'  // 그림자 강조
                      }}
                      // 전환 효과 설정
                      transition={{ 
                        duration: 1.2,  // 애니메이션 지속 시간 (1.2초)
                        ease: "easeOut"  // 감속하는 이징 효과
                      }}
                    >
                      +{formatNumber(earning.amount)}원  {/* 획득 금액 표시 */}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.button>
            </div>
            
            <div className="w-full max-w-md bg-gray-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-gray-700">자동 수익</span>
                </div>
                <span className="text-lg font-semibold text-blue-600">
                  {formatNumber(autoLevel)}원/초
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
          
          {/* Stats Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">현재 상태</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">보유 금액</span>
                  <span className="text-2xl font-bold text-gray-900">{formatNumber(user.balance)}원</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                    style={{ width: `${Math.min(100, (user.balance / 1000000) * 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                    <span>클릭당 수익</span>
                  </div>
                  <span className="font-semibold text-blue-700">
                    {formatNumber(clickLevel)}원
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-green-500 mr-2" />
                    <span>초당 자동 수익</span>
                  </div>
                  <span className="font-semibold text-green-700">
                    {formatNumber(autoLevel)}원
                  </span>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="flex items-center text-purple-700 mb-2">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">팁</span>
                </div>
                <p className="text-sm text-purple-600">
                  강화 상점에서 클릭과 자동 수익을 업그레이드할 수 있어요!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clicker; 