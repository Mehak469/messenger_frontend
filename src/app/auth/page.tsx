"use client";
import { useState, useEffect } from 'react'
import './auth.css'

interface AuthState {
  isLogin: boolean;
  email: string;
  password: string;
  username: string;
  loading: boolean;
}

interface User {
  id?: string;
  user_id?: string;
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  token?: string;
  // Add any other fields your backend might return
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

  const API_BASE_URL = "https://messanger-semester-project.vercel.app/api/v1"

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('messengerUser')
        if (userData) {
          const user: User = JSON.parse(userData)
          // Check if any user identifier exists
          if (user?.id || user?.user_id || user?._id || user?.email) {
            window.location.href = '/chats'
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        localStorage.removeItem('messengerUser')
      }
    }

    checkAuth()
  }, [])

  const toggleAuthMode = () => {
    setAuthState(prev => ({
      ...prev,
      isLogin: !prev.isLogin,
      username: '',
      email: '',
      password: ''
    }))
    setErrorMessage('')
  }

  const validateForm = (): boolean => {
    const { email, password, username, isLogin } = authState

    if (!email.trim() || !password || (!isLogin && !username.trim())) {
      setErrorMessage("Please fill in all required fields.")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.")
      return false
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.")
      return false
    }

    if (!isLogin && username.trim().length < 3) {
      setErrorMessage("Username must be at least 3 characters.")
      return false
    }

    return true
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const { email, password, username, isLogin } = authState

    setAuthState(prev => ({ ...prev, loading: true }))
    setErrorMessage("")

    try {
      const endpoint = isLogin ? "users/login" : "users/register"
      const url = `${API_BASE_URL}/${endpoint}`

      console.log('Making request to:', url) // Debug

      const payload = isLogin
        ? { email, password }
        : {
          name: username.trim(),
          username: username.trim().toLowerCase(),
          email: email.trim(),
          password
        }

      console.log('Request payload:', payload) // Debug

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      console.log('Response status:', res.status) // Debug

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Error response:', errorText) // Debug
        let errorData
        try {
          errorData = JSON.parse(errorText)
          throw new Error(errorData.detail || errorData.message || errorData.error || `Request failed with status ${res.status}`)
        } catch {
          throw new Error(`HTTP ${res.status}: ${errorText}`)
        }
      }

      const data = await res.json()
      console.log('Full API response:', data) // Debug the complete response

      // Handle different response formats
      let userData: User = {}

      // Case 1: Direct user object in response
      if (data.id || data.user_id || data._id || data.email) {
        userData = data
      }
      // Case 2: Nested user object
      else if (data.user && (data.user.id || data.user.user_id || data.user._id || data.user.email)) {
        userData = data.user
      }
      // Case 3: Data field contains user
      else if (data.data && (data.data.id || data.data.user_id || data.data._id || data.data.email)) {
        userData = data.data
      }
      // Case 4: Try to extract any user-like object
      else {
        // Look for any key that might contain user data
        const possibleUserKeys = ['user', 'data', 'userData', 'result']
        for (const key of possibleUserKeys) {
          if (data[key] && (data[key].id || data[key].user_id || data[key]._id || data[key].email)) {
            userData = data[key]
            break
          }
        }

        // If no nested user found, use the entire response
        if (!userData.id && !userData.user_id && !userData._id) {
          userData = data
        }
      }

      console.log('Extracted user data:', userData) // Debug

      // Check if we have at least some user identifier
      const hasUserIdentifier = userData.id || userData.user_id || userData._id || userData.email

      if (!hasUserIdentifier) {
        console.warn('No clear user identifier found in response, but storing anyway:', userData)
        // Continue anyway - maybe the backend doesn't return user data immediately
      }

      // Store whatever user data we got
      localStorage.setItem("messengerUser", JSON.stringify(userData))

      setErrorMessage(
        isLogin ? "Successfully logged in! Redirecting..." : "Account created successfully! Redirecting..."
      )

      setTimeout(() => {
        window.location.href = "/chats"
      }, 1000)

    } catch (err: unknown) {
      console.error('Auth error:', err)

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setErrorMessage("Request timeout: Server is not responding.")
        } else if (err.message.includes('Failed to fetch')) {
          setErrorMessage(
            `Cannot connect to server. Please ensure:\n\n` +
            `• Backend is running on port 8000\n` +
            `• URL: ${API_BASE_URL}\n` +
            `• No CORS issues`
          )
        } else {
          setErrorMessage(err.message)
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.")
      }
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const handleInputChange = (field: keyof Omit<AuthState, 'isLogin' | 'loading'>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAuthState(prev => ({ ...prev, [field]: e.target.value }))
      if (errorMessage) {
        setErrorMessage('')
      }
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
          <form onSubmit={handleAuthSubmit} noValidate>
            <div className={`form-group ${authState.isLogin ? 'hidden' : ''}`}>
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="form-input"
                placeholder="johndoe"
                value={authState.username}
                onChange={handleInputChange('username')}
                required={!authState.isLogin}
                disabled={authState.loading}
                minLength={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
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
              <label htmlFor="password" className="form-label">
                Password
              </label>
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
                {errorMessage.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
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
            <button
              type="button"
              className="auth-link"
              onClick={toggleAuthMode}
              disabled={authState.loading}
            >
              {authState.isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>

            {/* Add Forgot Password link - only show in login mode */}
            {authState.isLogin && (
              <a
                href="/auth/forgot-password"
                className="forgot-password-link"
                style={{ marginTop: '10px', display: 'block', color: '#007bff', textDecoration: 'none' }}
              >
                Forgot your password?
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}