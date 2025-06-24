import { useState, useEffect } from 'react';

const generateRandomStocks = () => {
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

  return stockSymbols.map(stock => {
    const basePrice = Math.random() * 500 + 50;
    const change = (Math.random() - 0.5) * basePrice * 0.1;
    const changePercent = (change / basePrice) * 100;
    
    return {
      id: stock.symbol,
      symbol: stock.symbol,
      name: stock.name,
      price: parseFloat(basePrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000
    };
  });
};

export const useStockData = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with random data
    const initialStocks = generateRandomStocks();
    setStocks(initialStocks);
    setLoading(false);

    // Update prices every 3 seconds
    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          const priceChange = (Math.random() - 0.5) * stock.price * 0.02;
          const newPrice = Math.max(stock.price + priceChange, 1);
          const change = newPrice - stock.price;
          const changePercent = (change / stock.price) * 100;

          return {
            ...stock,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2)),
            volume: stock.volume + Math.floor((Math.random() - 0.5) * 100000)
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { stocks, loading };
};