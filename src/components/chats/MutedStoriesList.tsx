'use client'
import React from 'react'
import { Story } from '@/Types/chats'

interface MutedStoriesListProps {
  stories: Story[]
  onStoryClick: (storyId: number, itemIndex?: number) => void
  onStoryRightClick: (e: React.MouseEvent, storyId: number) => void
  onStoryTouchStart: (storyId: number, e: React.TouchEvent) => void
  onStoryTouchEnd: () => void
}

export default function MutedStoriesList({
  stories,
  onStoryClick,
  onStoryRightClick,
  onStoryTouchStart,
  onStoryTouchEnd
}: MutedStoriesListProps) {
  return (
    <div className="muted-stories-section">
      <div className="stories-container">
        {stories.map(story => (
          <div
            key={story.id}
            className="story muted-story"
            onClick={() => onStoryClick(story.id)}
            onContextMenu={(e) => onStoryRightClick(e, story.id)}
            onTouchStart={(e) => onStoryTouchStart(story.id, e)}
            onTouchEnd={onStoryTouchEnd}
          >
            <div className="story-avatar">
              <img src={story.avatar} alt={story.name} />
              <div className="muted-story-indicator">
                <i className="fas fa-volume-mute"></i>
              </div>
            </div>
            <span className="story-name">{story.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

