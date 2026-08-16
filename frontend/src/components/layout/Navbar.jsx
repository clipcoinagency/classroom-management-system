import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AttendanceModal from '../attendance/AttendanceModal';
import './Navbar.css';

const STUDENT_HOME = { to: '/dashboard', label: 'Dashboard' };
const TEACHER_HOME = { to: '/teacher', label: 'Class Overview' };

const SHARED_LINKS = [
  { to: '/resources', label: 'Resources' },
  { to: '/notices', label: 'Notices' },
  { to: '/attendance', label: 'Attendance' },
];

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const isTeacher = user?.role === 'TEACHER';
  const navLinks = [isTeacher ? TEACHER_HOME : STUDENT_HOME, ...SHARED_LINKS];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo" aria-hidden="true">
          🎓
        </span>
        <span className="navbar-title">ClassConnect</span>
      </div>

      <nav className="navbar-links">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `navbar-link${isActive ? ' navbar-link-active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="navbar-user">
        {!isTeacher && (
          <button
            type="button"
            className="navbar-attendance-btn"
            onClick={() => setShowAttendanceModal(true)}
            aria-label="Mark Attendance"
          >
            📷 <span>Mark Attendance</span>
          </button>
        )}
        <span className={`pill navbar-role ${isTeacher ? 'pill-rose' : 'pill-info'}`}>
          {user?.role ?? 'STUDENT'}
        </span>
        <span className={`navbar-avatar${isTeacher ? ' navbar-avatar-teacher' : ''}`}>
          {getInitials(user?.name)}
        </span>
        <button type="button" className="navbar-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {showAttendanceModal && (
        <AttendanceModal onClose={() => setShowAttendanceModal(false)} />
      )}
    </header>
  );
}
