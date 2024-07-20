// frontend/src/AppRoutes.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/Home';
import AuthPage from './pages/AuthPage';
import {Account} from './pages/Account';
import CartPage from './pages/CartPage';
import AppBar from '@/components/main/AppBar';
import ProductPage from './pages/ProductPage';
import NotFoundPage from './pages/NotFoundPage';
import CheckoutComplete from './pages/CheckoutComplete';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route 
          path='*'
          element= {
          <>
            <AppBar/>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/account/" element={<Navigate to='/account/profil' />} />
              <Route path="/account/:section" element={<Account />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/product/:productId" element={<ProductPage/>} />
              <Route path="/checkout/complete" element={<CheckoutComplete />} />
              <Route path="*" element={<NotFoundPage/>} />
            </Routes>
          </>
        }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;