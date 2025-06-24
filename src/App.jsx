import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/Layout';
import Clicker from './components/Clicker';
import Trading from './components/Trading/Trading';
import Shop from './components/Shop/Shop';
import Casino from './components/Casino/Casino';

function App() {
  return (
    <AppProvider>
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