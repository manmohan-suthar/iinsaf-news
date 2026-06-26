import { fetchJson } from '../../store/apiClient'

export function reverseLocation({ latitude, longitude }) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
  })

  return fetchJson(`/api/location/reverse?${params.toString()}`)
}
