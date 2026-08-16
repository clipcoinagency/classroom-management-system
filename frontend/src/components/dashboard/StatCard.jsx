import './StatCard.css';

export default function StatCard({ icon, iconBg, value, label }) {
  return (
    <div className="card stat-card">
      <span className="stat-card-icon" style={{ background: iconBg }} aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="stat-card-value">{value}</p>
        <p className="stat-card-label">{label}</p>
      </div>
    </div>
  );
}
