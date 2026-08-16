import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import AttendanceModal from '../components/attendance/AttendanceModal';
import { useAuth } from '../context/AuthContext';
import { getStudentAttendance } from '../api/attendance';
import './Attendance.css';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export default function Attendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  function loadHistory() {
    return getStudentAttendance(user.id).then((data) =>
      setRecords([...data].sort((a, b) => new Date(b.markedAt) - new Date(a.markedAt)))
    );
  }

  useEffect(() => {
    let cancelled = false;

    loadHistory()
      .catch(() => {
        if (!cancelled) setError('Could not load attendance history.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  function handleModalClose() {
    setShowModal(false);
    loadHistory().catch(() => {});
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-content">
        <div className="attendance-page-header">
          <h1>Attendance</h1>
          <p>Mark today's attendance using face recognition.</p>
        </div>

        <div className="card attendance-cta-card">
          <span className="attendance-cta-icon" aria-hidden="true">
            📷
          </span>
          <div className="attendance-cta-text">
            <h2>Mark Today's Attendance</h2>
            <p>Scan your face to confirm you're present.</p>
          </div>
          <button type="button" className="attendance-cta-btn" onClick={() => setShowModal(true)}>
            Mark Attendance
          </button>
        </div>

        <section>
          <h2 className="section-title">📅 Attendance History</h2>
          {loading ? (
            <p className="dashboard-status">Loading…</p>
          ) : error ? (
            <p className="dashboard-status">{error}</p>
          ) : records.length === 0 ? (
            <p className="dashboard-status">No attendance marked yet.</p>
          ) : (
            <div className="attendance-history-list">
              {records.map((record) => (
                <div key={record.id} className="card attendance-history-row">
                  <span className="pill pill-success">{record.status}</span>
                  <span>{formatDate(record.markedAt)}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {showModal && <AttendanceModal onClose={handleModalClose} />}
    </div>
  );
}
