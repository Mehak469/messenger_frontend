"use client";

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

// const API = process.env.NEXT_PUBLIC_API_URL;

// ------------------------------
// Token Helpers
// ------------------------------
const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

const setTokens = (access: string, refresh?: string) => {
  localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
};

const logout = () => {
  localStorage.clear();
  window.location.href = "/auth";
};

// ------------------------------
// Refresh Token Function
// ------------------------------
async function refreshAccessToken() {
  if (isRefreshing) {
    return new Promise(resolve => {
      refreshQueue.push(resolve);
    });
  }

  isRefreshing = true;

  try {
    const res = await fetch(`${URL}/users/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: getRefreshToken(),
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error("Refresh failed");

    setTokens(data.access_token, data.refresh_token);

    refreshQueue.forEach(cb => cb(data.access_token));
    refreshQueue = [];

    return data.access_token;

  } catch (err) {
    logout();
  } finally {
    isRefreshing = false;
  }
}

// ------------------------------
// MAIN PROTECTED FETCH
// ------------------------------
export async function authFetch(url: string, options: any = {}) {

  let accessToken = getAccessToken();

  let headers = options.headers || {};
  headers["Authorization"] = `Bearer ${accessToken}`;
  headers["Content-Type"] = "application/json";

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // If access token expired → refresh
  if (res.status === 401) {
    accessToken = await refreshAccessToken();

    if (!accessToken) return res; // refresh failed → auto-logout happened

    // Retry the request
    return await fetch(url, {
      ...options,
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return res;
}
