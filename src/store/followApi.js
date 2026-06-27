import { API_BASE_URL, fetchJson, getAuthToken } from './apiClient'

async function sendFollowRequest(userId, method) {
  const token = getAuthToken()
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/follow`, {
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    method,
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error || `Follow request failed: ${response.status}`)
  }

  const payload = await response.json()
  return payload.data
}

export function fetchFollowStatus(userId) {
  return fetchJson(`/api/users/${userId}/follow`)
}

export function followUser(userId) {
  return sendFollowRequest(userId, 'POST')
}

export function unfollowUser(userId) {
  return sendFollowRequest(userId, 'DELETE')
}
