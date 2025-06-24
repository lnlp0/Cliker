import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Play, Plus, Minus } from 'lucide-react';

const Blackjack = () => {
  const { state, dispatch } = useApp();
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [betAmount, setBetAmount] = useState(10);
  const [gameStatus, setGameStatus] = useState('betting'); // betting, playing, dealer, finished
  const [gameResult, setGameResult] = useState('');
  const [dealerHidden, setDealerHidden] = useState(true);

  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const createDeck = () => {
    const deck = [];
    suits.forEach(suit => {
      ranks.forEach(rank => {
        deck.push({ suit, rank });
      });
    });
    return deck.sort(() => Math.random() - 0.5);
  };

  const getCardValue = (cards) => {
    let value = 0;
    let aces = 0;
    
    cards.forEach(card => {
      if (card.rank === 'A') {
        aces++;
        value += 11;
      } else if (['J', 'Q', 'K'].includes(card.rank)) {
        value += 10;
      } else {
        value += parseInt(card.rank);
      }
    });
    
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    
    return value;
  };

  const dealInitialCards = () => {
    const deck = createDeck();
    const newPlayerCards = [deck[0], deck[2]];
    const newDealerCards = [deck[1], deck[3]];
    
    setPlayerCards(newPlayerCards);
    setDealerCards(newDealerCards);
    setGameStatus('playing');
    setGameResult('');
    setDealerHidden(true);
    
    // Check for blackjack
    if (getCardValue(newPlayerCards) === 21) {
      if (getCardValue(newDealerCards) === 21) {
        endGame('push');
      } else {
        endGame('blackjack');
      }
    }
  };

  const hit = () => {
    const deck = createDeck();
    const newCard = deck[0];
    const newPlayerCards = [...playerCards, newCard];
    setPlayerCards(newPlayerCards);
    
    if (getCardValue(newPlayerCards) > 21) {
      endGame('bust');
    }
  };

  const stand = () => {
    setGameStatus('dealer');
    setDealerHidden(false);
    
    let newDealerCards = [...dealerCards];
    const deck = createDeck();
    let deckIndex = 0;
    
    while (getCardValue(newDealerCards) < 17) {
      newDealerCards.push(deck[deckIndex]);
      deckIndex++;
    }
    
    setDealerCards(newDealerCards);
    
    setTimeout(() => {
      const playerValue = getCardValue(playerCards);
      const dealerValue = getCardValue(newDealerCards);
      
      if (dealerValue > 21) {
        endGame('dealer-bust');
      } else if (playerValue > dealerValue) {
        endGame('win');
      } else if (playerValue < dealerValue) {
        endGame('lose');
      } else {
        endGame('push');
      }
    }, 1000);
  };

  const endGame = (result) => {
    setGameStatus('finished');
    setGameResult(result);
    
    let winAmount = 0;
    let won = false;
    
    switch (result) {
      case 'blackjack':
        winAmount = betAmount * 2.5;
        won = true;
        break;
      case 'win':
      case 'dealer-bust':
        winAmount = betAmount * 2;
        won = true;
        break;
      case 'push':
        winAmount = betAmount;
        won = true;
        break;
      case 'lose':
      case 'bust':
        winAmount = 0;
        won = false;
        break;
    }
    
    dispatch({
      type: 'CASINO_BET',
      payload: {
        amount: betAmount,
        won,
        winAmount
      }
    });
  };

  const newGame = () => {
    setPlayerCards([]);
    setDealerCards([]);
    setGameStatus('betting');
    setGameResult('');
    setDealerHidden(true);
  };

  const Card = ({ card, hidden = false }) => (
    <div className="w-16 h-24 bg-white border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center text-lg font-bold shadow-md">
      {hidden ? (
        <div className="w-full h-full bg-blue-600 rounded-md"></div>
      ) : (
        <>
          <div className={card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'}>
            {card.rank}
          </div>
          <div className={card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'}>
            {card.suit}
          </div>
        </>
      )}
    </div>
  );

  const getResultMessage = () => {
    switch (gameResult) {
      case 'blackjack': return 'Blackjack! You win!';
      case 'win': return 'You win!';
      case 'lose': return 'You lose!';
      case 'bust': return 'Bust! You lose!';
      case 'dealer-bust': return 'Dealer bust! You win!';
      case 'push': return 'Push! Tie game!';
      default: return '';
    }
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">블랙잭</h3>
        <p className="text-gray-600">21에 가까워지세요!</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Dealer's Hand */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4">
            딜러의 카드 {!dealerHidden && `(${getCardValue(dealerCards)})`}
          </h4>
          <div className="flex space-x-2 justify-center">
            {dealerCards.map((card, index) => (
              <Card key={index} card={card} hidden={index === 1 && dealerHidden} />
            ))}
          </div>
        </div>

        {/* Player's Hand */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4">
            나의 카드 ({getCardValue(playerCards)})
          </h4>
          <div className="flex space-x-2 justify-center">
            {playerCards.map((card, index) => (
              <Card key={index} card={card} />
            ))}
          </div>
        </div>

        {/* Game Controls */}
        <div className="text-center space-y-4">
          {gameStatus === 'betting' && (
            <div className="space-y-4">
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">배팅 금액: {betAmount.toLocaleString()}원</label>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setBetAmount(prev => Math.max(10, prev - 10))}
                    className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
                    disabled={gameStatus !== 'betting'}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-20 text-center">
                    {betAmount.toLocaleString()}원
                  </div>
                  <button
                    onClick={() => setBetAmount(prev => prev + 10)}
                    className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
                    disabled={gameStatus !== 'betting'}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={dealInitialCards}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  disabled={gameStatus !== 'betting'}
                >
                  Deal Cards
                </button>
              </div>
            </div>
          )}

          {gameStatus === 'playing' && (
            <div className="space-x-4">
              <button
                onClick={hit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Hit
              </button>
              <button
                onClick={stand}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Stand
              </button>
            </div>
          )}

          {gameStatus === 'dealer' && (
            <p className="text-lg font-semibold">딜러가 카드를 뽑는 중입니다...</p>
          )}

          {gameStatus === 'finished' && (
            <div className="space-y-4">
              <p className="text-xl font-bold">{getResultMessage()}</p>
              {gameResult === 'blackjack' && (
                <p className="text-green-600 font-semibold">{(betAmount * 2.5).toLocaleString()}원을 획득하셨습니다!</p>
              )}
              {(gameResult === 'win' || gameResult === 'dealer-bust') && (
                <p className="text-green-600 font-semibold">{(betAmount * 2).toLocaleString()}원을 획득하셨습니다!</p>
              )}
              <button
                onClick={newGame}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                새 게임
              </button>
            </div>
          )}
        </div>

        {/* Rules */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <h4 className="font-semibold mb-2">게임 규칙:</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• 21에 가까워지되 넘기지 마세요</li>
            <li>• 에이스는 1 또는 11, 그림카드는 10으로 계산</li>
            <li>• 딜러는 16 이하면 무조건 힛, 17 이상이면 스탠드</li>
            <li>• 블랙잭(처음 2장으로 21) 시 2.5배 지급</li>
            <li>• 일반 승리 시 2배 지급</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Blackjack;