import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { X } from 'lucide-react';

/**
 * 주식 거래 모달 컴포넌트
 * - 주식 구매/판매를 위한 모달 다이얼로그
 * - 거래 유형(구매/판매) 선택, 주식 수량 입력, 거래 실행 기능 제공
 * 
 * @param {Object} stock - 거래할 주식 정보
 * @param {Function} onTrade - 거래 실행 시 호출될 콜백 함수
 * @param {Function} onClose - 모달 닫기 핸들러
 */
const TradeModal = ({ stock, onTrade, onClose }) => {
  // 전역 상태에서 사용자 정보 및 포트폴리오 가져오기
  const { state } = useApp();
  
  // 상태 관리
  const [action, setAction] = useState('buy');      // 거래 유형 (buy/sell)
  const [shares, setShares] = useState(1);         // 거래할 주식 수량
  const [error, setError] = useState('');           // 오류 메시지

  // 거래 총액 계산 (주식 수량 × 주가)
  const totalCost = shares * stock.price;
  
  // 최대 거래 가능 주식 수 계산
  // - 구매 시: 보유한 잔액으로 살 수 있는 최대 주식 수
  // - 판매 시: 보유한 주식 수
  const maxShares = action === 'buy' 
    ? Math.floor(state.user.balance / stock.price)
    : state.portfolio.stocks[stock.id]?.shares || 0;

  /**
   * 폼 제출 핸들러
   * - 입력 유효성 검사 후 거래 실행
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    if (shares <= 0) {
      setError('유효한 주식 수량을 입력해주세요');
      return;
    }

    // 구매 시 잔액 확인
    if (action === 'buy' && totalCost > state.user.balance) {
      setError('잔액이 부족합니다');
      return;
    }

    // 판매 시 보유 주식 수 확인
    if (action === 'sell' && shares > maxShares) {
      setError('보유한 주식이 부족합니다');
      return;
    }

    // 상위 컴포넌트로 거래 정보 전달
    onTrade(stock.id, shares, stock.price, action);
  };

  // 모달이 열릴 때 body의 스크롤 비활성화
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    // 컴포넌트 언마운트 시 스크롤 복구
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto h-full w-full">
      <div className="bg-white rounded-lg p-6 w-full max-w-md m-0">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            주식 시장
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">{stock.name}</p>
          <p className="text-2xl font-bold text-gray-900">${stock.price}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-0">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              거래 유형
            </label>
            {/* 거래 유형 선택 버튼 그룹 */}
            <div className="grid grid-cols-2 gap-2">
              {/* 구매 버튼 */}
              <button
                type="button"
                onClick={() => setAction('buy')}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  action === 'buy'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-pressed={action === 'buy'}
              >
                구매
              </button>
              {/* 판매 버튼 */}
              <button
                type="button"
                onClick={() => setAction('sell')}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  action === 'sell'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-pressed={action === 'sell'}
              >
                판매
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주식 수량
            </label>
            <input
              type="number"
              min="1"
              max={maxShares}
              value={shares}
              onChange={(e) => setShares(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              최대 구매 수량: {maxShares.toLocaleString()} 개
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">총 {action === 'buy' ? '비용' : '가격'}:</span>
              <span className="text-lg font-bold text-gray-900">
                ${totalCost.toFixed(2)}
              </span>
            </div>
            {action === 'buy' && (
              <p className="text-xs text-gray-500 mt-1">
                잔액: ${(state.user.balance - totalCost).toFixed(2)}
              </p>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* 하단 액션 버튼 그룹 */}
          <div className="flex space-x-3">
            {/* 취소 버튼 */}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              aria-label="거래 취소"
            >
              취소
            </button>
            {/* 거래 실행 버튼 */}
            <button
              type="submit"
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium text-white transition-colors ${
                action === 'buy'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              aria-label={`${action === 'buy' ? '구매' : '판매'} 실행`}
            >
              {action === 'buy' ? '구매' : '판매'}
            </button>
          </div>
        </form>
      </div>
      {/* 모달 바깥 영역 클릭 시 닫기 */}
      <div 
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
        role="button"
        tabIndex="-1"
      />
    </div>
  );
};

export default TradeModal;