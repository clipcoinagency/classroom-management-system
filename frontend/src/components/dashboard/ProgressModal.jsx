import { useState } from 'react';
import { updateProgress } from '../../api/progress';
import './ProgressModal.css';

const PERCENTAGE_OPTIONS = [0, 25, 50, 75, 100];

export default function ProgressModal({ experiment, studentId, initialPercentage, onClose, onSaved }) {
  const [percentage, setPercentage] = useState(initialPercentage ?? 0);
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleFileChange(e) {
    setFile(e.target.files[0] ?? null);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const saved = await updateProgress({
        studentId,
        experimentId: experiment.id,
        percentage,
        notes,
        fileUrl: file ? file.name : null,
      });
      onSaved(saved);
    } catch (err) {
      setError('Could not save progress. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card progress-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="progress-modal-title">Update Progress</h2>
        <p className="progress-modal-subtitle">
          Exp {experiment.number} · {experiment.title}
        </p>

        <form onSubmit={handleSave}>
          <div className="progress-modal-section">
            <label>Completion</label>
            <div className="percentage-selector">
              {PERCENTAGE_OPTIONS.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`percentage-btn${percentage === value ? ' percentage-btn-active' : ''}`}
                  onClick={() => setPercentage(value)}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>

          <div className="progress-modal-section">
            <label htmlFor="progress-notes">Notes / What you learned</label>
            <textarea
              id="progress-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you implement? Any blockers?"
            />
          </div>

          <label
            htmlFor="progress-file"
            className={`progress-dropzone${isDragging ? ' progress-dropzone-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input id="progress-file" type="file" onChange={handleFileChange} hidden />
            <span>
              {file ? `📎 ${file.name}` : '📎 Drag & drop your code file here, or click to browse'}
            </span>
          </label>

          {error && <p className="progress-modal-error">{error}</p>}

          <div className="progress-modal-actions">
            <button type="button" className="progress-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="progress-save-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save Progress'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
