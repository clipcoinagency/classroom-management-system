import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { uploadResource } from '../../api/resources';
import './TeacherModals.css';

export default function UploadResourceModal({ onClose, onSaved }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
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
    if (!file) {
      setError('Please choose a file to upload.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const saved = await uploadResource({ file, title, uploadedBy: user.name });
      onSaved(saved);
    } catch (err) {
      setError('Could not upload the file. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card teacher-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="teacher-modal-title">Upload Resource</h2>

        <form onSubmit={handleSave}>
          <div className="teacher-modal-section">
            <label htmlFor="resource-title">Title</label>
            <input
              id="resource-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Spring Boot Basics"
              required
            />
          </div>

          <label
            htmlFor="resource-file"
            className={`teacher-modal-dropzone${isDragging ? ' teacher-modal-dropzone-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input id="resource-file" type="file" onChange={handleFileChange} hidden />
            <span>{file ? `📎 ${file.name}` : '📎 Drag & drop a file here, or click to browse'}</span>
          </label>

          {error && <p className="teacher-modal-error">{error}</p>}

          <div className="teacher-modal-actions">
            <button type="button" className="teacher-modal-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="teacher-modal-save-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Uploading…' : 'Upload Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
