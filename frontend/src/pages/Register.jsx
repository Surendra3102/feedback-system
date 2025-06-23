import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Register.css';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'employee',
    emp_id: '',
    manager_id: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === 'employee') {
        payload.emp_id = formData.emp_id.trim().toUpperCase(); // normalize for backend
      } else if (formData.role === 'manager') {
        payload.manager_id = formData.manager_id.trim().toUpperCase(); // normalize for backend
      }

      await api.post('accounts/register/', payload);
      alert('Registration successful!');
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <div className="register-page-container">
      <h2 className="register-page-title">Registration</h2>
      {error && <p className="register-page-error">{error}</p>}

      <form onSubmit={handleSubmit} className="register-page-form">
        <input
          className="register-page-input"
          type="text"
          name="username"
          placeholder="Username"
          required
          value={formData.username}
          onChange={handleChange}
        />
        <input
          className="register-page-input"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          className="register-page-input"
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />

        <label className="register-page-label">Role:</label>
        <select
          className="register-page-select"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>

        {formData.role === 'employee' && (
          <input
            className="register-page-input"
            type="text"
            name="emp_id"
            placeholder="Enter Employee ID"
            required
            value={formData.emp_id}
            onChange={handleChange}
          />
        )}

        {formData.role === 'manager' && (
          <input
            className="register-page-input"
            type="text"
            name="manager_id"
            placeholder="Enter Manager ID"
            required
            value={formData.manager_id}
            onChange={handleChange}
          />
        )}

        <button className="register-page-button" type="submit">Register</button>
      </form>
    </div>
  );
}
