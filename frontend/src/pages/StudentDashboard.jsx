import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroBanner from '../components/shared/HeroBanner';
import StatCard from '../components/dashboard/StatCard';
import AnnouncementCard from '../components/dashboard/AnnouncementCard';
import ExperimentCard from '../components/dashboard/ExperimentCard';
import ProgressModal from '../components/dashboard/ProgressModal';
import { useAuth } from '../context/AuthContext';
import { getExperiments } from '../api/experiments';
import { getStudentProgress } from '../api/progress';
import { getNotices } from '../api/notices';
import { getStudentAttendance } from '../api/attendance';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [experiments, setExperiments] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [notices, setNotices] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const [experimentsData, progressData, noticesData, attendanceData] = await Promise.all([
          getExperiments(),
          getStudentProgress(user.id),
          getNotices(),
          getStudentAttendance(user.id),
        ]);

        if (cancelled) return;

        setExperiments([...experimentsData].sort((a, b) => a.number - b.number));
        setProgressList(progressData);
        setNotices(noticesData);
        setAttendance(attendanceData);
      } catch (err) {
        if (!cancelled) setError('Could not load your dashboard. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [user.id]);

  function handleProgressSaved(savedProgress) {
    setProgressList((prev) => [
      ...prev.filter((p) => p.experimentId !== savedProgress.experimentId),
      savedProgress,
    ]);
    setSelectedExperiment(null);
    setToastMessage('Progress saved!');
    setTimeout(() => setToastMessage(''), 3000);
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <main className="dashboard-content">
          <p className="dashboard-status">Loading your dashboard…</p>
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

  const progressByExperimentId = new Map(progressList.map((p) => [p.experimentId, p.percentage]));
  const totalExperiments = experiments.length;
  const completedCount = experiments.filter(
    (exp) => (progressByExperimentId.get(exp.id) ?? 0) >= 100
  ).length;
  const completionPercent = totalExperiments
    ? Math.round((completedCount / totalExperiments) * 100)
    : 0;
  const firstName = user.name?.split(' ')[0] ?? user.name;

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-content">
        <HeroBanner
          title={`Welcome back, ${firstName}! 👋`}
          subtitle={`You're ${completionPercent}% through this semester's lab work. Keep going!`}
          icon="🚀"
        />

        <div className="stats-row">
          <StatCard
            icon="📗"
            iconBg="var(--color-info-bg)"
            value={`${completedCount} / ${totalExperiments}`}
            label="Experiments Completed"
          />
          <StatCard
            icon="✅"
            iconBg="var(--color-success-bg)"
            value={attendance.length}
            label="Attendance (Face Check-in)"
          />
          <StatCard
            icon="🔔"
            iconBg="var(--color-warning-bg)"
            value={notices.length}
            label="New Notices"
          />
        </div>

        <section>
          <h2 className="section-title">📢 Announcements</h2>
          {notices.length === 0 ? (
            <p className="dashboard-status">No announcements yet.</p>
          ) : (
            <div className="announcements-list">
              {notices.slice(0, 2).map((notice) => (
                <AnnouncementCard key={notice.id} notice={notice} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="section-title">📝 Lab Experiments Progress</h2>
          <div className="experiments-grid">
            {experiments.map((experiment, index) => (
              <ExperimentCard
                key={experiment.id}
                experiment={experiment}
                percentage={progressByExperimentId.get(experiment.id) ?? 0}
                style={{ animationDelay: `${index * 40}ms` }}
                onUpdate={() => setSelectedExperiment(experiment)}
              />
            ))}
          </div>
        </section>
      </main>

      {toastMessage && <div className="dashboard-toast">{toastMessage}</div>}

      {selectedExperiment && (
        <ProgressModal
          experiment={selectedExperiment}
          studentId={user.id}
          initialPercentage={progressByExperimentId.get(selectedExperiment.id) ?? 0}
          onClose={() => setSelectedExperiment(null)}
          onSaved={handleProgressSaved}
        />
      )}
    </div>
  );
}
