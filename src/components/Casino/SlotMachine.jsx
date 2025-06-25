import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Play, Coins } from 'lucide-react';

// 슬롯 머신 게임 컴포넌트
const SlotMachine = () => {
  // 전역 상태 및 디스패치 함수 가져오기
  const { state, dispatch } = useApp();
  
  // 컴포넌트 상태 관리
  const [reels, setReels] = useState(['🍒', '🍒', '🍒']);  // 릴에 표시될 심볼들
  const [isSpinning, setIsSpinning] = useState(false);    // 회전 중인지 여부
  const [betAmount, setBetAmount] = useState(10);         // 배팅 금액
  const [lastWin, setLastWin] = useState(0);              // 마지막으로 획득한 상금

  // 슬롯 머신에 사용될 심볼들
  const symbols = ['🍒', '🍋', '🔔', '⭐', '💎', '🍇', '🎰'];
  
  // 당첨 조합별 상금 배율 (베팅 금액 대비)
  const payouts = {
    '🍒🍒🍒': 50,   // 체리 3개
    '🍋🍋🍋': 30,   // 레몬 3개
    '🔔🔔🔔': 100,  // 벨 3개
    '⭐⭐⭐': 200,    // 별 3개
    '💎💎💎': 500,  // 다이아몬드 3개
    '🍇🍇🍇': 75,   // 포도 3개
    '🎰🎰🎰': 1000, // 슬롯머신 3개 (잭팟)
    'any_two': 5     // 아무 심볼 2개 일치 (보너스)
  };

  // 슬롯 머신을 회전시키는 함수
  const spin = () => {
    // 잔고 부족이거나 이미 회전 중이면 실행하지 않음
    if (betAmount > state.user.balance || isSpinning) return;

    // 회전 시작 상태로 설정
    setIsSpinning(true);
    setLastWin(0);

    // 회전 애니메이션을 위한 설정
    const spinDuration = 2000;  // 총 회전 시간 (2초)
    const spinInterval = 100;   // 회전 간격 (0.1초)
    
    // 회전 애니메이션을 위한 인터벌 설정
    const interval = setInterval(() => {
      // 랜덤한 심볼로 릴 업데이트 (애니메이션 효과)
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
    }, spinInterval);

    // 회전 종료 후 처리
    setTimeout(() => {
      clearInterval(interval);  // 애니메이션 정지
      
      // 최종 결과 심볼 결정
      const finalReels = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ];
      
      // 릴을 최종 결과로 업데이트
      setReels(finalReels);
      
      // 당첨 금액 계산
      const reelString = finalReels.join('');
      let winAmount = 0;
      
      // 당첨 조합 확인
      if (payouts[reelString]) {
        // 3개 일치 시 당첨
        winAmount = payouts[reelString] * betAmount / 10;
      } else if (
        finalReels[0] === finalReels[1] || 
        finalReels[1] === finalReels[2] || 
        finalReels[0] === finalReels[2]
      ) {
        // 2개 일치 시 당첨 (보너스)
        winAmount = payouts.any_two * betAmount / 10;
      }
      
      // 당첨 금액 설정
      setLastWin(winAmount);
      
      // 전역 상태 업데이트 (배팅 결과 반영)
      dispatch({
        type: 'CASINO_BET',
        payload: {
          amount: betAmount,    // 배팅 금액
          won: winAmount > 0,   // 승리 여부
          winAmount: winAmount  // 획득 금액
        }
      });
      
      // 회전 종료 상태로 설정
      setIsSpinning(false);
    }, spinDuration);
  };

  return (
    <div className="p-4">
      {/* 게임 제목 및 설명 */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">슬롯 머신</h2>
        <p className="text-gray-600">심볼을 맞춰 큰 상금을 획득하세요!</p>
      </div>
      
      {/* 슬롯 머신 메인 컨테이너 */}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-yellow-500 p-6">
          {/* 릴 디스플레이 영역 */}
          <div className="bg-black p-4 rounded-lg mb-4">
            <div className="grid grid-cols-3 gap-3">
              {reels.map((symbol, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg h-24 flex items-center justify-center text-5xl"
                >
                  {symbol}
                </div>
              ))}
            </div>
          </div>
          
          {/* 배팅 컨트롤 패널 */}
          <div className="bg-white p-4 rounded-lg mb-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">배팅 금액</label>
              {/* 배팅 금액 조절 버튼 */}
              <div className="flex items-center">
                <button
                  onClick={() => setBetAmount(prev => Math.max(10, prev - 10))}
                  className="px-3 py-1 bg-gray-200 rounded-l-md hover:bg-gray-300 transition-colors"
                  disabled={isSpinning}
                >
                  -
                </button>
                <div className="flex-1 text-center px-4 py-2 bg-gray-100">
                  ${betAmount}
                </div>
                <button
                  onClick={() => setBetAmount(prev => prev + 10)}
                  className="px-3 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300 transition-colors"
                  disabled={isSpinning}
                >
                  +
                </button>
              </div>
              {/* 현재 보유 금액 표시 */}
              <p className="text-xs text-gray-500 mt-1">
                보유 금액: ${state.user.balance.toLocaleString()}
              </p>
            </div>
            
            {/* 스핀 버튼 */}
            <button
              onClick={spin}
              disabled={isSpinning || betAmount > state.user.balance}
              className={`w-full py-3 rounded-md font-medium text-white ${
                isSpinning || betAmount > state.user.balance
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 transition-colors'
              }`}
            >
              {isSpinning ? '회전 중...' : '스핀'}
            </button>
          </div>
          
          {/* 당첨 메시지 */}
          {lastWin > 0 && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">축하합니다! </strong>
              <span className="block sm:inline">${lastWin.toLocaleString()}을(를) 획득하셨습니다! 🎉</span>
            </div>
          )}
          
          {/* 당첨금 테이블 */}
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-center">당첨 금액 ($10 기준)</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>🎰🎰🎰</span>
                <span className="font-medium">$1,000</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>💎💎💎</span>
                <span className="font-medium">$500</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>⭐⭐⭐</span>
                <span className="font-medium">$200</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>🔔🔔🔔</span>
                <span className="font-medium">$100</span>
              </div>
              <div className="col-span-2 flex justify-between p-2 bg-gray-50 rounded">
                <span>두 개 일치</span>
                <span className="font-medium">$5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;