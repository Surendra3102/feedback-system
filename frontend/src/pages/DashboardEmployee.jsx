// src/pages/DashboardEmployee.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import FeedbackTimeline from '../components/FeedbackTimeline';
import '../styles/DashboardEmployee.css'; 

export default function DashboardEmployee() {
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();  // ✅ Must be inside the component

  const loadFeedbacks = async () => {
    const res = await api.get('feedback/');
    setFeedbacks(res.data);
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleAcknowledge = async (id) => {
    const fb = feedbacks.find((f) => f.id === id);
    await api.put(`feedback/${id}/`, { ...fb, acknowledged: true });
    loadFeedbacks();
  };

  const handleComment = async (id, comment) => {
    const fb = feedbacks.find((f) => f.id === id);
    await api.put(`feedback/${id}/`, { ...fb, employee_comment: comment });
    loadFeedbacks();
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
      <div className="feedback-timeline-wrapper">
        <FeedbackTimeline
          feedbacks={feedbacks}
          onAcknowledge={handleAcknowledge}
          onComment={handleComment}
        />
      </div>
    </div>
  );
}
