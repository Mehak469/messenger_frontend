'use client'
import React from 'react'
import { Message } from '@/Types/chats'

interface MessageItemProps {
  message: Message
  playingVoiceMessage: number | null
  onPlayVoiceMessage: (messageId: number, voiceUrl: string) => void
  onStopVoiceMessage: () => void
}

export default function MessageItem({
  message,
  playingVoiceMessage,
  onPlayVoiceMessage,
  onStopVoiceMessage
}: MessageItemProps) {
  if (message.type === 'notification') {
    return (
      <div key={message.id} className="theme-change-notification">
        <span>{message.text}</span>
        <span className="change-link">{message.time}</span>
      </div>
    )
  }

  if (message.type === 'like') {
    return (
      <div key={message.id} className={`message ${message.isUser ? 'user-message' : 'friend-message'}`}>
        <div className="like-message">
          <span className="thumb-emoji">👍</span>
          <span>Liked a message</span>
        </div>
      </div>
    )
  }

  if (message.type === 'image' || message.type === 'video') {
    return (
      <div key={message.id} className={`message ${message.isUser ? 'user-message' : 'friend-message'}`}>
        {message.type === 'image' ? (
          <div className="media-message">
            <div className="media-container">
              <img src={message.content} alt="Shared image" />
              <div className="media-overlay">
                <i className="fas fa-expand"></i>
              </div>
            </div>
            <div className="media-status">
              <span className="message-time">{message.time}</span>
              {message.isUser && <i className="fas fa-check-double status-icon read"></i>}
            </div>
          </div>
        ) : (
          <div className="media-message">
            <div className="reel-player">
              <video controls style={{ width: '100%', height: '300px', objectFit: 'cover' }}>
                <source src={message.content} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="reel-controls">
                <button className="play-pause">
                  <i className="fas fa-play"></i>
                </button>
                <div className="reel-info">
                  <span>Video</span>
                  <span className="reel-duration">0:15</span>
                </div>
              </div>
            </div>
            <div className="media-status">
              <span className="message-time">{message.time}</span>
              {message.isUser && <i className="fas fa-check-double status-icon read"></i>}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (message.type === 'voice') {
    return (
      <div key={message.id} className={`message ${message.isUser ? 'user-message' : 'friend-message'}`}>
        <div className="voice-message">
          <div className="voice-player">
            <button
              className="play-voice-btn"
              onClick={() => playingVoiceMessage === message.id 
                ? onStopVoiceMessage() 
                : onPlayVoiceMessage(message.id, message.voiceUrl!)
              }
            >
              <i className={`fas ${playingVoiceMessage === message.id ? 'fa-pause' : 'fa-play'}`}></i>
            </button>
            <div className="voice-waveform">
              <div
                className="voice-wave"
                style={{
                  width: playingVoiceMessage === message.id ? '100%' : '80%',
                  animation: playingVoiceMessage === message.id ? 'wave 1.5s ease-in-out infinite' : 'none'
                }}
              ></div>
            </div>
            <span className="voice-duration">{message.duration}s</span>
          </div>
          <div className="media-status">
            <span className="message-time">{message.time}</span>
            {message.isUser && <i className="fas fa-check-double status-icon read"></i>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div key={message.id} className={`message ${message.isUser ? 'user-message' : 'friend-message'}`}>
      <div className={`${message.isUser ? 'sent-message' : 'received-message'} whatsapp-message`}>
        <p className="message-text">{message.text}</p>
        <div className="message-meta">
          <span className="message-time">{message.time}</span>
          {message.isUser && <i className="fas fa-check-double status-icon read"></i>}
        </div>
      </div>
    </div>
  )
}

