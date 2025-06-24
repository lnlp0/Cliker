import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { X } from 'lucide-react';

const TradeModal = ({ stock, onTrade, onClose }) => {
  const { state } = useApp();
  const [action, setAction] = useState('buy');
  const [shares, setShares] = useState(1);
  const [error, setError] = useState('');

  const totalCost = shares * stock.price;
  const maxShares = action === 'buy' 
    ? Math.floor(state.user.balance / stock.price)
    : state.portfolio.stocks[stock.id]?.shares || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (shares <= 0) {
      setError('Please enter a valid number of shares');
      return;
    }

    if (action === 'buy' && totalCost > state.user.balance) {
      setError('Insufficient funds');
      return;
    }

    if (action === 'sell' && shares > maxShares) {
      setError('Not enough shares to sell');
      return;
    }

    onTrade(stock.id, shares, stock.price, action);
  };

  // Add overflow hidden to body when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-md m-4">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              거래 유형
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAction('buy')}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  action === 'buy'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                구매
              </button>
              <button
                type="button"
                onClick={() => setAction('sell')}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  action === 'sell'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
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

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium text-white transition-colors ${
                action === 'buy'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {action === 'buy' ? '구매' : '판매'}
            </button>
          </div>
        </form>
      </div>
      {/* Click outside to close */}
      <div 
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />
    </div>
  );
};

export default TradeModal;