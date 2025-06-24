// src/pages/DashboardEmployee.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/DashboardEmployee.css';

export default function DashboardEmployee() {
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  const loadFeedbacks = async () => {
    try {
      const res = await api.get('feedback/');
      setFeedbacks(res.data);
    } catch (err) {
      console.error('Error loading feedbacks:', err);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleAcknowledge = async (id) => {
    try {
      const { data } = await api.get(`feedback/${id}/`);

      await api.put(`feedback/${id}/`, {
        ...data,
        acknowledged: true,
      });

      loadFeedbacks();
    } catch (err) {
      console.error('Acknowledge failed:', err.response?.data || err.message);
      alert("Failed to acknowledge. Check console.");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Employee Dashboard</h2>
        <button className="logout-button" onClick={logout}>Logout</button>
      </div>

      <div className="feedback-list">
        {feedbacks.length === 0 ? (
          <p>No feedback yet.</p>
        ) : (
          feedbacks.map((fb) => (
            <div className="feedback-card" key={fb.id}>
              <p><strong>From:</strong> {fb.manager_name}</p>
              <p><strong>Strengths:</strong> {fb.strengths}</p>
              <p><strong>Improvements:</strong> {fb.improvements}</p>
              <p><strong>Sentiment:</strong> {fb.sentiment}</p>
              <p><strong>Tags:</strong> {fb.tags || '-'}</p>
              <p><strong>Acknowledged:</strong> {fb.acknowledged ? '✅ Yes' : '❌ No'}</p>

              {!fb.acknowledged && (
                <button onClick={() => handleAcknowledge(fb.id)}>Acknowledge</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
