import React, { useEffect, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, ArrowUpRight } from 'lucide-react';

const Clicker = () => {
  const { state, dispatch } = useApp();
  const { user, clickLevel, autoLevel } = state;
  const [clickEarnings, setClickEarnings] = useState([]);
  
  const handleClick = (e) => {
    dispatch({ type: 'EARN_CLICK' });
    
    // Get click position relative to the clickable area
    const rect = e.currentTarget.getBoundingClientRect();
    const baseX = e.clientX - rect.left; // x position within the element
    const baseY = e.clientY - rect.top;  // y position within the element
    
    // Generate random offset (-30 to 30 pixels) from the click position
    const randomOffsetX = (Math.random() - 0.5) * 60;
    const randomOffsetY = (Math.random() - 0.5) * 60;
    
    // Add new earning indicator with random position around the click
    const newEarning = {
      id: Date.now(),
      amount: clickLevel,
      x: baseX + randomOffsetX,
      y: baseY + randomOffsetY,
    };
    
    setClickEarnings(prev => [...prev, newEarning]);
    
    // Remove the earning indicator after animation
    setTimeout(() => {
      setClickEarnings(prev => prev.filter(earning => earning.id !== newEarning.id));
    }, 1000);
  };

  // 자동 수익 (1초마다)
  useEffect(() => {
    if (autoLevel > 0) {
      const interval = setInterval(() => {
        dispatch({ type: 'EARN_AUTO' });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoLevel, dispatch]);

  // 숫자 포맷 (3자리 콤마)
  const formatNumber = (num) => num.toLocaleString();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cliker!</h1>
          <p className="text-lg text-gray-600">버튼을 클릭해서 돈을 벌고, 강화해서 더 많이 벌어보세요!</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Clicker Area */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
            <div className="relative w-full max-w-md h-64 mb-8">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-full h-full bg-transparent focus:outline-none relative"
                onClick={handleClick}
                aria-label="클릭해서 돈 벌기"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-contain bg-no-repeat bg-center"
                       style={{
                         backgroundImage: 'url(/click-btn.png)',
                         backgroundSize: 'contain',
                         backgroundPosition: 'center',
                         backgroundRepeat: 'no-repeat',
                       }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      {/* No text on the button */}
                    </div>
                  </div>
                </div>
                
                {/* Click effect */}
                <AnimatePresence>
                  {clickEarnings.map(earning => (
                    <motion.div
                      key={earning.id}
                      className="absolute text-green-500 font-bold text-2xl pointer-events-none whitespace-nowrap"
                      style={{
                        left: `${earning.x}px`,
                        top: `${earning.y}px`,
                      }}
                      initial={{ 
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                      }}
                      animate={{ 
                        y: -80,
                        opacity: 0,
                        scale: 1.8,
                        textShadow: '0 0 20px rgba(255, 255, 255, 1)'
                      }}
                      transition={{ 
                        duration: 1.2,
                        ease: "easeOut" 
                      }}
                    >
                      +{formatNumber(earning.amount)}원
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.button>
            </div>
            
            <div className="w-full max-w-md bg-gray-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-gray-700">자동 수익</span>
                </div>
                <span className="text-lg font-semibold text-blue-600">
                  {formatNumber(autoLevel)}원/초
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
          
          {/* Stats Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">현재 상태</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">보유 금액</span>
                  <span className="text-2xl font-bold text-gray-900">{formatNumber(user.balance)}원</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                    style={{ width: `${Math.min(100, (user.balance / 1000000) * 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                    <span>클릭당 수익</span>
                  </div>
                  <span className="font-semibold text-blue-700">
                    {formatNumber(clickLevel)}원
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-green-500 mr-2" />
                    <span>초당 자동 수익</span>
                  </div>
                  <span className="font-semibold text-green-700">
                    {formatNumber(autoLevel)}원
                  </span>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="flex items-center text-purple-700 mb-2">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">팁</span>
                </div>
                <p className="text-sm text-purple-600">
                  강화 상점에서 클릭과 자동 수익을 업그레이드할 수 있어요!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clicker; 