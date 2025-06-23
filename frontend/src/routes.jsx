// src/routes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardManager from './pages/DashboardManager';
import DashboardEmployee from './pages/DashboardEmployee';

export default function AppRoutes() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={
        user?.role === 'manager' ? <DashboardManager /> : <DashboardEmployee />
      } />
    </Routes>
  );
}
