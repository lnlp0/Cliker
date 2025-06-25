import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * 주식 목록 컴포넌트
 * - 시장에 상장된 주식들의 목록을 테이블 형식으로 표시
 * - 각 주식의 현재가, 변동률, 거래량 정보 제공
 * 
 * @param {Array} stocks - 표시할 주식 목록
 * @param {Function} onTradeClick - 거래 버튼 클릭 시 호출될 콜백 함수
 */
const StockList = ({ stocks, onTradeClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">시장 개요</h3>
        <p className="text-sm text-gray-500">실시간 주가 정보</p>
      </div>
      
      {/* 반응형 테이블 컨테이너 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* 테이블 헤더 */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주식
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가격
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                변동
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                거래량
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                행동
              </th>
            </tr>
          </thead>
          {/* 테이블 바디 */}
          <tbody className="bg-white divide-y divide-gray-200">
            {stocks.map((stock) => (
              <tr key={stock.id} className="hover:bg-gray-50">
                {/* 주식 심볼 및 이름 */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                    <div className="text-sm text-gray-500">{stock.name}</div>
                  </div>
                </td>
                {/* 현재가 */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${stock.price}
                </td>
                {/* 가격 변동 정보 */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center space-x-1 ${
                    stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stock.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </td>
                {/* 거래량 */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stock.volume.toLocaleString()}
                </td>
                {/* 거래 버튼 */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onTradeClick(stock)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
                    aria-label={`${stock.symbol} 거래하기`}
                  >
                    거래
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockList;