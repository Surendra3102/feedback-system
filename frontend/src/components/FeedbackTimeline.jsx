// src/components/FeedbackTimeline.jsx
import React, { useState } from 'react';
import '../styles/FeedbackTimeline.css';

export default function FeedbackTimeline({ feedbacks, onAcknowledge, onComment }) {
  const [comments, setComments] = useState({});

  const handleInputChange = (id, value) => {
    setComments({ ...comments, [id]: value });
  };

  const handleSubmitComment = (id) => {
    if (comments[id]?.trim()) {
      onComment(id, comments[id]);
    }
  };

  return (
    <div className="feedback-timeline">
      <h3 className="timeline-title">Your Feedback Timeline</h3>

      {feedbacks.length === 0 ? (
        <p className="no-feedback">No feedback available yet.</p>
      ) : (
        feedbacks.map((fb) => (
          <div key={fb.id} className="timeline-card">
            <p><strong>From:</strong> {fb.manager_name || `Manager #${fb.manager}`}</p>
            <p><strong>Strengths:</strong> {fb.strengths}</p>
            <p><strong>Improvements:</strong> {fb.improvements}</p>
            <p><strong>Sentiment:</strong> {fb.sentiment}</p>
            <p><strong>Tags:</strong> {fb.tags}</p>
            <p><strong>Acknowledged:</strong> {fb.acknowledged ? '✅' : '❌'}</p>
            <p><strong>Your Comment:</strong> {fb.employee_comment || 'None'}</p>

            {!fb.acknowledged && (
              <button className="ack-btn" onClick={() => onAcknowledge(fb.id)}>Acknowledge</button>
            )}

            <input
              className="comment-input"
              placeholder="Add comment"
              value={comments[fb.id] || ''}
              onChange={(e) => handleInputChange(fb.id, e.target.value)}
            />
            <button
              className="submit-comment-btn"
              onClick={() => handleSubmitComment(fb.id)}
            >
              Submit Comment
            </button>
          </div>
        ))
      )}
    </div>
  );
}
