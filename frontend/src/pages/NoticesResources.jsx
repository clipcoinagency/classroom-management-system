import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import NoticeCard from '../components/notices/NoticeCard';
import ResourceCard from '../components/resources/ResourceCard';
import PostNoticeModal from '../components/teacher/PostNoticeModal';
import UploadResourceModal from '../components/teacher/UploadResourceModal';
import { useAuth } from '../context/AuthContext';
import { getNotices } from '../api/notices';
import { getResources } from '../api/resources';
import './NoticesResources.css';

export default function NoticesResources() {
  const { user } = useAuth();
  const isTeacher = user?.role === 'TEACHER';

  const [notices, setNotices] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPostNotice, setShowPostNotice] = useState(false);
  const [showUploadResource, setShowUploadResource] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [noticesData, resourcesData] = await Promise.all([getNotices(), getResources()]);
        if (cancelled) return;
        setNotices([...noticesData].sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt)));
        setResources(
          [...resourcesData].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
        );
      } catch (err) {
        if (!cancelled) setError('Could not load notices and resources. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function showToast(message) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  }

  function handleNoticeSaved(savedNotice) {
    setNotices((prev) =>
      [savedNotice, ...prev].sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
    );
    setShowPostNotice(false);
    showToast('Notice posted!');
  }

  function handleResourceSaved(savedResource) {
    setResources((prev) =>
      [savedResource, ...prev].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    );
    setShowUploadResource(false);
    showToast('Resource uploaded!');
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-content">
        <div className="notices-resources-header">
          <h1>Notices & Class Resources</h1>
          {isTeacher && (
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
          )}
        </div>

        {loading ? (
          <p className="dashboard-status">Loading notices and resources…</p>
        ) : error ? (
          <p className="dashboard-status">{error}</p>
        ) : (
          <div className="notices-resources-grid">
            <section>
              <h2 className="section-title">📢 Notices Feed</h2>
              {notices.length === 0 ? (
                <p className="dashboard-status">No notices yet.</p>
              ) : (
                <div className="notices-feed">
                  {notices.map((notice) => (
                    <NoticeCard key={notice.id} notice={notice} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="section-title">📁 Class Resources</h2>
              {resources.length === 0 ? (
                <p className="dashboard-status">No resources yet</p>
              ) : (
                <div className="resources-grid">
                  {resources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
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
