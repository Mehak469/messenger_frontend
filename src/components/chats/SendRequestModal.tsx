'use client'
import React from 'react'
import { SelectedUser } from '@/Types/chats'

interface SendRequestModalProps {
  isOpen: boolean
  profileAvatar: string
  selectedUser: SelectedUser | null
  requestMessage: string
  isSendingRequest: boolean
  onClose: () => void
  onMessageChange: (message: string) => void
  onSendRequest: () => void
}

export default function SendRequestModal({
  isOpen,
  profileAvatar,
  selectedUser,
  requestMessage,
  isSendingRequest,
  onClose,
  onMessageChange,
  onSendRequest
}: SendRequestModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="send-request-modal">
        <div className="modal-header">
          <div className="modal-user-info">
            <div className="sender-avatar">
              <img src={profileAvatar} alt="You" />
            </div>
            <div className="friendship-icon">
              <i className="fas fa-handshake"></i>
            </div>
            <div className="receiver-avatar">
              <img src={selectedUser?.avatar || 'https://i.pravatar.cc/150?img=1'} alt={selectedUser?.name} />
            </div>
          </div>
          <button className="close-modal" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className="request-chat-box">
            <textarea
              placeholder="Type a message to send with your friend request..."
              value={requestMessage}
              onChange={(e) => onMessageChange(e.target.value)}
            />
          </div>
          <button
            className="send-request-button"
            onClick={onSendRequest}
            disabled={isSendingRequest || !requestMessage.trim()}
          >
            {isSendingRequest ? (
              <>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                Sending...
              </>
            ) : (
              'Send Request'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

