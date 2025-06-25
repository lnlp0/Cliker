import React, { createContext, useContext, useReducer, useEffect } from 'react';

/**
 * 애플리케이션의 초기 상태
 * - 사용자 잔고, 클릭/자동 레벨, 주식, 포트폴리오, 장바구니, 거래 내역 등을 관리
 */
const initialState = {
  user: {
    balance: 0, // 사용자 보유 금액 (원)
  },
  clickLevel: 1,         // 클릭당 수익 레벨
  autoLevel: 0,         // 자동 수익 레벨
  stocks: [],           // 시장에 상장된 주식 목록
  portfolio: {          // 사용자 포트폴리오
    stocks: {},         // 보유 주식 { [stockId]: { shares, avgPrice } }
    totalValue: 0,     // 포트폴리오 총 가치
    totalGain: 0,       // 총 평가 손익
    totalGainPercent: 0 // 총 수익률 (%)
  },
  products: [],         // 상점에서 판매하는 상품 목록
  cart: [],             // 장바구니 아이템
  transactions: [],     // 거래 내역
  isLoading: false,     // 로딩 상태
};

/**
 * 애플리케이션 상태를 관리하는 리듀서 함수
 * - 모든 상태 업데이트 로직을 중앙 집중화
 * 
 * @param {Object} state - 현재 상태
 * @param {Object} action - 디스패치된 액션
 * @returns {Object} 새로운 상태
 */
function appReducer(state, action) {
  switch (action.type) {
    // 잔액 업데이트
    case 'UPDATE_BALANCE':
      return {
        ...state,
        user: {
          ...state.user,
          // 잔액이 0 미만이 되지 않도록 보장
          balance: Math.max(0, state.user.balance + action.payload)
        }
      };
      
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };
      
    // 사용자 정보 설정
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    // 주식 목록 업데이트
    case 'UPDATE_STOCKS':
      return { ...state, stocks: action.payload }; // action.payload는 주식 배열이어야 함
    
    // 주식 구매 액션
    case 'BUY_STOCK':
      const { stockId, shares, price } = action.payload;
      const totalCost = shares * price; // 총 구매 비용
      
      // 유효성 검사: 사용자 정보가 없거나 잔액이 부족하면 상태 변경 없이 종료
      if (!state.user || state.user.balance < totalCost) return state;
      
      // 기존 보유 포지션 조회
      const currentPosition = state.portfolio.stocks[stockId];
      // 새로운 포지션 계산 (평균 단가 업데이트)
      const newPosition = currentPosition
        ? {
            shares: currentPosition.shares + shares, // 총 보유 수량 업데이트
            // 가중평균으로 평균 단가 재계산
            avgPrice: ((currentPosition.shares * currentPosition.avgPrice) + totalCost) / (currentPosition.shares + shares)
          }
        : { shares, avgPrice: price }; // 신규 포지션인 경우
      
      // 거래 내역 생성
      const newTransaction = {
        id: Date.now().toString(),
        type: 'stock',
        action: 'BUY',
        amount: totalCost,
        details: `${shares}주 ${stockId} 매수 (주당 $${price})`,
        timestamp: new Date()
      };
      
      // 상태 업데이트
      return {
        ...state,
        user: { ...state.user, balance: state.user.balance - totalCost }, // 잔액 차감
        portfolio: {
          ...state.portfolio,
          stocks: { ...state.portfolio.stocks, [stockId]: newPosition } // 포트폴리오 업데이트
        },
        transactions: [newTransaction, ...state.transactions] // 거래 내역 추가
      };
    
    // 주식 판매 액션
    case 'SELL_STOCK':
      const { stockId: sellStockId, shares: sellShares, price: sellPrice } = action.payload;
      const sellValue = sellShares * sellPrice; // 판매 금액
      const sellPosition = state.portfolio.stocks[sellStockId]; // 현재 보유 포지션
      
      // 유효성 검사: 보유 주식이 없거나 판매 수량이 부족하면 상태 변경 없이 종료
      if (!sellPosition || sellPosition.shares < sellShares) return state;
      
      // 판매 후 남은 주식 수 계산
      const remainingShares = sellPosition.shares - sellShares;
      const updatedPortfolio = { ...state.portfolio.stocks };
      
      // 보유 주식 업데이트: 전량 매도 시 삭제, 일부 매도 시 수량만 감소
      if (remainingShares === 0) {
        delete updatedPortfolio[sellStockId]; // 전량 매도 시 포지션 제거
      } else {
        updatedPortfolio[sellStockId] = { ...sellPosition, shares: remainingShares }; // 부분 매도
      }
      
      // 판매 거래 내역 생성
      const sellTransaction = {
        id: Date.now().toString(),
        type: 'stock',
        action: 'SELL',
        amount: sellValue,
        details: `${sellShares}주 ${sellStockId} 매도 (주당 $${sellPrice})`,
        timestamp: new Date()
      };
      
      // 상태 업데이트
      return {
        ...state,
        user: { ...state.user, balance: state.user.balance + sellValue }, // 잔액 증가
        portfolio: { ...state.portfolio, stocks: updatedPortfolio }, // 포트폴리오 업데이트
        transactions: [sellTransaction, ...state.transactions] // 거래 내역 추가
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
    
    // 카지노 베팅 처리
    case 'CASINO_BET': {
      const { amount, won, winAmount = 0 } = action.payload;
      const netChange = won ? winAmount - amount : -amount; // 순수익/손실 계산
      const newUserBalance = state.user.balance + (won ? winAmount : -amount); // 새 잔액
      
      // 카지노 거래 내역 생성
      const casinoTransaction = {
        id: Date.now(),
        type: 'CASINO',
        amount: netChange,
        description: won ? `카지노 승리: +₩${winAmount.toLocaleString()}` : `카지노 베팅: -₩${amount.toLocaleString()}`,
        timestamp: new Date().toISOString()
      };
      
      // 상태 업데이트
      return {
        ...state,
        user: {
          ...state.user,
          balance: Math.max(0, newUserBalance) // 잔액이 0 미만이 되지 않도록 보장
        },
        transactions: [casinoTransaction, ...state.transactions] // 거래 내역 추가
      };
    }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    // 클릭 업그레이드: 클릭당 수익 증가
    case 'CLICK_UPGRADE':
      const clickUpgradeCost = state.clickLevel * state.clickLevel * 10; // 업그레이드 비용 (레벨^2 * 10)
      if (state.user.balance < clickUpgradeCost) return state; // 잔액 부족 시 업그레이드 불가
      
      return {
        ...state,
        user: { 
          ...state.user, 
          balance: state.user.balance - clickUpgradeCost // 잔액 차감
        },
        clickLevel: state.clickLevel + 1 // 클릭 레벨 증가
      };
    
    // 자동 수익 업그레이드: 초당 자동 수익 증가
    case 'AUTO_UPGRADE':
      const nextAutoLevel = state.autoLevel + 1;
      const autoUpgradeCost = nextAutoLevel * nextAutoLevel * 50; // 업그레이드 비용 (다음레벨^2 * 50)
      
      if (state.user.balance < autoUpgradeCost) return state; // 잔액 부족 시 업그레이드 불가
      
      return {
        ...state,
        user: { 
          ...state.user, 
          balance: state.user.balance - autoUpgradeCost // 잔액 차감
        },
        autoLevel: nextAutoLevel // 자동 수익 레벨 증가
      };
    
    // 클릭 수익 발생
    case 'EARN_CLICK':
      return {    
        ...state,
        user: { 
          ...state.user, 
          balance: state.user.balance + state.clickLevel // 클릭당 수익만큼 잔액 증가
        }
      };
    
    // 자동 수익 발생 (1초마다 호출됨)
    case 'EARN_AUTO':
      return {
        ...state,
        user: { 
          ...state.user, 
          balance: state.user.balance + state.autoLevel // 자동 수익만큼 잔액 증가
        }
      };
    
    // 게임 초기화 (리셋)
    case 'RESET_GAME':
      return {
        ...initialState, // 모든 상태 초기화
        user: {
          ...initialState.user,
          balance: 100000000 // 초기 자본금 100,000,000원으로 설정
        }
      };
    
    // 특별 아이템(???) 구매
    case 'ANDING_PURCHASE':
      const itemCost = 100000; // 100,000원 비용
      const newBalance = state.user.balance - itemCost;
      
      // 거래 내역 생성
      const specialItemTransaction = {
        id: Date.now().toString(),
        type: 'purchase',
        action: 'SPECIAL_ITEM',
        amount: -itemCost,
        details: '??? 아이템 구매',
        timestamp: new Date()
      };
      
      // 상태 업데이트
      return {
        ...state,
        user: { 
          ...state.user, 
          balance: newBalance // 비용 차감
        },
        transactions: [specialItemTransaction, ...state.transactions] // 거래 내역 추가
      };
    
    default:
      return state;
  }
}

// React Context 생성
const AppContext = createContext();

/**
 * useApp 커스텀 훅
 * - AppContext의 값을 쉽게 사용할 수 있도록 하는 헬퍼 훅
 * - 반드시 AppProvider 내부에서만 사용해야 함
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp은 반드시 AppProvider 내부에서 사용해야 합니다');
  }
  return context;
};

/**
 * 애플리케이션 상태 제공자 컴포넌트
 * - 전역 상태와 디스패치 함수를 하위 컴포넌트에 제공
 */
export const AppProvider = ({ children }) => {
  // useReducer를 사용한 상태 관리
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // 자동 수익 발생: 1초마다 실행 (autoLevel이 0보다 클 때만)
  useEffect(() => {
    if (state.autoLevel > 0) {
      const interval = setInterval(() => {
        dispatch({ type: 'EARN_AUTO' });
      }, 1000);
      // 컴포넌트 언마운트 시 인터벌 정리
      return () => clearInterval(interval);
    }
  }, [state.autoLevel]);

  // Context Provider로 상태와 디스패치 함수 제공
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};