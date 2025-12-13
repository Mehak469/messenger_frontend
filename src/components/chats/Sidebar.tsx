'use client'
import React from 'react'

interface SidebarProps {
  activeSection: string
  profileAvatar: string
  notifications: any[]
  messageRequests: any[]
  onSectionChange: (section: string) => void
}

export default function Sidebar({
  activeSection,
  profileAvatar,
  notifications,
  messageRequests,
  onSectionChange
}: SidebarProps) {
  return (
    <div className="left-sidebar">
      <div className="sidebar-icons">
        <div
          className={`icon-item ${activeSection === 'chats' ? 'active' : ''}`}
          onClick={() => onSectionChange('chats')}
        >
          <i className="fas fa-comment"></i>
          <div className="icon-tooltip">Chats</div>
        </div>
        <div
          className={`icon-item ${activeSection === 'notifications' ? 'active' : ''}`}
          onClick={() => onSectionChange('notifications')}
        >
          <i className="fas fa-bell"></i>
          <div className="icon-tooltip">Notifications</div>
          {notifications.some((n: any) => n.isNew) && (
            <div className="notification-indicator"></div>
          )}
        </div>
        <div
          className={`icon-item ${activeSection === 'requests' ? 'active' : ''}`}
          onClick={() => onSectionChange('requests')}
        >
          <i className="fas fa-user-friends"></i>
          <div className="icon-tooltip">Message Requests</div>
          {messageRequests.length > 0 && (
            <div className="notification-indicator"></div>
          )}
        </div>
        <div
          className={`icon-item ${activeSection === 'archived' ? 'active' : ''}`}
          onClick={() => onSectionChange('archived')}
        >
          <i className="fas fa-archive"></i>
          <div className="icon-tooltip">Archived Chats</div>
        </div>
        <div className="icon-item profile-icon" onClick={() => window.location.href = '/profile'}>
          <img src={profileAvatar} alt="Profile" />
          <div className="icon-tooltip">Profile</div>
        </div>
      </div>
    </div>
  )
}

