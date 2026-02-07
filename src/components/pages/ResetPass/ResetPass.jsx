import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import '../Login/Login.css'; // reuse same styles

const API_URL = import.meta.env.VITE_API_URL || '';

export default function ResetPass() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';
  const userId = searchParams.get('id') || ''; // if backend supplies id in link
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token || !userId) {
      setApiError('Invalid or missing reset token. Request a new link.');
    }
  }, [token, userId]);

  function validatePassword(pw) {
    if (pw.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pw)) return 'Password must include an uppercase letter';
    if (!/[a-z]/.test(pw)) return 'Password must include a lowercase letter';
    if (!/\d/.test(pw)) return 'Password must include a number';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    setSuccess('');

    if (!token || !userId) {
      setApiError('Invalid reset link.');
      return;
    }

    const pwErr = validatePassword(password);
    if (pwErr) {
      setApiError(pwErr);
      return;
    }
    if (password !== confirm) {
      setApiError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-pass`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, id: userId, password }),

      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setSuccess('Password reset successful. Redirecting to sign in...');
        setTimeout(() => navigate('/login'), 1400);
      } else {
        setApiError(data?.error || 'Reset failed. Token may be invalid or expired.');
      }
    } catch (err) {
      console.error(err);
      setApiError('Something went wrong. Try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="12" fill="url(#logo-gradient)"/>
                <path d="M24 14L32 20V28L24 34L16 28V20L24 14Z" fill="white" fillOpacity="0.9"/>
                <defs>
                  <linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48">
                    <stop stopColor="#4361ee"/>
                    <stop offset="1" stopColor="#7209b7"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="auth-title">Reset password</h1>
            <p className="auth-subtitle">Create a new password for your account.</p>
          </div>

          {apiError && <div className="alert alert--error">{apiError}</div>}
          {success && <div className="alert">{success}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="rp-password" className="form-label">New password</label>
              <div className="input-wrapper">
                <input
                  id="rp-password"
                  name="newPassword"
                  type="password"
                  className="form-input"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="rp-confirm" className="form-label">Confirm password</label>
              <div className="input-wrapper">
                <input
                  id="rp-confirm"
                  name="confirm"
                  type="password"
                  className="form-input"
                  placeholder="Confirm password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset password'}
            </button>

            <div className="auth-divider"><span>OR</span></div>

            <div className="auth-footer">
              <p className="auth-footer-text">
                <Link to="/login" className="link link--primary">Back to sign in</Link>
              </p>
            </div>
          </form>
        </div>

        <div className="auth-bottom">
          <p className="auth-copyright">© 2026 WorkFlow. All rights reserved.</p>
          <div className="auth-links">
            <a href="#" className="link link--muted">Privacy Policy</a>
            <span className="auth-links-separator">•</span>
            <a href="#" className="link link--muted">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
}
