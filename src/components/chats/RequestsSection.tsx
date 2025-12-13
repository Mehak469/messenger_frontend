'use client'
import React from 'react'

interface Request {
  id: string
  name: string
  avatar: string
  message: string
  time: string
  status?: string
  senderId?: string
  receiverId?: string
}

interface RequestsSectionProps {
  activeTab: string
  receivedRequests: Request[]
  sentRequests: Request[]
  onTabChange: (tab: string) => void
  onAcceptRequest: (requestId: string) => void
  onRejectRequest: (requestId: string) => void
  onCancelRequest: (requestId: string) => void
}

export default function RequestsSection({
  activeTab,
  receivedRequests,
  sentRequests,
  onTabChange,
  onAcceptRequest,
  onRejectRequest,
  onCancelRequest
}: RequestsSectionProps) {
  return (
    <div className="requests-section">
      <div className="requests-tabs">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => onTabChange('requests')}
          >
            Requests
          </button>
          <button
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => onTabChange('pending')}
          >
            Pending
          </button>
        </div>
      </div>

      {activeTab === 'requests' ? (
        <div className="requests-list">
          {receivedRequests.length > 0 ? (
            receivedRequests.map(request => (
              <div key={request.id} className="request-item">
                <div className="request-avatar">
                  <img src={request.avatar} alt={request.name} />
                </div>
                <div className="request-content">
                  <div className="request-header">
                    <span className="request-name">{request.name}</span>
                    <span className="request-time">{request.time}</span>
                  </div>
                  <div className="request-message">
                    {request.message}
                  </div>
                  <div className="request-actions">
                    <button 
                      className="reject-btn" 
                      onClick={() => onRejectRequest(request.id)}
                    >
                      Reject
                    </button>
                    <button 
                      className="accept-btn" 
                      onClick={() => onAcceptRequest(request.id)}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-requests">
              <div className="no-requests-content">
                <i className="fas fa-user-friends" style={{ fontSize: '48px', color: '#65676B', marginBottom: '16px' }}></i>
                <h3>No incoming friend requests</h3>
                <p>When people send you friend requests, they'll appear here.</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="sent-requests-list">
          {sentRequests.length > 0 ? (
            sentRequests.map(req => (
              <div key={req.id} className="sent-request-item">
                <div className="request-avatar">
                  <img src={req.avatar} alt={req.name} />
                </div>
                <div className="request-content">
                  <div className="request-header">
                    <span className="request-name">{req.name}</span>
                    <span className="request-time">{req.time}</span>
                  </div>
                  <div className="request-message">
                    {req.message}
                  </div>
                  <div className="sent-request-actions">
                    <button 
                      className="cancel-request-btn" 
                      onClick={() => onCancelRequest(req.id)}
                    >
                      <i className="fas fa-times"></i> Cancel Request
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-sent-requests">
              <div className="no-sent-requests-content">
                <i className="fas fa-paper-plane" style={{ fontSize: '48px', color: '#65676B', marginBottom: '16px' }}></i>
                <h3>No sent requests</h3>
                <p>You haven't sent any friend requests yet. Search for friends to send requests.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

