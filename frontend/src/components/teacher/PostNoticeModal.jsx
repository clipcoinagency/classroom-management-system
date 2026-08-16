import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createNotice } from '../../api/notices';
import './TeacherModals.css';

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low', pillClass: 'pill-success' },
  { value: 'MEDIUM', label: 'Medium', pillClass: 'pill-warning' },
  { value: 'HIGH', label: 'High', pillClass: 'pill-danger' },
];

export default function PostNoticeModal({ onClose, onSaved }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const saved = await createNotice({
        title,
        message,
        priority,
        postedBy: user.name,
      });
      onSaved(saved);
    } catch (err) {
      setError('Could not post notice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card teacher-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="teacher-modal-title">Post Notice</h2>

        <form onSubmit={handleSave}>
          <div className="teacher-modal-section">
            <label htmlFor="notice-title">Title</label>
            <input
              id="notice-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CIE-2 Postponed to Next Monday"
              required
            />
          </div>

          <div className="teacher-modal-section">
            <label htmlFor="notice-message">Message</label>
            <textarea
              id="notice-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Details for the class…"
              required
            />
          </div>

          <div className="teacher-modal-section">
            <label>Priority</label>
            <div className="priority-selector">
              {PRIORITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`pill priority-option ${option.pillClass}${
                    priority === option.value ? ' priority-option-active' : ''
                  }`}
                  onClick={() => setPriority(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="teacher-modal-error">{error}</p>}

          <div className="teacher-modal-actions">
            <button type="button" className="teacher-modal-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="teacher-modal-save-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Posting…' : 'Post Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
