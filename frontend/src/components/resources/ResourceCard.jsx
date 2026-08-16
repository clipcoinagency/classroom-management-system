import { useState } from 'react';
import { downloadResource } from '../../api/resources';
import './ResourceCard.css';

const FILE_STYLES = {
  PDF: { icon: '📕', bg: 'var(--color-danger-bg)' },
  DOC: { icon: '📘', bg: 'var(--color-info-bg)' },
  DOCX: { icon: '📘', bg: 'var(--color-info-bg)' },
  ZIP: { icon: '📙', bg: 'var(--color-warning-bg)' },
  TXT: { icon: '📃', bg: 'var(--color-neutral-bg)' },
};
const DEFAULT_FILE_STYLE = { icon: '📗', bg: 'var(--color-success-bg)' };

function formatUploadedAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
}

export default function ResourceCard({ resource }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const fileStyle = FILE_STYLES[resource.fileType] ?? DEFAULT_FILE_STYLE;

  async function handleDownload() {
    setIsDownloading(true);
    try {
      await downloadResource(resource.id, resource.fileName);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="card resource-card">
      <span className="resource-card-icon" style={{ background: fileStyle.bg }} aria-hidden="true">
        {fileStyle.icon}
      </span>
      <h3 className="resource-card-title">{resource.fileName}</h3>
      <p className="resource-card-meta">
        Uploaded {formatUploadedAgo(resource.uploadedAt)} · {resource.uploadedBy}
      </p>
      <button
        type="button"
        className="resource-card-download-btn"
        onClick={handleDownload}
        disabled={isDownloading}
      >
        {isDownloading ? 'Downloading…' : 'Download →'}
      </button>
    </div>
  );
}
