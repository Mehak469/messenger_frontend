export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
  isActive?: boolean;
  messages: Message[];
}
export interface SelectedUser {
  id: string;
  name: string;
  username?: string;
  email?: string;
  avatar: string | null;
  bio?: string;
  friends?: any[];
}

export interface SentRequest {
  id: string;
  receiverId: string;
  name: string;
  avatar: string;
  message: string;
  time: string;
  status: 'Pending';
}


export interface Message {
  id: number;
  text: string;
  time: string;
  isUser: boolean;
  type: string;
  content?: string;
  voiceUrl?: string;
  duration?: number;
  mediaType?: string;
}

export interface Story {
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

export interface Notification {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  pageAvatar?: string;
  userAvatar?: string;
  isNew: boolean;
}
// Add these types
export interface Friend {
  id: string;
  name: string;
  avatar: string;
  username: string;
  isOnline?: boolean;
  lastSeen?: string;
  email?: string;
  bio?: string;
  mutualFriends?: number;
}


export interface CallState {
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

export interface AppState {
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
  requestsActiveTab: string;
  showSendRequestModal: boolean;
  requestMessage: string;
  selectedUserForRequest: SelectedUser | null;
  dummyUsers: any[];
  showChatContextMenu: boolean;
  showStoryOptionsMenu: boolean;
  longPressTimer: any;
  isSendingRequest: boolean;   // Add this
  isLoadingUser: boolean;    // Add this
  isSearching: boolean;
  sentRequests: any[]; // Add this new property
  receivedRequests: any[]; // Add this for incoming friend requests
friends: Friend[]; // Add this
  isLoadingFriends: boolean;

}
