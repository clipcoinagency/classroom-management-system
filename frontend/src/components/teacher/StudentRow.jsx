import './StudentRow.css';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function StudentRow({ student, percentage, lastActive, attendance }) {
  return (
    <tr className="student-row">
      <td>
        <div className="student-row-identity">
          <span className="student-row-avatar">{getInitials(student.name)}</span>
          <span className="student-row-name">{student.name}</span>
        </div>
      </td>
      <td>{student.usn || '—'}</td>
      <td>
        <div className="student-row-progress">
          <div className="student-row-progress-track">
            <div className="student-row-progress-fill" style={{ width: `${percentage}%` }} />
          </div>
          <span>{percentage}%</span>
        </div>
      </td>
      <td>{lastActive}</td>
      <td>{attendance}</td>
    </tr>
  );
}
