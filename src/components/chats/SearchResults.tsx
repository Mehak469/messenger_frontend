'use client'
import React from 'react'
import { Chat, Notification } from '@/Types/chats'

interface SearchResultsProps {
  searchQuery: string
  searchResults: any[]
  activeSection: string
  isMobile: boolean
  chats: Chat[]
  onChatClick: (chatId: number) => void
  onOpenSendRequestModal: (user: any) => void
}

export default function SearchResults({
  searchQuery,
  searchResults,
  activeSection,
  isMobile,
  chats,
  onChatClick,
  onOpenSendRequestModal
}: SearchResultsProps) {
  if (!searchQuery.trim()) return null

  return (
    <div className="search-results">
      {searchResults.length > 0 ? (
        searchResults.map((result, index) => {
          // For chats section
          if (activeSection === 'chats') {
            const chat = result as Chat
            return (
              <div
                key={chat.id}
                className={`search-result-item ${isMobile ? 'mobile-chat-item' : 'chat-item'}`}
                onClick={() => onChatClick(chat.id)}
              >
                {/* Chat item rendering */}
              </div>
            )
          }

          // For requests section
          else if (activeSection === 'requests') {
            const user = result
            const isConnected = chats.some(chat =>
              chat.name.toLowerCase() === user.name.toLowerCase()
            )

            return (
              <div key={user.id} className="search-result-item">
                <div className={`chat-item ${isMobile ? 'mobile-chat-item' : ''}`}>
                  <div className={`${isMobile ? 'mobile-chat-avatar' : 'chat-avatar'}`}>
                    <img src={user.avatar} alt={user.name} />
                  </div>
                  <div className={`${isMobile ? 'mobile-chat-info' : 'chat-content'}`}>
                    <div className={`${isMobile ? 'mobile-chat-header' : 'chat-header'}`}>
                      <span className={`${isMobile ? 'mobile-chat-name' : 'chat-name'}`}>
                        {user.name}
                        {user.username && (
                          <span className="username" style={{ fontSize: '12px', color: '#65676B', marginLeft: '8px' }}>
                            @{user.username}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className={`${isMobile ? 'mobile-chat-preview' : 'chat-preview'}`}>
                      <span>
                        {isConnected
                          ? "Already connected"
                          : user.bio || "Click to send friend request"
                        }
                        {user.friends && user.friends.length > 0 && (
                          <span style={{ fontSize: '11px', color: '#1877f2', marginLeft: '8px' }}>
                            {user.friends.length} friends
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  {!isConnected && (
                    <button
                      className="send-request-btn"
                      onClick={() => onOpenSendRequestModal(user)}
                    >
                      Send Request
                    </button>
                  )}
                  {isConnected && (
                    <button
                      className="send-request-btn connected-btn"
                      style={{ backgroundColor: '#e4e6eb', color: '#65676B' }}
                      disabled
                    >
                      Connected
                    </button>
                  )}
                </div>
              </div>
            )
          }

          // For other sections
          else {
            return (
              <div key={index} className="search-result-item">
                <div className="chat-item">
                  <div className="chat-content">
                    <div className="chat-header">
                      <span className="chat-name">{result.name || result.title}</span>
                    </div>
                    <div className="chat-preview">
                      <span>{result.lastMessage || result.description}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        })
      ) : (
        <div className="no-results">No results found for "{searchQuery}"</div>
      )}
    </div>
  )
}

