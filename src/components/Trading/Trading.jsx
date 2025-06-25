import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useStockData } from '../../hooks/useStockData';
import StockList from './StockList';
import Portfolio from './Portfolio';
import TradeModal from './TradeModal';

/**
 * 주식 거래 메인 컴포넌트
 * - 주식 시장과 포트폴리오를 보여주는 메인 레이아웃
 * - 주식 목록, 포트폴리오, 거래 모달을 관리
 */
const Trading = () => {
  // 전역 상태와 디스패치 함수 가져오기
  const { state, dispatch } = useApp();
  
  // 커스텀 훅을 사용하여 주식 데이터 가져오기
  const { stocks: hookStocks, loading } = useStockData();
  
  // 로컬 상태 관리
  const [selectedStock, setSelectedStock] = useState(null);      // 선택된 주식
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false); // 거래 모달 표시 여부

  // 주식 데이터가 업데이트되면 전역 상태에 반영
  useEffect(() => {
    if (hookStocks.length > 0) {
      dispatch({ type: 'UPDATE_STOCKS', payload: hookStocks });
    }
  }, [hookStocks, dispatch]);

  /**
   * 거래 버튼 클릭 핸들러
   * - 선택된 주식으로 거래 모달을 엽니다.
   */
  const handleTradeClick = (stock) => {
    setSelectedStock(stock);
    setIsTradeModalOpen(true);
  };

  /**
   * 주식 거래 실행 핸들러
   * - 구매/판매 액션에 따라 적절한 디스패치를 실행합니다.
   */
  const handleTrade = (stockId, shares, price, action) => {
    if (action === 'buy') {
      // 주식 구매 액션 디스패치
      dispatch({ type: 'BUY_STOCK', payload: { stockId, shares, price } });
    } else {
      // 주식 판매 액션 디스패치
      dispatch({ type: 'SELL_STOCK', payload: { stockId, shares, price } });
    }
    // 거래 완료 후 모달 닫기
    setIsTradeModalOpen(false);
  };

  // 로딩 중일 때 표시할 스피너
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">주식 시장</h1>
        <p className="text-gray-600 mt-2">실시간 시세로 주식을 사고팔 수 있습니다.</p>
      </div>

      {/* 메인 그리드 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽 영역: 주식 목록 (2/3 너비) */}
        <div className="lg:col-span-2">
          <StockList 
            stocks={state.stocks} 
            onTradeClick={handleTradeClick} 
          />
        </div>
        
        {/* 오른쪽 영역: 포트폴리오 (1/3 너비) */}
        <div>
          <Portfolio />
        </div>
      </div>

      {/* 거래 모달 */}
      {isTradeModalOpen && selectedStock && (
        <TradeModal
          stock={selectedStock}
          onTrade={handleTrade}
          onClose={() => setIsTradeModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Trading;