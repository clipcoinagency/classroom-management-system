import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  loadModels,
  detectFaceDescriptor,
  calculateEuclideanDistance,
  MATCH_THRESHOLD,
} from '../../utils/faceRecognition';
import { markAttendance } from '../../api/attendance';
import './AttendanceModal.css';

const STATUS_TEXT = {
  loading: 'Loading face recognition…',
  camera: 'Requesting camera access…',
  positioning: 'Position your face in the frame',
  scanning: 'Scanning…',
  success: 'Attendance marked!',
  'no-match': 'Face not recognized. Try again?',
  error: 'Something went wrong',
};

const PROGRESS_BY_STAGE = {
  loading: 15,
  camera: 30,
  positioning: 50,
  scanning: 80,
  success: 100,
  'no-match': 50,
  error: 0,
};

function faceDescriptorKey(userId) {
  return `classconnect_face_${userId}`;
}

export default function AttendanceModal({ onClose }) {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const activeRef = useRef(true);
  const stageRef = useRef('loading');

  const [stage, setStage] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  function setStageSafe(next) {
    if (!activeRef.current) return;
    stageRef.current = next;
    setStage(next);
  }

  function stopScanLoop() {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  }

  function stopCamera() {
    stopScanLoop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }

  // Compares a freshly captured descriptor against the student's stored one
  // (or enrolls it, if this is their first scan) and marks attendance on a match.
  async function evaluateDescriptor(descriptor) {
    const storageKey = faceDescriptorKey(user.id);
    const storedRaw = localStorage.getItem(storageKey);

    let isMatch;
    if (!storedRaw) {
      localStorage.setItem(storageKey, JSON.stringify(descriptor));
      isMatch = true;
    } else {
      const storedDescriptor = JSON.parse(storedRaw);
      isMatch = calculateEuclideanDistance(descriptor, storedDescriptor) < MATCH_THRESHOLD;
    }

    if (!isMatch) {
      setStageSafe('no-match');
      return;
    }

    try {
      await markAttendance(user.id);
      stopCamera();
      setStageSafe('success');
      setTimeout(() => activeRef.current && onClose(), 2000);
    } catch (err) {
      setErrorMessage('Recognized you, but could not save attendance. Please try again.');
      setStageSafe('error');
    }
  }

  // Polls the video feed for a face; once found, extracts its descriptor and evaluates it.
  function startScanLoop() {
    setStageSafe('positioning');
    scanIntervalRef.current = setInterval(async () => {
      if (stageRef.current === 'scanning' || !videoRef.current) return;

      const descriptor = await detectFaceDescriptor(videoRef.current);
      if (!descriptor || !activeRef.current) return;

      stopScanLoop();
      setStageSafe('scanning');
      setTimeout(() => activeRef.current && evaluateDescriptor(descriptor), 500);
    }, 700);
  }

  useEffect(() => {
    activeRef.current = true;

    async function start() {
      try {
        await loadModels();
        if (!activeRef.current) return;

        setStageSafe('camera');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });
        if (!activeRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        startScanLoop();
      } catch (err) {
        if (!activeRef.current) return;
        if (err.name === 'NotAllowedError') {
          setErrorMessage('Camera access was denied. Allow camera access and try again.');
        } else if (err.name === 'NotFoundError') {
          setErrorMessage('No camera was found on this device.');
        } else {
          setErrorMessage('Could not start face recognition. Please try again.');
        }
        setStageSafe('error');
      }
    }

    start();

    return () => {
      activeRef.current = false;
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCancel() {
    stopCamera();
    onClose();
  }

  const isScanningPhase = stage === 'positioning' || stage === 'scanning';
  const statusDotClass =
    stage === 'success'
      ? 'attendance-dot-success'
      : stage === 'no-match' || stage === 'error'
        ? 'attendance-dot-error'
        : 'attendance-dot-active';

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="card attendance-modal" onClick={(e) => e.stopPropagation()}>
        <div className="attendance-modal-header">
          <span className="attendance-modal-logo" aria-hidden="true">
            🧠
          </span>
          <div>
            <h2 className="attendance-modal-title">Mark Attendance</h2>
            <p className="attendance-modal-subtitle">Look straight into the camera</p>
          </div>
        </div>

        <div className="attendance-video-frame">
          <video ref={videoRef} className="attendance-video" muted playsInline />

          {isScanningPhase && <div className="attendance-face-guide" />}
          {isScanningPhase && (
            <div
              className={`attendance-scan-line${stage === 'scanning' ? ' attendance-scan-line-fast' : ''}`}
            />
          )}

          <span className="attendance-corner attendance-corner-tl" />
          <span className="attendance-corner attendance-corner-tr" />
          <span className="attendance-corner attendance-corner-bl" />
          <span className="attendance-corner attendance-corner-br" />

          {(stage === 'loading' || stage === 'camera') && (
            <div className="attendance-video-placeholder">📷</div>
          )}
        </div>

        <div className="attendance-status-row">
          <span className={`attendance-status-dot ${statusDotClass}`} />
          <span>{stage === 'error' ? errorMessage || STATUS_TEXT.error : STATUS_TEXT[stage]}</span>
        </div>

        <div className="attendance-progress-track">
          <div className="attendance-progress-fill" style={{ width: `${PROGRESS_BY_STAGE[stage]}%` }} />
        </div>

        <div className="attendance-modal-actions">
          <button type="button" className="attendance-cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          {stage === 'no-match' && (
            <button type="button" className="attendance-retry-btn" onClick={startScanLoop}>
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
