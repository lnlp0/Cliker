import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useStockData } from '../../hooks/useStockData';
import StockList from './StockList';
import Portfolio from './Portfolio';
import TradeModal from './TradeModal';

const Trading = () => {
  const { state, dispatch } = useApp();
  const { stocks: hookStocks, loading } = useStockData();
  const [selectedStock, setSelectedStock] = useState(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

  useEffect(() => {
    if (hookStocks.length > 0) {
      dispatch({ type: 'UPDATE_STOCKS', payload: hookStocks });
    }
  }, [hookStocks, dispatch]);

  const handleTradeClick = (stock) => {
    setSelectedStock(stock);
    setIsTradeModalOpen(true);
  };

  const handleTrade = (stockId, shares, price, action) => {
    if (action === 'buy') {
      dispatch({ type: 'BUY_STOCK', payload: { stockId, shares, price } });
    } else {
      dispatch({ type: 'SELL_STOCK', payload: { stockId, shares, price } });
    }
    setIsTradeModalOpen(false);
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <StockList stocks={state.stocks} onTradeClick={handleTradeClick} />
        </div>
        <div>
          <Portfolio />
        </div>
      </div>

      {isTradeModalOpen && (
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