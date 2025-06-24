import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { TrendingUp, ShoppingBag, Dice6, Wallet, ArrowUp, ArrowDown } from 'lucide-react';

const Dashboard = () => {
  const { state } = useApp();
  const { user, portfolio, cart, transactions } = state;

  const portfolioValue = Object.entries(portfolio.stocks).reduce((total, [stockId, position]) => {
    return total + (position.shares * position.avgPrice);
  }, 0);

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const recentTransactions = transactions.slice(0, 5);

  const StatCard = ({ title, value, icon: Icon, color, link, subtitle }) => (
    <Link to={link} className="group">
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your account today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Account Balance"
          value={`$${user?.balance?.toLocaleString()}`}
          icon={Wallet}
          color="bg-blue-500"
          link="/trading"
          subtitle="Available funds"
        />
        <StatCard
          title="Portfolio Value"
          value={`$${portfolioValue.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-green-500"
          link="/trading"
          subtitle={`${Object.keys(portfolio.stocks).length} positions`}
        />
        <StatCard
          title="Shopping Cart"
          value={`$${cartTotal.toFixed(2)}`}
          icon={ShoppingBag}
          color="bg-purple-500"
          link="/shop"
          subtitle={`${cart.length} items`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent transactions</p>
            ) : (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'stock' ? 'bg-blue-100' :
                      transaction.type === 'shop' ? 'bg-purple-100' :
                      'bg-red-100'
                    }`}>
                      {transaction.type === 'stock' && <TrendingUp className="w-4 h-4 text-blue-600" />}
                      {transaction.type === 'shop' && <ShoppingBag className="w-4 h-4 text-purple-600" />}
                      {transaction.type === 'casino' && <Dice6 className="w-4 h-4 text-red-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.action}</p>
                      <p className="text-xs text-gray-500">{transaction.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {transaction.action === 'WIN' || transaction.action === 'SELL' ? (
                      <ArrowUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-semibold ${
                      transaction.action === 'WIN' || transaction.action === 'SELL' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/trading"
              className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-700">Trade Stocks</span>
            </Link>
            <Link
              to="/shop"
              className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <ShoppingBag className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-700">Shop Now</span>
            </Link>
            <Link
              to="/casino"
              className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Dice6 className="w-8 h-8 text-red-600 mb-2" />
              <span className="text-sm font-medium text-red-700">Play Games</span>
            </Link>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <Wallet className="w-8 h-8 text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">View Transactions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;