'use client'
import React from 'react'
import { Chat } from '@/Types/chats'

interface ChatItemProps {
  chat: Chat
  isActive: boolean
  isMobile: boolean
  onChatClick: (chatId: number) => void
  onChatRightClick: (e: React.MouseEvent, chatId: number, type: string) => void
  onChatTouchStart: (chatId: number, type: string, e: React.TouchEvent) => void
  onChatTouchEnd: (e: React.TouchEvent) => void
  type?: string
}

export default function ChatItem({
  chat,
  isActive,
  isMobile,
  onChatClick,
  onChatRightClick,
  onChatTouchStart,
  onChatTouchEnd,
  type = 'chat'
}: ChatItemProps) {
  const className = isMobile 
    ? 'mobile-chat-item' 
    : type === 'archived' 
      ? 'archived-item' 
      : 'chat-item'

  return (
    <div
      className={`${className} ${isActive ? 'active' : ''}`}
      data-chat-id={chat.id}
      onClick={() => onChatClick(chat.id)}
      onContextMenu={(e) => onChatRightClick(e, chat.id, type)}
      onTouchStart={(e) => onChatTouchStart(chat.id, type, e)}
      onTouchEnd={onChatTouchEnd}
    >
      <div className={isMobile ? 'mobile-chat-avatar' : type === 'archived' ? 'archived-avatar' : 'chat-avatar'}>
        <img src={chat.avatar} alt={chat.name} />
        {chat.isOnline && <div className={isMobile ? 'mobile-online-indicator' : 'online-indicator'}></div>}
      </div>
      <div className={isMobile ? 'mobile-chat-info' : type === 'archived' ? 'archived-content' : 'chat-content'}>
        <div className={isMobile ? 'mobile-chat-header' : type === 'archived' ? 'archived-header' : 'chat-header'}>
          <span className={isMobile ? 'mobile-chat-name' : type === 'archived' ? 'archived-name' : 'chat-name'}>
            {chat.name}
          </span>
          <span className={isMobile ? 'mobile-chat-time' : type === 'archived' ? 'archived-time' : 'chat-time'}>
            {chat.time}
          </span>
        </div>
        <div className={isMobile ? 'mobile-chat-preview' : type === 'archived' ? 'archived-preview' : 'chat-preview'}>
          <span className={isMobile ? 'mobile-last-message' : type === 'archived' ? 'archived-preview-text' : 'chat-preview-text'}>
            {chat.lastMessage || 'No messages yet'}
          </span>
          {chat.unread > 0 && (
            <span className={isMobile ? 'mobile-unread-badge' : 'unread-badge'}>
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

