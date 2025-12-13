'use client'
import React from 'react'
import { Story } from '@/Types/chats'

interface StoriesListProps {
  stories: Story[]
  yourStory: Story
  currentStoryItemIndex: number
  onStoryClick: (storyId: number, itemIndex?: number) => void
  onStoryRightClick: (e: React.MouseEvent, storyId: number) => void
  onStoryTouchStart: (storyId: number, e: React.TouchEvent) => void
  onStoryTouchEnd: () => void
  onAddStory: () => void
}

export default function StoriesList({
  stories,
  yourStory,
  currentStoryItemIndex,
  onStoryClick,
  onStoryRightClick,
  onStoryTouchStart,
  onStoryTouchEnd,
  onAddStory
}: StoriesListProps) {
  return (
    <div className="stories-container">
      {/* Create Story Icon */}
      <div className="story create-story" onClick={onAddStory}>
        <div className="story-avatar create-story-avatar">
          <div className="grey-circle">
            <i className="fas fa-plus" style={{ color: '#0084ff', fontSize: '20px' }}></i>
          </div>
        </div>
        <span className="story-name">Create Story</span>
      </div>

      {/* Your Story - Only show if user has stories */}
      {yourStory.storyCount > 0 && (
        <div
          key={yourStory.id}
          className={`story ${yourStory.isMyStory ? 'my-story' : ''} ${yourStory.isSeen ? 'seen-story' : ''}`}
          onClick={() => onStoryClick(yourStory.id)}
          onContextMenu={(e) => onStoryRightClick(e, yourStory.id)}
          onTouchStart={(e) => onStoryTouchStart(yourStory.id, e)}
          onTouchEnd={onStoryTouchEnd}
        >
          <div className="story-avatar">
            <img src={yourStory.avatar} alt={yourStory.name} />
            {yourStory.storyCount && yourStory.storyCount > 1 && (
              <div className="story-lines">
                {Array.from({ length: yourStory.storyCount }, (_, i) => (
                  <div key={i} className={`story-line ${i === currentStoryItemIndex ? 'active' : ''}`}></div>
                ))}
              </div>
            )}
          </div>
          <span className="story-name">{yourStory.name}</span>
        </div>
      )}

      {/* Other Stories */}
      {stories.filter(story => !story.isMyStory).map(story => (
        <div
          key={story.id}
          className={`story ${story.isMyStory ? 'my-story' : ''} ${story.isSeen ? 'seen-story' : ''}`}
          onClick={() => onStoryClick(story.id)}
          onContextMenu={(e) => onStoryRightClick(e, story.id)}
          onTouchStart={(e) => onStoryTouchStart(story.id, e)}
          onTouchEnd={onStoryTouchEnd}
        >
          <div className="story-avatar">
            <img src={story.avatar} alt={story.name} />
            {story.storyCount && story.storyCount > 1 && (
              <div className="story-lines">
                {Array.from({ length: story.storyCount }, (_, i) => (
                  <div key={i} className={`story-line ${i === 0 ? 'active' : ''}`}></div>
                ))}
              </div>
            )}
          </div>
          <span className="story-name">{story.name}</span>
        </div>
      ))}
    </div>
  )
}

