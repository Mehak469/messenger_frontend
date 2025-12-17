import { authFetch } from "../utils/authfetch"
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const API_BASE_URL="https://messangersemesterproject-production.up.railway.app/api/v1"

export const getConversationsAPI = async () => {
  try {
    const response = await authFetch(`${API_BASE_URL}/conversations`);

    if (!response.ok) {
      throw new Error("Failed to fetch conversations");
    }

    const data = await response.json();

    console.log("🟢 [API] Raw conversations response:", data);

    return data;
  } catch (error) {
    console.error("🔴 [API] Error fetching conversations:", error);
    throw error;
  }
};
