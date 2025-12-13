'use client';
import { useState, useEffect } from 'react';
import './auth.css';
import { useRouter } from 'next/navigation';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_BASE_URL="http://127.0.0.1:8000/api/v1"


interface AuthState {
  isLogin: boolean;
  email: string;
  password: string;
  username: string;
  loading: boolean;
}

interface User {
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  created_at?: Date;
  updated_at?: Date;
}

export default function AuthPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isLogin: true,
    email: '',
    password: '',
    username: '',
    loading: false,
  });

  const [errorMessage, setErrorMessage] = useState('');


  // Toggle between login/register
  const toggleAuthMode = () => {
    setAuthState(prev => ({
      ...prev,
      isLogin: !prev.isLogin,
      username: '',
      email: '',
      password: ''
    }));
    setErrorMessage('');
  };

  // Form validation
  const validateForm = (): boolean => {
    const { email, password, username, isLogin } = authState;

    if (!email.trim() || !password || (!isLogin && !username.trim())) {
      setErrorMessage("Please fill in all required fields.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return false;
    }

    if (!isLogin && username.trim().length < 3) {
      setErrorMessage("Username must be at least 3 characters.");
      return false;
    }

    return true;
  };

  // Handle login/register submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { email, password, username, isLogin } = authState;
    setAuthState(prev => ({ ...prev, loading: true }));
    setErrorMessage('');

    try {
      const endpoint = isLogin ? 'users/login' : 'users/register';
      const url = `${API_BASE_URL}/${endpoint}`;
      // const url = `${URL}/${endpoint}`;

      const payload = isLogin
        ? { email, password }
        : { name: username.trim(), username: username.trim().toLowerCase(), email: email.trim(), password };
        console.log('Request payload:', payload) // Debug

      // const controller = new AbortController()
      // const timeoutId = setTimeout(() => controller.abort(), 10000)

      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
         },
        body: JSON.stringify(payload),
        // signal: controller.signal

      });
      //  clearTimeout(timeoutId)

      if (!res.ok) {
        const errorText = await res.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
          throw new Error(errorData.detail || errorData.message || errorData.error || `Request failed with status ${res.status}`);
        } catch {
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
      }

      let data = await res.json();

// ✅ Store tokens
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);

     
     const userData = {
        _id: data.user?._id,
        name: data.user?.name,
        username: data.user?.username,
        email: data.user?.email,
        avatar: data.user?.avatar,
        bio: data.user?.bio,
        created_at: data.user?.created_at,
        updated_at:data.user?.updated_at,
      };
      localStorage.setItem('user', JSON.stringify(userData));

      setErrorMessage(isLogin ? "Successfully logged in! Redirecting..." : "Account created successfully! Redirecting...");

     router.push('/chats');

    } catch (err: unknown) {
      console.error('Auth error:', err);

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setErrorMessage("Request timeout: Server is not responding.");
        } else if (err.message.includes('Failed to fetch')) {
          setErrorMessage(`Cannot connect to server. Ensure backend is running and URL is correct.`);
        } else {
          setErrorMessage(err.message);
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof Omit<AuthState, 'isLogin' | 'loading'>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAuthState(prev => ({ ...prev, [field]: e.target.value }));
      if (errorMessage) setErrorMessage('');
    };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon"><i className="fas fa-comments"></i></div>
          <h1 className="auth-title">{authState.isLogin ? 'Welcome back' : 'Create account'}</h1>
          <p className="auth-subtitle">{authState.isLogin ? 'Sign in to continue chatting' : 'Join Messenger to start connecting'}</p>
        </div>

        <div className="auth-form">
          <form onSubmit={handleAuthSubmit} noValidate>
            {!authState.isLogin && (
              <div className="form-group">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  className="form-input"
                  placeholder="johndoe"
                  value={authState.username}
                  onChange={handleInputChange('username')}
                  required
                  disabled={authState.loading}
                  minLength={3}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="you@example.com"
                value={authState.email}
                onChange={handleInputChange('email')}
                required
                disabled={authState.loading}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="••••••••"
                value={authState.password}
                onChange={handleInputChange('password')}
                required
                disabled={authState.loading}
                minLength={6}
                autoComplete={authState.isLogin ? "current-password" : "new-password"}
              />
            </div>

            {errorMessage && (
              <div className={`message ${errorMessage.includes('Success') ? 'success-message' : 'error-message'}`}>
                {errorMessage.split('\n').map((line, index) => <div key={index}>{line}</div>)}
              </div>
            )}

            <button type="submit" className="auth-button" disabled={authState.loading}>
              {authState.loading ? 'Please wait...' : authState.isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </form>

          <div className="auth-footer">
            <button type="button" className="auth-link" onClick={toggleAuthMode} disabled={authState.loading}>
              {authState.isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>

            {authState.isLogin && (
              <a href="/auth/forgot-password" className="forgot-password-link" style={{ marginTop: '10px', display: 'block', color: '#007bff', textDecoration: 'none' }}>
                Forgot your password?
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


