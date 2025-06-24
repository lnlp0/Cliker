import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, HandMetal, Scissors } from 'lucide-react';

const choices = [
  { id: 'rock', name: '바위', icon: HandMetal, beats: 'scissors' },
  { id: 'paper', name: '보', icon: Hand, beats: 'rock' },
  { id: 'scissors', name: '가위', icon: Scissors, beats: 'paper' },
];

const RockPaperScissors = () => {
  const { state, dispatch } = useApp();
  const [playerChoice, setPlayerChoice] = useState(null);
  const [dealerChoice, setDealerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [betAmount, setBetAmount] = useState(10);
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);

  const playGame = (playerChoiceId) => {
    if (isAnimating || state.user.balance < betAmount) {
      return;
    }
    
    // Reset states
    setPlayerChoice(choices.find(c => c.id === playerChoiceId));
    setDealerChoice(null);
    setResult(null);
    setIsAnimating(true);
    
    // Dealer makes a random choice after a short delay
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * choices.length);
      const dealerChoice = choices[randomIndex];
      setDealerChoice(dealerChoice);
      
      // Determine the winner after showing dealer's choice
      setTimeout(() => {
        let gameResult;
        let winAmount = 0;
        
        if (playerChoiceId === dealerChoice.id) {
          gameResult = 'draw';
          winAmount = betAmount; // Return the bet amount
        } else if (choices.find(c => c.id === playerChoiceId).beats === dealerChoice.id) {
          gameResult = 'win';
          winAmount = betAmount * 2; // Double the bet amount
        } else {
          gameResult = 'lose';
          winAmount = 0;
        }
        
        setResult(gameResult);
        
        // Update balance
        dispatch({
          type: 'UPDATE_BALANCE',
          payload: winAmount - (gameResult === 'lose' ? betAmount : 0)
        });
        
        // Add transaction
        dispatch({
          type: 'ADD_TRANSACTION',
          payload: {
            id: Date.now(),
            type: gameResult === 'win' ? 'CASINO_WIN' : 'CASINO_BET',
            amount: gameResult === 'win' ? winAmount : -betAmount,
            description: `가위바위보 ${gameResult === 'win' ? '승리' : gameResult === 'lose' ? '패배' : '무승부'}: ${gameResult === 'win' ? '+' : ''}${gameResult === 'win' ? winAmount : betAmount}원`,
            timestamp: new Date().toISOString()
          }
        });
        
        // Add to game history
        setGameHistory(prev => [
          { player: playerChoiceId, dealer: dealerChoice.id, result: gameResult, timestamp: new Date() },
          ...prev.slice(0, 4)
        ]);
        
        setIsAnimating(false);
      }, 1000);
    }, 1500);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setDealerChoice(null);
    setResult(null);
  };

  const getResultMessage = () => {
    if (!result) return '';
    const messages = {
      win: '승리!',
      lose: '패배!',
      draw: '무승부!'
    };
    return messages[result];
  };

  const getResultColor = () => {
    if (!result) return '';
    const colors = {
      win: 'text-green-600',
      lose: 'text-red-600',
      draw: 'text-yellow-600'
    };
    return colors[result];
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">가위바위보</h2>
        <p className="text-gray-600">딜러와 대결하여 돈을 따보세요!</p>
        {result && (
          <div className={`mt-4 text-2xl font-bold ${getResultColor()}`}>
            {getResultMessage()}
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-center flex-1">
            <h3 className="text-lg font-semibold mb-2">플레이어</h3>
            <div className="h-24 flex items-center justify-center">
              {playerChoice ? (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <playerChoice.icon size={48} className="text-blue-600" />
                  <span className="mt-2 font-medium">{playerChoice.name}</span>
                </motion.div>
              ) : (
                <div className="text-gray-400">선택해주세요</div>
              )}
            </div>
          </div>
          
          <div className="text-center px-6">
            <div className="text-2xl font-bold mb-2">VS</div>
            <div className="h-8">
              {isAnimating && !dealerChoice && (
                <div className="text-gray-500 animate-pulse">딜러가 선택 중...</div>
              )}
            </div>
          </div>
          
          <div className="text-center flex-1">
            <h3 className="text-lg font-semibold mb-2">딜러</h3>
            <div className="h-24 flex items-center justify-center">
              {dealerChoice ? (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <dealerChoice.icon size={48} className="text-red-600" />
                  <span className="mt-2 font-medium">{dealerChoice.name}</span>
                </motion.div>
              ) : (
                <div className="text-gray-400">
                  {playerChoice && !dealerChoice ? (
                    <div className="animate-pulse">선택 중...</div>
                  ) : (
                    '?'
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-center space-x-4 mb-6">
          {choices.map((choice) => {
            const ChoiceIcon = choice.icon;
            return (
              <motion.button
                key={choice.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log('Button clicked:', choice.id);
                  playGame(choice.id);
                }}
                disabled={isAnimating}
                className={`p-4 rounded-xl flex flex-col items-center justify-center w-28 h-28 ${
                  isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                } border-2 ${
                  playerChoice?.id === choice.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <ChoiceIcon size={40} className="mb-2" />
                <span className="font-medium">{choice.name}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex justify-center mt-8">
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                배팅 금액
              </label>
              <div className="flex">
                <input
                  type="number"
                  min="10"
                  max={state.user.balance}
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={isAnimating}
                />
                <span className="inline-flex items-center px-3 rounded-r-md bg-gray-50 text-gray-500 text-sm">
                  원
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {[10, 50, 100, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setBetAmount(amount)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      betAmount === amount
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    disabled={isAnimating}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>보유 금액:</span>
                <span className="font-medium">{state.user.balance.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>배당률:</span>
                <span className="font-medium">2배 (승리 시 배팅금의 2배 지급)</span>
              </div>
            </div>
            
            {result && (
              <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-center font-medium">
                  {result === 'win' && '축하합니다! '}
                  {result === 'lose' && '아쉽네요! '}
                  {result === 'draw' && '비겼습니다! '}
                  {result !== 'draw' && (
                    <span className={result === 'win' ? 'text-green-600' : 'text-red-600'}>
                      {result === 'win' ? `+${betAmount}` : `-${betAmount}`}원
                    </span>
                  )}
                </p>
              </div>
            )}
            
            <div className="mt-6">
              <button
                onClick={resetGame}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
              >
                다시하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {gameHistory.length > 0 && (
        <div className="mt-12">
          <h3 className="text-lg font-semibold mb-3">최근 전적</h3>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">플레이어</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">딜러</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">결과</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시간</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {gameHistory.map((game, index) => {
                  const playerChoice = choices.find(c => c.id === game.player);
                  const dealerChoice = choices.find(c => c.id === game.dealer);
                  const resultColor = {
                    win: 'text-green-600',
                    lose: 'text-red-600',
                    draw: 'text-yellow-600'
                  }[game.result];
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {playerChoice && <playerChoice.icon className="mr-2" size={16} />}
                          <span>{playerChoice?.name || '-'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {dealerChoice && <dealerChoice.icon className="mr-2" size={16} />}
                          <span>{dealerChoice?.name || '-'}</span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 whitespace-nowrap font-medium ${resultColor}`}>
                        {game.result === 'win' ? '승리' : game.result === 'lose' ? '패배' : '무승부'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(game.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">게임 방법</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 가위, 바위, 보 중 하나를 선택하세요.</li>
          <li>• 배팅 금액을 설정하고 게임을 시작하세요.</li>
          <li>• 이기면 배팅금의 2배를 얻습니다.</li>
          <li>• 지면 배팅금을 잃습니다.</li>
          <li>• 비기면 배팅금이 반환됩니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default RockPaperScissors;
