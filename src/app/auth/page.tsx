'use client'
import { useState, useEffect } from 'react'
import './auth.css'

interface AuthState {
  isLogin: boolean;
  email: string;
  password: string;
  username: string;
  loading: boolean;
}

export default function AuthPage() {
  const [authState, setAuthState] = useState<AuthState>({
    isLogin: true,
    email: '',
    password: '',
    username: '',
    loading: false
  })

  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // Check if user is already logged in
    if (localStorage.getItem('messengerUser')) {
      window.location.href = '/chats'
    }
  }, [])

  const toggleAuthMode = () => {
    setAuthState(prev => ({
      ...prev,
      isLogin: !prev.isLogin,
      email: '',
      password: '',
      username: ''
    }))
    setErrorMessage('')
  }

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const { email, password, username, isLogin } = authState
    
    // Basic validation
    if (!email || !password) {
      setErrorMessage('Please fill in all required fields.')
      return
    }
    
    if (!isLogin && !username) {
      setErrorMessage('Please fill in all required fields.')
      return
    }
    
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.')
      return
    }
    
    setAuthState(prev => ({ ...prev, loading: true }))
    
    // Simulate API call
    setTimeout(() => {
      setAuthState(prev => ({ ...prev, loading: false }))
      
      // For demo purposes, accept any valid-looking email and password
      if (email && password.length >= 6) {
        // Store user data
        const userData = {
          email: email,
          username: username || email.split('@')[0],
          displayName: username || email.split('@')[0],
          bio: '',
          phoneNumber: '',
          avatar: `https://i.pravatar.cc/150?u=${email}`
        }
        
        localStorage.setItem('messengerUser', JSON.stringify(userData))
        
        // Show success message
        setErrorMessage(isLogin ? 'Successfully logged in!' : 'Account created successfully!')
        
        // Redirect to chats after a short delay
        setTimeout(() => {
          window.location.href = '/chats'
        }, 1000)
      } else {
        setErrorMessage('Invalid credentials. Please try again.')
      }
    }, 1500)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <i className="fas fa-comments"></i>
          </div>
          <h1 className="auth-title">
            {authState.isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="auth-subtitle">
            {authState.isLogin ? 'Sign in to continue chatting' : 'Join Messenger to start connecting'}
          </p>
        </div>
        <div className="auth-form">
          <form onSubmit={handleAuthSubmit}>
            <div className={`form-group ${authState.isLogin ? 'hidden' : ''}`}>
              <label htmlFor="username" className="form-label">Username</label>
              <input 
                type="text" 
                id="username" 
                className="form-input" 
                placeholder="johndoe" 
                value={authState.username}
                onChange={(e) => setAuthState(prev => ({ ...prev, username: e.target.value }))}
                required={!authState.isLogin}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="email" 
                id="email" 
                className="form-input" 
                placeholder="you@example.com" 
                value={authState.email}
                onChange={(e) => setAuthState(prev => ({ ...prev, email: e.target.value }))}
                required 
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
                onChange={(e) => setAuthState(prev => ({ ...prev, password: e.target.value }))}
                required 
                minLength={6}
              />
            </div>
            {errorMessage && (
              <div className={`error-message ${errorMessage.includes('Success') ? 'success' : ''}`}>
                {errorMessage}
              </div>
            )}
            <button 
              type="submit" 
              className="auth-button" 
              disabled={authState.loading}
            >
              {authState.loading ? 'Please wait...' : (authState.isLogin ? 'Sign in' : 'Sign up')}
            </button>
          </form>
          <div className="auth-footer">
            <a className="auth-link" onClick={toggleAuthMode}>
              {authState.isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}