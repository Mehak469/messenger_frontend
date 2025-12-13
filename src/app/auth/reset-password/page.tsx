// src/app/auth/reset-password/page.tsx
"use client";
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '../auth.css';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_BASE_URL="http://127.0.0.1:8000/api/v1"



interface ResetPasswordState {
  newPassword: string;
  confirmPassword: string;
  loading: boolean;
  manualToken: string;
}

function ResetPasswordContent() {
  const [state, setState] = useState<ResetPasswordState>({
    newPassword: '',
    confirmPassword: '',
    loading: false,
    manualToken: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showManualToken, setShowManualToken] = useState(false);
  
  const searchParams = useSearchParams();
  const urlToken = searchParams.get('token');
  

  // Use URL token if available, otherwise use manual token
  const token = urlToken || (showManualToken ? state.manualToken : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    if (!state.newPassword || !state.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (state.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (state.newPassword !== state.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setState(prev => ({ ...prev, loading: true }));
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/users/reset-password`, {
      // const response = await fetch(`${URL}/users/reset-password`
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          new_password: state.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to reset password');
      }

      setMessage('Password reset successfully! You can now sign in with your new password.');
      setState(prev => ({ 
        newPassword: '', 
        confirmPassword: '', 
        loading: false,
        manualToken: ''
      }));
      setShowManualToken(false);

    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // If no token in URL and not manually entered, show token input form
  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              <i className="fas fa-key"></i>
            </div>
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">
              Enter your reset token to continue
            </p>
          </div>

          <div className="auth-form">
            <div className="form-group">
              <label htmlFor="manualToken" className="form-label">Reset Token</label>
              <input 
                type="text" 
                id="manualToken" 
                className="form-input" 
                placeholder="Paste your reset token here" 
                value={state.manualToken}
                onChange={(e) => setState(prev => ({ ...prev, manualToken: e.target.value }))}
                required
              />
            </div>

            <button 
              type="button"
              className="auth-button" 
              onClick={() => {
                if (state.manualToken.trim()) {
                  setShowManualToken(true);
                  setError('');
                } else {
                  setError('Please enter a reset token');
                }
              }}
            >
              Continue to Reset Password
            </button>

            <div className="auth-footer">
              <Link href="/auth/forgot-password" className="auth-link">
                Get a new reset token
              </Link>
              <Link href="/auth" className="auth-link" style={{marginTop: '10px'}}>
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <i className="fas fa-lock"></i>
          </div>
          <h1 className="auth-title">Set New Password</h1>
          <p className="auth-subtitle">
            Enter your new password below.
          </p>
        </div>

        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input 
                type="password" 
                id="newPassword" 
                className="form-input" 
                placeholder="••••••••" 
                value={state.newPassword}
                onChange={(e) => setState(prev => ({ ...prev, newPassword: e.target.value }))}
                required 
                disabled={state.loading}
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                className="form-input" 
                placeholder="••••••••" 
                value={state.confirmPassword}
                onChange={(e) => setState(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required 
                disabled={state.loading}
                minLength={6}
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

            <button 
              type="submit" 
              className="auth-button" 
              disabled={state.loading}
            >
              {state.loading ? 'Resetting...' : 'Reset Password'}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Loading...</h1>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}