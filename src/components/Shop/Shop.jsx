import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Zap, Clock, ArrowUp, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const Shop = () => {
  const { state, dispatch } = useApp();
  const { clickLevel, autoLevel, user } = state;
  const [selectedUpgrade, setSelectedUpgrade] = useState('click');
  const [showModal, setShowModal] = useState(false);
  
  const clickUpgradeCost = clickLevel * clickLevel * 10;
  const autoUpgradeCost = (autoLevel + 1) * (autoLevel + 1) * 50;
  const andingCost = 100000;

  const upgrades = [
    {
      id: 'click',
      name: '클릭 강화',
      icon: Zap,
      currentLevel: clickLevel,
      currentBonus: `${clickLevel}원`, 
      nextBonus: `${clickLevel + 1}원`,
      cost: clickUpgradeCost,
      action: 'CLICK_UPGRADE',
      description: '클릭당 획득 금액이 증가합니다.',
      color: 'from-blue-500 to-blue-600',
      iconColor: 'text-yellow-400'
    },
    {
      id: 'auto',
      name: '자동 수익',
      icon: Clock,
      currentLevel: autoLevel,
      currentBonus: `${autoLevel}원/초`,
      nextBonus: `${autoLevel + 1}원/초`,
      cost: autoUpgradeCost,
      action: 'AUTO_UPGRADE',
      description: '초당 자동으로 금액을 획득합니다.',
      color: 'from-green-500 to-green-600',
      iconColor: 'text-blue-400'
    },
    {
      id: 'anding',
      name: '???',
      icon: Zap,
      currentLevel: autoLevel,
      currentBonus: `???`,
      nextBonus: `???`,
      cost: andingCost,
      action: 'ANDING_PURCHASE',
      description: '???',
      color: 'from-purple-500 to-pink-600',
      iconColor: 'text-yellow-400'
    }
  ];

  const handleUpgrade = (upgrade) => {
    if (user.balance >= upgrade.cost) {
      if (upgrade.id === 'anding') {
        setShowModal(true);
      } else {
        dispatch({ type: upgrade.action });
      }
    }
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_GAME' });
    setShowModal(false);
  };

  const handleContinue = () => {
    dispatch({ type: 'ANDING_PURCHASE' });
    setShowModal(false);
  };

  return (
    <div className="relative">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">강화 상점</h1>
          <p className="text-gray-600 mt-2">강화를 통해 더 많은 수익을 올려보세요!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upgrades.map((upgrade) => {
            const Icon = upgrade.icon;
            const isDisabled = user.balance < upgrade.cost;
            
            return (
              <div 
                key={upgrade.id}
                onClick={() => setSelectedUpgrade(upgrade.id)}
                className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-[1.02] cursor-pointer ${
                  selectedUpgrade === upgrade.id
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-white'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full bg-gradient-to-br ${upgrade.color} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{upgrade.name}</h3>
                    <p className="text-sm text-gray-500">Lv. {upgrade.currentLevel}</p>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">현재 보너스:</span>
                    <span className="font-medium">{upgrade.currentBonus}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">다음 레벨 보너스:</span>
                    <span className="font-medium text-green-600 flex items-center">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      {upgrade.nextBonus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">강화 비용:</span>
                    <span className={`font-medium ${isDisabled ? 'text-red-500' : 'text-blue-600'}`}>
                      {upgrade.cost.toLocaleString()}원
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpgrade(upgrade);
                  }}
                  disabled={isDisabled}
                  className={`mt-6 w-full py-3 rounded-lg font-medium transition-colors ${
                    isDisabled 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : `bg-gradient-to-r ${upgrade.color} hover:opacity-90 text-white`
                  }`}
                >
                  {isDisabled ? '잔액 부족' : '강화하기'}
                </button>
                
                <p className="mt-3 text-xs text-gray-400 text-center">
                  {upgrade.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold text-center mb-4">축하합니다! 🎉</h3>
            <p className="text-gray-700 mb-6 text-center whitespace-pre-line">
              ??? 아이템을 성공적으로 구매하셨습니다!
              게임을 초기화하시겠습니까?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleReset}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                초기화하기
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                계속하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shop;