'use client'
import React from 'react'

interface MessageInputProps {
  newMessage: string
  receiverName:string
  showEmojiPicker: boolean
  showAttachmentMenu: boolean
  onMessageChange: (message: string) => void
  onSendMessage: () => void
  onSendThumbEmoji: () => void
  onToggleEmojiPicker: () => void
  onToggleAttachmentMenu: () => void
  onAddEmoji: (emoji: string) => void
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, mediaType: string) => void
  onOpenCamera: () => void
  popularEmojis: string[]
}

export default function MessageInput({
  newMessage,
  receiverName,
  showEmojiPicker,
  showAttachmentMenu,
  onMessageChange,
  onSendMessage,
  onSendThumbEmoji,
  onToggleEmojiPicker,
  onToggleAttachmentMenu,
  onAddEmoji,
  onFileUpload,
  onOpenCamera,
  popularEmojis
}: MessageInputProps) {
  return (
    <div className="message-input">
      <div className="input-container">
        <i
          className="fas fa-paperclip"
          id="attachButton"
          onClick={onToggleAttachmentMenu}
        ></i>
        <input
          type="text"
          id="messageInput"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
        />
        <div className="input-actions">
          <i
            className="fas fa-smile"
            id="emojiButton"
            onClick={onToggleEmojiPicker}
          ></i>
          <i
            className="fas fa-thumbs-up"
            id="likeButton"
            onClick={onSendThumbEmoji}
          ></i>
        </div>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="emoji-picker active">
          {popularEmojis.map((emoji, index) => (
            <div
              key={index}
              className="emoji-option"
              onClick={() => onAddEmoji(emoji)}
            >
              {emoji}
            </div>
          ))}
        </div>
      )}

      {/* Attachment Menu */}
      {showAttachmentMenu && (
        <div className="attachment-menu active">
          <div className="attachment-option" onClick={() => document.getElementById('photoInput')?.click()}>
            <i className="fas fa-image"></i>
            <span>Photo</span>
            <input
              id="photoInput"
              type="file"
              className="file-input"
              accept="image/*"
              onChange={(e) => onFileUpload(e, 'image')}
            />
          </div>
          <div className="attachment-option" onClick={() => document.getElementById('videoInput')?.click()}>
            <i className="fas fa-film"></i>
            <span>Video</span>
            <input
              id="videoInput"
              type="file"
              className="file-input"
              accept="video/*"
              onChange={(e) => onFileUpload(e, 'video')}
            />
          </div>
          <div className="attachment-option" onClick={onOpenCamera}>
            <i className="fas fa-camera"></i>
            <span>Camera</span>
          </div>
        </div>
      )}
    </div>
  )
}
