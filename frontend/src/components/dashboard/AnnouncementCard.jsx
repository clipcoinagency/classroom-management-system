import './AnnouncementCard.css';

const PRIORITY_STYLES = {
  HIGH: { pillClass: 'pill-danger', borderColor: 'var(--color-danger-text)', label: 'High' },
  MEDIUM: { pillClass: 'pill-warning', borderColor: 'var(--color-warning-text)', label: 'Medium' },
  LOW: { pillClass: 'pill-success', borderColor: 'var(--color-success-text)', label: 'Low' },
};

function timeAgo(dateString) {
  const posted = new Date(dateString);
  const diffMs = Date.now() - posted.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Posted just now';
  if (diffHours < 24) return `Posted ${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Posted yesterday';
  return `Posted ${diffDays} days ago`;
}

export default function AnnouncementCard({ notice }) {
  const style = PRIORITY_STYLES[notice.priority] ?? PRIORITY_STYLES.LOW;

  return (
    <div className="card announcement-card" style={{ borderLeftColor: style.borderColor }}>
      <div>
        <h3 className="announcement-title">{notice.title}</h3>
        <p className="announcement-meta">
          {notice.postedBy} · {timeAgo(notice.postedAt)}
        </p>
      </div>
      <span className={`pill ${style.pillClass}`}>{style.label}</span>
    </div>
  );
}
