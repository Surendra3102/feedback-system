// src/pages/DashboardManager.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import FeedbackForm from '../components/FeedbackForm';
import '../styles/DashboardManager.css';

export default function DashboardManager() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const navigate = useNavigate();

  const loadFeedbacks = async () => {
    const res = await api.get('feedback/');
    setFeedbacks(res.data);
    setEditingFeedback(null);
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const sentimentCounts = feedbacks.reduce((acc, fb) => {
    acc[fb.sentiment] = (acc[fb.sentiment] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="manager-container">
      <div className="topbar">
        <h2>Manager Dashboard</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="summary-section">
        <h3>Team Overview</h3>
        <p><b>Total Feedbacks:</b> {feedbacks.length}</p>
        <p><b>Positive:</b> {sentimentCounts.positive || 0}</p>
        <p><b>Neutral:</b> {sentimentCounts.neutral || 0}</p>
        <p><b>Negative:</b> {sentimentCounts.negative || 0}</p>
      </div>

      <div className="form-section">
        <FeedbackForm
          onSubmitSuccess={loadFeedbacks}
          initialData={editingFeedback}
          onCancelEdit={() => setEditingFeedback(null)}
        />
      </div>

      <div className="history-section">
        <h3>Feedback History</h3>
        {feedbacks.map((fb) => (
          <div key={fb.id} className="feedback-card">
            <p><b>Employee:</b> {fb.employee_name}</p>
            <p><b>Strengths:</b> {fb.strengths}</p>
            <p><b>Improvements:</b> {fb.improvements}</p>
            <p><b>Sentiment:</b> {fb.sentiment}</p>
            <p><b>Tags:</b> {fb.tags}</p>
            <button className='edit-btn' onClick={() => setEditingFeedback(fb)}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
