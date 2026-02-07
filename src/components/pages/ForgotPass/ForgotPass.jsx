import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Login/Login.css'; // reuse the same login styles

const API_URL = import.meta.env.VITE_API_URL || '';

export default function ForgotPass() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    setMessage('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setApiError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/auth/forgot-pass`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // Always show a neutral success message for security
      setMessage('If an account exists for that email, a password reset link has been sent.');
      // Optionally log failure details for debugging
      if (!res.ok) {
        const debug = await res.json().catch(() => null);
        console.debug('forgot-password response', res.status, debug);
      }
    } catch (err) {
      console.error(err);
      setApiError('Something went wrong. Please try again later.');
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
              {/* reuse same logo as login */}
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
            <h1 className="auth-title">Forgot password</h1>
            <p className="auth-subtitle">Enter your email and we’ll send a reset link.</p>
          </div>

          {apiError && (
            <div className="alert alert--error">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <span>{apiError}</span>
            </div>
          )}

          {message && (
            <div className="alert">
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="fp-email" className="form-label">Email Address</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                <input
                  id="fp-email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
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
          <p className="auth-copyright">© 2025 PayFlow. All rights reserved.</p>
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
