import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import SlotMachine from './SlotMachine';
import Blackjack from './Blackjack';
import { Dice6, Coins } from 'lucide-react';

const Casino = () => {
  const { state } = useApp();
  const [selectedGame, setSelectedGame] = useState('slots');

  const games = [
    { id: 'slots', name: '슬롯 머신', icon: Dice6, description: '릴을 돌려서 큰 상금을 노려보세요!' },
    { id: 'blackjack', name: '블랙잭', icon: Coins, description: '딜러를 이기고 21에 도전하세요!' }
  ];

  const renderGame = () => {
    switch (selectedGame) {
      case 'slots':
        return <SlotMachine />;
      case 'blackjack':
        return <Blackjack />;
      default:
        return <SlotMachine />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">카지노</h1>
        <p className="text-gray-600 mt-2">다양한 게임으로 즐거운 시간을 보내보세요!</p>
      </div>

      <div className="flex flex-col items-center space-y-8">
        <div className="w-full max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game) => {
              const Icon = game.icon;
              return (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game.id)}
                  className={`p-6 rounded-lg border-2 transition-colors ${
                    selectedGame === game.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${
                    selectedGame === game.id ? 'text-red-600' : 'text-gray-600'
                  }`} />
                  <h3 className="font-semibold text-gray-900 mb-2">{game.name}</h3>
                  <p className="text-sm text-gray-500">{game.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {renderGame()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Casino;