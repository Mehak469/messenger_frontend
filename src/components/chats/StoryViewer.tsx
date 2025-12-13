'use client'
import React, { useRef, useEffect } from 'react'
import { Story } from '@/Types/chats'

interface StoryViewerProps {
  currentStory: Story
  currentStoryItemIndex: number
  currentStoryIndex: number
  storiesLength: number
  storyProgress: number
  isStoryPlaying: boolean
  isYourStory: boolean
  onClose: () => void
  onTogglePlayPause: () => void
  onNextStory: () => void
  onPrevStory: () => void
  onNextStoryItem: () => void
  onPrevStoryItem: () => void
  showStoryMessageBox: boolean
  storyMessage: string
  onStoryMessageChange: (message: string) => void
  onStoryMessageSend: () => void
  onToggleStoryMessageBox: () => void
  onDeleteStory: (storyId: number) => void
  videoRef: React.RefObject<HTMLVideoElement | null>
}

export default function StoryViewer({
  currentStory,
  currentStoryItemIndex,
  currentStoryIndex,
  storiesLength,
  storyProgress,
  isStoryPlaying,
  isYourStory,
  onClose,
  onTogglePlayPause,
  onNextStory,
  onPrevStory,
  onNextStoryItem,
  onPrevStoryItem,
  showStoryMessageBox,
  storyMessage,
  onStoryMessageChange,
  onStoryMessageSend,
  onToggleStoryMessageBox,
  onDeleteStory,
  videoRef
}: StoryViewerProps) {
  const currentMediaUrl = currentStory?.mediaUrls[currentStoryItemIndex]
  const isVideo = currentMediaUrl?.includes('video') || currentStory?.mediaType === 'video'

  useEffect(() => {
    if (videoRef.current) {
      if (isStoryPlaying) {
        videoRef.current.play().catch(console.error)
      } else {
        videoRef.current.pause()
      }
    }
  }, [isStoryPlaying, currentStoryItemIndex, videoRef])

  if (!currentStory || currentStory.mediaUrls.length === 0) return null

  return (
    <div className="stories-viewer" onClick={onClose}>
      <div className="story-content" onClick={(e) => e.stopPropagation()}>
        {/* Progress Bars */}
        <div className="story-progress">
          {Array.from({ length: currentStory.storyCount }, (_, i) => (
            <div key={i} className="progress-segment">
              <div
                className={`progress-fill ${i === currentStoryItemIndex ? 'active' : i < currentStoryItemIndex ? 'completed' : ''}`}
                style={{
                  width: i === currentStoryItemIndex ? `${storyProgress}%` :
                    i < currentStoryItemIndex ? '100%' : '0%'
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="story-header">
          <img
            src={currentStory.avatar}
            alt=""
            className="story-header-avatar"
          />
          <div className="story-header-info">
            <div className="story-user-name">{currentStory.name}</div>
            <div className="story-time">{currentStory.time}</div>
          </div>
          <div className="story-controls">
            <button className="story-play-pause" onClick={onTogglePlayPause}>
              <i className={`fas ${isStoryPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </button>
            <button className="story-close" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        {!isYourStory && currentStoryIndex > 0 && (
          <button className="story-nav story-prev" onClick={onPrevStory}>
            <i className="fas fa-chevron-left"></i>
          </button>
        )}
        {!isYourStory && currentStoryIndex < storiesLength - 1 && (
          <button className="story-nav story-next" onClick={onNextStory}>
            <i className="fas fa-chevron-right"></i>
          </button>
        )}

        {/* Story Media */}
        <div className="story-media">
          {isVideo ? (
            <video
              ref={videoRef}
              src={currentMediaUrl}
              autoPlay
              muted={false}
              loop={false}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onEnded={onNextStoryItem}
            />
          ) : (
            <img
              src={currentMediaUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          )}
        </div>

        {/* Story Caption */}
        {currentStory.captions[currentStoryItemIndex] && (
          <div className="story-caption">
            {currentStory.captions[currentStoryItemIndex]}
          </div>
        )}

        {/* Story Message Box - Only show for other people's stories */}
        {!isYourStory && (
          <>
            {showStoryMessageBox ? (
              <div className="story-message-box">
                <input
                  type="text"
                  className="story-message-input"
                  placeholder="Send message..."
                  value={storyMessage}
                  onChange={(e) => onStoryMessageChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onStoryMessageSend()}
                  autoFocus
                />
              </div>
            ) : (
              <button className="story-message-btn" onClick={onToggleStoryMessageBox}>
                <i className="fas fa-comment" style={{ marginRight: '8px' }}></i>
                Send Message
              </button>
            )}
          </>
        )}

        {/* Delete Story Option for Your Story */}
        {isYourStory && (
          <button
            className="delete-story-btn"
            onClick={() => onDeleteStory(currentStory.id)}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              background: 'rgba(255, 0, 0, 0.7)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '10px 20px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
          >
            <i className="fas fa-trash" style={{ marginRight: '8px' }}></i>
            Delete Story
          </button>
        )}
      </div>
    </div>
  )
}

