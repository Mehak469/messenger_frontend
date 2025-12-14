// src/utils/fetchMessage.ts
import { FetchedMessage } from '@/Types/chats'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

interface APIMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: string; // text, image, video, file, etc.
  status: string;       // sent, delivered, seen
  created_at: string;
  updated_at: string;
}

interface FetchMessagesResponse {
  messages: APIMessage[];
}

export async function fetchMessages(conv_id: string): Promise<FetchedMessage[]> {
  try {
    // Get current user and access token from localStorage
    console.log("message fetching for cov id : ",conv_id)
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    console.log("access token is ",token)
    if (!userStr || !token) throw new Error('User or access token not found in localStorage');

    const currentUser = JSON.parse(userStr);
    const user_id = currentUser._id;

    const res = await fetch(`${API_BASE_URL}/conversations/${conv_id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // send token in Authorization header
      }
    });

    if (!res.ok) throw new Error('Failed to fetch messages');

    const data: FetchMessagesResponse = await res.json();

    const messages: FetchedMessage[] = data.messages
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((msg, index) => ({
        id: index + 1,
        text: msg.message_type === 'text' ? msg.content : "",  // fallback for non-text
        mediaUrl: msg.message_type !== 'text' ? msg.content : undefined, // media URL
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: msg.sender_id === user_id,
        type: msg.message_type,
        status: msg.status
      }));

    return messages;
  } catch (error) {
    console.error('[fetchMessages] Error:', error);
    return [];
  }
}
