// 'use client'
// import { useState, useEffect } from 'react'
// import { authFetch } from "../../utils/authfetch"
// import './profile.css'

// const API_BASE_URL = "http://127.0.0.1:8000/api/v1"

// interface UserProfile {
//   _id: string;
//   name: string;
//   username: string;
//   email: string;
//   avatar: string | null;
//   bio: string | null;
//   friends: string[];
//   created_at: string;
//   updated_at: string;
// }

// interface ProfileState {
//   name: string;
//   username: string;
//   bio: string;
//   email: string;
//   avatar: string;
//   saving: boolean;
//   loading: boolean;
// }

// export default function ProfilePage() {
//   const [profileState, setProfileState] = useState<ProfileState>({
//     name: '',
//     username: '',
//     bio: '',
//     email: '',
//     avatar: '',
//     saving: false,
//     loading: true
//   })
//   const [originalProfile, setOriginalProfile] = useState<ProfileState | null>(null)
//   const [avatarFile, setAvatarFile] = useState<File | null>(null)
//   const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
//   const [showDeleteModal, setShowDeleteModal] = useState(false)

//   // Helper function to generate UI avatar URL
//   const generateUIAvatar = (name: string): string => {
//     const encodedName = encodeURIComponent(name || 'User')
//     return `https://ui-avatars.com/api/?name=${encodedName}&background=1877f2&color=fff&size=200`
//   }

//   // Function to check if an avatar is a UI-generated avatar
//   const isUIAvatar = (avatarUrl: string): boolean => {
//     return avatarUrl.includes('ui-avatars.com')
//   }

//   useEffect(() => {
//     loadProfileData()
//   }, [])

//   const loadProfileData = async () => {
//     try {
//       const res = await authFetch(`${API_BASE_URL}/users/me`, {
//         method: 'GET'
//       })
      
//       if (!res.ok) {
//         throw new Error('Failed to load profile')
//       }
      
//       const userData: UserProfile = await res.json()
     
//       // Generate default avatar based on user's name
//       const defaultAvatar = generateUIAvatar(userData.name)
      
//       const profileData: ProfileState = {
//         name: userData.name || '',
//         username: userData.username || '',
//         bio: userData.bio || '',
//         email: userData.email || '',
//         avatar: userData.avatar || defaultAvatar,
//         saving: false,
//         loading: false
//       }
      
//       setProfileState(profileData)
//       setOriginalProfile(profileData)
     
//     } catch (error) {
//       console.error('Error loading profile:', error)
//       // Set default UI avatar on error
//       setProfileState(prev => ({ 
//         ...prev, 
//         loading: false,
//         avatar: generateUIAvatar('User')
//       }))
//     }
//   }

//   const handleProfileSave = async () => {
//     if (!hasChanges()) {
//       return
//     }
    
//     setProfileState(prev => ({ ...prev, saving: true }))
   
//     try {
//       // Prepare update data
//       const updateData: any = {
//         name: profileState.name.trim(),
//         bio: profileState.bio.trim() || null
//       }
      
//       // Handle avatar - check if it's changed
//       if (avatarPreview) {
//         // If user uploaded a new image (avatarPreview exists), we have a problem:
//         // We can't save base64 to server that expects a URL
//         // So we'll show an error and ask them to use a proper image URL
//         showToast('Cannot save uploaded image. Please use an image URL or use the default avatar.', 'error')
//         setProfileState(prev => ({ ...prev, saving: false }))
//         return
//       }
      
//       // Check if avatar is a UI avatar
//       const isCurrentUIAvatar = isUIAvatar(profileState.avatar)
      
//       // If it's a UI avatar, send null (server should handle default)
//       // If it's a custom URL, send the URL
//       updateData.avatar = isCurrentUIAvatar ? null : profileState.avatar
      
//       // Send update to server
//       const res = await authFetch(`${API_BASE_URL}/users/me`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updateData)
//       })
      
//       if (!res.ok) {
//         throw new Error('Failed to update profile')
//       }
      
//       const result = await res.json()
      
//       // Generate new UI avatar if server returns null
//       const updatedAvatar = result.user.avatar || generateUIAvatar(result.user.name)
      
//       const updatedProfile: ProfileState = {
//         ...profileState,
//         name: result.user.name,
//         bio: result.user.bio || '',
//         avatar: updatedAvatar,
//         saving: false
//       }
      
//       setProfileState(updatedProfile)
//       setOriginalProfile(updatedProfile)
//       setAvatarFile(null)
//       setAvatarPreview(null)
      
//       // Show success message
//       showToast('Profile updated successfully!', 'success')
     
//     } catch (error) {
//       console.error('Error updating profile:', error)
//       showToast('Failed to update profile. Please try again.', 'error')
//       setProfileState(prev => ({ ...prev, saving: false }))
//     }
//   }

//   const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return
    
//     if (!file.type.startsWith('image/')) {
//       showToast('Please upload an image file', 'error')
//       return
//     }
    
//     if (file.size > 5 * 1024 * 1024) {
//       showToast('Image size should be less than 5MB', 'error')
//       return
//     }
    
//     setAvatarFile(file)
    
//     const reader = new FileReader()
//     reader.onload = (event) => {
//       const preview = event.target?.result as string
//       setAvatarPreview(preview)
//       setProfileState(prev => ({
//         ...prev,
//         avatar: preview // This will be base64, not a URL
//       }))
//     }
//     reader.readAsDataURL(file)
//   }

//   const removeAvatar = () => {
//     // Reset to default UI avatar based on current name
//     const defaultAvatar = generateUIAvatar(profileState.name)
    
//     setAvatarFile(null)
//     setAvatarPreview(null)
//     setProfileState(prev => ({
//       ...prev,
//       avatar: defaultAvatar
//     }))
//   }

//   const hasChanges = () => {
//     if (!originalProfile) return false
    
//     // Check for text changes
//     const textChanged = (
//       profileState.name.trim() !== originalProfile.name ||
//       profileState.bio.trim() !== originalProfile.bio
//     )
    
//     // Check for avatar changes
//     const avatarChanged = profileState.avatar !== originalProfile.avatar
    
//     return textChanged || avatarChanged
//   }

//   const showToast = (message: string, type: 'success' | 'error') => {
//     // Simple toast implementation
//     alert(`${type.toUpperCase()}: ${message}`)
//   }

//   // Function to handle avatar URL input manually
//   const handleAvatarUrlChange = () => {
//     const url = prompt('Enter image URL for your avatar:')
//     if (url) {
//       // Basic URL validation
//       try {
//         new URL(url)
//         setProfileState(prev => ({
//           ...prev,
//           avatar: url
//         }))
//         setAvatarFile(null)
//         setAvatarPreview(null)
//       } catch (error) {
//         showToast('Please enter a valid URL', 'error')
//       }
//     }
//   }

//   // ... rest of your existing functions (handleProfileLogout, handleDeleteAccount, handleProfileBack) ...
//   const handleProfileLogout = async () => {
//     try {
//       const refreshToken = localStorage.getItem('refresh_token')
     
//       if (refreshToken) {
//         await fetch(`${API_BASE_URL}/users/logout`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ refresh_token: refreshToken })
//         })
//       }
//     } catch (error) {
//       console.error('Logout API error:', error)
//     } finally {
//       localStorage.removeItem('access_token')
//       localStorage.removeItem('refresh_token')
//       localStorage.removeItem('user')
//       window.location.href = '/auth'
//     }
//   }

//   const handleDeleteAccount = async () => {
//     try {
//       const res = await authFetch(`${API_BASE_URL}/users/me`, {
//         method: 'DELETE'
//       })
      
//       if (!res.ok) {
//         throw new Error('Failed to delete account')
//       }
      
//       localStorage.clear()
//       window.location.href = '/auth'
     
//     } catch (error) {
//       console.error('Error deleting account:', error)
//       showToast('Failed to delete account. Please try again.', 'error')
//     } finally {
//       setShowDeleteModal(false)
//     }
//   }

//   const handleProfileBack = () => {
//     if (hasChanges()) {
//       if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
//         window.history.back()
//       }
//     } else {
//       window.history.back()
//     }
//   }

  

//   if (profileState.loading) {
//     return (
//       <div className="profile-container">
//         <div className="profile-header">
//           <button className="profile-back-btn" onClick={handleProfileBack}>
//             <i className="fas fa-arrow-left"></i>
//           </button>
//           <h1 className="profile-title">Profile</h1>
//           <div style={{ width: '40px' }}></div>
//         </div>
//         <div className="profile-loading">
//           <div className="loading-spinner"></div>
//           <p>Loading profile...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="profile-container">
//       <div className="profile-header">
//         <button className="profile-back-btn" onClick={handleProfileBack}>
//           <i className="fas fa-arrow-left"></i>
//         </button>
//         <h1 className="profile-title">Profile</h1>
//         <div style={{ width: '40px' }}></div>
//       </div>

//       <div className="profile-card">
//         <div className="profile-card-header">
//           <h2 className="profile-card-title">Edit Profile</h2>
//           {hasChanges() && (
//             <div className="profile-unsaved-changes">
//               <i className="fas fa-exclamation-circle"></i>
//               <span>Unsaved changes</span>
//             </div>
//           )}
//         </div>

//         <div className="profile-card-content">
//           {/* Avatar Section */}
//           <div className="profile-avatar-section">
//             <div className="profile-avatar">
//               <img 
//                 src={avatarPreview || profileState.avatar} 
//                 alt="Profile" 
//                 onError={(e) => {
//                   // If image fails to load, fall back to UI avatar
//                   e.currentTarget.src = generateUIAvatar(profileState.name)
//                 }}
//               />
//               <div className="profile-avatar-edit" onClick={() => document.getElementById('profileAvatarInput')?.click()}>
//                 <i className="fas fa-camera"></i>
//               </div>
//             </div>
//             <input
//               type="file"
//               id="profileAvatarInput"
//               accept="image/*"
//               style={{ display: 'none' }}
//               onChange={handleAvatarUpload}
//             />
            
//             {/* Show warning if user uploaded a file (base64) */}
//             {avatarPreview && (
//               <div className="profile-avatar-warning">
//                 <i className="fas fa-exclamation-triangle"></i>
//                 <span>Uploaded images cannot be saved. Please use an image URL instead.</span>
//               </div>
//             )}
            
//             <div className="profile-avatar-buttons">
//               {(avatarPreview || !isUIAvatar(profileState.avatar)) && (
//                 <button className="profile-avatar-remove" onClick={removeAvatar}>
//                   <i className="fas fa-times"></i> Use Default Avatar
//                 </button>
//               )}
              
//               <button 
//                 className="profile-avatar-url-btn"
//                 onClick={handleAvatarUrlChange}
//               >
//                 <i className="fas fa-link"></i> Use Image URL
//               </button>
//             </div>
            
//             <p className="profile-avatar-hint">
//               {isUIAvatar(profileState.avatar) 
//                 ? 'Click to upload or enter image URL'
//                 : 'Using custom avatar'}
//             </p>
//           </div>

//           {/* Form Section */}
//           <div className="profile-form">
//             <div className="profile-form-group">
//               <label htmlFor="profileName" className="profile-form-label">
//                 Display Name <span className="required">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="profileName"
//                 className="profile-form-input"
//                 placeholder="Enter your display name"
//                 value={profileState.name}
//                 onChange={(e) => setProfileState(prev => ({ ...prev, name: e.target.value }))}
//                 maxLength={50}
//               />
//             </div>

//             <div className="profile-form-group">
//               <label htmlFor="profileUsername" className="profile-form-label">Username</label>
//               <input
//                 type="text"
//                 id="profileUsername"
//                 className="profile-form-input profile-form-input-disabled"
//                 value={profileState.username}
//                 disabled
//               />
//               <span className="profile-form-hint">Username cannot be changed</span>
//             </div>

//             <div className="profile-form-group">
//               <label htmlFor="profileBio" className="profile-form-label">Bio</label>
//               <textarea
//                 id="profileBio"
//                 className="profile-form-textarea"
//                 placeholder="Tell us about yourself..."
//                 value={profileState.bio}
//                 onChange={(e) => setProfileState(prev => ({ ...prev, bio: e.target.value }))}
//                 maxLength={500}
//               ></textarea>
//               <div className="profile-bio-counter">
//                 {profileState.bio.length}/500
//               </div>
//             </div>

//             <div className="profile-form-group">
//               <label htmlFor="profileEmail" className="profile-form-label">Email</label>
//               <input
//                 type="email"
//                 id="profileEmail"
//                 className="profile-form-input profile-form-input-disabled"
//                 value={profileState.email}
//                 disabled
//               />
//               <span className="profile-form-hint">Email cannot be changed</span>
//             </div>

//             {/* Save Button */}
//             <button
//               className="profile-save-btn"
//               onClick={handleProfileSave}
//               disabled={profileState.saving || !hasChanges() || !!avatarPreview}
//             >
//               {profileState.saving ? (
//                 <>
//                   <i className="fas fa-spinner fa-spin"></i> Saving...
//                 </>
//               ) : avatarPreview ? (
//                 <>
//                   <i className="fas fa-exclamation-triangle"></i> Cannot Save (Uploaded Image)
//                 </>
//               ) : (
//                 <>
//                   <i className="fas fa-save"></i> Save Changes
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//      {/* Account Actions Card */}
//       <div className="profile-card profile-account-card">
//         <div className="profile-card-header">
//           <h2 className="profile-card-title">Account Actions</h2>
//         </div>
//         <div className="profile-card-content">
//           <button className="profile-logout-btn" onClick={handleProfileLogout}>
//             <i className="fas fa-sign-out-alt"></i>
//             <div className="button-text">
//               <span className="button-title">Log Out</span>
//               <span className="button-subtitle">Sign out of your account</span>
//             </div>
//           </button>
//         </div>
//       </div>

//       {/* Danger Zone Card */}
//       <div className="profile-card profile-danger-card">
//         <div className="profile-card-header">
//           <h2 className="profile-card-title profile-danger-title">
//             <i className="fas fa-exclamation-triangle"></i> Danger Zone
//           </h2>
//         </div>
//         <div className="profile-card-content">
//           <div className="profile-danger-warning">
//             <i className="fas fa-info-circle"></i>
//             <span>This action is permanent and cannot be undone</span>
//           </div>
//           <button className="profile-delete-btn" onClick={() => setShowDeleteModal(true)}>
//             <i className="fas fa-trash-alt"></i>
//             <div className="button-text">
//               <span className="button-title">Delete Account</span>
//               <span className="button-subtitle">Permanently delete your account and all data</span>
//             </div>
//           </button>
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <i className="fas fa-exclamation-triangle modal-icon"></i>
//               <h3>Delete Account</h3>
//             </div>
//             <div className="modal-body">
//               <p>Are you absolutely sure you want to delete your account?</p>
//               <ul className="modal-list">
//                 <li>All your data will be permanently deleted</li>
//                 <li>Your messages and posts will be removed</li>
//                 <li>Your friends will be notified</li>
//                 <li>This action cannot be undone</li>
//               </ul>
//               <p className="modal-confirm-text">
//                 Type <strong>{profileState.username}</strong> to confirm:
//               </p>
//               <input
//                 type="text"
//                 className="modal-input"
//                 placeholder="Enter your username"
//                 id="deleteConfirmInput"
//               />
//             </div>
//             <div className="modal-footer">
//               <button className="modal-btn modal-btn-cancel" onClick={() => setShowDeleteModal(false)}>
//                 Cancel
//               </button>
//               <button
//                 className="modal-btn modal-btn-delete"
//                 onClick={() => {
//                   const input = document.getElementById('deleteConfirmInput') as HTMLInputElement
//                   if (input?.value === profileState.username) {
//                     handleDeleteAccount()
//                   } else {
//                     showToast('Username does not match', 'error')
//                   }
//                 }}
//               >
//                 Delete My Account
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
'use client'
import { useState, useEffect } from 'react'
import { authFetch } from "../../utils/authfetch"
import './profile.css'

const API_BASE_URL = "http://127.0.0.1:8000/api/v1"
const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User&background=1877f2&color=fff&size=200"

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
    avatar: DEFAULT_AVATAR,
    saving: false,
    loading: true
  })
  const [originalProfile, setOriginalProfile] = useState<ProfileState | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
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
     
      const profileData: ProfileState = {
        name: userData.name || '',
        username: userData.username || '',
        bio: userData.bio || '',
        email: userData.email || '',
        avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=1877f2&color=fff&size=200`,
        saving: false,
        loading: false
      }
      
      setProfileState(profileData)
      setOriginalProfile(profileData)
     
    } catch (error) {
      console.error('Error loading profile:', error)
      setProfileState(prev => ({ ...prev, loading: false }))
    }
  }

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    // TODO: Replace with your actual Cloudinary credentials
    const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset'
    const CLOUDINARY_CLOUD_NAME = 'your_cloud_name'
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to upload image')
    }
    
    const data = await response.json()
    return data.secure_url
  }

  const handleProfileSave = async () => {
    if (!hasChanges()) {
      return
    }
    
    setProfileState(prev => ({ ...prev, saving: true }))
   
    try {
      let avatarUrl = profileState.avatar
      
      // Upload new avatar if file selected
      if (avatarFile) {
        try {
          // For now, we'll use base64, but in production use uploadImageToCloudinary
          // avatarUrl = await uploadImageToCloudinary(avatarFile)
          avatarUrl = avatarPreview || profileState.avatar
        } catch (uploadError) {
          console.error('Avatar upload failed:', uploadError)
          alert('Failed to upload avatar. Proceeding with other changes.')
        }
      }
      
      const updateData = {
        name: profileState.name.trim(),
        avatar: avatarUrl !== DEFAULT_AVATAR && !avatarUrl.includes('ui-avatars.com') ? avatarUrl : null,
        bio: profileState.bio.trim() || null
      }
      
      const res = await authFetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })
      
      if (!res.ok) {
        throw new Error('Failed to update profile')
      }
      
      const result = await res.json()
     
      // Update state with server response
      const updatedProfile = {
        ...profileState,
        avatar: result.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(result.user.name)}&background=1877f2&color=fff&size=200`
      }
      
      setProfileState(updatedProfile)
      setOriginalProfile(updatedProfile)
      setAvatarFile(null)
      setAvatarPreview(null)
      
      // Show success message
      showToast('Profile updated successfully!', 'success')
     
    } catch (error) {
      console.error('Error updating profile:', error)
      showToast('Failed to update profile. Please try again.', 'error')
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

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
   
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error')
      return
    }
   
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error')
      return
    }
   
    setAvatarFile(file)
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const preview = event.target?.result as string
      setAvatarPreview(preview)
      setProfileState(prev => ({
        ...prev,
        avatar: preview
      }))
    }
    reader.readAsDataURL(file)
  }

  const removeAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileState.name || 'User')}&background=1877f2&color=fff&size=200`
    setProfileState(prev => ({
      ...prev,
      avatar: defaultAvatar
    }))
  }

  const hasChanges = () => {
    if (!originalProfile) return false
    return (
      profileState.name.trim() !== originalProfile.name ||
      profileState.bio.trim() !== originalProfile.bio ||
      avatarFile !== null ||
      (avatarPreview && avatarPreview !== originalProfile.avatar)
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
              <img src={profileState.avatar} alt="Profile" />
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
            {avatarFile && (
              <button className="profile-avatar-remove" onClick={removeAvatar}>
                <i className="fas fa-times"></i> Remove new photo
              </button>
            )}
            <p className="profile-avatar-hint">Upload a profile picture (max 5MB)</p>
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