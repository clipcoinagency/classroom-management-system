import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroBanner from '../components/shared/HeroBanner';
import StatCard from '../components/dashboard/StatCard';
import StudentRow from '../components/teacher/StudentRow';
import PostNoticeModal from '../components/teacher/PostNoticeModal';
import UploadResourceModal from '../components/teacher/UploadResourceModal';
import { getStudents } from '../api/users';
import { getExperiments } from '../api/experiments';
import { getStudentProgress } from '../api/progress';
import { getNotices } from '../api/notices';
import { getAllAttendance } from '../api/attendance';
import './TeacherDashboard.css';

function isToday(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function formatLastActive(dateString) {
  if (!dateString) return 'No activity yet';

  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (startOfDay(new Date()) - startOfDay(new Date(dateString))) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [notices, setNotices] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [progressByStudent, setProgressByStudent] = useState(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPostNotice, setShowPostNotice] = useState(false);
  const [showUploadResource, setShowUploadResource] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadTeacherDashboard() {
      try {
        const [studentsData, experimentsData, noticesData, attendanceData] = await Promise.all([
          getStudents(),
          getExperiments(),
          getNotices(),
          getAllAttendance(),
        ]);

        const progressLists = await Promise.all(
          studentsData.map((student) => getStudentProgress(student.id))
        );

        if (cancelled) return;

        setStudents(studentsData);
        setExperiments(experimentsData);
        setNotices(noticesData);
        setAttendance(attendanceData);
        setProgressByStudent(
          new Map(studentsData.map((student, index) => [student.id, progressLists[index]]))
        );
      } catch (err) {
        if (!cancelled) setError('Could not load class data. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTeacherDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  function showToast(message) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  }

  function handleNoticeSaved(savedNotice) {
    setNotices((prev) => [savedNotice, ...prev]);
    setShowPostNotice(false);
    showToast('Notice posted!');
  }

  function handleResourceSaved() {
    setShowUploadResource(false);
    showToast('Resource uploaded!');
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <main className="dashboard-content">
          <p className="dashboard-status">Loading class overview…</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <main className="dashboard-content">
          <p className="dashboard-status">{error}</p>
        </main>
      </div>
    );
  }

  const totalExperiments = experiments.length;
  const totalStudents = students.length;

  function getCompletionPercent(studentId) {
    const progress = progressByStudent.get(studentId) ?? [];
    const completedCount = progress.filter((p) => p.percentage >= 100).length;
    return totalExperiments ? Math.round((completedCount / totalExperiments) * 100) : 0;
  }

  function getLastActive(studentId) {
    const progress = progressByStudent.get(studentId) ?? [];
    if (progress.length === 0) return formatLastActive(null);
    const latest = progress.reduce((max, p) => (p.updatedAt > max ? p.updatedAt : max), progress[0].updatedAt);
    return formatLastActive(latest);
  }

  function getAttendanceDaysCount(studentId) {
    return attendance.filter((a) => a.studentId === studentId).length;
  }

  const presentTodayCount = new Set(
    attendance.filter((a) => isToday(a.markedAt)).map((a) => a.studentId)
  ).size;

  const avgCompletion = totalStudents
    ? Math.round(
        students.reduce((sum, student) => sum + getCompletionPercent(student.id), 0) / totalStudents
      )
    : 0;

  const filteredStudents = students.filter((student) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      student.name?.toLowerCase().includes(term) || student.usn?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-content">
        <HeroBanner
          title="FSD Class 5-B Overview"
          subtitle={`${totalStudents} students · ${totalExperiments} experiments · Semester progress: ${avgCompletion}%`}
          icon="📊"
        />

        <div className="stats-row stats-row-4">
          <StatCard icon="👥" iconBg="var(--color-info-bg)" value={totalStudents} label="Total Students" />
          <StatCard
            icon="📈"
            iconBg="var(--color-success-bg)"
            value={`${avgCompletion}%`}
            label="Avg. Completion"
          />
          <StatCard
            icon="🟢"
            iconBg="var(--color-warning-bg)"
            value={`${presentTodayCount} / ${totalStudents}`}
            label="Present Today"
          />
          <StatCard
            icon="🔔"
            iconBg="var(--color-rose-bg)"
            value={notices.length}
            label="Active Notices"
          />
        </div>

        <div className="teacher-toolbar">
          <div className="teacher-search">
            <span aria-hidden="true">🔍</span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student by name or roll no."
            />
          </div>
          <div className="teacher-actions">
            <button
              type="button"
              className="teacher-btn-secondary"
              onClick={() => setShowUploadResource(true)}
            >
              + Upload Resource
            </button>
            <button
              type="button"
              className="teacher-btn-primary"
              onClick={() => setShowPostNotice(true)}
            >
              + Post Notice
            </button>
          </div>
        </div>

        <div className="card teacher-table-card">
          {filteredStudents.length === 0 ? (
            <p className="dashboard-status">No students match your search.</p>
          ) : (
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No.</th>
                  <th>Experiments Progress</th>
                  <th>Last Active</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    percentage={getCompletionPercent(student.id)}
                    lastActive={getLastActive(student.id)}
                    attendance={`${getAttendanceDaysCount(student.id)} days`}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {toastMessage && <div className="dashboard-toast">{toastMessage}</div>}

      {showPostNotice && (
        <PostNoticeModal onClose={() => setShowPostNotice(false)} onSaved={handleNoticeSaved} />
      )}

      {showUploadResource && (
        <UploadResourceModal
          onClose={() => setShowUploadResource(false)}
          onSaved={handleResourceSaved}
        />
      )}
    </div>
  );
}
