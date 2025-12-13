'use client'
import React from 'react'
import { Chat } from '@/Types/chats'

interface ChatHeaderProps {
  chat: Chat
  isMobile: boolean
  onStartCall: (contact: Chat) => void
  onBack?: () => void
}

export default function ChatHeader({
  chat,
  isMobile,
  onStartCall,
  onBack
}: ChatHeaderProps) {
  if (isMobile) {
    return (
      <div className="mobile-chat-header">
        <div className="mobile-chat-header-content">
          {onBack && (
            <button className="mobile-back-btn" onClick={onBack}>
              <i className="fas fa-arrow-left"></i>
            </button>
          )}
          <div className="mobile-chat-user">
            <div className="mobile-chat-avatar">
              <img src={chat.avatar} alt={chat.name} />
              {chat.isOnline && <div className="online-indicator"></div>}
            </div>
            <div className="mobile-chat-info">
              <span className="mobile-chat-name">{chat.name}</span>
              <span className="mobile-chat-status">{chat.isOnline ? 'Active now' : 'Offline'}</span>
            </div>
          </div>
          <div className="mobile-chat-actions">
            <i className="fas fa-video"></i>
            <i className="fas fa-phone" onClick={() => onStartCall(chat)}></i>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-header">
      <div className="chat-user">
        <div className="user-avatar">
          <img src={chat.avatar} alt={chat.name} />
          {chat.isOnline && <div className="online-indicator"></div>}
        </div>
        <div className="user-info">
          <span className="user-name">{chat.name}</span>
          <span className={`user-status ${chat.isOnline ? 'online' : 'offline'}`}>
            {chat.isOnline ? 'Active now' : 'Offline'}
          </span>
        </div>
      </div>
      <div className="chat-actions">
        <i className="fas fa-video"></i>
        <i className="fas fa-phone" onClick={() => onStartCall(chat)}></i>
      </div>
    </div>
  )
}

