import './NoticeCard.css';

const PRIORITY_STYLES = {
  HIGH: { pillClass: 'pill-danger', borderColor: 'var(--color-danger-text)', label: 'High' },
  MEDIUM: { pillClass: 'pill-warning', borderColor: 'var(--color-warning-text)', label: 'Medium' },
  LOW: { pillClass: 'pill-success', borderColor: 'var(--color-success-text)', label: 'Low' },
};

function formatPostedAt(dateString) {
  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function NoticeCard({ notice }) {
  const style = PRIORITY_STYLES[notice.priority] ?? PRIORITY_STYLES.LOW;

  return (
    <div className="card notice-card" style={{ borderLeftColor: style.borderColor }}>
      <div className="notice-card-header">
        <h3 className="notice-card-title">{notice.title}</h3>
        <span className={`pill ${style.pillClass}`}>{style.label}</span>
      </div>
      <p className="notice-card-message">{notice.message}</p>
      <p className="notice-card-meta">
        {notice.postedBy} · {formatPostedAt(notice.postedAt)}
      </p>
    </div>
  );
}
