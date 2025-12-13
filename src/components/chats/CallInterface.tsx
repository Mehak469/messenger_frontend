'use client'
import React from 'react'
import { CallState, Chat } from '@/Types/chats'

interface CallInterfaceProps {
  callState: CallState
  onCancelCall: () => void
  onEndCall: () => void
  onToggleMute: () => void
  onToggleSpeaker: () => void
  onRedial: (contact: Chat) => void
  onClose: () => void
  formatCallDuration: (seconds: number) => string
}

export default function CallInterface({
  callState,
  onCancelCall,
  onEndCall,
  onToggleMute,
  onToggleSpeaker,
  onRedial,
  onClose,
  formatCallDuration
}: CallInterfaceProps) {
  if (!callState.isOutgoingCall && !callState.isCallActive && !callState.isCallEnded) {
    return null
  }

  return (
    <>
      <div className="call-interface-overlay"></div>
      <div className="call-interface">
        <div className="call-header">
          <img
            src={callState.callRecipient?.avatar || 'https://i.pravatar.cc/150?img=1'}
            alt=""
            className="call-user-avatar"
          />
          <h2 className="call-user-name">{callState.callRecipient?.name || 'Unknown'}</h2>
          <p className="call-status">
            {callState.isOutgoingCall ? 'Ringing...' :
              callState.isCallActive ? 'Connected' :
                'Call Ended'}
          </p>
          {(callState.isCallActive || (callState.isCallEnded && callState.totalCallTime > 0)) && (
            <p className="call-timer">
              {callState.isCallActive ?
                formatCallDuration(callState.callDuration) :
                `Call Duration: ${formatCallDuration(callState.totalCallTime)}`}
            </p>
          )}
        </div>

        {callState.isCallActive && (
          <div className="call-options">
            <button
              className={`call-option-btn ${callState.isMuted ? 'active' : ''}`}
              onClick={onToggleMute}
            >
              <i className={`fas ${callState.isMuted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
            </button>
            <button
              className={`call-option-btn ${callState.isSpeakerOn ? 'active' : ''}`}
              onClick={onToggleSpeaker}
            >
              <i className="fas fa-volume-up"></i>
            </button>
          </div>
        )}

        <div className="call-actions">
          {callState.isOutgoingCall && (
            <button className="call-action-btn cancel-call" onClick={onCancelCall}>
              <i className="fas fa-phone-slash"></i>
            </button>
          )}
          {callState.isCallActive && (
            <button className="call-action-btn end-call" onClick={onEndCall}>
              <i className="fas fa-phone-slash"></i>
            </button>
          )}
          {callState.isCallEnded && callState.callType === 'outgoing' && callState.callRecipient && (
            <>
              <button className="call-action-btn redial-call" onClick={() => onRedial(callState.callRecipient!)}>
                <i className="fas fa-phone"></i>
              </button>
              <button className="call-action-btn close-call" onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

