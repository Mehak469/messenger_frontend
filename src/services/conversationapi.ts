import { authFetch } from "../utils/authfetch"
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const API_BASE_URL="http://127.0.0.1:8000/api/v1"

export const getConversationsAPI = async () => {
  try {
    const response = await authFetch(`${API_BASE_URL}/conversations`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};