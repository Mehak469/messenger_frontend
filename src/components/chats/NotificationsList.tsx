'use client'

import React, { useState } from 'react'
import { Notification } from '@/Types/chats'
import { subscribePush, unsubscribePush } from '@/utils/PushNotifications'

interface NotificationsListProps {
  notifications: Notification[]
  onMarkAsRead: (id: number) => void
}

export default function NotificationsList({
  notifications,
  onMarkAsRead
}: NotificationsListProps) {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const handleToggleNotifications = async () => {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      setStatusMessage('Access token missing')
      return
    }

    setIsLoading(true)
    setStatusMessage('')

    let message: string

    if (isNotificationsEnabled) {
      // Disable notifications
      message = await unsubscribePush(accessToken)
      if (message.toLowerCase().includes('success')) setIsNotificationsEnabled(false)
    } else {
      // Enable notifications
      message = await subscribePush(accessToken)
      if (message.toLowerCase().includes('success')) setIsNotificationsEnabled(true)
    }

    setStatusMessage(message)
    setIsLoading(false)

    // Clear status message after 3 seconds
    setTimeout(() => setStatusMessage(''), 3000)
  }

  return (
    <div className="notifications-list">
      {/* Notification Toggle Header */}
      <div className="notification-toggle-header" style={{
        padding: '16px',
        borderBottom: '1px solid #e4e6eb',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <i className="fas fa-bell" style={{ fontSize: '18px', color: '#1877f2' }}></i>
          <div>
            <div style={{ fontWeight: '600', fontSize: '15px', color: '#050505' }}>
              Push Notifications
            </div>
            <div style={{ fontSize: '13px', color: '#65676B', marginTop: '2px' }}>
              {isNotificationsEnabled ? 'Enabled' : 'Disabled'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <label style={{
            position: 'relative',
            display: 'inline-block',
            width: '44px',
            height: '24px'
          }}>
            <input
              type="checkbox"
              checked={isNotificationsEnabled}
              onChange={handleToggleNotifications}
              disabled={isLoading}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: isNotificationsEnabled ? '#1877f2' : '#ccc',
              transition: '.4s',
              borderRadius: '24px',
              opacity: isLoading ? 0.6 : 1
            }}>
              <span style={{
                position: 'absolute',
                content: '""',
                height: '18px',
                width: '18px',
                left: '3px',
                bottom: '3px',
                backgroundColor: 'white',
                transition: '.4s',
                borderRadius: '50%',
                transform: isNotificationsEnabled ? 'translateX(20px)' : 'translateX(0)'
              }}></span>
            </span>
          </label>
          {isLoading && (
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '12px', color: '#65676B' }}></i>
          )}
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div style={{
          padding: '12px 16px',
          margin: '0 16px 8px',
          borderRadius: '8px',
          fontSize: '13px',
          backgroundColor: statusMessage.toLowerCase().includes('success') || statusMessage.toLowerCase().includes('enabled') || statusMessage.toLowerCase().includes('disabled')
            ? '#e7f3ff'
            : '#fff4e6',
          color: statusMessage.toLowerCase().includes('success') || statusMessage.toLowerCase().includes('enabled') || statusMessage.toLowerCase().includes('disabled')
            ? '#1877f2'
            : '#cc6600',
          border: `1px solid ${statusMessage.toLowerCase().includes('success') || statusMessage.toLowerCase().includes('enabled') || statusMessage.toLowerCase().includes('disabled')
            ? '#b3d9ff'
            : '#ffd9b3'}`
        }}>
          {statusMessage}
        </div>
      )}

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          color: '#65676B'
        }}>
          <i className="fas fa-bell-slash" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}></i>
          <p>No notifications yet</p>
        </div>
      ) : (
        notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification-item ${notification.isNew ? 'new' : ''}`}
            onClick={() => onMarkAsRead(notification.id)}
          >
            <div className="notification-avatar">
              {notification.userAvatar ? (
                <img src={notification.userAvatar} alt={notification.title} />
              ) : notification.pageAvatar ? (
                <img src={notification.pageAvatar} alt={notification.title} />
              ) : (
                <div className="system-avatar">
                  <i className="fas fa-bell"></i>
                </div>
              )}
            </div>
            <div className="notification-content">
              <div className="notification-header">
                <span className="notification-title">{notification.title}</span>
                <span className="notification-time">{notification.time}</span>
              </div>
              <div className="notification-description">
                {notification.description}
              </div>
            </div>
            {notification.isNew && <div className="new-notification-indicator"></div>}
          </div>
        ))
      )}
    </div>
  )
}
