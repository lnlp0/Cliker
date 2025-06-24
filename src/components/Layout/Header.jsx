import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { User, Wallet, ShoppingCart } from 'lucide-react';

const Header = () => {
  const { state } = useApp();
  const location = useLocation();
  const { user, cart } = state;

  const isActive = (path) => location.pathname === path;

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">Cliker!</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              돈벌기
            </Link>
            <Link
              to="/trading"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/trading') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              주식 시장
            </Link>
            <Link
              to="/shop"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/shop') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              상점
            </Link>
            <Link
              to="/casino"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/casino') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              카지노
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Wallet className="w-4 h-4" />
              <span className="font-semibold">{user?.balance?.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;