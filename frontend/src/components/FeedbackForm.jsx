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
      setFormData({
        employee: initialData.employee.emp_id || '',
        strengths: initialData.strengths,
        improvements: initialData.improvements,
        sentiment: initialData.sentiment,
        tags: initialData.tags || ''
      });
    }

    const fetchEmployees = async () => {
      try {
        const res = await api.get('accounts/employees/');
        setEmployees(res.data); // All employees (with/without user_id)
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

  // Fix: Use employee.id, not user_id
  const selectedEmp = employees.find(emp => emp.emp_id === formData.employee);
  const employeeId = selectedEmp?.id;

  if (!employeeId) {
    alert("Invalid employee selected.");
    return;
  }

  try {
    const feedbackPayload = {
      ...formData,
      employee: employeeId  // ✅ Send EmployeeInfo ID (not user_id)
    };

    if (initialData) {
      await api.put(`feedback/${initialData.id}/`, feedbackPayload);
    } else {
      await api.post('feedback/', feedbackPayload);
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
  } catch (error) {
    console.error('Feedback submission error:', error);
    console.log("Error details:", error.response?.data); // 🔍 Log backend response
    alert("Feedback submission failed. Check console.");
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
        disabled={!!initialData} // Disable in edit mode
      >
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option
            key={emp.id}
            value={emp.emp_id}
          >
            {emp.name} ({emp.emp_id}) {emp.user_id ? '' : ' - Not Registered'}
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
        placeholder="Tags (e.g. teamwork, communication)"
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
