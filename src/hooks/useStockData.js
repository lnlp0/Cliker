import { useState, useEffect } from 'react';

/**
 * 랜덤 주식 데이터를 생성하는 함수
 * @returns {Array} 랜덤하게 생성된 주식 데이터 배열
 */

const generateRandomStocks = () => {
  // 주식 심볼과 회사명 목록
  const stockSymbols = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
    { symbol: 'NFLX', name: 'Netflix Inc.' },
    { symbol: 'DIS', name: 'Walt Disney Co.' },
    { symbol: 'UBER', name: 'Uber Technologies Inc.' }
  ];

  // 각 주식 심볼에 대해 랜덤 데이터 생성
  return stockSymbols.map(stock => {
    // 기본 가격: 50 ~ 550 사이의 랜덤 값
    const basePrice = Math.random() * 500 + 50;
    // 전일 대비 변동액: -5% ~ +5% 범위의 랜덤 값
    const change = (Math.random() - 0.5) * basePrice * 0.1;
    // 전일 대비 변동률 계산
    const changePercent = (change / basePrice) * 100;
    
    // 주식 데이터 객체 반환
    return {
      id: stock.symbol,                    // 고유 ID (심볼 사용)
      symbol: stock.symbol,                // 주식 심볼 (예: 'AAPL')
      name: stock.name,                    // 회사명
      price: parseFloat(basePrice.toFixed(2)),          // 현재 가격 (소수점 2자리)
      change: parseFloat(change.toFixed(2)),            // 전일 대비 변동액
      changePercent: parseFloat(changePercent.toFixed(2)), // 전일 대비 변동율(%)
      volume: Math.floor(Math.random() * 10000000) + 1000000 // 거래량: 1,000,000 ~ 11,000,000
    };
  });
};

/**
 * 주식 시장 데이터를 관리하는 커스텀 훅
 * @returns {Object} 주식 데이터와 로딩 상태를 포함한 객체
 * @property {Array} stocks - 주식 데이터 배열
 * @property {boolean} loading - 데이터 로딩 상태
 */
export const useStockData = () => {
  // 주식 데이터 상태
  const [stocks, setStocks] = useState([]);
  // 로딩 상태
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 컴포넌트 마운트 시 초기 주식 데이터 생성
    const initialStocks = generateRandomStocks();
    setStocks(initialStocks);
    setLoading(false); // 로딩 상태 해제

    // 3초마다 주가 변동 시뮬레이션
    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          // 가격 변동: -1% ~ +1% 범위의 랜덤 변동
          const priceChange = (Math.random() - 0.5) * stock.price * 0.02;
          // 새 가격 계산 (0.01 미만으로 내려가지 않도록 보장)
          const newPrice = Math.max(stock.price + priceChange, 0.01);
          // 변동액과 변동률 계산
          const change = newPrice - stock.price;
          const changePercent = (change / stock.price) * 100;

          // 업데이트된 주식 데이터 반환
          return {
            ...stock,
            price: parseFloat(newPrice.toFixed(2)),          // 새 가격 (소수점 2자리)
            change: parseFloat(change.toFixed(2)),           // 전일 대비 변동액
            changePercent: parseFloat(changePercent.toFixed(2)), // 전일 대비 변동율(%)
            volume: stock.volume + Math.floor((Math.random() - 0.5) * 100000) // 거래량 변동
          };
        })
      );
    }, 3000); // 3초마다 업데이트

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, []); // 빈 의존성 배열: 컴포넌트 마운트 시에만 실행

  // 주식 데이터와 로딩 상태 반환
  return { stocks, loading };
};