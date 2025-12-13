'use client'
import React from 'react'

interface ContextMenusProps {
  contextMenu: {
    visible: boolean
    x: number
    y: number
    chatId: number | null
    type: string | null
  }
  storyContextMenu: {
    visible: boolean
    x: number
    y: number
    storyId: number | null
    isMutedStory: boolean
  }
  onDeleteChat: () => void
  onArchiveChat: () => void
  onUnarchiveChat: () => void
  onMuteStory: (storyId: number) => void
  onUnmuteStory: (storyId: number) => void
  onDeleteStory: (storyId: number) => void
  yourStoryId: number
}

export default function ContextMenus({
  contextMenu,
  storyContextMenu,
  onDeleteChat,
  onArchiveChat,
  onUnarchiveChat,
  onMuteStory,
  onUnmuteStory,
  onDeleteStory,
  yourStoryId
}: ContextMenusProps) {
  return (
    <>
      {/* Chat Context Menu */}
      {contextMenu.visible && (
        <div
          className={`chat-context-menu ${contextMenu.visible ? 'active' : ''}`}
          style={{
            position: 'fixed',
            left: Math.min(contextMenu.x, window.innerWidth - 200),
            top: Math.min(contextMenu.y, window.innerHeight - 200),
            zIndex: 1000
          }}
        >
          {contextMenu.type === 'chat' && (
            <>
              <div className="context-menu-item" onClick={onDeleteChat}>
                <i className="fas fa-trash"></i>
                <span>Delete Chat</span>
              </div>
              <div className="context-menu-item" onClick={onArchiveChat}>
                <i className="fas fa-archive"></i>
                <span>Archive Chat</span>
              </div>
              <div className="context-menu-item">
                <i className="fas fa-bell-slash"></i>
                <span>Mute Notifications</span>
              </div>
            </>
          )}
          {contextMenu.type === 'archived' && (
            <>
              <div className="context-menu-item" onClick={onDeleteChat}>
                <i className="fas fa-trash"></i>
                <span>Delete Chat</span>
              </div>
              <div className="context-menu-item" onClick={onUnarchiveChat}>
                <i className="fas fa-inbox"></i>
                <span>Unarchive Chat</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Story Context Menu */}
      {storyContextMenu.visible && (
        <div
          className={`story-context-menu ${storyContextMenu.visible ? 'active' : ''}`}
          style={{
            position: 'fixed',
            left: Math.min(storyContextMenu.x, window.innerWidth - 200),
            top: Math.min(storyContextMenu.y, window.innerHeight - 200),
            zIndex: 1000
          }}
        >
          {storyContextMenu.storyId === yourStoryId ? (
            <div className="context-menu-item delete" onClick={() => onDeleteStory(yourStoryId)}>
              <i className="fas fa-trash"></i>
              <span>Delete Story</span>
            </div>
          ) : (
            <>
              {storyContextMenu.isMutedStory ? (
                <div className="context-menu-item" onClick={() => onUnmuteStory(storyContextMenu.storyId!)}>
                  <i className="fas fa-volume-up"></i>
                  <span>Unmute Story</span>
                </div>
              ) : (
                <div className="context-menu-item" onClick={() => onMuteStory(storyContextMenu.storyId!)}>
                  <i className="fas fa-volume-mute"></i>
                  <span>Mute Story</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}

