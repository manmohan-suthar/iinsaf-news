import { fetchJson, postJson } from './apiClient'

export function fetchComments(newsId) {
  return fetchJson(`/api/news/${newsId}/comments`)
}

export function addComment(newsId, text, parentId = null) {
  return postJson(`/api/news/${newsId}/comments`, parentId ? { parentId, text } : { text })
}

export function toggleLike(newsId) {
  return postJson(`/api/news/${newsId}/like`)
}
