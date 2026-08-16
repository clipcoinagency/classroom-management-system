import { useEffect, useState } from 'react';
import './ExperimentCard.css';

const DIFFICULTY_STYLES = {
  EASY: 'pill-success',
  MEDIUM: 'pill-warning',
  HARD: 'pill-danger',
};

function getStatus(percentage) {
  if (percentage >= 100) return { label: 'Completed', pillClass: 'pill-success' };
  if (percentage > 0) return { label: 'In Progress', pillClass: 'pill-info' };
  return { label: 'Not Started', pillClass: 'pill-neutral' };
}

export default function ExperimentCard({ experiment, percentage, onUpdate, style }) {
  const [barWidth, setBarWidth] = useState(0);
  const status = getStatus(percentage);
  const difficultyClass = DIFFICULTY_STYLES[experiment.difficulty] ?? 'pill-neutral';

  useEffect(() => {
    const timer = setTimeout(() => setBarWidth(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="card experiment-card" style={style}>
      <div className="experiment-card-header">
        <h3>
          Exp {experiment.number}: {experiment.title}
        </h3>
        <span className={`pill ${difficultyClass}`}>
          {experiment.difficulty?.charAt(0) + experiment.difficulty?.slice(1).toLowerCase()}
        </span>
      </div>

      <p className="experiment-card-category">{experiment.category}</p>

      <div className="experiment-progress-track">
        <div className="experiment-progress-fill" style={{ width: `${barWidth}%` }} />
      </div>

      <div className="experiment-card-footer">
        <span className={`pill ${status.pillClass}`}>{status.label}</span>
        <button type="button" className="experiment-update-btn" onClick={onUpdate}>
          Update →
        </button>
      </div>
    </div>
  );
}
