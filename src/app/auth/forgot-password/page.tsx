// src/app/auth/forgot-password/page.tsx
"use client";
import { useState } from 'react';
import Link from 'next/link';
import '../auth.css';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const URL="http://127.0.0.1:8000/api/v1"


interface ForgotPasswordState {
  email: string;
  loading: boolean;
}

export default function ForgotPasswordPage() {
  const [state, setState] = useState<ForgotPasswordState>({
    email: '',
    loading: false
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setState(prev => ({ ...prev, loading: true }));
    setError('');
    setMessage('');
    setResetToken('');

    try {
      // const response = await fetch(`${API_BASE_URL}/users/forgot-password`
      const response = await fetch(`${URL}/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: state.email.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to send reset email');
      }

      // Show the reset token and create direct link
      if (data.reset_token) {
        setResetToken(data.reset_token);
        setMessage('Password reset token has been generated. Use the link below to reset your password:');
      } else {
        setMessage('Password reset instructions have been sent to your email!');
        setState(prev => ({ ...prev, email: '' }));
      }

    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <i className="fas fa-key"></i>
          </div>
          <h1 className="auth-title">Reset Your Password</h1>
          <p className="auth-subtitle">
            Enter your email address to get a password reset link.
          </p>
        </div>

        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="form-input" 
                placeholder="you@example.com" 
                value={state.email}
                onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                required 
                disabled={state.loading}
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {message && (
              <div className="success-message">
                {message}
              </div>
            )}

            {/* Reset Token Link */}
            {resetToken && (
              <div className="token-section">
                <Link 
                  href={`/auth/reset-password?token=${encodeURIComponent(resetToken)}`}
                  className="auth-button"
                  style={{display: 'block', textAlign: 'center', marginTop: '10px'}}
                >
                  Reset Your Password
                </Link>
                <div className="token-info">
                  <p>Reset Token: <code>{resetToken}</code></p>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="auth-button" 
              disabled={state.loading}
              style={{marginTop: resetToken ? '15px' : '0'}}
            >
              {state.loading ? 'Generating Token...' : 'Get Reset Link'}
            </button>
          </form>

          <div className="auth-footer">
            <Link href="/auth" className="auth-link">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}