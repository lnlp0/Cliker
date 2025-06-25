import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Zap, Clock, ArrowUp, ArrowDownRight, ArrowUpRight } from 'lucide-react';

/**
 * 상점 컴포넌트
 * - 플레이어가 클릭 강화와 자동 수익 강화를 할 수 있는 상점 UI 제공
 * - 각 업그레이드 항목의 비용과 효과를 표시
 */
const Shop = () => {
  // 전역 상태 및 디스패치 함수 가져오기
  const { state, dispatch } = useApp();
  const { clickLevel, autoLevel, user } = state;
  
  // 로컬 상태 관리
  const [selectedUpgrade, setSelectedUpgrade] = useState('click');  // 선택된 업그레이드 항목 ID
  const [showModal, setShowModal] = useState(false);  // 모달 표시 여부
  
  // 업그레이드 비용 계산
  const clickUpgradeCost = clickLevel * clickLevel * 10;  // 클릭 강화 비용 (레벨^2 * 10)
  const autoUpgradeCost = (autoLevel + 1) * (autoLevel + 1) * 50;  // 자동 수익 강화 비용 (레벨^2 * 50)
  const andingCost = 100000;  // 특별 아이템 비용

  // 업그레이드 항목 목록
  const upgrades = [
    {
      id: 'click',  // 업그레이드 ID
      name: '클릭 강화',  // 업그레이드 이름
      icon: Zap,  // 아이콘 컴포넌트
      currentLevel: clickLevel,  // 현재 레벨
      currentBonus: `${clickLevel}원`,  // 현재 보너스
      nextBonus: `${clickLevel + 1}원`,  // 다음 레벨 보너스
      cost: clickUpgradeCost,  // 강화 비용
      action: 'CLICK_UPGRADE',  // 디스패치할 액션 타입
      description: '클릭당 획득 금액이 증가합니다.',  // 설명 텍스트
      color: 'from-blue-500 to-blue-600',  // 그라데이션 색상 클래스
      iconColor: 'text-yellow-400'  // 아이콘 색상 클래스
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
      name: '???',  // 숨겨진 아이템
      icon: Zap,
      currentLevel: autoLevel,
      currentBonus: `???`,  // 비공개 보너스
      nextBonus: `???`,  // 비공개 다음 레벨 보너스
      cost: andingCost,
      action: 'ANDING_PURCHASE',
      description: '???',  // 비공개 설명
      color: 'from-purple-500 to-pink-600',
      iconColor: 'text-yellow-400'
    }
  ];

  /**
   * 업그레이드 처리 함수
   * @param {Object} upgrade - 선택된 업그레이드 항목
   */
  const handleUpgrade = (upgrade) => {
    // 잔액이 충분한 경우에만 처리
    if (user.balance >= upgrade.cost) {
      if (upgrade.id === 'anding') {
        // '???' 아이템인 경우 확인 모달 표시
        setShowModal(true);
      } else {
        // 일반 업그레이드인 경우 즉시 처리
        dispatch({ type: upgrade.action });
      }
    }
  };

  /**
   * 게임 초기화 처리 함수
   */
  const handleReset = () => {
    // 게임 초기화 액션 디스패치
    dispatch({ type: 'RESET_GAME' });
    setShowModal(false);  // 모달 닫기
  };

  /**
   * 계속 진행 처리 함수
   */
  const handleContinue = () => {
    // ANDING 아이템 구매 처리
    dispatch({ type: 'ANDING_PURCHASE' });
    setShowModal(false);  // 모달 닫기
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
                onClick={(e) => {
                  // 버튼 클릭이 아닌 경우에만 선택 상태 업데이트
                  if (!e.target.closest('button')) {
                    setSelectedUpgrade(upgrade.id);
                  }
                }}
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
                
                {/* 업그레이드 정보 표시 */}
                <div className="mt-6 space-y-3">
                  {/* 현재 보너스 */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">현재 보너스:</span>
                    <span className="font-medium">{upgrade.currentBonus}</span>
                  </div>
                  
                  {/* 다음 레벨 보너스 */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">다음 레벨 보너스:</span>
                    <span className="font-medium text-green-600 flex items-center">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      {upgrade.nextBonus}
                    </span>
                  </div>
                  
                  {/* 강화 비용 */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">강화 비용:</span>
                    <span className={`font-medium ${isDisabled ? 'text-red-500' : 'text-blue-600'}`}>
                      {upgrade.cost.toLocaleString()}원
                    </span>
                  </div>
                </div>
                
                {/* 강화 버튼 */}
                <button
                  onClick={() => handleUpgrade(upgrade)}
                  disabled={isDisabled}  // 잔액 부족 시 비활성화
                  className={`mt-6 w-full py-3 rounded-lg font-medium transition-colors ${
                    isDisabled 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'  // 비활성화 스타일
                      : `bg-gradient-to-r ${upgrade.color} hover:opacity-90 text-white`  // 활성화 스타일
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
      
      {/* 확인 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold text-center mb-4">축하합니다! 🎉</h3>
            <p className="text-gray-700 mb-6 text-center whitespace-pre-line">
              ??? 아이템을 성공적으로 구매하셨습니다!
              게임을 초기화하시겠습니까?
            </p>
            <div className="flex space-x-4">
              {/* 초기화 버튼 */}
              <button
                onClick={handleReset}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                초기화하기
              </button>
              {/* 계속하기 버튼 */}
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