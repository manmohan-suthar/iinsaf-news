export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://iinsaf-news-api.vercel.app'
const authTokenKey = 'iinsaf_auth_token'

export function getAuthToken() {
  return window.localStorage.getItem(authTokenKey) || ''
}

export function setAuthToken(token) {
  if (token) {
    window.localStorage.setItem(authTokenKey, token)
  }
}

export function clearAuthToken() {
  window.localStorage.removeItem(authTokenKey)
}

function authHeaders(headers = {}) {
  const token = getAuthToken()
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers
}

export function apiAssetUrl(path) {
  if (!path) {
    return ''
  }

  if (/^(https?:|blob:|data:)/.test(path)) {
    return path
  }

  return `${API_BASE_URL}${path}`
}

export async function fetchJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: authHeaders(),
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  const payload = await response.json()
  return payload.data
}

export async function postJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    body: body ? JSON.stringify(body) : undefined,
    headers: authHeaders(body ? { 'Content-Type': 'application/json' } : {}),
    credentials: 'include',
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  const payload = await response.json()
  return payload.data ?? payload
}

export async function putJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    body: JSON.stringify(body),
    credentials: 'include',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    method: 'PUT',
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error || `API request failed: ${response.status}`)
  }

  const payload = await response.json()
  return payload.data ?? payload
}

export async function deleteJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: authHeaders(),
    method: 'DELETE',
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error || `API request failed: ${response.status}`)
  }

  const payload = await response.json()
  return payload.data ?? payload
}

export async function putForm(path, formData) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    body: formData,
    credentials: 'include',
    headers: authHeaders(),
    method: 'PUT',
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error || `API request failed: ${response.status}`)
  }

  const payload = await response.json()
  return payload.data ?? payload
}
