'use client'
import React from 'react'
import { Chat } from '@/Types/chats'

interface FetchedMessage {
  id: number
  text: string
  mediaUrl?: string
  time: string
  isUser: boolean
  type: string // text, image, video, file, voice, like, notification
  status: string // sent, delivered, seen
  voiceUrl?: string
  duration?: number
}

interface MessageItemProps {
  message: FetchedMessage
  chat: Chat
  playingVoiceMessage: number | null
  onPlayVoiceMessage: (messageId: number, voiceUrl: string) => void
  onStopVoiceMessage: () => void
}

export default function MessageItem({
  message,
  chat,
  playingVoiceMessage,
  onPlayVoiceMessage,
  onStopVoiceMessage
}: MessageItemProps) {

  const receiverName = chat.name || "Unknown";

  // notification type
  if (message.type === 'notification') {
    return (
      <div key={message.id} className="theme-change-notification">
        <span>{message.text}</span>
        <span className="change-link">{message.time}</span>
      </div>
    )
  }

  // like type
  if (message.type === 'like') {
    return (
      <div key={message.id} className={`message ${message.isUser ? 'user-message' : 'friend-message'}`}>
        <div className="like-message">
          <span className="thumb-emoji">👍</span>
          <span>{message.isUser ? "You liked a message" : `${receiverName} liked a message`}</span>
        </div>
      </div>
    )
  }

  // image / video / file type
  if (['image', 'video', 'file'].includes(message.type)) {
    return (
      <div key={message.id} className={`message ${message.isUser ? 'user-message' : 'friend-message'}`}>
        {message.type === 'image' && message.mediaUrl && (
          <div className="media-message">
            <div className="media-container">
              <img src={message.mediaUrl} alt="Shared media" />
              <div className="media-overlay"><i className="fas fa-expand"></i></div>
            </div>
            <div className="media-status">
              <span className="message-time">{message.time}</span>
              {message.isUser && <i className={`fas fa-check-double status-icon ${message.status === 'seen' ? 'read' : ''}`}></i>}
            </div>
          </div>
        )}
        {message.type === 'video' && message.mediaUrl && (
          <div className="media-message">
            <video controls style={{ width: '100%', height: '300px', objectFit: 'cover' }}>
              <source src={message.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="media-status">
              <span className="message-time">{message.time}</span>
              {message.isUser && (
                <i
                  className={`fas ${message.status === 'sent' ? 'fa-check' : // single tick
                      message.status === 'delivered' ? 'fa-check-double' : // double tick
                        message.status === 'seen' ? 'fa-check-double read' : '' // blue tick
                    } status-icon`}
                ></i>
              )}

            </div>
          </div>
        )}
      </div>
    )
  }

  // voice message (keep as is)
  if (message.type === 'voice' && message.voiceUrl) {
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
            <span className="voice-duration">{message.duration || 0}s</span>
          </div>
          <div className="media-status">
            <span className="message-time">{message.time}</span>
            {message.isUser && <i className={`fas fa-check-double status-icon ${message.status === 'seen' ? 'read' : ''}`}></i>}
          </div>
        </div>
      </div>
    )
  }

  // default: text message
  return (
    <div key={message.id} className={`message ${message.isUser ? 'user-message' : 'friend-message'}`}>
      <div className={`${message.isUser ? 'sent-message' : 'received-message'} whatsapp-message`}>
        {/* {!message.isUser && <span className="receiver-name">{receiverName}</span>} */}
        <p className="message-text">{message.text}</p>
        <div className="message-meta">
          <span className="message-time">{message.time}</span>
          {message.isUser && (
            <i
              className={`fas ${message.status === 'sent' ? 'fa-check' : // single tick
                message.status === 'delivered' ? 'fa-check-double' : // double tick
                  message.status === 'seen' ? 'fa-check-double read' : '' // blue tick
                } status-icon`}
            ></i>
          )}

        </div>
      </div>
    </div>
  )
}
