export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://iinsaf-news-api.vercel.app'

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
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
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
    headers: { 'Content-Type': 'application/json' },
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
    method: 'PUT',
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error || `API request failed: ${response.status}`)
  }

  const payload = await response.json()
  return payload.data ?? payload
}
