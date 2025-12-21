'use client'
import { useState, useEffect, useRef } from 'react'
import './chats.css'
import {
  getUserByIdAPI,
  searchUsersAPI,
  sendFriendRequestAPI,
  getSentFriendRequestsAPI,
  cancelFriendRequestAPI,
  getPendingFriendRequestsAPI,
  acceptFriendRequestAPI,
  rejectFriendRequestAPI,
} from '../../services/friendsapi'
import { getConversationsAPI } from '../../services/conversationapi'
import { Chat, SelectedUser, SentRequest, FetchedMessage, Message, Story, Notification, CallState, Friend, AppState } from '../../Types/chats'
import StoriesList from '@/components/chats/StoriesList'
import MutedStoriesList from '@/components/chats/MutedStoriesList'
import StoryViewer from '@/components/chats/StoryViewer'
import ChatItem from '@/components/chats/ChatItem'
import MessageItem from '@/components/chats/MessageItem'
import MessageInput from '@/components/chats/MessageInput'
import SendRequestModal from '@/components/chats/SendRequestModal'
import RequestsSection from '@/components/chats/RequestsSection'
import CallInterface from '@/components/chats/CallInterface'
import ContextMenus from '@/components/chats/ContextMenus'
import SearchResults from '@/components/chats/SearchResults'
import NotificationsList from '@/components/chats/NotificationsList'
import Sidebar from '@/components/chats/Sidebar'
import ChatHeader from '@/components/chats/ChatHeader'
import { fetchMessages } from '@/services/fetchMessages'
import { useWebSocket } from '@/contexts/WebSocketContext'


// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_BASE_URL = "https://messangersemesterproject-production.up.railway.app/api/v1"


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

// Enhanced dummy users with names starting with different letters A to Z
const dummyUsers = [
  { id: 101, name: "Ali Khan", avatar: "https://i.pravatar.cc/150?img=11" },
  { id: 102, name: "Ahmed Raza", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: 103, name: "Ayesha Malik", avatar: "https://i.pravatar.cc/150?img=13" },
  { id: 104, name: "Amina Sheikh", avatar: "https://i.pravatar.cc/150?img=14" },
  { id: 105, name: "Bilal Shah", avatar: "https://i.pravatar.cc/150?img=15" },
  { id: 106, name: "Babar Iqbal", avatar: "https://i.pravatar.cc/150?img=16" },
  { id: 107, name: "Chaudhry Usman", avatar: "https://i.pravatar.cc/150?img=17" },
  { id: 108, name: "Danish Ali", avatar: "https://i.pravatar.cc/150?img=18" },
  { id: 109, name: "Fatima Noor", avatar: "https://i.pravatar.cc/150?img=19" },
  { id: 110, name: "Faisal Mahmood", avatar: "https://i.pravatar.cc/150?img=20" },
  { id: 111, name: "Hina Aslam", avatar: "https://i.pravatar.cc/150?img=21" },
  { id: 112, name: "Hassan Raza", avatar: "https://i.pravatar.cc/150?img=22" },
  { id: 113, name: "Imran Khan", avatar: "https://i.pravatar.cc/150?img=23" },
  { id: 114, name: "Iqbal Ahmed", avatar: "https://i.pravatar.cc/150?img=24" },
  { id: 115, name: "Junaid Akhtar", avatar: "https://i.pravatar.cc/150?img=25" },
  { id: 116, name: "Javed Iqbal", avatar: "https://i.pravatar.cc/150?img=26" },
  { id: 117, name: "Kamran Butt", avatar: "https://i.pravatar.cc/150?img=27" },
  { id: 118, name: "Kashif Ali", avatar: "https://i.pravatar.cc/150?img=28" },
  { id: 119, name: "Laiba Noor", avatar: "https://i.pravatar.cc/150?img=29" },
  { id: 120, name: "Lubna Khan", avatar: "https://i.pravatar.cc/150?img=30" },
  { id: 121, name: "Muhammad Ali", avatar: "https://i.pravatar.cc/150?img=31" },
  { id: 122, name: "Mushtaq Ahmed", avatar: "https://i.pravatar.cc/150?img=32" },
  { id: 123, name: "Nadia Shah", avatar: "https://i.pravatar.cc/150?img=33" },
  { id: 124, name: "Naveed Iqbal", avatar: "https://i.pravatar.cc/150?img=34" },
  { id: 125, name: "Omar Farooq", avatar: "https://i.pravatar.cc/150?img=35" },
  { id: 126, name: "Osman Ali", avatar: "https://i.pravatar.cc/150?img=36" },
  { id: 127, name: "Palwasha Khan", avatar: "https://i.pravatar.cc/150?img=37" },
  { id: 128, name: "Parvez Ahmed", avatar: "https://i.pravatar.cc/150?img=38" },
  { id: 129, name: "Qasim Ali", avatar: "https://i.pravatar.cc/150?img=39" },
  { id: 130, name: "Qurat ul Ain", avatar: "https://i.pravatar.cc/150?img=40" },
  { id: 131, name: "Rashid Minhas", avatar: "https://i.pravatar.cc/150?img=41" },
  { id: 132, name: "Rukhsar Noor", avatar: "https://i.pravatar.cc/150?img=42" },
  { id: 133, name: "Sara Ahmed", avatar: "https://i.pravatar.cc/150?img=43" },
  { id: 134, name: "Sadia Ali", avatar: "https://i.pravatar.cc/150?img=44" },
  { id: 135, name: "Tahir Mahmood", avatar: "https://i.pravatar.cc/150?img=45" },
  { id: 136, name: "Tayyaba Noor", avatar: "https://i.pravatar.cc/150?img=46" },
  { id: 137, name: "Usman Raza", avatar: "https://i.pravatar.cc/150?img=47" },
  { id: 138, name: "Uzma Khan", avatar: "https://i.pravatar.cc/150?img=48" },
  { id: 139, name: "Vickey Khan", avatar: "https://i.pravatar.cc/150?img=49" },
  { id: 140, name: "Waqas Ahmed", avatar: "https://i.pravatar.cc/150?img=50" },
  { id: 141, name: "Waseem Akram", avatar: "https://i.pravatar.cc/150?img=51" },
  { id: 142, name: "Xavier John", avatar: "https://i.pravatar.cc/150?img=52" },
  { id: 143, name: "Yasir Arafat", avatar: "https://i.pravatar.cc/150?img=53" },
  { id: 144, name: "Yasmeen Noor", avatar: "https://i.pravatar.cc/150?img=54" },
  { id: 145, name: "Zainab Malik", avatar: "https://i.pravatar.cc/150?img=55" },
  { id: 146, name: "Zubair Ahmed", avatar: "https://i.pravatar.cc/150?img=56" }
];

const popularEmojis = [
  '😀', '😂', '😍', '🥰', '😎', '🤩', '😜', '🤗', '👍', '👏',
  '❤', '🔥', '💯', '✨', '🎉', '🙏', '😊', '😘', '😉', '🤔', '🌸', '💞', '🥲', '✅',
  '🫀', '🥹', '🤨', '😡', '😶‍🌫', '😴', '👿', '👏', '👍🏻', '👀'
];

export default function ChatsPage() {
  const wsClient = useWebSocket();

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
    chats: [], // Will be loaded from API
    archivedChats: [
      // Haider Mughal ki chat yahan say remove kar di gayi hai
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
    isMobile: false,
    isTablet: false,
    requestsActiveTab: 'requests',
    showSendRequestModal: false,
    requestMessage: '',
    selectedUserForRequest: null,
    dummyUsers: dummyUsers,
    showChatContextMenu: false,
    showStoryOptionsMenu: false,
    longPressTimer: null,
    isSendingRequest: false,
    isLoadingUser: false,
    isSearching: false,
    sentRequests: [],
    receivedRequests: [],
    friends: [],
    isLoadingFriends: false,

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

  const [isClient, setIsClient] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartRef = useRef<number>(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to format time
  const formatTime = (dateString: string): string => {
    if (!dateString) return 'Just now';

    try {
      // Handle both ISO strings and "Just now" strings
      if (dateString === 'Just now') return 'Just now';

      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      const diffWeeks = Math.floor(diffDays / 7);

      if (diffSecs < 60) return 'Just now';
      if (diffMins < 60) return `${diffMins}m`;
      if (diffHours < 24) return `${diffHours}h`;
      if (diffDays < 7) return `${diffDays}d`;
      if (diffWeeks < 4) return `${diffWeeks}w`;

      // For older dates, show date
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (error) {
      return 'Just now';
    }
  };


  // Helper function to convert string ID to number (simple hash)
  const stringIdToNumber = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  // Function to load conversations from API
  const loadConversations = async (): Promise<Chat[]> => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        console.error("❌ No user data found");
        return [];
      }

      const parsedUserData = JSON.parse(userData);
      const currentUserId = parsedUserData._id;

      console.log("🟢 Current User ID:", currentUserId);

      const response = await getConversationsAPI();

      console.log("🟡 Raw conversations API response:", response);

      if (!response || !Array.isArray(response.conversations)) {
        console.error("❌ Invalid conversations format:", response);
        return [];
      }

      const chats: Chat[] = response.conversations.map((conv: any, index: number) => {
        console.log(`🟣 Processing conversation ${index}:`, conv);

        const participant = conv.participant;

        if (!participant) {
          console.warn("⚠️ Missing participant in conversation:", conv);
          return null;
        }

        console.log("🟢 Participant data:", participant);

        const chat: Chat = {
          id: participant.id,
          conv_id: conv.conversation_id,
          name: participant.name ?? "Unknown User",
          avatar:
            participant.avatar ??
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              participant.name ?? "User"
            )}&background=1877f2&color=fff&size=200`,
          lastMessage: conv.last_message ?? "",
          time: conv.last_message_time
            ? formatTime(conv.last_message_time)
            : "",
          unread: conv.unread_count ?? 0,
          isOnline: false,
          messages: [],
        };

        console.log("✅ Final Chat Object:", chat);
        return chat;
      }).filter(Boolean) as Chat[];

      console.log("🔵 Final chats array:", chats);

      return chats;
    } catch (error) {
      console.error("🔴 Error loading conversations:", error);
      return [];
    }
  };

  const cancelSentRequest = async (requestId: string) => {
    try {
      // Optimistic UI (optional but recommended)
      setState(prev => ({
        ...prev,
        sentRequests: prev.sentRequests.filter(req => req.id !== requestId)
      }));

      const response = await cancelFriendRequestAPI(requestId);

      if (response.message !== 'Friend request cancelled') {
        throw new Error('Unexpected cancel response');
      }

    } catch (error) {
      console.error('Cancel request failed:', error);

      // Rollback UI if API fails
      await reloadSentRequests();
      alert('Failed to cancel friend request');
    }
  };
  // Function to load incoming friend requests
  const loadIncomingRequests = async () => {
    try {
      const incomingRequests = await getPendingFriendRequestsAPI();

      console.log('Incoming requests from API:', incomingRequests); // Debug log

      // Enrich with user details
      const enrichedRequests = await Promise.all(
        incomingRequests.map(async (req: any) => {
          try {
            // Fetch sender details
            const user = await getUserByIdAPI(req.sender_id);

            return {
              id: req._id, // Request ID from API
              senderId: req.sender_id,
              name: user?.name || 'Unknown User',
              avatar: user?.avatar || 'https://i.pravatar.cc/150?img=1',
              message: req.message || 'Hi, I\'d like to connect with you!',
              time: formatTime(req.created_at),
              status: req.status || 'Pending'
            };
          } catch (userError) {
            console.error('Failed to fetch user for request:', userError);
            return {
              id: req._id,
              senderId: req.sender_id,
              name: 'Unknown User',
              avatar: 'https://i.pravatar.cc/150?img=1',
              message: req.message || 'Hi, I\'d like to connect with you!',
              time: formatTime(req.created_at),
              status: req.status || 'Pending'
            };
          }
        })
      );

      setState(prev => ({
        ...prev,
        receivedRequests: enrichedRequests
      }));

    } catch (error) {
      console.error('Failed to load incoming requests:', error);
      setState(prev => ({
        ...prev,
        receivedRequests: []
      }));
    }
  };
  const reloadSentRequests = async () => {
    try {
      const sentRequests = await getSentFriendRequestsAPI();

      // Sort by creation date (newest first)
      const sortedRequests = sentRequests.sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      const enriched = await Promise.all(
        sortedRequests.map(async (req: any) => {
          try {
            const user = await getUserByIdAPI(req.receiver_id);
            return {
              id: req._id,
              receiverId: req.receiver_id,
              name: user?.name || 'Unknown User',
              avatar: user?.avatar || 'https://i.pravatar.cc/150?img=1',
              message: req.message || 'Hi, I\'d like to connect with you!',
              time: formatTime(req.created_at),
              status: req.status || 'Pending'
            };
          } catch (userError) {
            console.error('Failed to fetch user:', userError);
            return {
              id: req._id,
              receiverId: req.receiver_id,
              name: 'Unknown User',
              avatar: 'https://i.pravatar.cc/150?img=1',
              message: req.message || 'Hi, I\'d like to connect with you!',
              time: formatTime(req.created_at),
              status: req.status || 'Pending'
            };
          }
        })
      );

      setState(prev => ({
        ...prev,
        sentRequests: enriched
      }));

    } catch (error) {
      console.error('Failed to load sent requests:', error);
      // Keep existing sent requests if API fails
    }
  };
  // Function to accept a friend request
  const acceptFriendRequest = async (requestId: string) => {
    try {
      // Find the request to get user info before removing
      const request = state.receivedRequests.find(req => req.id === requestId);
      if (!request) {
        console.error('Request not found');
        return;
      }

      // Optimistic UI update - remove from list immediately
      setState(prev => ({
        ...prev,
        receivedRequests: prev.receivedRequests.filter(req => req.id !== requestId)
      }));

      // Call the API
      const response = await acceptFriendRequestAPI(requestId);

      console.log('Accept response:', response);

      // If successful, create a new chat with this user
      const newChat: Chat = {
        id: Date.now(), // Temporary ID, you might want to use real user ID
        conv_id: response.conv_id,
        name: request.name,
        avatar: request.avatar,
        lastMessage: "You are now friends!",
        time: 'Just now',
        unread: 0,
        isOnline: true,
        isActive: true,
        messages: [
        ]
      };

      // Add the new chat to the chats list
      setState(prev => ({
        ...prev,
        chats: [newChat, ...prev.chats]
      }));

      // Optional: Show success message
      alert(`You are now friends with ${request.name}!`);

    } catch (error) {
      console.error('Failed to accept friend request:', error);

      // Rollback on error - reload the requests
      alert('Failed to accept friend request');
      await loadIncomingRequests();
    }
  };

  // Function to reject a friend request
  const rejectFriendRequest = async (requestId: string) => {
    try {
      // Find the request to get user info for feedback
      const request = state.receivedRequests.find(req => req.id === requestId);

      // Optimistic UI update - remove from list immediately
      setState(prev => ({
        ...prev,
        receivedRequests: prev.receivedRequests.filter(req => req.id !== requestId)
      }));

      // Call the API
      const response = await rejectFriendRequestAPI(requestId);

      console.log('Reject response:', response);

      // Optional: Show feedback
      if (request) {
        alert(`Friend request from ${request.name} has been rejected.`);
      }

    } catch (error) {
      console.error('Failed to reject friend request:', error);

      // Rollback on error - reload the requests
      alert('Failed to reject friend request');
      await loadIncomingRequests();
    }
  };

  useEffect(() => {
    setIsClient(true);

    const userData = localStorage.getItem('user');
    if (!userData) {
      window.location.href = '/auth';
      return;
    }

    const parsedUserData = JSON.parse(userData);
    if (parsedUserData.avatar) {
      setProfileAvatar(parsedUserData.avatar);
      setYourStory(prev => ({
        ...prev,
        avatar: parsedUserData.avatar
      }));
    }

    const handleResize = () => {
      setState(prev => ({
        ...prev,
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth > 768 && window.innerWidth <= 1024
      }));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // Load conversations from API on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversations = await loadConversations();
        setState(prev => ({
          ...prev,
          chats: conversations
        }));
      } catch (error) {
        console.error('Failed to load conversations:', error);
        // Keep empty array on error, or fallback to initialChatsData if needed
      }
    };

    // Only load if user is authenticated
    const userData = localStorage.getItem('user');
    if (userData) {
      fetchConversations();
    }
  }, []);

  useEffect(() => {
    const loadSentRequests = async () => {
      try {
        const sentRequests = await getSentFriendRequestsAPI();

        const enrichedRequests = await Promise.all(
          sentRequests.map(async (req: any) => {
            // Fetch receiver details
            const user = await getUserByIdAPI(req.receiver_id);

            return {
              id: req._id,
              receiverId: req.receiver_id,
              name: user?.name || 'Unknown User',
              avatar: user?.avatar || 'https://i.pravatar.cc/150?img=1',
              message: req.message,
              time: formatTime(req.created_at),
              status: 'Pending'
            };
          })
        );

        setState(prev => ({
          ...prev,
          sentRequests: enrichedRequests
        }));

      } catch (error) {
        console.error('Failed to load sent requests:', error);
      }
    };

    loadSentRequests();
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

  // Handle ESC key to close chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.activeChat) {
        setState(prev => ({
          ...prev,
          activeChat: null,
          messages: []
        }));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.activeChat]);

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


  // messages 
  useEffect(() => {
    console.log("active chat ", state.activeChat)
    console.log("returning from fetching msgs")
    if (!state.activeChat?.conv_id) return; // stop if undefined
    console.log("entered into fetching msgs")
    const loadMessages = async () => {
      try {
        const messages = await fetchMessages(state.activeChat?.conv_id || ''); // conv_id is string now
        setState(prev => ({
          ...prev,
          messages
        }));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    loadMessages();
  }, [state.activeChat]);


  //mark delivered and mark seen
  useEffect(() => {
    if (!wsClient || !state.chats?.length) return;

    // Send markDelivered only once (for all conversations collectively)
    // Assuming backend handles it per conversation if needed
    wsClient.markDelivered('all', 'all'); // or handle according to your wsClient API

    // If there is an active chat, mark all as seen and reset unread locally
    if (state.activeChat) {
      const { conv_id: activeConvId, id: activeSenderId } = state.activeChat;

      wsClient.markSeenAll(activeConvId, activeSenderId.toString());


      setState(prev => {
        // If activeChat exists, update its unread and corresponding chat in chats array
        if (!prev.activeChat) return prev;

        return {
          ...prev,
          chats: prev.chats.map(c =>
            c.conv_id === prev.activeChat!.conv_id ? { ...c, unread: 0 } : c
          ),
          activeChat: { ...prev.activeChat, unread: 0 }
        };
      });
    }
  }, [state.activeChat?.conv_id, wsClient]);

  // WebSocket event listeners - FIXED: Now in useEffect to prevent duplicate registrations
  useEffect(() => {
    if (!wsClient) return;

    const handleNewMessage = (data: any) => {
      const msg = data.message;

      setState(prev => {
        const transformedMsg: FetchedMessage = {
          id: msg.id,
          text: msg.content || '',
          mediaUrl: msg.attachments?.[0],
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          isUser: false,
          type: msg.message_type,
          status: msg.status,
        };

        const isActiveChat = prev.activeChat?.conv_id === msg.conversation_id;

        // Update active messages immediately
        const updatedMessages = isActiveChat
          ? [...prev.messages, transformedMsg]
          : prev.messages;

        // Update chats list (preview + unread)
        const updatedChats = prev.chats.map(chat => {
          if (chat.conv_id === msg.conversation_id) {
            return {
              ...chat,
              unread: isActiveChat ? 0 : (chat.unread || 0) + 1,
              lastMessage:
                msg.message_type === 'text'
                  ? msg.content
                  : 'Media has been received',
              time: transformedMsg.time,
            };
          }
          return chat;
        });

        return {
          ...prev,
          messages: updatedMessages,
          chats: updatedChats,
        };
      });

      // Mark as delivered
      wsClient.markDelivered(msg.conversation_id, msg.sender_id);

      // Mark as seen if chat is active
      setState(prev => {
        if (prev.activeChat?.conv_id === msg.conversation_id) {
          wsClient.markSeenAll(msg.conversation_id, msg.sender_id);
        }
        return prev;
      });
    };

    const handleMessageStatus = (data: any) => {
      const { status, conversation_id } = data;

      setState(prev => {
        if (prev.activeChat?.conv_id !== conversation_id) return prev;

        const updatedMessages = prev.messages.map(msg => {
          if (
            msg.isUser &&
            ((msg.status === "sent" && (status === "delivered" || status === "seen")) ||
              (msg.status === "delivered" && status === "seen"))
          ) {
            return { ...msg, status };
          }
          return msg;
        });
        return { ...prev, messages: updatedMessages };
      });
    };

    // Register event listeners
    wsClient.on('new_message', handleNewMessage);
    wsClient.on('message_status', handleMessageStatus);

    // Cleanup function - removes listeners when component unmounts or wsClient changes
    return () => {
      wsClient.off('new_message', handleNewMessage);
      wsClient.off('message_status', handleMessageStatus);
    };
  }, [wsClient]); // Only re-run when wsClient changes


  // Helper functions
  const setActiveSection = (section: string) => {
    setState(prev => ({
      ...prev,
      activeSection: section,
      searchQuery: '',
      searchResults: []
    }));
  };

  // Function to close the active chat
  const closeChat = () => {
    setState(prev => ({
      ...prev,
      activeChat: null,
      messages: []
    }));
  };

  // ===== FIXED: Handle Chat Click for Both Active and Archived Chats =====
  const handleChatClick = (chatId: number) => {
    // If clicking the same chat that's already open, close it
    if (state.activeChat?.id === chatId) {
      closeChat();
      return;
    }

    // First search in active chats
    let chat: Chat | undefined = state.chats.find(c => c.id === chatId);

    // If not found in active chats, search in archived chats
    if (!chat) {
      const archivedChat = state.archivedChats.find(c => c.id === chatId);
      if (archivedChat) {
        // Convert archived chat to full Chat object with messages
        chat = {
          ...archivedChat,
          unread: archivedChat.unread || 0,
          isOnline: archivedChat.isOnline || false,
          messages: archivedChat.messages || []
        };
      }
    }

    if (chat) {
      const selectedChat = chat; // Capture for TypeScript
      setState(prev => ({
        ...prev,
        activeChat: selectedChat,
        messages: selectedChat.messages || []
      }));
    }
  };

  const sendMessage = () => {
    if (!state.newMessage.trim() || !state.activeChat) return;
    console.log("enetred send message")

    if (!wsClient) return; // ensure websocket is ready
    console.log("ok websocket available for message send")

    const currentTime = getCurrentTime();
    const localId = state.messages.length + 1;

    // Local message for immediate UI update
    const newMsg: FetchedMessage = {
      id: localId,
      text: state.newMessage,
      time: currentTime,
      isUser: true,
      type: "text",
      status: "sending" // will be updated when backend confirms
    };

    console.log("send message :", newMsg)

    // Update local state
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMsg],
      newMessage: ""
    }));

    // Update last message in chats
    reorderChats(state.activeChat.id, state.newMessage, currentTime);

    // Send message via websocket
    wsClient.sendMessage(
      state.activeChat.conv_id,      // conversation_id
      String(state.activeChat.id),   // receiver_id
      state.newMessage,              // content
      "text",                        // message_type
      [],                             // attachments
      String(localId)                // temp_id
    );
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
    // Update in active chats
    const chatIndex = state.chats.findIndex(chat => chat.id === chatId);
    if (chatIndex !== -1) {
      const updatedChats = [...state.chats];
      const chatToMove = { ...updatedChats[chatIndex] };

      chatToMove.lastMessage = lastMessage;
      chatToMove.time = time;

      updatedChats.splice(chatIndex, 1);
      updatedChats.unshift(chatToMove);

      setState(prev => ({
        ...prev,
        chats: updatedChats
      }));
    }

    // Also update in archived chats if the chat is archived
    const archivedIndex = state.archivedChats.findIndex(chat => chat.id === chatId);
    if (archivedIndex !== -1) {
      const updatedArchivedChats = [...state.archivedChats];
      const archivedChatToUpdate = { ...updatedArchivedChats[archivedIndex] };

      archivedChatToUpdate.lastMessage = lastMessage;
      archivedChatToUpdate.time = time;

      setState(prev => ({
        ...prev,
        archivedChats: updatedArchivedChats.map(chat =>
          chat.id === chatId ? archivedChatToUpdate : chat
        )
      }));
    }
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

    if (storyId === yourStory.id) {
      setState(prev => ({
        ...prev,
        currentStoryIndex: -1,
        currentStoryItemIndex: itemIndex,
        showStoriesViewer: true,
        isStoryPlaying: true,
        storyProgress: 0,
        showStoryMessageBox: false
      }));
      return;
    }

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

  // Mobile Touch Handlers
  const handleChatTouchStart = (chatId: number, type: string = 'chat', e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;

    longPressTimerRef.current = setTimeout(() => {
      const touch = e.touches[0];
      showChatContextMenu(chatId, type, touch.clientX, touch.clientY);
    }, 500); // 500ms for long press
  };

  const handleChatTouchEnd = (e: React.TouchEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    // Check if it was a swipe (for mobile)
    const touchEnd = e.changedTouches[0].clientX;
    if (Math.abs(touchEnd - touchStartRef.current) < 10) {
      // It's a tap, handle normal click
      const target = e.target as HTMLElement;
      const chatItem = target.closest('.mobile-chat-item, .chat-item, .archived-item');
      if (chatItem && !state.contextMenu.visible) {
        const chatId = parseInt(chatItem.getAttribute('data-chat-id') || '0');
        if (chatId) handleChatClick(chatId);
      }
    }
  };

  const handleStoryTouchStart = (storyId: number, e: React.TouchEvent) => {
    longPressTimerRef.current = setTimeout(() => {
      const touch = e.touches[0];
      showStoryContextMenu(storyId, touch.clientX, touch.clientY);
    }, 500); // 500ms for long press
  };

  const handleStoryTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  const showChatContextMenu = (chatId: number, type: string, x: number, y: number) => {
    setState(prev => ({
      ...prev,
      contextMenu: {
        visible: true,
        x: x,
        y: y,
        chatId: chatId,
        type: type
      }
    }));
  };

  const showStoryContextMenu = (storyId: number, x: number, y: number) => {
    const story = state.stories.find(s => s.id === storyId) || (storyId === yourStory.id ? yourStory : null);
    if (story) {
      setState(prev => ({
        ...prev,
        storyContextMenu: {
          visible: true,
          x: x,
          y: y,
          storyId: storyId,
          isMutedStory: !!story.isMuted
        }
      }));
    }
  };

  const handleStoryRightClick = (e: React.MouseEvent, storyId: number) => {
    e.preventDefault();
    e.stopPropagation();

    const story = state.stories.find(s => s.id === storyId) || (storyId === yourStory.id ? yourStory : null);
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
    if (storyId === yourStory.id) return;

    setState(prev => ({
      ...prev,
      stories: prev.stories.map(story =>
        story.id === storyId ? { ...story, isMuted: true } : story
      ),
      storyContextMenu: { ...prev.storyContextMenu, visible: false }
    }));
  };

  const unmuteStory = (storyId: number) => {
    if (storyId === yourStory.id) return;

    setState(prev => ({
      ...prev,
      stories: prev.stories.map(story =>
        story.id === storyId ? { ...story, isMuted: false } : story
      ),
      storyContextMenu: { ...prev.storyContextMenu, visible: false }
    }));
  };

  const deleteStory = (storyId: number) => {
    if (storyId === yourStory.id) {
      setYourStory(prev => ({
        ...prev,
        mediaUrls: [],
        captions: [],
        storyCount: 0,
        hasNewStory: false
      }));

      if (state.showStoriesViewer && state.currentStoryIndex === -1) {
        closeStory();
      }
    } else {
      setState(prev => ({
        ...prev,
        stories: prev.stories.filter(story => story.id !== storyId)
      }));
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

          if (newMediaUrls.length === files.length) {
            setYourStory(prev => ({
              ...prev,
              mediaUrls: [...prev.mediaUrls, ...newMediaUrls],
              captions: [...prev.captions, ...newCaptions],
              storyCount: prev.storyCount + files.length,
              time: 'Just now',
              hasNewStory: true
            }));

            setState(prev => ({
              ...prev,
              currentStoryIndex: -1,
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

    if (isYourStory) return;

    setState(prev => ({
      ...prev,
      showStoryMessageBox: !prev.showStoryMessageBox,
      isStoryPlaying: !prev.showStoryMessageBox
    }));
  };

  const handleStoryMessageSend = () => {
    if (!state.storyMessage.trim()) return;

    alert("Will deal later");

    // Reset story message and close input
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
      const archivedChat = {
        id: chatToArchive.id,
        conv_id: chatToArchive.conv_id,
        name: chatToArchive.name,
        avatar: chatToArchive.avatar,
        lastMessage: chatToArchive.lastMessage,
        time: chatToArchive.time,
        unread: chatToArchive.unread,
        isOnline: chatToArchive.isOnline,
        messages: chatToArchive.messages
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
      const newChat: Chat = {
        id: chatToUnarchive.id,
        conv_id: chatToUnarchive.conv_id,
        name: chatToUnarchive.name,
        avatar: chatToUnarchive.avatar,
        lastMessage: chatToUnarchive.lastMessage,
        time: chatToUnarchive.time,
        unread: chatToUnarchive.unread || 0,
        isOnline: chatToUnarchive.isOnline || false,
        messages: chatToUnarchive.messages || []
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
        setState(prev => ({
          ...prev,
          archivedChats: prev.archivedChats.filter(chat => chat.id !== state.contextMenu.chatId),
          contextMenu: { ...prev.contextMenu, visible: false }
        }));
      } else {
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

  // ===== FIXED SEARCH FUNCTIONALITY =====
  const handleSearch = async (query: string) => {
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

    // For different sections, handle search differently
    if (state.activeSection === 'chats') {
      // Search in active chats
      const results = state.chats.filter(chat =>
        chat.name.toLowerCase().startsWith(lowerQuery)
      );
      setState(prev => ({
        ...prev,
        searchResults: results
      }));

    } else if (state.activeSection === 'notifications') {
      // Search in notifications
      const results = state.notifications.filter(notification =>
        notification.title.toLowerCase().includes(lowerQuery) ||
        notification.description.toLowerCase().includes(lowerQuery)
      );
      setState(prev => ({
        ...prev,
        searchResults: results
      }));

    } else if (state.activeSection === 'requests') {
      // ===== INTEGRATED SEARCH ENDPOINT HERE =====
      try {
        // Call the search API
        const apiResult = await searchUsersAPI(query);

        // Transform API data to match your format
        const transformedResults = apiResult.results.map((user: any) => ({
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          avatar: user.avatar || null,
          isConnected: state.chats.some(chat =>
            chat.name.toLowerCase() === user.name.toLowerCase() ||
            chat.name.toLowerCase() === user.username.toLowerCase()
          ),
          bio: user.bio,
          friends: user.friends
        }));

        setState(prev => ({
          ...prev,
          searchResults: transformedResults
        }));

      } catch (error) {
        console.error('Search failed:', error);
        // Fallback to local search
        const connectedUserNames = state.chats.map(chat => chat.name.toLowerCase());
        const results = state.dummyUsers.filter(user => {
          const userName = user.name.toLowerCase();
          return userName.startsWith(lowerQuery) && !connectedUserNames.includes(userName);
        });
        setState(prev => ({
          ...prev,
          searchResults: results
        }));
      }

    } else if (state.activeSection === 'archived') {
      // Search in archived chats
      const results = state.archivedChats.filter((chat: any) =>
        chat.name.toLowerCase().includes(lowerQuery) ||
        chat.lastMessage.toLowerCase().includes(lowerQuery)
      );
      setState(prev => ({
        ...prev,
        searchResults: results
      }));
    }
  };

  // ===== UPDATED: Thumb emoji send function =====
  const sendThumbEmoji = () => {
    const currentTime = getCurrentTime();
    const likeMessage: FetchedMessage = {
      id: state.messages.length + 1,
      text: "👍",
      time: currentTime,
      isUser: true,
      type: 'like',
      status: 'sent' // required field in FetchedMessage
    };


    const updatedMessages = [...state.messages, likeMessage];
    setState(prev => ({
      ...prev,
      messages: updatedMessages
    }));

    reorderChats(state.activeChat!.id, "👍", currentTime);
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

        const currentTime = getCurrentTime();
        const voiceMessage: FetchedMessage = {
          id: state.messages.length + 1,
          text: "Voice message",
          time: currentTime,
          isUser: true,
          type: 'voice',
          status: 'sent',          // required
          mediaUrl: audioUrl       // use mediaUrl for voice file
        };


        const updatedMessages = [...state.messages, voiceMessage];
        setState(prev => ({
          ...prev,
          messages: updatedMessages,
          audioChunks: []
        }));

        reorderChats(state.activeChat!.id, "Voice message", currentTime);

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

        const newMsg: FetchedMessage = {
          id: state.messages.length + 1,
          text: "",
          mediaUrl: event.target?.result as string,
          time: currentTime,
          isUser: true,
          type: mediaType,
          status: 'sent'
        };

        const updatedMessages = [...state.messages, newMsg];
        setState(prev => ({
          ...prev,
          messages: updatedMessages
        }));

        const mediaText = mediaType === 'image' ? 'a photo' : 'a video';
        reorderChats(state.activeChat!.id, `Sent ${mediaText}`, currentTime);
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
      const newMsg: FetchedMessage = {
        id: state.messages.length + 1,
        mediaUrl: event.target?.result as string,
        time: currentTime,
        text: "",
        isUser: true,
        type: mediaType === 'image' ? 'image' : 'video',
        status: 'sent'
      };


      const updatedMessages = [...state.messages, newMsg];
      setState(prev => ({
        ...prev,
        messages: updatedMessages
      }));

      const mediaText = mediaType === 'image' ? 'a photo' : 'a video';
      reorderChats(state.activeChat!.id, `Sent ${mediaText}`, currentTime);


    };
    reader.readAsDataURL(file);

    setState(prev => ({ ...prev, showAttachmentMenu: false }));
    e.target.value = '';
  };

  // New functions for message requests
  const setRequestsActiveTab = async (tab: string) => {
    setState(prev => ({
      ...prev,
      requestsActiveTab: tab,
      searchQuery: '',
      searchResults: []
    }));

    // Load appropriate data based on tab
    if (tab === 'pending') {
      await reloadSentRequests();
    } else if (tab === 'requests') {
      await loadIncomingRequests();
    }
  };

  const openSendRequestModal = async (user: any) => {
    try {
      // Ensure we're in requests section
      if (state.activeSection !== 'requests') {
        setActiveSection('requests');
      }

      // Ensure we're on Pending tab
      setRequestsActiveTab('pending');


      // Show loading
      setState(prev => ({ ...prev, isLoadingUser: true }));

      // Fetch full user details from public API
      const userDetails = await getUserByIdAPI(user.id);

      if (userDetails) {
        // Use data from getUserById
        const fullUser = {
          id: userDetails._id,
          name: userDetails.name,
          username: userDetails.username,
          email: userDetails.email,
          avatar: userDetails.avatar, // Use helper
          bio: userDetails.bio || '',
          friends: userDetails.friends || []
        };

        setState(prev => ({
          ...prev,
          showSendRequestModal: true,
          selectedUserForRequest: fullUser,
          requestMessage: `Hi ${userDetails.name}, I'd like to connect with you!`,
          isLoadingUser: false
        }));
      } else {
        // Fallback to search result data
        setState(prev => ({
          ...prev,
          showSendRequestModal: true,
          selectedUserForRequest: {
            ...user,
            avatar: user.avatar || null
          },
          requestMessage: `Hi ${user.name}, I'd like to connect with you!`,
          isLoadingUser: false
        }));
      }

    } catch (error) {
      console.error('Failed to load user details:', error);
      // Fallback
      setState(prev => ({
        ...prev,
        showSendRequestModal: true,
        selectedUserForRequest: {
          ...user,
          avatar: user.avatar || null
        },
        requestMessage: `Hi ${user.name}, I'd like to connect with you!`,
        isLoadingUser: false
      }));
    }
  };
  const closeSendRequestModal = () => {
    setState(prev => ({
      ...prev,
      showSendRequestModal: false,
      selectedUserForRequest: null,
      requestMessage: ''
    }));
  };

  const sendFriendRequest = async () => {
    const { selectedUserForRequest, requestMessage } = state;

    if (!selectedUserForRequest || !requestMessage.trim()) return;

    const baseRequest = {
      receiverId: selectedUserForRequest.id,
      name: selectedUserForRequest.name,
      avatar:
        selectedUserForRequest.avatar || 'https://i.pravatar.cc/150?img=1',
      message: requestMessage,
      time: 'Just now',
      status: 'Pending'
    };

    try {
      // Start loading
      setState(prev => ({ ...prev, isSendingRequest: true }));

      const response = await sendFriendRequestAPI(
        selectedUserForRequest.id,
        requestMessage
      );

      if (response?.detail === 'Friend request already exists') {
        alert('Friend request already sent to this user');
        return;
      }

      if (response?.detail === 'Friend request sent') {
        const newSentRequest = {
          id: response._id || selectedUserForRequest.id,
          ...baseRequest
        };

        setState(prev => ({
          ...prev,
          sentRequests: [newSentRequest, ...prev.sentRequests],
          showSendRequestModal: false,
          selectedUserForRequest: null,
          requestMessage: '',
          isSendingRequest: false
        }));

        setRequestsActiveTab('pending');

        // Sync with backend (non-blocking)
        setTimeout(() => {
          reloadSentRequests().catch(console.error);
        }, 1000);

        return;
      }

      // Fallback for unexpected responses
      alert(response?.detail || 'Request sent');

    } catch (error: any) {
      console.error('Failed to send friend request:', error);
      alert(error.message || 'Failed to send friend request');

      // UI fallback (same as your current logic)
      const fallbackRequest = {
        id: selectedUserForRequest.id,
        ...baseRequest
      };

      setState(prev => ({
        ...prev,
        sentRequests: [fallbackRequest, ...prev.sentRequests],
        showSendRequestModal: false,
        selectedUserForRequest: null,
        requestMessage: '',
        isSendingRequest: false
      }));

      setRequestsActiveTab('pending');
    }
  };

  // Check if user is already connected
  const isUserConnected = (userName: string) => {
    return state.chats.some(chat =>
      chat.name.toLowerCase() === userName.toLowerCase()
    );
  };

  // Helper functions for story navigation
  const getCurrentStory = () => {
    if (state.currentStoryIndex === -1) {
      return yourStory;
    }
    return state.stories[state.currentStoryIndex];
  };

  const normalStories = state.stories.filter(story => !story.isMuted && !story.isMyStory);
  const mutedStories = state.stories.filter(story => story.isMuted);

  const currentStory = getCurrentStory();
  const isYourStory = state.currentStoryIndex === -1;
  const currentMediaUrl = currentStory?.mediaUrls[state.currentStoryItemIndex];
  const isVideo = currentMediaUrl?.includes('video') || currentStory?.mediaType === 'video';


  // Don't render anything until client-side to avoid hydration mismatch
  if (!isClient) {
    return <div className="messenger-container">Loading...</div>;
  }


  return (
    <div className="messenger-container">
      {/* Mobile Layout */}
      {state.isMobile && (
        <div className="mobile-layout">
          {/* Mobile Header - Only shown in main list view */}
          {!state.activeChat && (
            <div className="mobile-header">
              <div className="mobile-header-content">
                <div className="mobile-header-title">
                  {state.activeSection === 'chats' ? 'Messenger' :
                    state.activeSection === 'notifications' ? 'Notifications' :
                      state.activeSection === 'requests' ? 'Friend Request' : 'Archived chats'}
                </div>
                <div className="mobile-header-actions">
                  <i className="fas fa-edit"></i>
                  <img
                    src={profileAvatar}
                    alt="Profile"
                    className="mobile-profile-pic"
                    onClick={() => window.location.href = '/profile'}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mobile Chat Header - Only shown in chat view */}
          {state.activeChat && (
            <ChatHeader
              chat={state.activeChat}
              isMobile={true}
              onStartCall={startOutgoingCall}
              onBack={() => setState(prev => ({ ...prev, activeChat: null }))}
            />
          )}

          {/* Mobile Content Area */}
          <div className="mobile-content">
            {state.activeChat ? (
              // ===== MOBILE CHAT SCREEN =====
              <div className="mobile-chat-screen">
                <div className="messages-container">
                  <div className="date-separator">
                    <span>Today</span>
                  </div>
                  {state.messages.length === 0 ? (
                    <div className="encryption-notice">
                      <i className="fas fa-lock"></i>
                      Messages and calls are end-to-end encrypted. No one outside of this chat, not even Messenger, can read or listen to them.
                    </div>
                  ) : (
                    state.messages.map(message => (
                      <MessageItem
                        key={message.id}
                        message={message}
                        chat={state.activeChat || { id: 0, conv_id: '', name: '', avatar: '', lastMessage: '', time: '', unread: 0, messages: [] }}
                        playingVoiceMessage={state.playingVoiceMessage}
                        onPlayVoiceMessage={playVoiceMessage}
                        onStopVoiceMessage={stopVoiceMessage}
                      />
                    ))
                  )}
                </div>

                {/* FIXED BOTTOM MESSAGE INPUT */}
                <div className="mobile-message-input-container">
                  <div className="mobile-message-input">
                    <MessageInput
                      newMessage={state.newMessage}
                      receiverName={state.activeChat.name}
                      showEmojiPicker={state.showEmojiPicker}
                      showAttachmentMenu={state.showAttachmentMenu}
                      onMessageChange={(message) => setState(prev => ({ ...prev, newMessage: message }))}
                      onSendMessage={sendMessage}
                      onSendThumbEmoji={sendThumbEmoji}
                      onToggleEmojiPicker={toggleEmojiPicker}
                      onToggleAttachmentMenu={toggleAttachmentMenu}
                      onAddEmoji={addEmoji}
                      onFileUpload={handleFileUpload}
                      onOpenCamera={openCamera}
                      popularEmojis={popularEmojis}
                    />
                  </div>
                </div>
              </div>
            ) : (
              // ===== MOBILE MAIN MESSAGES LIST SCREEN =====
              <div className="mobile-list-view">
                {/* Search Bar */}
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
                    {!state.showMutedStories ? (
                      <StoriesList
                        stories={normalStories}
                        yourStory={yourStory}
                        currentStoryItemIndex={state.currentStoryItemIndex}
                        onStoryClick={openStory}
                        onStoryRightClick={handleStoryRightClick}
                        onStoryTouchStart={handleStoryTouchStart}
                        onStoryTouchEnd={handleStoryTouchEnd}
                        onAddStory={addStory}
                      />
                    ) : (
                      <MutedStoriesList
                        stories={mutedStories}
                        onStoryClick={openStory}
                        onStoryRightClick={handleStoryRightClick}
                        onStoryTouchStart={handleStoryTouchStart}
                        onStoryTouchEnd={handleStoryTouchEnd}
                      />
                    )}
                  </div>
                )}

                {/* Content based on active section */}
                <div className="mobile-section-content">
                  {state.searchQuery ? (
                    <SearchResults
                      searchQuery={state.searchQuery}
                      searchResults={state.searchResults}
                      activeSection={state.activeSection}
                      isMobile={state.isMobile}
                      chats={state.chats}
                      onChatClick={handleChatClick}
                      onOpenSendRequestModal={openSendRequestModal}
                    />
                  ) : (
                    <>
                      {/* Chats List - FIXED FOR MOBILE WITH NAMES AND TIMESTAMPS */}
                      {state.activeSection === 'chats' && (
                        <div className="mobile-chats-list">
                          {state.chats.map(chat => (
                            <ChatItem
                              key={chat.id}
                              chat={chat}
                              isActive={false}
                              isMobile={true}
                              onChatClick={handleChatClick}
                              onChatRightClick={handleChatRightClick}
                              onChatTouchStart={handleChatTouchStart}
                              onChatTouchEnd={handleChatTouchEnd}
                              type="chat"
                            />
                          ))}
                        </div>
                      )}

                      {/* Notifications List */}
                      {state.activeSection === 'notifications' && (
                        <NotificationsList
                          notifications={state.notifications}
                          onMarkAsRead={markNotificationAsRead}
                        />
                      )}

                      {/* Requests Section */}
                      {state.activeSection === 'requests' && (
                        <RequestsSection
                          activeTab={state.requestsActiveTab}
                          receivedRequests={state.receivedRequests}
                          sentRequests={state.sentRequests}
                          onTabChange={setRequestsActiveTab}
                          onAcceptRequest={acceptFriendRequest}
                          onRejectRequest={rejectFriendRequest}
                          onCancelRequest={cancelSentRequest}
                        />
                      )}

                      {/* ===== FIXED: Archived Section with Working Chat Opening ===== */}
                      {state.activeSection === 'archived' && (
                        <div className="archived-list">
                          {state.archivedChats.map(chat => (
                            <ChatItem
                              key={chat.id}
                              chat={chat}
                              isActive={false}
                              isMobile={state.isMobile}
                              onChatClick={handleChatClick}
                              onChatRightClick={handleChatRightClick}
                              onChatTouchStart={handleChatTouchStart}
                              onChatTouchEnd={handleChatTouchEnd}
                              type="archived"
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Bottom Navigation - Only shown in main list view */}
          {!state.activeChat && (
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
                  <span>Message Request</span>
                  {state.receivedRequests.length > 0 && (
                    <div className="mobile-nav-indicator"></div>
                  )}
                </div>
                <div
                  className={`mobile-nav-item ${state.activeSection === 'archived' ? 'active' : ''}`}
                  onClick={() => setActiveSection('archived')}
                >
                  <i className="fas fa-archive"></i>
                  <span>Archived Chats</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Desktop Layout - Hidden on Mobile */}
      {!state.isMobile && (
        <div className="desktop-layout">
          {/* Left Sidebar Icons */}
          <Sidebar
            activeSection={state.activeSection}
            profileAvatar={profileAvatar}
            notifications={state.notifications}
            receivedRequests={state.receivedRequests}
            onSectionChange={setActiveSection}
          />

          {/* Chats/Notifications/Requests/Archived Sidebar */}
          <div className="chats-sidebar">
            <div className="sidebar-header">
              <h2 className="messenger-title" style={{ color: '#1877f2' }}>
                {state.activeSection === 'chats' ? 'Messenger' :
                  state.activeSection === 'notifications' ? 'Notifications' :
                    state.activeSection === 'requests' ? 'Friend Request' : 'Archived chats'}
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
                <SearchResults
                  searchQuery={state.searchQuery}
                  searchResults={state.searchResults}
                  activeSection={state.activeSection}
                  isMobile={state.isMobile}
                  chats={state.chats}
                  onChatClick={handleChatClick}
                  onOpenSendRequestModal={openSendRequestModal}
                />
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
                      {!state.showMutedStories ? (
                        <StoriesList
                          stories={normalStories}
                          yourStory={yourStory}
                          currentStoryItemIndex={state.currentStoryItemIndex}
                          onStoryClick={openStory}
                          onStoryRightClick={handleStoryRightClick}
                          onStoryTouchStart={handleStoryTouchStart}
                          onStoryTouchEnd={handleStoryTouchEnd}
                          onAddStory={addStory}
                        />
                      ) : (
                        <MutedStoriesList
                          stories={mutedStories}
                          onStoryClick={openStory}
                          onStoryRightClick={handleStoryRightClick}
                          onStoryTouchStart={handleStoryTouchStart}
                          onStoryTouchEnd={handleStoryTouchEnd}
                        />
                      )}
                    </div>
                  )}

                  {/* Chats List - FIXED WITH NAMES AND TIMESTAMPS */}
                  {state.activeSection === 'chats' && (
                    <div className="chats-section">
                      <div className="chats-list">
                        {state.chats.map(chat => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === state.activeChat?.id}
                            isMobile={false}
                            onChatClick={handleChatClick}
                            onChatRightClick={handleChatRightClick}
                            onChatTouchStart={handleChatTouchStart}
                            onChatTouchEnd={handleChatTouchEnd}
                            type="chat"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notifications List */}
                  {state.activeSection === 'notifications' && (
                    <div className="notifications-section">
                      <NotificationsList
                        notifications={state.notifications}
                        onMarkAsRead={markNotificationAsRead}
                      />
                    </div>
                  )}

                  {/* Requests Section */}
                  {state.activeSection === 'requests' && (
                    <RequestsSection
                      activeTab={state.requestsActiveTab}
                      receivedRequests={state.receivedRequests}
                      sentRequests={state.sentRequests}
                      onTabChange={setRequestsActiveTab}
                      onAcceptRequest={acceptFriendRequest}
                      onRejectRequest={rejectFriendRequest}
                      onCancelRequest={cancelSentRequest}
                    />
                  )}

                  {/* ===== FIXED: Archived Section with Working Chat Opening ===== */}
                  {state.activeSection === 'archived' && (
                    <div className="archived-section">
                      <div className="archived-list">
                        {state.archivedChats.map(chat => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={false}
                            isMobile={false}
                            onChatClick={handleChatClick}
                            onChatRightClick={handleChatRightClick}
                            onChatTouchStart={handleChatTouchStart}
                            onChatTouchEnd={handleChatTouchEnd}
                            type="archived"
                          />
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
                <ChatHeader
                  chat={state.activeChat}
                  isMobile={false}
                  onStartCall={startOutgoingCall}
                  onClose={closeChat}
                />

                <div className="messages-container">
                  <div className="date-separator">
                    <span>Today</span>
                  </div>
                  {state.messages.length === 0 ? (
                    <div className="encryption-notice">
                      <i className="fas fa-lock"></i>
                      Messages and calls are end-to-end encrypted. No one outside of this chat, not even Messenger, can read or listen to them.
                    </div>
                  ) : (
                    state.messages.map(message => (
                      <MessageItem
                        key={message.id}
                        message={message}
                        chat={state.activeChat || { id: 0, conv_id: '', name: '', avatar: '', lastMessage: '', time: '', unread: 0, messages: [] }}
                        playingVoiceMessage={state.playingVoiceMessage}
                        onPlayVoiceMessage={playVoiceMessage}
                        onStopVoiceMessage={stopVoiceMessage}
                      />
                    ))
                  )}
                </div>

                <MessageInput
                  newMessage={state.newMessage}
                  receiverName={state.activeChat.name}
                  showEmojiPicker={state.showEmojiPicker}
                  showAttachmentMenu={state.showAttachmentMenu}
                  onMessageChange={(message) => setState(prev => ({ ...prev, newMessage: message }))}
                  onSendMessage={sendMessage}
                  onSendThumbEmoji={sendThumbEmoji}
                  onToggleEmojiPicker={toggleEmojiPicker}
                  onToggleAttachmentMenu={toggleAttachmentMenu}
                  onAddEmoji={addEmoji}
                  onFileUpload={handleFileUpload}
                  onOpenCamera={openCamera}
                  popularEmojis={popularEmojis}
                />
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
      )}

      {/* Send Request Modal */}
      <SendRequestModal
        isOpen={state.showSendRequestModal}
        profileAvatar={profileAvatar}
        selectedUser={state.selectedUserForRequest}
        requestMessage={state.requestMessage}
        isSendingRequest={state.isSendingRequest}
        onClose={closeSendRequestModal}
        onMessageChange={(message) => setState(prev => ({ ...prev, requestMessage: message }))}
        onSendRequest={sendFriendRequest}
      />

      {/* Stories Viewer */}
      {state.showStoriesViewer && currentStory && currentStory.mediaUrls.length > 0 && (
        <StoryViewer
          currentStory={currentStory}
          currentStoryItemIndex={state.currentStoryItemIndex}
          currentStoryIndex={state.currentStoryIndex}
          storiesLength={state.stories.length}
          storyProgress={state.storyProgress}
          isStoryPlaying={state.isStoryPlaying}
          isYourStory={isYourStory}
          onClose={closeStory}
          onTogglePlayPause={toggleStoryPlayPause}
          onNextStory={nextStory}
          onPrevStory={prevStory}
          onNextStoryItem={nextStoryItem}
          onPrevStoryItem={prevStoryItem}
          showStoryMessageBox={state.showStoryMessageBox}
          storyMessage={state.storyMessage}
          onStoryMessageChange={(message) => setState(prev => ({ ...prev, storyMessage: message }))}
          onStoryMessageSend={handleStoryMessageSend}
          onToggleStoryMessageBox={toggleStoryMessageBox}
          onDeleteStory={deleteStory}
          videoRef={videoRef}
        />
      )}

      {/* Context Menus */}
      <ContextMenus
        contextMenu={state.contextMenu}
        storyContextMenu={state.storyContextMenu}
        onDeleteChat={handleDeleteFromContextMenu}
        onArchiveChat={handleArchiveFromContextMenu}
        onUnarchiveChat={handleUnarchiveFromContextMenu}
        onMuteStory={muteStory}
        onUnmuteStory={unmuteStory}
        onDeleteStory={deleteStory}
        yourStoryId={yourStory.id}
      />

      {/* Call Interfaces */}
      <CallInterface
        callState={state.callState}
        onCancelCall={cancelOutgoingCall}
        onEndCall={endCall}
        onToggleMute={toggleMute}
        onToggleSpeaker={toggleSpeaker}
        onRedial={startOutgoingCall}
        onClose={() => setState(prev => ({
          ...prev,
          callState: {
            ...prev.callState,
            isCallEnded: false,
            callType: null,
            callRecipient: null
          }
        }))}
        formatCallDuration={formatCallDuration}
      />
    </div>
  );
}