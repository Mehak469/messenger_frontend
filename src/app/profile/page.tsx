'use client'
import { useState, useEffect } from 'react'
import { authFetch } from "../../utils/authfetch"
import './profile.css'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface UserProfile {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  friends: string[];
  created_at: string;
  updated_at: string;
}

interface ProfileState {
  name: string;
  username: string;
  bio: string;
  email: string;
  avatar: string;
  saving: boolean;
  loading: boolean;
}

export default function ProfilePage() {
  const [profileState, setProfileState] = useState<ProfileState>({
    name: '',
    username: '',
    bio: '',
    email: '',
    avatar: 'https://i.pravatar.cc/150?img=32',
    saving: false,
    loading: true
  })

  const [originalProfile, setOriginalProfile] = useState<ProfileState | null>(null)

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/users/me`, {
        method: 'GET'
      })

      if (!res.ok) {
        if (res.status === 401) {
          // Token refresh should have been handled by authFetch
          throw new Error('Authentication failed')
        }
        throw new Error('Failed to load profile')
      }

      const userData: UserProfile = await res.json()
      
      const profileData: ProfileState = {
        name: userData.name || '',
        username: userData.username || '',
        bio: userData.bio || '',
        email: userData.email || '',
        avatar: userData.avatar || 'https://i.pravatar.cc/150?img=32',
        saving: false,
        loading: false
      }

      setProfileState(profileData)
      setOriginalProfile(profileData)
      
    } catch (error) {
      console.error('Error loading profile:', error)
      // Fallback to localStorage data if available
      const storedUser = localStorage.getItem('userData')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        const profileData: ProfileState = {
          name: userData.name || '',
          username: userData.username || '',
          bio: userData.bio || '',
          email: userData.email || '',
          avatar: userData.avatar || 'https://i.pravatar.cc/150?img=32',
          saving: false,
          loading: false
        }
        setProfileState(profileData)
        setOriginalProfile(profileData)
      } else {
        setProfileState(prev => ({ ...prev, loading: false }))
      }
    }
  }

  const handleProfileSave = async () => {
    if (!hasChanges()) {
      alert('No changes to save')
      return
    }

    setProfileState(prev => ({ ...prev, saving: true }))
    
    try {
      const updateData = {
        name: profileState.name,
        avatar: profileState.avatar !== 'https://i.pravatar.cc/150?img=32' ? profileState.avatar : null,
        bio: profileState.bio
      }

      const res = await authFetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      })

      if (!res.ok) {
        throw new Error('Failed to update profile')
      }

      const result = await res.json()
      
      // Update localStorage with new data
      const currentUserData = {
        name: profileState.name,
        username: profileState.username,
        email: profileState.email,
        avatar: profileState.avatar,
        bio: profileState.bio
      }
      localStorage.setItem('userData', JSON.stringify(currentUserData))
      
      setOriginalProfile({ ...profileState })
      alert('Profile updated successfully!')
      
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setProfileState(prev => ({ ...prev, saving: false }))
    }
  }

  const handleProfileLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      
      if (refreshToken) {
        // Call logout endpoint
        const res = await fetch(`${API_BASE_URL}/users/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken })
        })
        
        // Even if logout API fails, clear local storage
        console.log('Logout response:', res.status)
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Clear all auth data from localStorage
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('userData')
      
      // Redirect to auth page
      window.location.href = '/auth'
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    try {
      const res = await authFetch(`${API_BASE_URL}/users/me`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Failed to delete account')
      }

      // Clear all data from localStorage
      localStorage.clear()
      
      alert('Account deleted successfully')
      window.location.href = '/auth'
      
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete account. Please try again.')
    }
  }

  const handleProfileBack = () => {
    if (hasChanges()) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        window.history.back()
      }
    } else {
      window.history.back()
    }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (event) => {
      setProfileState(prev => ({
        ...prev,
        avatar: event.target?.result as string
      }))
    }
    reader.readAsDataURL(file)
  }

  const hasChanges = () => {
    if (!originalProfile) return false
    return (
      profileState.name !== originalProfile.name ||
      profileState.bio !== originalProfile.bio ||
      profileState.avatar !== originalProfile.avatar
    )
  }

  if (profileState.loading) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <button className="profile-back-btn" onClick={handleProfileBack}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="profile-title">Profile</h1>
          <div style={{ width: '40px' }}></div>
        </div>
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="profile-back-btn" onClick={handleProfileBack}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="profile-title">Profile</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="profile-card">
        <div className="profile-card-header">
          <h2 className="profile-card-title">Edit Profile</h2>
          {hasChanges() && (
            <div className="profile-unsaved-changes">
              <i className="fas fa-exclamation-circle"></i>
              <span>You have unsaved changes</span>
            </div>
          )}
        </div>
        <div className="profile-card-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <img id="profileAvatarImg" src={profileState.avatar} alt="Profile" />
              <div className="profile-avatar-edit" onClick={() => document.getElementById('profileAvatarInput')?.click()}>
                <i className="fas fa-camera"></i>
              </div>
            </div>
            <input 
              type="file" 
              id="profileAvatarInput" 
              accept="image/*" 
              style={{ display: 'none' }}
              onChange={handleAvatarUpload}
            />
            <p className="profile-avatar-hint">Click the camera icon to upload a new profile picture</p>
          </div>

          <div className="profile-form">
            <div className="profile-form-group">
              <label htmlFor="profileName" className="profile-form-label">Display Name</label>
              <input 
                type="text" 
                id="profileName" 
                className="profile-form-input" 
                placeholder="Enter your display name"
                value={profileState.name}
                onChange={(e) => setProfileState(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="profileUsername" className="profile-form-label">Username</label>
              <input 
                type="text" 
                id="profileUsername" 
                className="profile-form-input" 
                value={profileState.username}
                disabled
                title="Username cannot be changed"
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="profileBio" className="profile-form-label">Bio</label>
              <textarea 
                id="profileBio" 
                className="profile-form-textarea" 
                placeholder="Tell us about yourself"
                value={profileState.bio}
                onChange={(e) => setProfileState(prev => ({ ...prev, bio: e.target.value }))}
                maxLength={500}
              ></textarea>
              <div className="profile-bio-counter">
                <span>{profileState.bio.length}/500</span>
              </div>
            </div>

            <div className="profile-form-group">
              <label htmlFor="profileEmail" className="profile-form-label">Email</label>
              <input 
                type="email" 
                id="profileEmail" 
                className="profile-form-input" 
                value={profileState.email}
                disabled
              />
            </div>

            <div className="profile-actions">
              <button 
                className="profile-save-btn" 
                onClick={handleProfileSave}
                disabled={profileState.saving || !hasChanges()}
              >
                {profileState.saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Saving...
                  </>
                ) : 'Save Changes'}
              </button>
              
              <div className="profile-danger-zone">
                <h3 className="profile-danger-title">
                  <i className="fas fa-exclamation-triangle"></i> Danger Zone
                </h3>
                <div className="profile-danger-actions">
                  <button className="profile-logout-btn" onClick={handleProfileLogout}>
                    <i className="fas fa-sign-out-alt"></i> Log Out
                  </button>
                  <button className="profile-delete-btn" onClick={handleDeleteAccount}>
                    <i className="fas fa-trash"></i> Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}