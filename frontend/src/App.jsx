// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardManager from './pages/DashboardManager';
import DashboardEmployee from './pages/DashboardEmployee';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/manager" element={<DashboardManager />} />
        <Route path="/employee" element={<DashboardEmployee />} />
      </Routes>
    </BrowserRouter>
  );
}
