import { API_BASE_URL, fetchJson } from './apiClient'

async function sendFollowRequest(userId, method) {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/follow`, {
    credentials: 'include',
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
