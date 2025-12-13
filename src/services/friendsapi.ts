import { authFetch } from "../utils/authfetch"
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const API_BASE_URL="http://127.0.0.1:8000/api/v1"

export const getUserByIdAPI = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Get user failed:', response.status);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get user API error:', error);
      return null;
    }
  };

// Search Users API function
export const searchUsersAPI = async (query: string) => {
try {
    const userData = localStorage.getItem('user');
    if (!userData) {
    window.location.href = '/auth';
    return { results: [] };
    }

    const parsedUserData = JSON.parse(userData);
    const token = parsedUserData.access_token;

    const response = await fetch(`${API_BASE_URL}/users/search?q=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    });

    if (!response.ok) {
    console.error('Search failed:', response.status);
    return { results: [] };
    }

    const data = await response.json();
    return data;
} catch (error) {
    console.error('Search API error:', error);
    return { results: [] };
}
};

// Send Friend Request API function - PROTECTED (uses authFetch)
export const sendFriendRequestAPI = async (receiverId: string, message: string) => {
try {
    const response = await authFetch(`${API_BASE_URL}/friends/request/${receiverId}`, {
    method: 'POST',
    body: JSON.stringify({
        message: message
    }),
    });

    const data = await response.json();

    if (!response.ok) {
    throw new Error(data.detail || 'Failed to send friend request');
    }

    return data;
} catch (error) {
    console.error('Send friend request error:', error);
    throw error;
}
};
// Get Sent Friend Requests API function - PROTECTED
export const getSentFriendRequestsAPI = async () => {
  try {
    const response = await authFetch(`${API_BASE_URL}/friends/requests/sent`, {
      method: 'GET',
    });

    if (!response.ok) {
      console.error('Get sent requests failed:', response.status);
      return [];
    }

    const data = await response.json();
    return data; // Returns array of sent friend requests
  } catch (error) {
    console.error('Get sent requests API error:', error);
    return [];
  }
};