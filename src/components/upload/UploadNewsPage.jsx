import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import MediaUploadField from "./MediaUploadField";
import NewsTextFields from "./NewsTextFields";
import UploadProgress from "./UploadProgress";
import TagSelector from "./TagSelector";
import UploadNotice from "./UploadNotice";
import { uploadNewsWithProgress } from "./uploadNewsApi";
import { MAX_DESCRIPTION_WORDS, NEWS_TAGS } from "./uploadConstants";
import { countWords, limitWords } from "./uploadUtils";
import { fetchNews } from "../../store/newsSlice";
import { fetchUserUploads } from "../../store/userUploadsSlice";

function UploadNewsPage() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const mediaItemsRef = useRef([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTag, setSelectedTag] = useState(NEWS_TAGS[0]);
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle");

  const descriptionWords = countWords(description);
  const isUploading = uploadStatus === "uploading";
  const canSubmit = Boolean(
    mediaItems.length && title.trim() && description.trim() && selectedTag && location.trim() && !isUploading,
  );

  useEffect(() => {
    mediaItemsRef.current = mediaItems;
  }, [mediaItems]);

  useEffect(() => {
    return () => {
      mediaItemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  function clearSubmitted() {
    if (submitted) {
      setSubmitted(false);
    }

    if (uploadError) {
      setUploadError("");
    }
  }

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) {
      return;
    }

    setMediaItems((currentItems) => [
      ...currentItems,
      ...selectedFiles.map((selectedFile) => ({
        file: selectedFile,
        id: `${selectedFile.name}-${selectedFile.lastModified}-${crypto.randomUUID()}`,
        previewUrl: URL.createObjectURL(selectedFile),
      })),
    ]);
    clearSubmitted();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleRemoveMedia(itemId) {
    setMediaItems((currentItems) => {
      const itemToRemove = currentItems.find((item) => item.id === itemId);

      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }

      return currentItems.filter((item) => item.id !== itemId);
    });
    clearSubmitted();
  }

  function handleDescriptionChange(event) {
    setDescription(limitWords(event.target.value, MAX_DESCRIPTION_WORDS));
    clearSubmitted();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setSubmitted(false);
    setUploadError("");
    setUploadProgress(0);
    setUploadStatus("uploading");

    try {
      await uploadNewsWithProgress({
        description,
        location,
        mediaItems,
        onProgress: setUploadProgress,
        tag: selectedTag,
        title,
      });

      dispatch(fetchUserUploads());
      dispatch(fetchNews());
      setSubmitted(true);
      setUploadStatus("succeeded");
    } catch (error) {
      setUploadError(error.message);
      setUploadStatus("failed");
    }
  }

  return (
    <section className="mx-auto grid w-full max-w-2xl gap-4 pb-4" aria-labelledby="upload-news-heading">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-[#c5222f]">Add News</p>
          <h1 className="text-2xl font-black text-[#111827]" id="upload-news-heading">
            Upload local news
          </h1>
        </div>
        <span className="rounded-full bg-[#f5e8df] px-3 py-1 text-xs font-extrabold text-[#c5222f]">
          Media upload
        </span>
      </div>

      <form
        className="grid gap-4 rounded-[28px] bg-white p-4 shadow-[0_10px_28px_rgba(17,24,39,0.06)]"
        onSubmit={handleSubmit}
      >
        <MediaUploadField
          fileInputRef={fileInputRef}
          mediaItems={mediaItems}
          onChange={handleFileChange}
          onRemove={handleRemoveMedia}
        />

        <NewsTextFields
          description={description}
          descriptionWords={descriptionWords}
          location={location}
          maxDescriptionWords={MAX_DESCRIPTION_WORDS}
          onDescriptionChange={handleDescriptionChange}
          onLocationChange={(event) => {
            setLocation(event.target.value);
            clearSubmitted();
          }}
          onTitleChange={(event) => {
            setTitle(event.target.value);
            clearSubmitted();
          }}
          title={title}
        />

        <TagSelector
          onChange={(tag) => {
            setSelectedTag(tag);
            clearSubmitted();
          }}
          selectedTag={selectedTag}
          tags={NEWS_TAGS}
        />

        <UploadProgress progress={uploadProgress} status={uploadStatus} />

        {uploadError ? (
          <div className="rounded-2xl bg-[#fff1f3] px-4 py-3 text-sm font-extrabold text-[#c5222f]">
            {uploadError}
          </div>
        ) : null}

        {submitted ? <UploadNotice /> : null}

        <button
          className="min-h-12 rounded-2xl bg-[#c5222f] px-5 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-[#d8d2c8]"
          disabled={!canSubmit}
          type="submit"
        >
          {isUploading ? "Uploading..." : "Upload News"}
        </button>
      </form>
    </section>
  );
}

export default UploadNewsPage;
