// src/components/FeedbackForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/FeedbackForm.css';

export default function FeedbackForm({ onSubmitSuccess, initialData = null, onCancelEdit }) {
  const [formData, setFormData] = useState({
    employee: '',
    strengths: '',
    improvements: '',
    sentiment: 'neutral',
    tags: ''
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (initialData) {
      await api.put(`feedback/${initialData.id}/`, formData);
    } else {
      await api.post('feedback/', formData);
    }
    setFormData({ employee: '', strengths: '', improvements: '', sentiment: 'neutral', tags: '' });
    onSubmitSuccess();
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h3 className="feedback-form-title">{initialData ? 'Edit Feedback' : 'Add Feedback'}</h3>

      <input
        className="feedback-input"
        name="employee"
        value={formData.employee}
        onChange={handleChange}
        placeholder="Employee ID or name"
        required
        disabled={!!initialData}
      />

      <textarea
        className="feedback-textarea"
        name="strengths"
        value={formData.strengths}
        onChange={handleChange}
        placeholder="Strengths"
        required
      />

      <textarea
        className="feedback-textarea"
        name="improvements"
        value={formData.improvements}
        onChange={handleChange}
        placeholder="Areas to improve"
        required
      />

      <select
        className="feedback-select"
        name="sentiment"
        value={formData.sentiment}
        onChange={handleChange}
      >
        <option value="positive">🌟 Positive</option>
        <option value="neutral">😐 Neutral</option>
        <option value="negative">⚠️ Negative</option>
      </select>

      <input
        className="feedback-input"
        name="tags"
        value={formData.tags}
        onChange={handleChange}
        placeholder="Tags (e.g. communication)"
      />

      <div className="form-buttons">
        <button type="submit" className="feedback-button">
          {initialData ? 'Update' : 'Submit'}
        </button>
        {initialData && (
          <button type="button" className="cancel-button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
