import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // 라우팅을 위한 훅과 컴포넌트
import { useApp } from '../../contexts/AppContext'; // 전역 상태 접근을 위한 커스텀 훅
import { User, Wallet, ShoppingCart } from 'lucide-react'; // 아이콘 라이브러리

/**
 * 애플리케이션의 헤더 컴포넌트
 * - 네비게이션 링크와 사용자 정보를 표시
 * - 현재 경로에 따라 활성화된 메뉴 아이템을 시각적으로 구분
 */
const Header = () => {
  // 전역 상태에서 필요한 값 추출
  const { state } = useApp();
  // 현재 경로 정보를 가져오기 위한 훅
  const location = useLocation();
  // 사용자 정보와 장바구니 상태 구조 분해 할당
  const { user, cart } = state;

  /**
   * 현재 경로가 주어진 경로와 일치하는지 확인하는 함수
   * @param {string} path - 확인할 경로
   * @returns {boolean} 경로가 일치하면 true, 아니면 false
   */
  const isActive = (path) => location.pathname === path;

  // 장바구니에 담긴 전체 아이템 수 계산
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    // 헤더 영역
    <header className="bg-white shadow-lg border-b border-gray-200">
      {/* 최대 너비와 패딩을 제어하는 컨테이너 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 내부 레이아웃 */}
        <div className="flex justify-between items-center h-16">
          {/* 로고 영역 */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" aria-label="홈으로 이동">
              <span className="text-xl font-bold text-gray-900">Cliker!</span>
            </Link>
          </div>

          {/* 메인 내비게이션 (중간 사이즈 이상의 화면에서만 표시) */}
          <nav className="hidden md:flex space-x-8">
            {/* 홈(돈벌기) 링크 */}
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700' // 현재 페이지인 경우 파란색 강조
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' // 기본/호버 스타일
              }`}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              돈벌기
            </Link>
            {/* 주식 시장 링크 */}
            <Link
              to="/trading"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/trading') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-current={isActive('/trading') ? 'page' : undefined}
            >
              주식 시장
            </Link>
            {/* 상점 링크 */}
            <Link
              to="/shop"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/shop') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-current={isActive('/shop') ? 'page' : undefined}
            >
              상점
            </Link>
            {/* 카지노 링크 */}
            <Link
              to="/casino"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/casino') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-current={isActive('/casino') ? 'page' : undefined}
            >
              카지노
            </Link>
          </nav>

          {/* 사용자 정보 영역 */}
          <div className="flex items-center space-x-4">
            {/* 잔액 표시 */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Wallet className="w-4 h-4" aria-hidden="true" />
              <span className="font-semibold" aria-label={`현재 잔액: ${user?.balance?.toLocaleString()}원`}>
                {user?.balance?.toLocaleString()}원
              </span>
            </div>
            
            {/* 장바구니 아이콘 (숨김 처리됨) */}
            {cartItemCount > 0 && (
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;