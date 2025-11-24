'use client'
import { useState, useEffect } from 'react'
import './profile.css'

interface ProfileState {
  username: string;
  displayName: string;
  bio: string;
  phoneNumber: string;
  email: string;
  avatar: string;
  saving: boolean;
}

export default function ProfilePage() {
  const [profileState, setProfileState] = useState<ProfileState>({
    username: '',
    displayName: '',
    bio: '',
    phoneNumber: '',
    email: '',
    avatar: 'https://i.pravatar.cc/150?img=32',
    saving: false
  })

  useEffect(() => {
    // Load profile data from localStorage
    const userData = localStorage.getItem('messengerUser')
    if (userData) {
      const parsedData = JSON.parse(userData)
      setProfileState(prev => ({
        ...prev,
        ...parsedData
      }))
    }
  }, [])

  const handleProfileSave = () => {
    setProfileState(prev => ({ ...prev, saving: true }))
    
    // Simulate API call
    setTimeout(() => {
      // Save to localStorage
      localStorage.setItem('messengerUser', JSON.stringify(profileState))
      
      setProfileState(prev => ({ ...prev, saving: false }))
      alert('Profile updated successfully!')
    }, 1000)
  }

  const handleProfileLogout = () => {
    localStorage.removeItem('messengerUser')
    window.location.href = '/auth'
  }

  const handleProfileBack = () => {
    window.history.back()
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      setProfileState(prev => ({
        ...prev,
        avatar: event.target?.result as string
      }))
    }
    reader.readAsDataURL(file)
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
          </div>

          <div className="profile-form">
            <div className="profile-form-group">
              <label htmlFor="profileUsername" className="profile-form-label">Username</label>
              <input 
                type="text" 
                id="profileUsername" 
                className="profile-form-input" 
                placeholder="Enter your username"
                value={profileState.username}
                onChange={(e) => setProfileState(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="profileDisplayName" className="profile-form-label">Display Name</label>
              <input 
                type="text" 
                id="profileDisplayName" 
                className="profile-form-input" 
                placeholder="Enter your display name"
                value={profileState.displayName}
                onChange={(e) => setProfileState(prev => ({ ...prev, displayName: e.target.value }))}
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
              ></textarea>
            </div>

            <div className="profile-form-group">
              <label htmlFor="profilePhone" className="profile-form-label">Phone Number</label>
              <input 
                type="tel" 
                id="profilePhone" 
                className="profile-form-input" 
                placeholder="+1 (555) 123-4567"
                value={profileState.phoneNumber}
                onChange={(e) => setProfileState(prev => ({ ...prev, phoneNumber: e.target.value }))}
              />
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
                disabled={profileState.saving}
              >
                {profileState.saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button className="profile-logout-btn" onClick={handleProfileLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}