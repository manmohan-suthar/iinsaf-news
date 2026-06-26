import { deleteJson, putJson } from './apiClient'

export function updateUploadedPost(newsId, payload) {
  return putJson(`/api/news/uploads/${newsId}`, payload)
}

export function deleteUploadedPost(newsId) {
  return deleteJson(`/api/news/uploads/${newsId}`)
}
