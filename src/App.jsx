import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/Layout'; // 공통 레이아웃
import Clicker from './components/Cliker/Clicker'; // 메인 클리커 게임
import Trading from './components/Trading/Trading'; // 주식 거래
import Shop from './components/Shop/Shop'; // 상점 (강화)
import Casino from './components/Casino/Casino'; // 카지노 미니게임

function App() {
  return (
    // 전역 상태 제공
    <AppProvider>
      {/* 라우터 설정 */}
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Clicker />} />
            <Route path="/trading" element={<Trading />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/casino" element={<Casino />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;