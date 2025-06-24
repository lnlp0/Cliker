import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Play, Coins } from 'lucide-react';

const SlotMachine = () => {
  const { state, dispatch } = useApp();
  const [reels, setReels] = useState(['🍒', '🍒', '🍒']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [lastWin, setLastWin] = useState(0);

  const symbols = ['🍒', '🍋', '🔔', '⭐', '💎', '🍇', '🎰'];
  const payouts = {
    '🍒🍒🍒': 50,
    '🍋🍋🍋': 30,
    '🔔🔔🔔': 100,
    '⭐⭐⭐': 200,
    '💎💎💎': 500,
    '🍇🍇🍇': 75,
    '🎰🎰🎰': 1000,
    'any_two': 5
  };

  const spin = () => {
    if (betAmount > state.user.balance || isSpinning) return;

    setIsSpinning(true);
    setLastWin(0);

    // Simulate spinning animation
    const spinDuration = 2000;
    const interval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      
      // Final result
      const finalReels = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ];
      
      setReels(finalReels);
      
      // Calculate winnings
      const reelString = finalReels.join('');
      let winAmount = 0;
      
      if (payouts[reelString]) {
        winAmount = payouts[reelString] * betAmount / 10;
      } else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
        winAmount = payouts.any_two * betAmount / 10;
      }
      
      setLastWin(winAmount);
      
      dispatch({
        type: 'CASINO_BET',
        payload: {
          amount: betAmount,
          won: winAmount > 0,
          winAmount: winAmount
        }
      });
      
      setIsSpinning(false);
    }, spinDuration);
  };

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">슬롯 머신</h2>
        <p className="text-gray-600">심볼을 맞춰 큰 상금을 획득하세요!</p>
      </div>
      
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Slot Machine Display */}
        <div className="bg-yellow-500 p-6">
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
          
          {/* Bet Controls */}
          <div className="bg-white p-4 rounded-lg mb-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">배팅 금액</label>
              <div className="flex items-center">
                <button
                  onClick={() => setBetAmount(prev => Math.max(10, prev - 10))}
                  className="px-3 py-1 bg-gray-200 rounded-l-md"
                  disabled={isSpinning}
                >
                  -
                </button>
                <div className="flex-1 text-center px-4 py-2 bg-gray-100">
                  ${betAmount}
                </div>
                <button
                  onClick={() => setBetAmount(prev => prev + 10)}
                  className="px-3 py-1 bg-gray-200 rounded-r-md"
                  disabled={isSpinning}
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                보유 금액: ${state.user.balance.toLocaleString()}
              </p>
            </div>
            
            <button
              onClick={spin}
              disabled={isSpinning || betAmount > state.user.balance}
              className={`w-full py-3 rounded-md font-medium text-white ${
                isSpinning || betAmount > state.user.balance
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isSpinning ? '회전 중...' : '스핀'}
            </button>
          </div>
          
          {/* Win Message */}
          {lastWin > 0 && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">축하합니다! </strong>
              <span className="block sm:inline">${lastWin.toLocaleString()}을(를) 획득하셨습니다! 🎉</span>
            </div>
          )}
          
          {/* Payout Table */}
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