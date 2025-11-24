'use client'
import { useState, useEffect, useRef } from 'react'
import './chats.css'

// Types
interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
  isActive: boolean;
  messages: Message[];
}

interface Message {
  id: number;
  text: string;
  time: string;
  isUser: boolean;
  type: string;
  content?: string;
  voiceUrl?: string;
  duration?: number;
}

interface Story {
  id: number;
  name: string;
  avatar: string;
  time: string;
  hasNewStory: boolean;
  mediaUrls: string[];
  mediaType: string;
  captions: string[];
  storyCount: number;
  isMyStory: boolean;
  isSeen?: boolean;
  isMuted?: boolean;
}

interface Notification {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  pageAvatar?: string;
  userAvatar?: string;
  isNew: boolean;
}

interface CallState {
  isIncomingCall: boolean;
  isOutgoingCall: boolean;
  isCallActive: boolean;
  isCallEnded: boolean;
  callDuration: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
  totalCallTime: number;
  callType: string | null;
  callRecipient: Chat | null;
}

interface AppState {
  activeSection: string;
  callState: CallState;
  showStoriesViewer: boolean;
  currentStoryIndex: number;
  currentStoryItemIndex: number;
  isStoryPlaying: boolean;
  storyProgress: number;
  showStoryMessageBox: boolean;
  storyMessage: string;
  contextMenu: {
    visible: boolean;
    x: number;
    y: number;
    chatId: number | null;
    type: string | null;
  };
  storyContextMenu: {
    visible: boolean;
    x: number;
    y: number;
    storyId: number | null;
    isMutedStory: boolean;
  };
  stories: Story[];
  showMutedStories: boolean;
  chats: Chat[];
  messageRequests: any[];
  archivedChats: any[];
  notifications: Notification[];
  activeChat: Chat | null;
  messages: Message[];
  newMessage: string;
  showAttachmentMenu: boolean;
  showEmojiPicker: boolean;
  searchQuery: string;
  searchResults: any[];
  isRecording: boolean;
  recordingTime: number;
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
  playingVoiceMessage: number | null;
  audioRef: HTMLAudioElement | null;
  storyProgressInterval: NodeJS.Timeout | null;
  callTimerInterval: NodeJS.Timeout | null;
  recordingInterval: NodeJS.Timeout | null;
  isMobile: boolean;
  isTablet: boolean;
}

// Initial data
const initialChatsData: Chat[] = [
  {
    id: 1,
    name: "Noor",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "You changed the theme to Classic",
    time: "2d",
    unread: 0,
    isOnline: true,
    isActive: true,
    messages: [
      { id: 1, text: "Kia hua h", time: "11:20 AM", isUser: false, type: 'text' },
      { id: 2, text: "Wei", time: "11:20 AM", isUser: true, type: 'text' },
      { id: 3, text: "You changed the theme to Classic", time: "Change", isUser: false, type: 'notification' },
      { id: 4, text: "As", time: "11:22 AM", isUser: false, type: 'text' }
    ]
  },
  {
    id: 2,
    name: "Buddy😊😊😊",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "You sent an attachment",
    time: "1w",
    unread: 0,
    isOnline: false,
    messages: []
  },
  {
    id: 3,
    name: "Elliz Ladla",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "You changed the theme to Graph Paper",
    time: "3w",
    unread: 0,
    isOnline: true,
    messages: []
  },
  {
    id: 4,
    name: "Hassan Raza",
    avatar: "https://i.pravatar.cc/150?img=4",
    lastMessage: "Messages and calls are secured with end-to-en...",
    time: "5w",
    unread: 0,
    isOnline: false,
    messages: []
  },
  {
    id: 5,
    name: "Muhammad Irfan Shameer",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Reacted 😊 to your message",
    time: "5w",
    unread: 0,
    isOnline: true,
    messages: []
  }
];

const initialStoriesData: Story[] = [
  {
    id: 1,
    name: 'Noor',
    avatar: 'https://i.pravatar.cc/150?img=1',
    time: '25m',
    hasNewStory: true,
    mediaUrls: ['https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=400'],
    mediaType: 'image',
    captions: ['Beautiful sunset views! 🌅'],
    storyCount: 1,
    isMyStory: false
  },
  {
    id: 2,
    name: 'Buddy',
    avatar: 'https://i.pravatar.cc/150?img=2',
    time: '1h',
    hasNewStory: true,
    mediaUrls: ['https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400'],
    mediaType: 'image',
    captions: ['Coffee time ☕'],
    storyCount: 1,
    isMyStory: false
  },
  {
    id: 4,
    name: 'Hassan',
    avatar: 'https://i.pravatar.cc/150?img=4',
    time: '4h',
    hasNewStory: true,
    mediaUrls: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
    mediaType: 'image',
    captions: ['Nature walk 🏞️'],
    storyCount: 1,
    isMyStory: false,
    isMuted: true
  },
];

const initialNotificationsData: Notification[] = [
  {
    id: 1,
    type: 'friend_suggestion',
    title: 'Abrar khawja Photography',
    description: 'is a suggested Page for you to follow.',
    time: '2h',
    pageAvatar: 'https://i.pravatar.cc/150?img=7',
    isNew: true
  },
  {
    id: 2,
    type: 'mention',
    title: 'Summer Abbas',
    description: 'mentioned you and others in a comment in University of Sargodha(official).',
    time: '4h',
    userAvatar: 'https://i.pravatar.cc/150?img=8',
    isNew: true
  }
];

const popularEmojis = [
  '😀', '😂', '😍', '🥰', '😎', '🤩', '😜', '🤗', '👍', '👏',
  '❤', '🔥', '💯', '✨', '🎉', '🙏', '😊', '😘', '😉', '🤔','🌸','💞','🥲','✅',
  '🫀','🥹','🤨','😡','😶‍🌫','😴','👿','👏','👍🏻','👀'
];

export default function ChatsPage() {
  const [state, setState] = useState<AppState>({
    activeSection: 'chats',
    callState: {
      isIncomingCall: false,
      isOutgoingCall: false,
      isCallActive: false,
      isCallEnded: false,
      callDuration: 0,
      isMuted: false,
      isSpeakerOn: false,
      totalCallTime: 0,
      callType: null,
      callRecipient: null
    },
    showStoriesViewer: false,
    currentStoryIndex: 0,
    currentStoryItemIndex: 0,
    isStoryPlaying: true,
    storyProgress: 0,
    showStoryMessageBox: false,
    storyMessage: '',
    contextMenu: {
      visible: false,
      x: 0,
      y: 0,
      chatId: null,
      type: null
    },
    storyContextMenu: {
      visible: false,
      x: 0,
      y: 0,
      storyId: null,
      isMutedStory: false
    },
    stories: [...initialStoriesData],
    showMutedStories: false,
    chats: JSON.parse(JSON.stringify(initialChatsData)),
    messageRequests: [],
    archivedChats: [
      {
        id: 6,
        name: 'Haider Ali Mughal',
        avatar: 'https://i.pravatar.cc/150?img=6',
        lastMessage: 'Messages and calls are secured with end-t...',
        time: '36w'
      }
    ],
    notifications: [...initialNotificationsData],
    activeChat: null,
    messages: [],
    newMessage: '',
    showAttachmentMenu: false,
    showEmojiPicker: false,
    searchQuery: '',
    searchResults: [],
    isRecording: false,
    recordingTime: 0,
    mediaRecorder: null,
    audioChunks: [],
    playingVoiceMessage: null,
    audioRef: null,
    storyProgressInterval: null,
    callTimerInterval: null,
    recordingInterval: null,
    isMobile: typeof window !== 'undefined' ? window.innerWidth <= 768 : false,
    isTablet: typeof window !== 'undefined' ? window.innerWidth > 768 && window.innerWidth <= 1024 : false
  });

  const [profileAvatar, setProfileAvatar] = useState('https://i.pravatar.cc/150?img=32');
  const [yourStory, setYourStory] = useState<Story>({
    id: 3,
    name: 'Your Story',
    avatar: 'https://i.pravatar.cc/150?img=32',
    time: 'Just now',
    hasNewStory: false,
    mediaUrls: [],
    mediaType: 'image',
    captions: [],
    storyCount: 0,
    isMyStory: true
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('messengerUser');
    if (!userData) {
      window.location.href = '/auth';
      return;
    }

    // Load user profile data
    const parsedUserData = JSON.parse(userData);
    if (parsedUserData.avatar) {
      setProfileAvatar(parsedUserData.avatar);
      setYourStory(prev => ({
        ...prev,
        avatar: parsedUserData.avatar
      }));
    }

    // Auto simulate incoming call after 3 seconds
    const callTimer = setTimeout(() => {
      simulateIncomingCall(initialChatsData[0]);
    }, 3000);

    // Window resize handler
    const handleResize = () => {
      setState(prev => ({
        ...prev,
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth > 768 && window.innerWidth <= 1024
      }));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(callTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close context menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (state.contextMenu.visible && !(e.target as Element).closest('.chat-context-menu')) {
        setState(prev => ({
          ...prev,
          contextMenu: { ...prev.contextMenu, visible: false }
        }));
      }
      if (state.storyContextMenu.visible && !(e.target as Element).closest('.story-context-menu')) {
        setState(prev => ({
          ...prev,
          storyContextMenu: { ...prev.storyContextMenu, visible: false }
        }));
      }
      if (state.showAttachmentMenu && !(e.target as Element).closest('.attachment-menu') && !(e.target as Element).closest('#attachButton')) {
        setState(prev => ({ ...prev, showAttachmentMenu: false }));
      }
      if (state.showEmojiPicker && !(e.target as Element).closest('.emoji-picker') && !(e.target as Element).closest('#emojiButton')) {
        setState(prev => ({ ...prev, showEmojiPicker: false }));
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [state.contextMenu.visible, state.storyContextMenu.visible, state.showAttachmentMenu, state.showEmojiPicker]);

  // Story progress interval
  useEffect(() => {
    if (state.showStoriesViewer && state.isStoryPlaying && (state.stories.length > 0 || yourStory.storyCount > 0)) {
      const interval = setInterval(() => {
        setState(prev => {
          if (prev.storyProgress >= 100) {
            nextStoryItem();
            return { ...prev, storyProgress: 0 };
          }
          return { ...prev, storyProgress: prev.storyProgress + 1 };
        });
      }, 50);
      
      setState(prev => ({ ...prev, storyProgressInterval: interval }));
      
      return () => clearInterval(interval);
    }
  }, [state.showStoriesViewer, state.isStoryPlaying, state.storyProgress]);

  // Handle video play/pause when story playing state changes
  useEffect(() => {
    if (videoRef.current) {
      if (state.isStoryPlaying) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [state.isStoryPlaying, state.currentStoryItemIndex]);

  // Call timer interval
  useEffect(() => {
    if (state.callState.isCallActive) {
      const interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          callState: {
            ...prev.callState,
            callDuration: prev.callState.callDuration + 1
          }
        }));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [state.callState.isCallActive]);

  // Recording timer interval
  useEffect(() => {
    if (state.isRecording) {
      const interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          recordingTime: prev.recordingTime + 1
        }));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [state.isRecording]);

  // Helper functions
  const setActiveSection = (section: string) => {
    setState(prev => ({
      ...prev,
      activeSection: section,
      searchQuery: '',
      searchResults: []
    }));
  };

  const handleChatClick = (chatId: number) => {
    const chat = state.chats.find(c => c.id === chatId);
    if (chat) {
      setState(prev => ({
        ...prev,
        activeChat: chat,
        messages: chat.messages
      }));
    }
  };

  const sendMessage = () => {
    if (!state.newMessage.trim()) return;
    
    const currentTime = getCurrentTime();
    const newMsg: Message = {
      id: state.messages.length + 1,
      text: state.newMessage,
      time: currentTime,
      isUser: true,
      type: 'text'
    };
    
    const updatedMessages = [...state.messages, newMsg];
    
    setState(prev => ({
      ...prev,
      messages: updatedMessages,
      newMessage: ''
    }));
    
    // Update chats state with new message and REORDER CHAT TO TOP
    reorderChats(state.activeChat!.id, state.newMessage, currentTime);
    
    // Simulate reply after 1 second
    setTimeout(() => {
      const replyText = getRandomReply();
      const replyTime = getCurrentTime();
      const replyMsg: Message = {
        id: updatedMessages.length + 1,
        text: replyText,
        time: replyTime,
        isUser: false,
        type: 'text'
      };
      
      setState(prev => ({
        ...prev,
        messages: [...updatedMessages, replyMsg]
      }));
      
      // Reorder chat again for the reply
      reorderChats(state.activeChat!.id, replyText, replyTime);
    }, 1000);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const getRandomReply = () => {
    const replies = [
      "That's interesting!",
      "I see what you mean.",
      "Tell me more about that.",
      "I agree with you.",
      "That's a good point.",
      "I'm not sure about that.",
      "Let me think about it.",
      "Thanks for sharing!"
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const reorderChats = (chatId: number, lastMessage: string, time: string) => {
    const chatIndex = state.chats.findIndex(chat => chat.id === chatId);
    if (chatIndex === -1) return;
    
    const updatedChats = [...state.chats];
    const chatToMove = { ...updatedChats[chatIndex] };
    
    // Update chat with new message info
    chatToMove.lastMessage = lastMessage;
    chatToMove.time = time;
    
    // Remove from current position
    updatedChats.splice(chatIndex, 1);
    
    // Add to top
    updatedChats.unshift(chatToMove);
    
    setState(prev => ({
      ...prev,
      chats: updatedChats
    }));
  };

  const simulateIncomingCall = (contact: Chat) => {
    setState(prev => ({
      ...prev,
      callState: {
        ...prev.callState,
        isIncomingCall: true,
        isOutgoingCall: false,
        isCallActive: false,
        isCallEnded: false,
        callDuration: 0,
        isMuted: false,
        isSpeakerOn: false,
        totalCallTime: 0,
        callType: 'incoming',
        callRecipient: contact
      }
    }));
  };

  const startOutgoingCall = (contact: Chat) => {
    setState(prev => ({
      ...prev,
      callState: {
        ...prev.callState,
        isIncomingCall: false,
        isOutgoingCall: true,
        isCallActive: false,
        isCallEnded: false,
        callDuration: 0,
        isMuted: false,
        isSpeakerOn: false,
        totalCallTime: 0,
        callType: 'outgoing',
        callRecipient: contact
      }
    }));
    
    // Simulate call being answered after 3 seconds
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        callState: {
          ...prev.callState,
          isOutgoingCall: false,
          isCallActive: true
        }
      }));
    }, 3000);
  };

  const answerCall = () => {
    setState(prev => ({
      ...prev,
      callState: {
        ...prev.callState,
        isIncomingCall: false,
        isCallActive: true,
        isCallEnded: false,
        callDuration: 0
      }
    }));
  };

  const endCall = () => {
    const finalCallTime = state.callState.callDuration;
    
    setState(prev => ({
      ...prev,
      callState: {
        ...prev.callState,
        isIncomingCall: false,
        isOutgoingCall: false,
        isCallActive: false,
        isCallEnded: true,
        totalCallTime: finalCallTime
      }
    }));
    
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        callState: {
          ...prev.callState,
          isCallEnded: false,
          callDuration: 0,
          totalCallTime: 0,
          callType: null,
          callRecipient: null
        }
      }));
    }, 2000);
  };

  const declineCall = () => {
    setState(prev => ({
      ...prev,
      callState: {
        ...prev.callState,
        isIncomingCall: false,
        isOutgoingCall: false,
        isCallActive: false,
        isCallEnded: false,
        callDuration: 0,
        isMuted: false,
        isSpeakerOn: false,
        totalCallTime: 0,
        callType: null,
        callRecipient: null
      }
    }));
  };

  const cancelOutgoingCall = () => {
    setState(prev => ({
      ...prev,
      callState: {
        ...prev.callState,
        isIncomingCall: false,
        isOutgoingCall: false,
        isCallActive: false,
        isCallEnded: true,
        callDuration: 0,
        isMuted: false,
        isSpeakerOn: false,
        totalCallTime: 0,
        callType: 'outgoing'
      }
    }));
    
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        callState: {
          ...prev.callState,
          isCallEnded: false,
          callType: null,
          callRecipient: null
        }
      }));
    }, 2000);
  };

  const toggleMute = () => {
    setState(prev => ({
      ...prev,
      callState: {
        ...prev.callState,
        isMuted: !prev.callState.isMuted
      }
    }));
  };

  const toggleSpeaker = () => {
    setState(prev => ({
      ...prev,
      callState: {
        ...prev.callState,
        isSpeakerOn: !prev.callState.isSpeakerOn
      }
    }));
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const openStory = (storyId: number, itemIndex: number = 0) => {
    let storyIndex = -1;
    let currentStories = [...state.stories];
    
    // Check if it's "Your Story"
    if (storyId === yourStory.id) {
      // For "Your Story", we'll handle it separately
      setState(prev => ({
        ...prev,
        currentStoryIndex: -1, // -1 indicates "Your Story"
        currentStoryItemIndex: itemIndex,
        showStoriesViewer: true,
        isStoryPlaying: true,
        storyProgress: 0,
        showStoryMessageBox: false
      }));
      return;
    }
    
    // Find the story in regular stories
    storyIndex = currentStories.findIndex(story => story.id === storyId);
    if (storyIndex === -1) return;
    
    setState(prev => ({
      ...prev,
      currentStoryIndex: storyIndex,
      currentStoryItemIndex: itemIndex,
      showStoriesViewer: true,
      isStoryPlaying: true,
      storyProgress: 0,
      showStoryMessageBox: false,
      stories: prev.stories.map((story, i) => 
        i === storyIndex ? { ...story, hasNewStory: false, isSeen: true } : story
      )
    }));
  };

  const closeStory = () => {
    setState(prev => ({
      ...prev,
      showStoriesViewer: false,
      isStoryPlaying: false,
      storyProgress: 0,
      currentStoryItemIndex: 0,
      showStoryMessageBox: false,
      storyMessage: ''
    }));
  };

  const toggleStoryPlayPause = () => {
    setState(prev => ({
      ...prev,
      isStoryPlaying: !prev.isStoryPlaying
    }));
  };

  const nextStoryItem = () => {
    const isYourStory = state.currentStoryIndex === -1;
    const currentStory = isYourStory ? yourStory : state.stories[state.currentStoryIndex];
    
    if (state.currentStoryItemIndex < (currentStory.storyCount || 1) - 1) {
      setState(prev => ({
        ...prev,
        currentStoryItemIndex: prev.currentStoryItemIndex + 1,
        storyProgress: 0
      }));
    } else {
      nextStory();
    }
  };

  const prevStoryItem = () => {
    if (state.currentStoryItemIndex > 0) {
      setState(prev => ({
        ...prev,
        currentStoryItemIndex: prev.currentStoryItemIndex - 1,
        storyProgress: 0
      }));
    } else {
      prevStory();
    }
  };

  const nextStory = () => {
    const isYourStory = state.currentStoryIndex === -1;
    
    if (isYourStory) {
      // If it's "Your Story" and we're at the end, close the viewer
      closeStory();
      return;
    }
    
    if (state.currentStoryIndex < state.stories.length - 1) {
      setState(prev => ({
        ...prev,
        currentStoryIndex: prev.currentStoryIndex + 1,
        currentStoryItemIndex: 0,
        storyProgress: 0,
        stories: prev.stories.map((story, i) => 
          i === prev.currentStoryIndex + 1 ? { ...story, hasNewStory: false, isSeen: true } : story
        )
      }));
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    const isYourStory = state.currentStoryIndex === -1;
    
    if (isYourStory) {
      // If it's "Your Story", we can't go to previous story
      return;
    }
    
    if (state.currentStoryIndex > 0) {
      setState(prev => ({
        ...prev,
        currentStoryIndex: prev.currentStoryIndex - 1,
        currentStoryItemIndex: 0,
        storyProgress: 0
      }));
    }
  };

  const handleStoryRightClick = (e: React.MouseEvent, storyId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Don't show context menu for "Your Story"
    if (storyId === yourStory.id) return;
    
    const story = state.stories.find(s => s.id === storyId);
    if (story) {
      setState(prev => ({
        ...prev,
        storyContextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY,
          storyId: storyId,
          isMutedStory: !!story.isMuted
        }
      }));
    }
  };

  const muteStory = (storyId: number) => {
    setState(prev => ({
      ...prev,
      stories: prev.stories.map(story => 
        story.id === storyId ? { ...story, isMuted: true } : story
      ),
      storyContextMenu: { ...prev.storyContextMenu, visible: false }
    }));
  };

  const unmuteStory = (storyId: number) => {
    setState(prev => ({
      ...prev,
      stories: prev.stories.map(story => 
        story.id === storyId ? { ...story, isMuted: false } : story
      ),
      storyContextMenu: { ...prev.storyContextMenu, visible: false }
    }));
  };

  const deleteStory = (storyId: number) => {
    // Only allow deleting "Your Story"
    if (storyId === yourStory.id) {
      // Reset your story
      setYourStory(prev => ({
        ...prev,
        mediaUrls: [],
        captions: [],
        storyCount: 0,
        hasNewStory: false
      }));
      
      // If current story is being deleted, close viewer
      if (state.showStoriesViewer && state.currentStoryIndex === -1) {
        closeStory();
      }
    }
    setState(prev => ({
      ...prev,
      storyContextMenu: { ...prev.storyContextMenu, visible: false }
    }));
  };

  const addStory = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;
      
      const newMediaUrls: string[] = [];
      const newCaptions: string[] = [];
      
      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const mediaUrl = event.target?.result as string;
          newMediaUrls.push(mediaUrl);
          newCaptions.push(`My story ${index + 1} 📸`);
          
          // When all files are processed
          if (newMediaUrls.length === files.length) {
            // Update "Your Story" with new media - ADD TO EXISTING STORIES
            setYourStory(prev => ({
              ...prev,
              mediaUrls: [...prev.mediaUrls, ...newMediaUrls],
              captions: [...prev.captions, ...newCaptions],
              storyCount: prev.storyCount + files.length,
              time: 'Just now',
              hasNewStory: true
            }));
            
            // Auto open the updated story
            setState(prev => ({
              ...prev,
              currentStoryIndex: -1, // -1 indicates "Your Story"
              currentStoryItemIndex: prev.currentStoryIndex === -1 ? prev.currentStoryItemIndex : 0,
              showStoriesViewer: true
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    };
    input.click();
  };

  const showMutedStoriesSection = () => {
    setState(prev => ({ ...prev, showMutedStories: true }));
  };

  const hideMutedStoriesSection = () => {
    setState(prev => ({ ...prev, showMutedStories: false }));
  };

  const toggleStoryMessageBox = () => {
    const isYourStory = state.currentStoryIndex === -1;
    
    // Don't show message box for "Your Story"
    if (isYourStory) return;
    
    setState(prev => ({ 
      ...prev, 
      showStoryMessageBox: !prev.showStoryMessageBox,
      isStoryPlaying: !prev.showStoryMessageBox // Pause when opening message box, play when closing
    }));
  };

  const handleStoryMessageSend = () => {
    if (!state.storyMessage.trim()) return;
    
    const isYourStory = state.currentStoryIndex === -1;
    
    // Don't allow sending messages to "Your Story"
    if (isYourStory) return;
    
    const currentStory = state.stories[state.currentStoryIndex];
    if (!currentStory.isMyStory) {
      // Find the chat for this story user
      const storyUserChat = state.chats.find(chat => 
        chat.name.toLowerCase().includes(currentStory.name.toLowerCase())
      );
      
      if (storyUserChat) {
        const currentTime = getCurrentTime();
        const storyReplyMessage: Message = {
          id: storyUserChat.messages.length + 1,
          text: state.storyMessage,
          time: currentTime,
          isUser: true,
          type: 'text'
        };
        
        const updatedMessages = [...storyUserChat.messages, storyReplyMessage];
        
        // Update both chats state and active chat if needed
        setState(prev => ({
          ...prev,
          chats: prev.chats.map(chat => 
            chat.id === storyUserChat.id ? {
              ...chat,
              messages: updatedMessages,
              lastMessage: state.storyMessage,
              time: currentTime
            } : chat
          )
        }));
        
        // Reorder the chat to top
        reorderChats(storyUserChat.id, state.storyMessage, currentTime);
        
        // If this chat is active, update messages
        if (state.activeChat?.id === storyUserChat.id) {
          setState(prev => ({
            ...prev,
            messages: updatedMessages
          }));
        }
        
        // Close story viewer and open chat interface
        closeStory();
        handleChatClick(storyUserChat.id);
      }
    }
    
    setState(prev => ({
      ...prev,
      storyMessage: '',
      showStoryMessageBox: false,
      isStoryPlaying: true
    }));
  };

  const handleChatRightClick = (e: React.MouseEvent, chatId: number, type: string = 'chat') => {
    e.preventDefault();
    e.stopPropagation();
    
    setState(prev => ({
      ...prev,
      contextMenu: {
        visible: true,
        x: e.clientX,
        y: e.clientY,
        chatId: chatId,
        type: type
      }
    }));
  };

  const deleteChat = (id: number) => {
    setState(prev => ({
      ...prev,
      chats: prev.chats.filter(chat => chat.id !== id),
      contextMenu: { ...prev.contextMenu, visible: false },
      ...(prev.activeChat?.id === id && {
        activeChat: prev.chats.length > 1 ? prev.chats[0] : null,
        messages: prev.chats.length > 1 ? prev.chats[0].messages : []
      })
    }));
  };

  const archiveChat = (id: number) => {
    const chatToArchive = state.chats.find(chat => chat.id === id);
    if (chatToArchive) {
      // Move chat to archived
      const archivedChat = {
        id: chatToArchive.id,
        name: chatToArchive.name,
        avatar: chatToArchive.avatar,
        lastMessage: chatToArchive.lastMessage,
        time: chatToArchive.time
      };
      
      setState(prev => ({
        ...prev,
        archivedChats: [...prev.archivedChats, archivedChat],
        chats: prev.chats.filter(chat => chat.id !== id),
        contextMenu: { ...prev.contextMenu, visible: false },
        ...(prev.activeChat?.id === id && {
          activeChat: prev.chats.length > 1 ? prev.chats[0] : null,
          messages: prev.chats.length > 1 ? prev.chats[0].messages : []
        })
      }));
    }
  };

  const unarchiveChat = (id: number) => {
    const chatToUnarchive = state.archivedChats.find(chat => chat.id === id);
    if (chatToUnarchive) {
      // Move chat back to main list with original messages
      const originalChat = initialChatsData.find(chat => chat.id === id);
      const newChat: Chat = {
        id: chatToUnarchive.id,
        name: chatToUnarchive.name,
        avatar: chatToUnarchive.avatar,
        lastMessage: chatToUnarchive.lastMessage,
        time: chatToUnarchive.time,
        unread: 0,
        isOnline: false,
        messages: originalChat?.messages || []
      };
      
      setState(prev => ({
        ...prev,
        chats: [...prev.chats, newChat],
        archivedChats: prev.archivedChats.filter(chat => chat.id !== id),
        contextMenu: { ...prev.contextMenu, visible: false }
      }));
    }
  };

  const handleDeleteFromContextMenu = () => {
    if (state.contextMenu.chatId) {
      if (state.contextMenu.type === 'archived') {
        // Delete archived chat
        setState(prev => ({
          ...prev,
          archivedChats: prev.archivedChats.filter(chat => chat.id !== state.contextMenu.chatId),
          contextMenu: { ...prev.contextMenu, visible: false }
        }));
      } else {
        // Delete regular chat
        deleteChat(state.contextMenu.chatId);
      }
    }
  };

  const handleArchiveFromContextMenu = () => {
    if (state.contextMenu.chatId && state.contextMenu.type === 'chat') {
      archiveChat(state.contextMenu.chatId);
    }
  };

  const handleUnarchiveFromContextMenu = () => {
    if (state.contextMenu.chatId && state.contextMenu.type === 'archived') {
      unarchiveChat(state.contextMenu.chatId);
    }
  };

  const markNotificationAsRead = (id: number) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(notification => 
        notification.id === id ? { ...notification, isNew: false } : notification
      )
    }));
  };

  const handleSearch = (query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query
    }));
    
    if (!query.trim()) {
      setState(prev => ({
        ...prev,
        searchResults: []
      }));
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    let results: any[] = [];
    
    if (state.activeSection === 'chats') {
      results = state.chats.filter(chat => 
        chat.name.toLowerCase().includes(lowerQuery) || 
        chat.lastMessage.toLowerCase().includes(lowerQuery)
      );
    } else if (state.activeSection === 'notifications') {
      results = state.notifications.filter(notification => 
        notification.title.toLowerCase().includes(lowerQuery) || 
        notification.description.toLowerCase().includes(lowerQuery)
      );
    } else if (state.activeSection === 'requests') {
      results = state.messageRequests.filter((request: any) => 
        request.name.toLowerCase().includes(lowerQuery) || 
        request.lastMessage.toLowerCase().includes(lowerQuery)
      );
    } else if (state.activeSection === 'archived') {
      results = state.archivedChats.filter((chat: any) => 
        chat.name.toLowerCase().includes(lowerQuery) || 
        chat.lastMessage.toLowerCase().includes(lowerQuery)
      );
    }
    
    setState(prev => ({
      ...prev,
      searchResults: results
    }));
  };

  const sendLike = () => {
    const currentTime = getCurrentTime();
    const likeMessage: Message = {
      id: state.messages.length + 1,
      text: "❤",
      time: currentTime,
      isUser: true,
      type: 'like'
    };
    
    const updatedMessages = [...state.messages, likeMessage];
    setState(prev => ({
      ...prev,
      messages: updatedMessages
    }));
    
    // Update chats state and reorder
    reorderChats(state.activeChat!.id, "❤", currentTime);
  };

  const addEmoji = (emoji: string) => {
    setState(prev => ({
      ...prev,
      newMessage: prev.newMessage + emoji,
      showEmojiPicker: false
    }));
  };

  const toggleAttachmentMenu = () => {
    setState(prev => ({
      ...prev,
      showAttachmentMenu: !prev.showAttachmentMenu,
      showEmojiPicker: false
    }));
  };

  const toggleEmojiPicker = () => {
    setState(prev => ({
      ...prev,
      showEmojiPicker: !prev.showEmojiPicker,
      showAttachmentMenu: false
    }));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Send voice message
        const currentTime = getCurrentTime();
        const voiceMessage: Message = {
          id: state.messages.length + 1,
          text: "Voice message",
          time: currentTime,
          isUser: true,
          type: 'voice',
          voiceUrl: audioUrl,
          duration: state.recordingTime
        };
        
        const updatedMessages = [...state.messages, voiceMessage];
        setState(prev => ({
          ...prev,
          messages: updatedMessages,
          audioChunks: []
        }));
        
        // Update chats state with new message and reorder
        reorderChats(state.activeChat!.id, "Voice message", currentTime);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setState(prev => ({
        ...prev,
        mediaRecorder: recorder,
        isRecording: true,
        recordingTime: 0
      }));
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Microphone access is required for voice recording.');
    }
  };

  const stopRecording = () => {
    if (state.mediaRecorder && state.isRecording) {
      state.mediaRecorder.stop();
      setState(prev => ({
        ...prev,
        isRecording: false
      }));
    }
  };

  const handleMicrophoneClick = () => {
    if (state.isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playVoiceMessage = (messageId: number, voiceUrl: string) => {
    if (state.audioRef) {
      state.audioRef.pause();
    }
    
    const audio = new Audio(voiceUrl);
    setState(prev => ({
      ...prev,
      audioRef: audio,
      playingVoiceMessage: messageId
    }));
    
    audio.onended = () => {
      setState(prev => ({
        ...prev,
        playingVoiceMessage: null,
        audioRef: null
      }));
    };
    
    audio.play().catch(error => {
      console.error('Error playing voice message:', error);
      setState(prev => ({
        ...prev,
        playingVoiceMessage: null
      }));
    });
  };

  const stopVoiceMessage = () => {
    if (state.audioRef) {
      state.audioRef.pause();
    }
    setState(prev => ({
      ...prev,
      playingVoiceMessage: null,
      audioRef: null
    }));
  };

  const openCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const currentTime = getCurrentTime();
        const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
        
        const newMsg: Message = {
          id: state.messages.length + 1,
          content: event.target?.result as string,
          time: currentTime,
          isUser: true,
          type: mediaType === 'image' ? 'image' : 'video',
          mediaType: mediaType
        };
        
        const updatedMessages = [...state.messages, newMsg];
        setState(prev => ({
          ...prev,
          messages: updatedMessages
        }));
        
        // Update chats state and reorder
        const mediaText = mediaType === 'image' ? 'a photo' : 'a video';
        reorderChats(state.activeChat!.id, `Sent ${mediaText}`, currentTime);
        
        // Simulate reply after 1.5 seconds
        setTimeout(() => {
          const replyText = "Nice! 👍";
          const replyTime = getCurrentTime();
          const replyMsg: Message = {
            id: updatedMessages.length + 1,
            text: replyText,
            time: replyTime,
            isUser: false,
            type: 'text'
          };
          
          setState(prev => ({
            ...prev,
            messages: [...updatedMessages, replyMsg]
          }));
          
          // Reorder chat again for the reply
          reorderChats(state.activeChat!.id, replyText, replyTime);
        }, 1500);
      };
      reader.readAsDataURL(file);
    };
    input.click();
    
    setState(prev => ({ ...prev, showAttachmentMenu: false }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, mediaType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const currentTime = getCurrentTime();
      const newMsg: Message = {
        id: state.messages.length + 1,
        content: event.target?.result as string,
        time: currentTime,
        isUser: true,
        type: mediaType === 'image' ? 'image' : 'video',
        mediaType: mediaType
      };
      
      const updatedMessages = [...state.messages, newMsg];
      setState(prev => ({
        ...prev,
        messages: updatedMessages
      }));
      
      // Update chats state and reorder
      const mediaText = mediaType === 'image' ? 'a photo' : 'a video';
      reorderChats(state.activeChat!.id, `Sent ${mediaText}`, currentTime);
      
      // Simulate reply after 1.5 seconds
      setTimeout(() => {
        const replyText = "Nice! 👍";
        const replyTime = getCurrentTime();
        const replyMsg: Message = {
          id: updatedMessages.length + 1,
          text: replyText,
          time: replyTime,
          isUser: false,
          type: 'text'
        };
        
        setState(prev => ({
          ...prev,
          messages: [...updatedMessages, replyMsg]
        }));
        
        // Reorder chat again for the reply
        reorderChats(state.activeChat!.id, replyText, replyTime);
      }, 1500);
    };
    reader.readAsDataURL(file);
    
    setState(prev => ({ ...prev, showAttachmentMenu: false }));
    e.target.value = '';
  };

  // Render functions
  const renderMessage = (message: Message) => {
    if (message.type === 'notification') {
      return (
        <div key={message.id} className="theme-change-notification">
          <span>{message.text}</span>
          <span className="change-link">{message.time}</span>
        </div>
      );
    } else if (message.type === 'like') {
      return (
        <div key={message.id} className={`message ${message.isUser ? 'user-message' : 'friend-message'}`}>
          <div className="like-message">
            <i className="fas fa-heart"></i>
            <span>Liked a message</span>
          </div>
        </div>
      );
    } else if (message.type === 'image' || message.type === 'video') {
      return (
        <div key={message.id} className={`message ${message.isUser ? 'user-message' : 'friend-message'}`}>
          {message.type === 'image' ? (
            <div className="media-message">
              <div className="media-container">
                <img src={message.content} alt="Shared image" />
                <div className="media-overlay">
                  <i className="fas fa-expand"></i>
                </div>
              </div>
              <div className="media-status">
                <span className="message-time">{message.time}</span>
                {message.isUser && <i className="fas fa-check-double status-icon read"></i>}
              </div>
            </div>
          ) : (
            <div className="media-message">
              <div className="reel-player">
                <video controls style={{ width: '100%', height: '300px', objectFit: 'cover' }}>
                  <source src={message.content} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="reel-controls">
                  <button className="play-pause">
                    <i className="fas fa-play"></i>
                  </button>
                  <div className="reel-info">
                    <span>Video</span>
                    <span className="reel-duration">0:15</span>
                  </div>
                </div>
              </div>
              <div className="media-status">
                <span className="message-time">{message.time}</span>
                {message.isUser && <i className="fas fa-check-double status-icon read"></i>}
              </div>
            </div>
          )}
        </div>
      );
    } else if (message.type === 'voice') {
      return (
        <div key={message.id} className={`message ${message.isUser ? 'user-message' : 'friend-message'}`}>
          <div className="voice-message">
            <div className="voice-player">
              <button 
                className="play-voice-btn" 
                onClick={() => state.playingVoiceMessage === message.id ? stopVoiceMessage() : playVoiceMessage(message.id, message.voiceUrl!)}
              >
                <i className={`fas ${state.playingVoiceMessage === message.id ? 'fa-pause' : 'fa-play'}`}></i>
              </button>
              <div className="voice-waveform">
                <div 
                  className="voice-wave" 
                  style={{ 
                    width: state.playingVoiceMessage === message.id ? '100%' : '80%',
                    animation: state.playingVoiceMessage === message.id ? 'wave 1.5s ease-in-out infinite' : 'none'
                  }}
                ></div>
              </div>
              <span className="voice-duration">{message.duration}s</span>
            </div>
            <div className="media-status">
              <span className="message-time">{message.time}</span>
              {message.isUser && <i className="fas fa-check-double status-icon read"></i>}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div key={message.id} className={`message ${message.isUser ? 'user-message' : 'friend-message'}`}>
          <div className={`${message.isUser ? 'sent-message' : 'received-message'} whatsapp-message`}>
            <p className="message-text">{message.text}</p>
            <div className="message-meta">
              <span className="message-time">{message.time}</span>
              {message.isUser && <i className="fas fa-check-double status-icon read"></i>}
            </div>
          </div>
        </div>
      );
    }
  };

  const renderStories = (stories: Story[]) => {
    return (
      <div className="stories-container">
        {/* Create Story Icon */}
        <div className="story create-story" onClick={addStory}>
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
            className={`story ${yourStory.isMyStory ? 'my-story' : ''} ${yourStory.isSeen ? 'seen-story' : ''}`}
            onClick={() => openStory(yourStory.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setState(prev => ({
                ...prev,
                storyContextMenu: {
                  visible: true,
                  x: e.clientX,
                  y: e.clientY,
                  storyId: yourStory.id,
                  isMutedStory: false
                }
              }));
            }}
          >
            <div className="story-avatar">
              <img src={yourStory.avatar} alt={yourStory.name} />
              {yourStory.storyCount && yourStory.storyCount > 1 && (
                <div className="story-lines">
                  {Array.from({ length: yourStory.storyCount }, (_, i) => (
                    <div key={i} className={`story-line ${i === state.currentStoryItemIndex ? 'active' : ''}`}></div>
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
            onClick={() => openStory(story.id)}
            onContextMenu={(e) => handleStoryRightClick(e, story.id)}
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
    );
  };

  const renderMutedStories = (stories: Story[]) => {
    return (
      <div className="muted-stories-section">
        <div className="stories-container">
          {stories.map(story => (
            <div 
              key={story.id}
              className="story muted-story"
              onClick={() => openStory(story.id)}
              onContextMenu={(e) => handleStoryRightClick(e, story.id)}
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
    );
  };

  const normalStories = state.stories.filter(story => !story.isMuted && !story.isMyStory);
  const mutedStories = state.stories.filter(story => story.isMuted);

  // Get current story for viewer
  const getCurrentStory = () => {
    if (state.currentStoryIndex === -1) {
      return yourStory;
    }
    return state.stories[state.currentStoryIndex];
  };

  const currentStory = getCurrentStory();
  const isYourStory = state.currentStoryIndex === -1;
  const currentMediaUrl = currentStory?.mediaUrls[state.currentStoryItemIndex];
  const isVideo = currentMediaUrl?.includes('video') || currentStory?.mediaType === 'video';

  return (
    <div className="messenger-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-header-content">
          <div className="mobile-header-title">Messenger</div>
          <div className="mobile-header-actions">
            <i className="fas fa-edit"></i>
            <i className="fas fa-user-circle" onClick={() => window.location.href = '/profile'}></i>
          </div>
        </div>
      </div>

      {/* Mobile Chat Header */}
      {state.activeChat && (
        <div className="mobile-chat-header">
          <div className="mobile-chat-header-content">
            <button className="mobile-back-btn" onClick={() => setState(prev => ({ ...prev, activeChat: null }))}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="mobile-chat-user">
              <div className="mobile-chat-avatar">
                <img src={state.activeChat.avatar} alt={state.activeChat.name} />
              </div>
              <div className="mobile-chat-info">
                <span className="mobile-chat-name">{state.activeChat.name}</span>
                <span className="mobile-chat-status">{state.activeChat.isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
            <div className="mobile-chat-actions">
              <i className="fas fa-video"></i>
              <i className="fas fa-phone" onClick={() => startOutgoingCall(state.activeChat!)}></i>
              <i className="fas fa-info-circle"></i>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="desktop-layout">
        {/* Left Sidebar Icons */}
        <div className="left-sidebar">
          <div className="sidebar-icons">
            <div 
              className={`icon-item ${state.activeSection === 'chats' ? 'active' : ''}`}
              onClick={() => setActiveSection('chats')}
            >
              <i className="fas fa-comment"></i>
              <div className="icon-tooltip">Chats</div>
            </div>
            <div 
              className={`icon-item ${state.activeSection === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveSection('notifications')}
            >
              <i className="fas fa-bell"></i>
              <div className="icon-tooltip">Notifications</div>
              {state.notifications.some(n => n.isNew) && (
                <div className="notification-indicator"></div>
              )}
            </div>
            <div 
              className={`icon-item ${state.activeSection === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveSection('requests')}
            >
              <i className="fas fa-user-friends"></i>
              <div className="icon-tooltip">Message Requests</div>
              {state.messageRequests.length > 0 && (
                <div className="notification-indicator"></div>
              )}
            </div>
            <div 
              className={`icon-item ${state.activeSection === 'archived' ? 'active' : ''}`}
              onClick={() => setActiveSection('archived')}
            >
              <i className="fas fa-archive"></i>
              <div className="icon-tooltip">Archived Chats</div>
            </div>
            <div className="icon-item profile-icon" onClick={() => window.location.href = '/profile'}>
              <img src={profileAvatar} alt="Profile" />
              <div className="icon-tooltip">Profile</div>
            </div>
          </div>
        </div>

        {/* Chats/Notifications/Requests/Archived Sidebar */}
        <div className="chats-sidebar">
          <div className="sidebar-header">
            <h2 className="messenger-title">
              {state.activeSection === 'chats' ? 'Messenger' :
               state.activeSection === 'notifications' ? 'Notifications' :
               state.activeSection === 'requests' ? 'Message Requests' : 'Archived chats'}
            </h2>
            <div className="header-icons">
              <i className="fas fa-edit" style={{ display: state.activeSection === 'chats' ? 'block' : 'none' }}></i>
              <i className="fas fa-cog" style={{ display: state.activeSection !== 'chats' ? 'block' : 'none' }}></i>
            </div>
          </div>

          <div className="search-bar">
            <div className="search-container">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search Messenger" 
                value={state.searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Section Content */}
          <div className="section-content">
            {state.searchQuery ? (
              <div className="search-results">
                {state.searchResults.length > 0 ? 
                  state.searchResults.map(result => (
                    <div key={result.id} className="search-result-item" onClick={() => handleChatClick(result.id)}>
                      <div className="chat-item">
                        <div className="chat-avatar">
                          <img src={result.avatar} alt={result.name} />
                          {result.isOnline && <div className="online-indicator"></div>}
                        </div>
                        <div className="chat-content">
                          <div className="chat-header">
                            <span className="chat-name">{result.name}</span>
                            <span className="chat-time">{result.time}</span>
                          </div>
                          <div className="chat-preview">
                            <span>{result.lastMessage || 'No messages yet'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) :
                  <div className="no-results">No results found for "{state.searchQuery}"</div>
                }
              </div>
            ) : (
              <>
                {/* Stories Section */}
                {state.activeSection === 'chats' && (
                  <div className="stories-section">
                    <div className="stories-header">
                      <span className="stories-title">Stories</span>
                      {mutedStories.length > 0 && !state.showMutedStories && (
                        <button className="mute-stories-btn" onClick={showMutedStoriesSection}>
                          Muted Stories ({mutedStories.length})
                        </button>
                      )}
                      {state.showMutedStories && (
                        <button className="back-to-stories-btn" onClick={hideMutedStoriesSection}>
                          Back to Stories
                        </button>
                      )}
                    </div>
                    {!state.showMutedStories ? renderStories(normalStories) : renderMutedStories(mutedStories)}
                  </div>
                )}

                {/* Chats List */}
                {state.activeSection === 'chats' && (
                  <div className="chats-section">
                    <div className="chats-list">
                      {state.chats.map(chat => (
                        <div 
                          key={chat.id}
                          className={`chat-item ${chat.id === state.activeChat?.id ? 'active' : ''}`}
                          onClick={() => handleChatClick(chat.id)}
                          onContextMenu={(e) => handleChatRightClick(e, chat.id, 'chat')}
                        >
                          <div className="chat-avatar">
                            <img src={chat.avatar} alt={chat.name} />
                            {chat.isOnline && <div className="online-indicator"></div>}
                          </div>
                          <div className="chat-content">
                            <div className="chat-header">
                              <span className="chat-name">{chat.name}</span>
                              <span className="chat-time">{chat.time}</span>
                            </div>
                            <div className="chat-preview">
                              <span>{chat.lastMessage || 'No messages yet'}</span>
                              {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notifications List */}
                {state.activeSection === 'notifications' && (
                  <div className="notifications-section">
                    <div className="notifications-list">
                      {state.notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`notification-item ${notification.isNew ? 'new' : ''}`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="notification-avatar">
                            {notification.userAvatar ? (
                              <img src={notification.userAvatar} alt={notification.title} />
                            ) : notification.pageAvatar ? (
                              <img src={notification.pageAvatar} alt={notification.title} />
                            ) : (
                              <div className="system-avatar">
                                <i className="fas fa-bell"></i>
                              </div>
                            )}
                          </div>
                          <div className="notification-content">
                            <div className="notification-header">
                              <span className="notification-title">{notification.title}</span>
                              <span className="notification-time">{notification.time}</span>
                            </div>
                            <div className="notification-description">
                              {notification.description}
                            </div>
                          </div>
                          {notification.isNew && <div className="new-notification-indicator"></div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requests Section */}
                {state.activeSection === 'requests' && (
                  <div className="requests-section">
                    <div className="requests-list">
                      <div className="no-requests">
                        <div className="no-requests-content">
                          <h3>No message requests</h3>
                          <p>New messages requests will appear here. You can control who can send you message requests.</p>
                          <button className="see-who-can-message">See who can message you</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Archived Section */}
                {state.activeSection === 'archived' && (
                  <div className="archived-section">
                    <div className="archived-list">
                      {state.archivedChats.map(chat => (
                        <div 
                          key={chat.id}
                          className="archived-item"
                          onClick={() => handleChatClick(chat.id)}
                          onContextMenu={(e) => handleChatRightClick(e, chat.id, 'archived')}
                        >
                          <div className="archived-avatar">
                            <img src={chat.avatar} alt={chat.name} />
                          </div>
                          <div className="archived-content">
                            <div className="archived-header">
                              <span className="archived-name">{chat.name}</span>
                              <span className="archived-time">{chat.time}</span>
                            </div>
                            <div className="archived-preview">
                              <span>{chat.lastMessage}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="main-chat">
          {state.activeChat ? (
            <div className="chat-window">
              <div className="chat-header">
                <div className="chat-user">
                  <div className="user-avatar">
                    <img src={state.activeChat.avatar} alt={state.activeChat.name} />
                    {state.activeChat.isOnline && <div className="online-indicator"></div>}
                  </div>
                  <div className="user-info">
                    <span className="user-name">{state.activeChat.name}</span>
                    <span className={`user-status ${state.activeChat.isOnline ? 'online' : 'offline'}`}>
                      {state.activeChat.isOnline ? 'Active now' : 'Offline'}
                    </span>
                  </div>
                </div>
                <div className="chat-actions">
                  <i className="fas fa-video"></i>
                  <i className="fas fa-phone" onClick={() => startOutgoingCall(state.activeChat!)}></i>
                  <i className="fas fa-info-circle"></i>
                </div>
              </div>

              <div className="messages-container">
                <div className="date-separator">
                  <span>Today</span>
                </div>
                {state.messages.length === 0 ? (
                  <div className="encryption-notice">
                    <i className="fas fa-lock"></i>
                    Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
                  </div>
                ) : (
                  state.messages.map(message => renderMessage(message))
                )}
              </div>

              <div className="message-input">
                <div className="input-container">
                  <i 
                    className="fas fa-microphone" 
                    id="microphoneButton"
                    onClick={handleMicrophoneClick}
                  ></i>
                  <i 
                    className="fas fa-paperclip" 
                    id="attachButton"
                    onClick={toggleAttachmentMenu}
                  ></i>
                  <input 
                    type="text" 
                    id="messageInput" 
                    placeholder="Type a message"
                    value={state.newMessage}
                    onChange={(e) => setState(prev => ({ ...prev, newMessage: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <div className="input-actions">
                    <i 
                      className="fas fa-smile" 
                      id="emojiButton"
                      onClick={toggleEmojiPicker}
                    ></i>
                    <i 
                      className="fas fa-thumbs-up" 
                      id="likeButton"
                      onClick={sendLike}
                    ></i>
                  </div>
                </div>

                {/* Recording Indicator */}
                {state.isRecording && (
                  <div className="recording-indicator">
                    <div className="recording-pulse"></div>
                    <span className="recording-text">Recording... {formatCallDuration(state.recordingTime)}</span>
                    <button className="stop-recording-btn" onClick={stopRecording}>
                      <i className="fas fa-stop"></i>
                    </button>
                  </div>
                )}

                {/* Emoji Picker */}
                {state.showEmojiPicker && (
                  <div className="emoji-picker active">
                    {popularEmojis.map((emoji, index) => (
                      <div 
                        key={index}
                        className="emoji-option"
                        onClick={() => addEmoji(emoji)}
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>
                )}

                {/* Attachment Menu */}
                {state.showAttachmentMenu && (
                  <div className="attachment-menu active">
                    <div className="attachment-option" onClick={() => document.getElementById('photoInput')?.click()}>
                      <i className="fas fa-image"></i>
                      <span>Photo</span>
                      <input 
                        id="photoInput" 
                        type="file" 
                        className="file-input" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'image')}
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
                        onChange={(e) => handleFileUpload(e, 'video')}
                      />
                    </div>
                    <div className="attachment-option" onClick={openCamera}>
                      <i className="fas fa-camera"></i>
                      <span>Camera</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="chat-placeholder">
              <div className="placeholder-content">
                <i className="fas fa-comments"></i>
                <h3>Your Messages</h3>
                <p>Send private messages to a friend or group.</p>
                <button className="send-message-btn">Send Message</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <div className="mobile-nav-items">
          <div 
            className={`mobile-nav-item ${state.activeSection === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveSection('chats')}
          >
            <i className="fas fa-comment"></i>
            <span>Chats</span>
          </div>
          <div 
            className={`mobile-nav-item ${state.activeSection === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveSection('notifications')}
          >
            <i className="fas fa-bell"></i>
            <span>Notifications</span>
            {state.notifications.some(n => n.isNew) && (
              <div className="mobile-nav-indicator"></div>
            )}
          </div>
          <div 
            className={`mobile-nav-item ${state.activeSection === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveSection('requests')}
          >
            <i className="fas fa-user-friends"></i>
            <span>Requests</span>
            {state.messageRequests.length > 0 && (
              <div className="mobile-nav-indicator"></div>
            )}
          </div>
          <div 
            className={`mobile-nav-item ${state.activeSection === 'archived' ? 'active' : ''}`}
            onClick={() => setActiveSection('archived')}
          >
            <i className="fas fa-archive"></i>
            <span>Archived</span>
          </div>
        </div>
      </div>

      {/* Stories Viewer */}
      {state.showStoriesViewer && currentStory && currentStory.mediaUrls.length > 0 && (
        <div className="stories-viewer" onClick={closeStory}>
          <div className="story-content" onClick={(e) => e.stopPropagation()}>
            {/* Progress Bars */}
            <div className="story-progress">
              {Array.from({ length: currentStory.storyCount }, (_, i) => (
                <div key={i} className="progress-segment">
                  <div 
                    className={`progress-fill ${i === state.currentStoryItemIndex ? 'active' : i < state.currentStoryItemIndex ? 'completed' : ''}`}
                    style={{ 
                      width: i === state.currentStoryItemIndex ? `${state.storyProgress}%` : 
                             i < state.currentStoryItemIndex ? '100%' : '0%' 
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
                <button className="story-play-pause" onClick={toggleStoryPlayPause}>
                  <i className={`fas ${state.isStoryPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                </button>
                <button className="story-close" onClick={closeStory}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            {/* Navigation Arrows */}
            {!isYourStory && state.currentStoryIndex > 0 && (
              <button className="story-nav story-prev" onClick={prevStory}>
                <i className="fas fa-chevron-left"></i>
              </button>
            )}
            {!isYourStory && state.currentStoryIndex < state.stories.length - 1 && (
              <button className="story-nav story-next" onClick={nextStory}>
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
                  onEnded={nextStoryItem}
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
            {currentStory.captions[state.currentStoryItemIndex] && (
              <div className="story-caption">
                {currentStory.captions[state.currentStoryItemIndex]}
              </div>
            )}

            {/* Story Message Box - Only show for other people's stories */}
            {!isYourStory && (
              <>
                {state.showStoryMessageBox ? (
                  <div className="story-message-box">
                    <input 
                      type="text" 
                      className="story-message-input" 
                      placeholder="Send message..."
                      value={state.storyMessage}
                      onChange={(e) => setState(prev => ({ ...prev, storyMessage: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleStoryMessageSend()}
                      autoFocus
                    />
                  </div>
                ) : (
                  <button className="story-message-btn" onClick={toggleStoryMessageBox}>
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
                onClick={() => deleteStory(yourStory.id)}
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
      )}

      {/* Story Context Menu */}
      {state.storyContextMenu.visible && (
        <div 
          className="story-context-menu active"
          style={{ left: state.storyContextMenu.x, top: state.storyContextMenu.y }}
        >
          {state.storyContextMenu.storyId === yourStory.id ? (
            <div className="context-menu-item delete" onClick={() => deleteStory(yourStory.id)}>
              <i className="fas fa-trash"></i>
              Delete Story
            </div>
          ) : (
            <>
              {!state.storyContextMenu.isMutedStory && (
                <div className="context-menu-item" onClick={() => muteStory(state.storyContextMenu.storyId!)}>
                  <i className="fas fa-volume-mute"></i>
                  Mute Story
                </div>
              )}
              {state.storyContextMenu.isMutedStory && (
                <div className="context-menu-item" onClick={() => unmuteStory(state.storyContextMenu.storyId!)}>
                  <i className="fas fa-volume-up"></i>
                  Unmute Story
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Chat Context Menu */}
      {state.contextMenu.visible && (
        <div 
          className="chat-context-menu active"
          style={{ left: state.contextMenu.x, top: state.contextMenu.y }}
        >
          {state.contextMenu.type === 'chat' && (
            <div className="context-menu-item" onClick={handleArchiveFromContextMenu}>
              <i className="fas fa-archive"></i>
              Archive Chat
            </div>
          )}
          {state.contextMenu.type === 'archived' && (
            <div className="context-menu-item" onClick={handleUnarchiveFromContextMenu}>
              <i className="fas fa-inbox"></i>
              Unarchive Chat
            </div>
          )}
          <div className="context-menu-item">
            <i className="fas fa-bell-slash"></i>
            Mute Notifications
          </div>
          <div className="context-menu-item delete" onClick={handleDeleteFromContextMenu}>
            <i className="fas fa-trash"></i>
            Delete Chat
          </div>
        </div>
      )}

      {/* Call Interfaces */}
      {(state.callState.isIncomingCall || state.callState.isOutgoingCall || 
        state.callState.isCallActive || state.callState.isCallEnded) && (
        <>
          <div className="call-interface-overlay"></div>
          <div className="call-interface">
            <div className="call-header">
              <img 
                src={state.callState.callRecipient?.avatar || 'https://i.pravatar.cc/150?img=1'} 
                alt="" 
                className="call-user-avatar" 
              />
              <h2 className="call-user-name">{state.callState.callRecipient?.name || 'Unknown'}</h2>
              <p className="call-status">
                {state.callState.isIncomingCall ? 'Incoming Call...' :
                 state.callState.isOutgoingCall ? 'Ringing...' :
                 state.callState.isCallActive ? 'Connected' :
                 'Call Ended'}
              </p>
              {(state.callState.isCallActive || (state.callState.isCallEnded && state.callState.totalCallTime > 0)) && (
                <p className="call-timer">
                  {state.callState.isCallActive ? 
                    formatCallDuration(state.callState.callDuration) :
                    `Call Duration: ${formatCallDuration(state.callState.totalCallTime)}`}
                </p>
              )}
            </div>

            {state.callState.isCallActive && (
              <div className="call-options">
                <button 
                  className={`call-option-btn ${state.callState.isMuted ? 'active' : ''}`}
                  onClick={toggleMute}
                >
                  <i className={`fas ${state.callState.isMuted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                </button>
                <button 
                  className={`call-option-btn ${state.callState.isSpeakerOn ? 'active' : ''}`}
                  onClick={toggleSpeaker}
                >
                  <i className="fas fa-volume-up"></i>
                </button>
              </div>
            )}

            <div className="call-actions">
              {state.callState.isIncomingCall && (
                <>
                  <button className="call-action-btn decline-call" onClick={declineCall}>
                    <i className="fas fa-phone-slash"></i>
                  </button>
                  <button className="call-action-btn answer-call" onClick={answerCall}>
                    <i className="fas fa-phone"></i>
                  </button>
                </>
              )}
              {state.callState.isOutgoingCall && (
                <button className="call-action-btn cancel-call" onClick={cancelOutgoingCall}>
                  <i className="fas fa-phone-slash"></i>
                </button>
              )}
              {state.callState.isCallActive && (
                <button className="call-action-btn end-call" onClick={endCall}>
                  <i className="fas fa-phone-slash"></i>
                </button>
              )}
              {state.callState.isCallEnded && state.callState.callType === 'outgoing' && (
                <>
                  <button className="call-action-btn redial-call" onClick={() => startOutgoingCall(state.callState.callRecipient!)}>
                    <i className="fas fa-phone"></i>
                  </button>
                  <button className="call-action-btn close-call" onClick={() => setState(prev => ({
                    ...prev,
                    callState: {
                      ...prev.callState,
                      isCallEnded: false,
                      callType: null,
                      callRecipient: null
                    }
                  }))}>
                    <i className="fas fa-times"></i>
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}