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
    const fetchEmployees = async () => {
      try {
        const res = await api.get('accounts/employees/');
        setEmployees(res.data);

        if (initialData) {
          const emp = res.data.find(e => e.id === initialData.employee);
          setFormData({
            employee: emp ? emp.emp_id : '',
            strengths: initialData.strengths,
            improvements: initialData.improvements,
            sentiment: initialData.sentiment,
            tags: initialData.tags || ''
          });
        }
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

    const selectedEmp = employees.find(emp => emp.emp_id === formData.employee);
    const employeeId = selectedEmp?.id;

    if (!employeeId) {
      alert("Please select a valid employee.");
      return;
    }

    const payload = {
      ...formData,
      employee: employeeId
    };

    try {
      if (initialData) {
        await api.put(`feedback/${initialData.id}/`, payload);
      } else {
        await api.post('feedback/', payload);
      }

      // Reset form
      setFormData({
        employee: '',
        strengths: '',
        improvements: '',
        sentiment: 'neutral',
        tags: ''
      });

      onSubmitSuccess();
      if (onCancelEdit) onCancelEdit();
    } catch (err) {
      console.error('Feedback submission failed:', err.response?.data || err.message);
      alert("Failed to submit feedback. Check console.");
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h3 className="feedback-form-title">{initialData ? 'Edit Feedback' : 'Add Feedback'}</h3>

      <select
        className="feedback-select"
        name="employee"
        value={formData.employee}
        onChange={handleChange}
        required
        disabled={!!initialData} // disabled while editing
      >
        <option value="">Select Employee</option>
        {employees.map(emp => (
          <option key={emp.id} value={emp.emp_id}>
            {emp.name} ({emp.emp_id}) {emp.user_id ? '' : '- Not Registered'}
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
        placeholder="Areas to Improve"
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
        placeholder="Tags (e.g. teamwork, punctuality)"
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
