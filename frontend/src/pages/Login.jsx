import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="auth-page">
      <div className="auth-blob auth-blob-1" aria-hidden="true" />
      <div className="auth-blob auth-blob-2" aria-hidden="true" />
      <div className="auth-blob auth-blob-3" aria-hidden="true" />

      <div className="card auth-card">
        <div className="auth-header">
          <span className="auth-logo" aria-hidden="true">
            🎓
          </span>
          <div>
            <h1 className="auth-title">ClassConnect</h1>
            <p className="auth-subtitle">5th Sem ISE · FSD Class Portal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in…' : 'Login to Dashboard →'}
          </button>
        </form>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <button type="button" className="login-face-btn" disabled>
          🔒 Face login coming soon
        </button>

        <p className="auth-footer">
          New to class? <Link to="/signup" className="auth-footer-link">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
