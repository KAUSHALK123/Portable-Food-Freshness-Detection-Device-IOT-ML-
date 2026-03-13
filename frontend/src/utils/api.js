const API_BASE = "http://127.0.0.1:8000";

export const endpoints = {
  latestData: `${API_BASE}/latest-data`,
  login: `${API_BASE}/auth/login`,
  register: `${API_BASE}/auth/register`,
  me: `${API_BASE}/auth/me`,
  setupConfig: `${API_BASE}/setup/config`,
  analytics: `${API_BASE}/analytics/summary`,
  analyticsOverview: `${API_BASE}/analytics/overview`,
  analyticsMonthly: `${API_BASE}/analytics/monthly`,
  alerts: `${API_BASE}/alerts`,
  containerImage: (containerId) => `${API_BASE}/container-image/${containerId}`,
};

export async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let message = "Request failed";
    try {
      const body = await res.json();
      message = body.detail || message;
    } catch {
      // keep fallback message
    }
    throw new Error(message);
  }
  return res.json();
}

export function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
