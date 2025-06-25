import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * 포트폴리오 컴포넌트
 * - 사용자가 보유한 주식 목록과 수익률을 표시
 * - 종목별 상세 정보와 총 자산 가치를 보여줌
 */
const Portfolio = () => {
  // 전역 상태에서 포트폴리오와 주식 데이터 가져오기
  const { state } = useApp();
  const { portfolio, stocks } = state;

  // 포트폴리오에 있는 각 주식에 대한 상세 계산
  const portfolioEntries = Object.entries(portfolio.stocks).map(([stockId, position]) => {
    // 현재 주식 정보 가져오기
    const currentStock = stocks.find(s => s.id === stockId);
    // 현재 가격 (주식이 없으면 평균 매수가격 사용)
    const currentPrice = currentStock ? currentStock.price : position.avgPrice;
    // 총 평가 금액 (보유 수량 × 현재 가격)
    const totalValue = position.shares * currentPrice;
    // 총 매수 금액 (보유 수량 × 평균 매수가격)
    const totalCost = position.shares * position.avgPrice;
    // 평가 손익 (총 평가 금액 - 총 매수 금액)
    const gain = totalValue - totalCost;
    // 수익률 (평가 손익 / 총 매수 금액 × 100)
    const gainPercent = totalCost > 0 ? (gain / totalCost) * 100 : 0;

    return {
      stockId,
      position,
      currentPrice,
      totalValue,
      totalCost,
      gain,
      gainPercent
    };
  });

  // 포트폴리오 전체 통계 계산
  const totalPortfolioValue = portfolioEntries.reduce((sum, entry) => sum + entry.totalValue, 0);  // 총 평가 금액
  const totalPortfolioCost = portfolioEntries.reduce((sum, entry) => sum + entry.totalCost, 0);    // 총 매수 금액
  const totalGain = totalPortfolioValue - totalPortfolioCost;  // 총 평가 손익
  const totalGainPercent = totalPortfolioCost > 0 ? (totalGain / totalPortfolioCost) * 100 : 0;  // 총 수익률

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">내 주식</h3>
      
      {portfolioEntries.length === 0 ? (
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">보유한 주식이 없습니다.</p>
          <p className="text-sm text-gray-400">거래를 시작하여 자산을 늘리세요.</p>
        </div>
      ) : (
        <>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">총 자산 가치</span>
              <span className="text-lg font-bold text-gray-900">
                ${totalPortfolioValue.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">총 손익</span>
              <div className={`flex items-center space-x-1 ${
                totalGain >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {totalGain >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {totalGain >= 0 ? '+' : ''}${totalGain.toFixed(2)} ({totalGainPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* 주식 목록 표시 */}
          <div className="space-y-4">
            {portfolioEntries.map((entry) => {
              // 주식 정보 가져오기
              const stock = stocks.find(s => s.id === entry.stockId);
              return (
                <div key={entry.stockId} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{entry.stockId}</h4>
                      <p className="text-sm text-gray-500">{stock?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${entry.currentPrice.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">현재 가격</p>
                    </div>
                  </div>
                  
                  {/* 주식 상세 정보 */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {/* 왼쪽: 기본 정보 */}
                    <div>
                      <p className="text-gray-600">보유 수량: {entry.position.shares}</p>
                      <p className="text-gray-600">평균 단가: ${entry.position.avgPrice.toFixed(2)}</p>
                    </div>
                    {/* 오른쪽: 평가 정보 */}
                    <div className="text-right">
                      <p className="text-gray-900 font-medium">
                        ${entry.totalValue.toFixed(2)}
                      </p>
                      <div className={`flex items-center justify-end space-x-1 ${
                        entry.gain >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {entry.gain >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span className="text-xs">
                          {entry.gain >= 0 ? '+' : ''}${entry.gain.toFixed(2)} ({entry.gainPercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Portfolio;