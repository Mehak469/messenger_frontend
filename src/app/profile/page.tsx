'use client'
import { useState, useEffect } from 'react'
import { authFetch } from "../../utils/authfetch"
import './profile.css'

const API_BASE_URL = "http://127.0.0.1:8000/api/v1"

// Random colors for avatars (vibrant colors)
const AVATAR_COLORS = [
  '1877f2', // Blue
  'e91e63', // Pink
  '9c27b0', // Purple
  '673ab7', // Deep Purple
  '3f51b5', // Indigo
  '2196f3', // Light Blue
  '00bcd4', // Cyan
  '009688', // Teal
  '4caf50', // Green
  '8bc34a', // Light Green
  'cddc39', // Lime
  'ffeb3b', // Yellow
  'ffc107', // Amber
  'ff9800', // Orange
  'ff5722', // Deep Orange
  'f44336', // Red
  '795548', // Brown
  '607d8b', // Blue Grey
]

// Generate random colored UI avatar
const generateUIAvatar = (name: string): string => {
  const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
  const encodedName = encodeURIComponent(name || 'User')
  return `https://ui-avatars.com/api/?name=${encodedName}&background=${randomColor}&color=fff&size=200`
}

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
    avatar: '',
    saving: false,
    loading: true
  })
  const [originalProfile, setOriginalProfile] = useState<ProfileState | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/users/me`, {
        method: 'GET'
      })
      
      if (!res.ok) {
        throw new Error('Failed to load profile')
      }
      
      const userData: UserProfile = await res.json()
     
      // If no avatar, generate a random colored UI avatar
      const avatar = userData.avatar || generateUIAvatar(userData.name || 'User')
     
      const profileData: ProfileState = {
        name: userData.name || '',
        username: userData.username || '',
        bio: userData.bio || '',
        email: userData.email || '',
        avatar: avatar,
        saving: false,
        loading: false
      }
      
      setProfileState(profileData)
      setOriginalProfile(profileData)
     
    } catch (error) {
      console.error('Error loading profile:', error)
      setProfileState(prev => ({ 
        ...prev, 
        loading: false,
        avatar: generateUIAvatar('User')
      }))
    }
  }

  const handleProfileSave = async () => {
    if (!hasChanges()) {
      return
    }
    
    setProfileState(prev => ({ ...prev, saving: true }))
   
    try {
      const updateData: any = {
        name: profileState.name.trim(),
        bio: profileState.bio.trim() || null,
        avatar: profileState.avatar // Always send avatar as string
      }
      
      const res = await authFetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to update profile')
      }
      
      const result = await res.json()
     
      // Update state with server response
      const updatedProfile = {
        ...profileState,
        name: result.user?.name || profileState.name,
        bio: result.user?.bio || '',
        avatar: result.user?.avatar || profileState.avatar,
        saving: false
      }
      
      setProfileState(updatedProfile)
      setOriginalProfile(updatedProfile)
      
      showToast('Profile updated successfully!', 'success')
     
    } catch (error) {
      console.error('Error updating profile:', error)
      showToast(error instanceof Error ? error.message : 'Failed to update profile. Please try again.', 'error')
    } finally {
      setProfileState(prev => ({ ...prev, saving: false }))
    }
  }

  const handleProfileLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
     
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/users/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken })
        })
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      window.location.href = '/auth'
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/users/me`, {
        method: 'DELETE'
      })
      
      if (!res.ok) {
        throw new Error('Failed to delete account')
      }
      
      localStorage.clear()
      window.location.href = '/auth'
     
    } catch (error) {
      console.error('Error deleting account:', error)
      showToast('Failed to delete account. Please try again.', 'error')
    } finally {
      setShowDeleteModal(false)
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

  const hasChanges = () => {
    if (!originalProfile) return false
    return (
      profileState.name.trim() !== originalProfile.name ||
      profileState.bio.trim() !== originalProfile.bio ||
      profileState.avatar !== originalProfile.avatar
    )
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    // Simple toast implementation - you can replace with a library like react-hot-toast
    alert(message)
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
              <span>Unsaved changes</span>
            </div>
          )}
        </div>

        <div className="profile-card-content">
          {/* Avatar Section */}
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <img 
                src={profileState.avatar} 
                alt="Profile"
                onError={(e) => {
                  e.currentTarget.src = generateUIAvatar(profileState.name || 'User')
                }}
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="profile-form">
            <div className="profile-form-group">
              <label htmlFor="profileName" className="profile-form-label">
                Display Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="profileName"
                className="profile-form-input"
                placeholder="Enter your display name"
                value={profileState.name}
                onChange={(e) => setProfileState(prev => ({ ...prev, name: e.target.value }))}
                maxLength={50}
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="profileUsername" className="profile-form-label">Username</label>
              <input
                type="text"
                id="profileUsername"
                className="profile-form-input profile-form-input-disabled"
                value={profileState.username}
                disabled
              />
              <span className="profile-form-hint">Username cannot be changed</span>
            </div>

            <div className="profile-form-group">
              <label htmlFor="profileBio" className="profile-form-label">Bio</label>
              <textarea
                id="profileBio"
                className="profile-form-textarea"
                placeholder="Tell us about yourself..."
                value={profileState.bio}
                onChange={(e) => setProfileState(prev => ({ ...prev, bio: e.target.value }))}
                maxLength={500}
              ></textarea>
              <div className="profile-bio-counter">
                {profileState.bio.length}/500
              </div>
            </div>

            <div className="profile-form-group">
              <label htmlFor="profileEmail" className="profile-form-label">Email</label>
              <input
                type="email"
                id="profileEmail"
                className="profile-form-input profile-form-input-disabled"
                value={profileState.email}
                disabled
              />
              <span className="profile-form-hint">Email cannot be changed</span>
            </div>

            {/* Save Button */}
            <button
              className="profile-save-btn"
              onClick={handleProfileSave}
              disabled={profileState.saving || !hasChanges()}
            >
              {profileState.saving ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Account Actions Card */}
      <div className="profile-card profile-account-card">
        <div className="profile-card-header">
          <h2 className="profile-card-title">Account Actions</h2>
        </div>
        <div className="profile-card-content">
          <button className="profile-logout-btn" onClick={handleProfileLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <div className="button-text">
              <span className="button-title">Log Out</span>
              <span className="button-subtitle">Sign out of your account</span>
            </div>
          </button>
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className="profile-card profile-danger-card">
        <div className="profile-card-header">
          <h2 className="profile-card-title profile-danger-title">
            <i className="fas fa-exclamation-triangle"></i> Danger Zone
          </h2>
        </div>
        <div className="profile-card-content">
          <div className="profile-danger-warning">
            <i className="fas fa-info-circle"></i>
            <span>This action is permanent and cannot be undone</span>
          </div>
          <button className="profile-delete-btn" onClick={() => setShowDeleteModal(true)}>
            <i className="fas fa-trash-alt"></i>
            <div className="button-text">
              <span className="button-title">Delete Account</span>
              <span className="button-subtitle">Permanently delete your account and all data</span>
            </div>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <i className="fas fa-exclamation-triangle modal-icon"></i>
              <h3>Delete Account</h3>
            </div>
            <div className="modal-body">
              <p>Are you absolutely sure you want to delete your account?</p>
              <ul className="modal-list">
                <li>All your data will be permanently deleted</li>
                <li>Your messages and posts will be removed</li>
                <li>Your friends will be notified</li>
                <li>This action cannot be undone</li>
              </ul>
              <p className="modal-confirm-text">
                Type <strong>{profileState.username}</strong> to confirm:
              </p>
              <input
                type="text"
                className="modal-input"
                placeholder="Enter your username"
                id="deleteConfirmInput"
              />
            </div>
            <div className="modal-footer">
              <button className="modal-btn modal-btn-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="modal-btn modal-btn-delete"
                onClick={() => {
                  const input = document.getElementById('deleteConfirmInput') as HTMLInputElement
                  if (input?.value === profileState.username) {
                    handleDeleteAccount()
                  } else {
                    showToast('Username does not match', 'error')
                  }
                }}
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
