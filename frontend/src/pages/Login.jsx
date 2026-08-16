import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/auth';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginWithSession } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await login(email, password);
      loginWithSession(data.token, {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      navigate(data.role === 'TEACHER' ? '/teacher' : '/dashboard');
    } catch (err) {
      const apiMessage = err.response?.data;
      setError(typeof apiMessage === 'string' ? apiMessage : 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-blob login-blob-1" aria-hidden="true" />
      <div className="login-blob login-blob-2" aria-hidden="true" />
      <div className="login-blob login-blob-3" aria-hidden="true" />

      <div className="card login-card">
        <div className="login-header">
          <span className="login-logo" aria-hidden="true">
            🎓
          </span>
          <div>
            <h1 className="login-title">ClassConnect</h1>
            <p className="login-subtitle">5th Sem ISE · FSD Class Portal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sami.patil@class.edu"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in…' : 'Login to Dashboard →'}
          </button>
        </form>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <button type="button" className="login-face-btn" disabled>
          🔒 Face login coming soon
        </button>

        <p className="login-footer">
          New to class? <span className="login-footer-link">Create an account</span>
        </p>
      </div>
    </div>
  );
}
