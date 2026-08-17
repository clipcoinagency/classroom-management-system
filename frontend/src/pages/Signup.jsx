import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import './Signup.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields) {
  const errors = {};

  if (!fields.name.trim()) errors.name = 'Full name is required';
  if (!fields.usn.trim()) errors.usn = 'Roll number is required';

  if (!fields.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_PATTERN.test(fields.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!fields.password) {
    errors.password = 'Password is required';
  } else if (fields.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (fields.confirmPassword !== fields.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!fields.role) errors.role = 'Please select a role';

  return errors;
}

export default function Signup() {
  const [name, setName] = useState('');
  const [usn, setUsn] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = validate({ name, usn, email, password, confirmPassword, role });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitError('');
    setIsSubmitting(true);

    try {
      await register({ name, usn, email, password, role });
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const apiMessage = err.response?.data;
      setSubmitError(
        typeof apiMessage === 'string' ? apiMessage : 'Could not create account. Please try again.'
      );
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
            <p className="auth-subtitle">Create your account</p>
          </div>
        </div>

        {isSuccess ? (
          <p className="signup-success">Account created! Redirecting to login…</p>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="auth-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
              {fieldErrors.name && <p className="auth-field-error">{fieldErrors.name}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="usn">Roll Number</label>
              <input
                id="usn"
                type="text"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                placeholder="Enter your roll number"
              />
              {fieldErrors.usn && <p className="auth-field-error">{fieldErrors.usn}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              {fieldErrors.email && <p className="auth-field-error">{fieldErrors.email}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="role">Role</label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="" disabled>
                  Select your role
                </option>
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
              </select>
              {fieldErrors.role && <p className="auth-field-error">{fieldErrors.role}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              {fieldErrors.password && <p className="auth-field-error">{fieldErrors.password}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
              {fieldErrors.confirmPassword && (
                <p className="auth-field-error">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </button>

            {submitError && <p className="auth-error">{submitError}</p>}
          </form>
        )}

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-footer-link">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
