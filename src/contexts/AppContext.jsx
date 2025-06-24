import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  user: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    balance: 0,
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  clickLevel: 1,
  autoLevel: 0,
  stocks: [],
  portfolio: {
    stocks: {},
    totalValue: 0,
    totalGain: 0,
    totalGainPercent: 0
  },
  products: [],
  cart: [],
  transactions: [],
  isLoading: false,
  casinoBalance: 1000 // Add initial casino balance
};

function appReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_BALANCE':
      return {
        ...state,
        user: {
          ...state.user,
          balance: Math.max(0, state.user.balance + action.payload)
        }
      };
      
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };
      
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'UPDATE_STOCKS':
      return { ...state, stocks: action.payload };
    
    case 'BUY_STOCK':
      const { stockId, shares, price } = action.payload;
      const totalCost = shares * price;
      
      if (!state.user || state.user.balance < totalCost) return state;
      
      const currentPosition = state.portfolio.stocks[stockId];
      const newPosition = currentPosition
        ? {
            shares: currentPosition.shares + shares,
            avgPrice: ((currentPosition.shares * currentPosition.avgPrice) + totalCost) / (currentPosition.shares + shares)
          }
        : { shares, avgPrice: price };
      
      const newTransaction = {
        id: Date.now().toString(),
        type: 'stock',
        action: 'BUY',
        amount: totalCost,
        details: `${shares} shares of ${stockId} at $${price}`,
        timestamp: new Date()
      };
      
      return {
        ...state,
        user: { ...state.user, balance: state.user.balance - totalCost },
        portfolio: {
          ...state.portfolio,
          stocks: { ...state.portfolio.stocks, [stockId]: newPosition }
        },
        transactions: [newTransaction, ...state.transactions]
      };
    
    case 'SELL_STOCK':
      const { stockId: sellStockId, shares: sellShares, price: sellPrice } = action.payload;
      const sellValue = sellShares * sellPrice;
      const sellPosition = state.portfolio.stocks[sellStockId];
      
      if (!sellPosition || sellPosition.shares < sellShares) return state;
      
      const remainingShares = sellPosition.shares - sellShares;
      const updatedPortfolio = { ...state.portfolio.stocks };
      
      if (remainingShares === 0) {
        delete updatedPortfolio[sellStockId];
      } else {
        updatedPortfolio[sellStockId] = { ...sellPosition, shares: remainingShares };
      }
      
      const sellTransaction = {
        id: Date.now().toString(),
        type: 'stock',
        action: 'SELL',
        amount: sellValue,
        details: `${sellShares} shares of ${sellStockId} at $${sellPrice}`,
        timestamp: new Date()
      };
      
      return {
        ...state,
        user: { ...state.user, balance: state.user.balance + sellValue },
        portfolio: { ...state.portfolio, stocks: updatedPortfolio },
        transactions: [sellTransaction, ...state.transactions]
      };
    
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.product.id === action.payload.product.id);
      
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      
      return {
        ...state,
        cart: [...state.cart, action.payload]
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload)
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'PLACE_ORDER':
      const orderTransaction = {
        id: Date.now().toString(),
        type: 'shop',
        action: 'PURCHASE',
        amount: action.payload.total,
        details: `Order with ${state.cart.length} items`,
        timestamp: new Date()
      };
      
      return {
        ...state,
        user: { ...state.user, balance: state.user.balance - action.payload.total },
        cart: [],
        transactions: [orderTransaction, ...state.transactions]
      };
    
    case 'CASINO_BET': {
      const { amount, won, winAmount = 0 } = action.payload;
      const netChange = won ? winAmount - amount : -amount;
      const newUserBalance = state.user.balance + (won ? winAmount : -amount);
      
      // Add transaction for the bet
      const casinoTransaction = {
        id: Date.now(),
        type: 'CASINO',
        amount: netChange,
        description: won ? `Casino Win: +₩${winAmount.toLocaleString()}` : `Casino Bet: -₩${amount.toLocaleString()}`,
        timestamp: new Date().toISOString()
      };
      
      return {
        ...state,
        user: {
          ...state.user,
          balance: Math.max(0, newUserBalance) // Ensure balance doesn't go below 0
        },
        transactions: [casinoTransaction, ...state.transactions]
      };
    }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'CLICK_UPGRADE':
      if (state.user.balance < state.clickLevel * state.clickLevel * 10) return state;
      return {
        ...state,
        user: { ...state.user, balance: state.user.balance - state.clickLevel * state.clickLevel * 10 },
        clickLevel: state.clickLevel + 1
      };
    
    case 'AUTO_UPGRADE':
      if (state.user.balance < (state.autoLevel + 1) * (state.autoLevel + 1) * 50) return state;
      return {
        ...state,
        user: { ...state.user, balance: state.user.balance - (state.autoLevel + 1) * (state.autoLevel + 1) * 50 },
        autoLevel: state.autoLevel + 1
      };
    
    case 'EARN_CLICK':
      return {
        ...state,
        user: { ...state.user, balance: state.user.balance + state.clickLevel }
      };
    
    case 'EARN_AUTO':
      return {
        ...state,
        user: { ...state.user, balance: state.user.balance + state.autoLevel }
      };
    
    default:
      return state;
  }
}

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // 자동수익: 전역적으로 1초마다 동작 (다른 페이지/탭에서도 항상 동작)
  useEffect(() => {
    if (state.autoLevel > 0) {
      const interval = setInterval(() => {
        dispatch({ type: 'EARN_AUTO' });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.autoLevel]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};