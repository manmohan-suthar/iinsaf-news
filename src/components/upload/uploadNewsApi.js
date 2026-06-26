import { API_BASE_URL } from "../../store/apiClient";

export function uploadNewsWithProgress({ description, location, mediaItems, onProgress, tag, title }) {
  const formData = new FormData();

  formData.append("title", title.trim());
  formData.append("description", description.trim());
  formData.append("tag", tag);
  formData.append("location", location.trim());
  mediaItems.forEach((item) => formData.append("media", item.file));

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open("POST", `${API_BASE_URL}/api/news/upload`);
    request.withCredentials = true;

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    request.onload = () => {
      let payload;

      try {
        payload = JSON.parse(request.responseText);
      } catch {
        payload = undefined;
      }

      if (request.status >= 200 && request.status < 300) {
        onProgress(100);
        resolve(payload?.data || payload);
        return;
      }

      reject(new Error(payload?.error || `Upload failed: ${request.status}`));
    };

    request.onerror = () => reject(new Error("Upload failed. Check your connection and try again."));
    request.send(formData);
  });
}
