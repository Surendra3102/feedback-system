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

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }

    // Load employee list from EmployeeInfo model
    const fetchEmployees = async () => {
      try {
        const res = await api.get('accounts/employees/');
        setEmployees(res.data); // Should contain id, emp_id, name
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };

    fetchEmployees();
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (initialData) {
        await api.put(`feedback/${initialData.id}/`, formData);
      } else {
        await api.post('feedback/', formData);
      }

      setFormData({
        employee: '',
        strengths: '',
        improvements: '',
        sentiment: 'neutral',
        tags: ''
      });

      onSubmitSuccess();
      if (onCancelEdit) onCancelEdit();
    } catch (error) {
      console.error('Feedback submission error:', error);
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h3 className="feedback-form-title">{initialData ? 'Edit Feedback' : 'Add Feedback'}</h3>

      {/* Employee dropdown */}
      <select
        className="feedback-select"
        name="employee"
        value={formData.employee}
        onChange={handleChange}
        required
        disabled={!!initialData} // disable if editing
      >
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.name} ({emp.emp_id})
          </option>
        ))}
      </select>

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
