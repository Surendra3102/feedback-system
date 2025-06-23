import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Login.css'; 

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await api.post('accounts/token/', {
        username,
        password
      });
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);

      const userInfo = await api.get('accounts/me/', {
        headers: { Authorization: `Bearer ${res.data.access}` }
      });

      const role = userInfo.data.role;
      if (role === 'manager') {
        navigate('/manager');
      } else {
        navigate('/employee');
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-page-title">Feedbacker</div>
      <div className="login-page-subtitle">Login</div>
      <input
        className="login-page-input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="login-page-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-page-button" onClick={handleLogin}>
        Login
      </button>
      <div className="login-page-register-link">
        New User? <a href="/register">Register</a>
      </div>
    </div>
  );
}
