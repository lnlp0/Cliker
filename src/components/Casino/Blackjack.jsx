import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Play, Plus, Minus } from 'lucide-react';

// 블랙잭 게임 컴포넌트
const Blackjack = () => {
  // 상태 관리
  const { state, dispatch } = useApp();
  const [playerCards, setPlayerCards] = useState([]);        // 플레이어 카드
  const [dealerCards, setDealerCards] = useState([]);        // 딜러 카드
  const [betAmount, setBetAmount] = useState(10);            // 배팅 금액
  const [gameStatus, setGameStatus] = useState('betting');   // 게임 상태 (betting, playing, dealer, finished)
  const [gameResult, setGameResult] = useState('');          // 게임 결과
  const [dealerHidden, setDealerHidden] = useState(true);    // 딜러의 두 번째 카드 숨김 여부

  // 카드 덱 생성에 사용될 무늬와 숫자
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  // 카드 덱을 생성하고 섞는 함수
  const createDeck = () => {
    const deck = [];
    // 모든 조합의 카드 생성
    suits.forEach(suit => {
      ranks.forEach(rank => {
        deck.push({ suit, rank });
      });
    });
    // 덱을 무작위로 섞음
    return deck.sort(() => Math.random() - 0.5);
  };

  // 카드의 점수를 계산하는 함수
  const getCardValue = (cards) => {
    let value = 0;       // 총 점수
    let aces = 0;         // 에이스 카드 수
    
    // 각 카드의 점수 계산
    cards.forEach(card => {
      if (card.rank === 'A') {
        aces++;           // 에이스 카드 수 증가
        value += 11;      // 일단 에이스를 11로 계산
      } else if (['J', 'Q', 'K'].includes(card.rank)) {
        value += 10;      // J, Q, K는 10점
      } else {
        value += parseInt(card.rank);  // 숫자 카드는 해당 숫자만큼 점수
      }
    });
    
    // 21점을 초과하고 에이스가 있으면 에이스를 1로 계산
    while (value > 21 && aces > 0) {
      value -= 10;  // 에이스 점수를 10 감소 (11 -> 1)
      aces--;       // 처리한 에이스 수 감소
    }
    
    return value;
  };

  // 초기 카드를 나누어주는 함수
  const dealInitialCards = () => {
    // 잔액 확인
    if (state.user.balance < betAmount) {
      alert('잔액이 부족합니다.');
      return;
    }
    
    // 새 덱 생성 및 카드 분배
    const deck = createDeck();
    const newPlayerCards = [deck[0], deck[2]];  // 플레이어 카드 2장
    const newDealerCards = [deck[1], deck[3]];  // 딜러 카드 2장 (한 장은 숨김)
    
    // 상태 업데이트
    setPlayerCards(newPlayerCards);
    setDealerCards(newDealerCards);
    setGameStatus('playing');  // 게임 상태를 플레이 중으로 변경
    setGameResult('');
    setDealerHidden(true);  // 딜러의 두 번째 카드 숨김
    
    // 블랙잭 확인 (에이스 + 10, J, Q, K)
    if (getCardValue(newPlayerCards) === 21) {
      // 플레이어와 딜러 모두 블랙잭인 경우 무승부
      if (getCardValue(newDealerCards) === 21) {
        endGame('push');
      } else {
        // 플레이어만 블랙잭인 경우 승리
        endGame('blackjack');
      }
    }
  };

  // 히트: 플레이어가 카드를 한 장 더 받음
  const hit = () => {
    const deck = createDeck();
    const newCard = deck[0];  // 덱에서 카드 한 장 뽑기
    const newPlayerCards = [...playerCards, newCard];  // 기존 카드에 새 카드 추가
    setPlayerCards(newPlayerCards);
    
    // 버스트 확인 (21점 초과)
    if (getCardValue(newPlayerCards) > 21) {
      endGame('bust');  // 버스트로 게임 종료
    }
  };

  // 스탠드: 플레이어의 턴 종료, 딜러의 턴 시작
  const stand = () => {
    setGameStatus('dealer');  // 딜러 턴으로 변경
    setDealerHidden(false);   // 딜러의 숨겨진 카드 공개
    
    let newDealerCards = [...dealerCards];
    const deck = createDeck();
    let deckIndex = 0;
    
    // 딜러는 17점 미만이면 계속 히트
    while (getCardValue(newDealerCards) < 17) {
      newDealerCards.push(deck[deckIndex]);
      deckIndex++;
    }
    
    setDealerCards(newDealerCards);
    
    // 딜러의 턴이 끝난 후 결과 확인 (1초 딜레이)
    setTimeout(() => {
      const playerValue = getCardValue(playerCards);
      const dealerValue = getCardValue(newDealerCards);
      
      // 게임 결과 결정
      if (dealerValue > 21) {
        endGame('dealer-bust');  // 딜러 버스트
      } else if (playerValue > dealerValue) {
        endGame('win');          // 플레이어 승리
      } else if (playerValue < dealerValue) {
        endGame('lose');         // 딜러 승리
      } else {
        endGame('push');          // 무승부
      }
    }, 1000);
  };

  // 게임 종료 처리 함수
  const endGame = (result) => {
    setGameStatus('finished');  // 게임 상태를 종료로 변경
    setGameResult(result);     // 게임 결과 설정
    
    let winAmount = 0;  // 획득 금액
    let won = false;      // 승패 여부
    
    // 결과에 따른 상금 계산
    switch (result) {
      case 'blackjack':   // 블랙잭 승리 (2.5배)
        winAmount = betAmount * 2.5;
        won = true;
        break;
      case 'win':         // 일반 승리 (2배)
      case 'dealer-bust': // 딜러 버스트 승리 (2배)
        winAmount = betAmount * 2;
        won = true;
        break;
      case 'push':        // 무승부 (베팅금 반환)
        winAmount = betAmount;
        won = true;
        break;
      case 'lose':        // 패배
      case 'bust':        // 버스트 패배
        winAmount = 0;
        won = false;
        break;
    }
    
    // 게임 결과를 전역 상태에 반영
    dispatch({
      type: 'CASINO_BET',
      payload: {
        amount: betAmount,  // 베팅 금액
        won,               // 승패 여부
        winAmount         // 획득 금액
      }
    });
  };

  // 새 게임을 시작하는 함수
  const newGame = () => {
    setPlayerCards([]);        // 플레이어 카드 초기화
    setDealerCards([]);        // 딜러 카드 초기화
    setGameStatus('betting');  // 게임 상태를 배팅 단계로 변경
    setGameResult('');         // 게임 결과 초기화
    setDealerHidden(true);     // 딜러의 두 번째 카드 다시 숨김
  };

  // 카드 컴포넌트
  const Card = ({ card, hidden = false }) => (
    <div className="w-16 h-24 bg-white border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center text-lg font-bold shadow-md">
      {hidden ? (
        // 숨겨진 카드 (딜러의 두 번째 카드)
        <div className="w-full h-full bg-blue-600 rounded-md"></div>
      ) : (
        // 공개된 카드
        <>
          {/* 카드 숫자/문자 (하트와 다이아몬드는 빨간색) */}
          <div className={card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'}>
            {card.rank}
          </div>
          {/* 카드 무늬 */}
          <div className={card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'}>
            {card.suit}
          </div>
        </>
      )}
    </div>
  );

  // 게임 결과에 따른 메시지를 반환하는 함수
  const getResultMessage = () => {
    switch (gameResult) {
      case 'blackjack': return '블랙잭! 승리하셨습니다!';
      case 'win': return '승리하셨습니다!';
      case 'lose': return '패배하셨습니다!';
      case 'bust': return '버스트! 패배하셨습니다!';
      case 'dealer-bust': return '딜러 버스트! 승리하셨습니다!';
      case 'push': return '무승부입니다!';
      default: return '';
    }
  };

  return (
    <div className="p-8">
      {/* 게임 제목 및 설명 */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">블랙잭</h3>
        <p className="text-gray-600">21에 가까워지세요!</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* 배팅 금액 조절 섹션 */}
        <div className="bg-gray-100 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-600">배팅 금액</p>
              <p className="text-xl font-bold">{betAmount.toLocaleString()}원</p>
            </div>
            {/* 배팅 금액 조절 버튼 */}
            <div className="flex space-x-2">
              <button
                onClick={() => setBetAmount(prev => Math.max(10, prev - 10))}
                className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
                disabled={gameStatus !== 'betting'}
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setBetAmount(prev => prev + 10)}
                className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
                disabled={gameStatus !== 'betting'}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* 배팅 금액 표시 바 */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* 딜러 카드 영역 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h4 className="text-lg font-semibold mb-4">딜러</h4>
          <div className="flex space-x-4 mb-4">
            {dealerCards.map((card, index) => (
              <Card 
                key={index} 
                card={card} 
                hidden={dealerHidden && index === 1}
              />
            ))}
          </div>
          {gameStatus !== 'betting' && (
            <p className="text-gray-700">
              점수: {getCardValue(dealerCards)}
            </p>
          )}
        </div>

        {/* 플레이어 카드 영역 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h4 className="text-lg font-semibold mb-4">플레이어</h4>
          <div className="flex space-x-4 mb-4">
            {playerCards.map((card, index) => (
              <Card key={index} card={card} />
            ))}
          </div>
          {playerCards.length > 0 && (
            <p className="text-gray-700">
              점수: {getCardValue(playerCards)}
            </p>
          )}
        </div>

        {/* 게임 컨트롤 버튼 */}
        <div className="space-y-4">
          {gameStatus === 'betting' ? (
            <button
              onClick={dealInitialCards}
              className={`w-full py-3 px-4 text-white rounded-lg font-medium transition-colors ${
                state.user.balance < betAmount || gameStatus !== 'betting'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={state.user.balance < betAmount || gameStatus !== 'betting'}
            >
              {state.user.balance < betAmount ? '잔액 부족' : '게임 시작'}
            </button>
          ) : gameStatus === 'playing' ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={hit}
                className="py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                히트 (카드 받기)
              </button>
              <button
                onClick={stand}
                className="py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                스탠드 (멈추기)
              </button>
            </div>
          ) : gameStatus === 'dealer' ? (
            <p className="text-lg font-semibold text-center py-4">딜러가 카드를 뽑는 중입니다...</p>
          ) : (
            <button
              onClick={newGame}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              새 게임
            </button>
          )}
        </div>

        {/* 게임 결과 메시지 */}
        {gameResult && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <p className="text-lg font-semibold text-yellow-800">{getResultMessage()}</p>
            {gameResult === 'blackjack' && (
              <p className="text-green-600 font-semibold">
                {(betAmount * 2.5).toLocaleString()}원을 획득하셨습니다!
              </p>
            )}
            {(gameResult === 'win' || gameResult === 'dealer-bust') && (
              <p className="text-green-600 font-semibold">
                {(betAmount * 2).toLocaleString()}원을 획득하셨습니다!
              </p>
            )}
            {gameResult === 'push' && (
              <p className="text-blue-600 font-semibold">
                {betAmount.toLocaleString()}원이 반환되었습니다.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blackjack;