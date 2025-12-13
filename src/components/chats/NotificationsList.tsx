'use client'
import React from 'react'
import { Notification } from '@/Types/chats'

interface NotificationsListProps {
  notifications: Notification[]
  onMarkAsRead: (id: number) => void
}

export default function NotificationsList({
  notifications,
  onMarkAsRead
}: NotificationsListProps) {
  return (
    <div className="notifications-list">
      {notifications.map(notification => (
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
      ))}
    </div>
  )
}

