import { useEffect, useRef, useState } from "react";
import { Edit3, Heart, MessageCircle, MoreVertical, Plus, Send, Share2, Trash2, Volume2, VolumeX, X } from "lucide-react";
import { useSelector } from "react-redux";
import video1 from "../assets/videos/video1.mp4";
import video2 from "../assets/videos/video2.mp4";
import video3 from "../assets/videos/video3.mp4";
import CommentPanel from "./comments/CommentPanel";
import { apiAssetUrl } from "../store/apiClient";
import { toggleLike } from "../store/engagementApi";
import { followUser, unfollowUser } from "../store/followApi";
import { deleteUploadedPost, updateUploadedPost } from "../store/uploadedNewsApi";
import newsPreview from "../../WhatsApp Image 2026-06-25 at 9.20.11 AM.jpeg";

const storyVideos = {
  video1,
  video2,
  video3,
};

const reporterPhotos = {
  ramesh: "https://api.dicebear.com/9.x/initials/svg?seed=Ramesh%20Kumar&backgroundColor=f5e8df&fontWeight=700",
  ramPratap: "https://api.dicebear.com/9.x/initials/svg?seed=Ram%20Pratap&backgroundColor=f3f1ec&fontWeight=700",
  suresh: "https://api.dicebear.com/9.x/initials/svg?seed=Suresh%20Yadav&backgroundColor=e8f7ee&fontWeight=700",
};

function formatCount(count) {
  if (!count) {
    return "";
  }

  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(".0", "")}M`;
  }

  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(".0", "")}K`;
  }

  return String(count);
}

function ArticleCard({ index, isActive, onFollowChange, onOpenProfile, onPostDeleted, onPostUpdated, story }) {
  const { user } = useSelector((state) => state.auth);
  const videoRef = useRef(null);
  const commentCloseTimerRef = useRef(null);
  const [currentStory, setCurrentStory] = useState(story);
  const [isMuted, setIsMuted] = useState(false);
  const [commentPanelState, setCommentPanelState] = useState("closed");
  const [engagementOverride, setEngagementOverride] = useState(null);
  const [isSavingLike, setIsSavingLike] = useState(false);
  const [actionError, setActionError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    description: "",
    location: "",
    tag: "",
    title: "",
  });
  const [editStatus, setEditStatus] = useState("idle");
  const videoSrc = currentStory.videoUrl ? apiAssetUrl(currentStory.videoUrl) : storyVideos[currentStory.video];
  const imageSrc = currentStory.imageUrl ? apiAssetUrl(currentStory.imageUrl) : "";
  const reporter = currentStory.reporter || { name: "Local Reporter", username: "@local.news" };
  const [followOverride, setFollowOverride] = useState(null);
  const [isSavingFollow, setIsSavingFollow] = useState(false);
  const reporterPhoto = apiAssetUrl(reporter.avatarUrl || reporterPhotos[reporter.photo] || newsPreview);
  const timeText = currentStory.timeLabel || currentStory.time;
  const canManagePost = Boolean(user?.id && reporter.id && user.id === reporter.id);
  const SoundIcon = isMuted ? VolumeX : Volume2;
  const isFollowingReporter =
    followOverride?.reporterId === reporter.id ? followOverride.isFollowing : Boolean(reporter.isFollowing);
  const engagement =
    engagementOverride?.newsId === currentStory.id
      ? engagementOverride
      : {
          commentsCount: currentStory.commentsCount || 0,
          isLiked: Boolean(currentStory.isLiked),
          likesCount: currentStory.likesCount || 0,
          newsId: currentStory.id,
        };

  useEffect(() => {
    setCurrentStory(story);
  }, [story]);

  async function handleFollowClick() {
    if (!reporter.id || isSavingFollow) {
      return;
    }

    setIsSavingFollow(true);

    try {
      const nextStatus = isFollowingReporter ? await unfollowUser(reporter.id) : await followUser(reporter.id);
      setFollowOverride({
        isFollowing: nextStatus.isFollowing,
        reporterId: reporter.id,
      });
      onFollowChange?.();
    } finally {
      setIsSavingFollow(false);
    }
  }

  async function handleLikeClick() {
    if (!currentStory.id || isSavingLike) {
      return;
    }

    setIsSavingLike(true);
    setActionError("");

    try {
      const nextEngagement = await toggleLike(currentStory.id);
      setEngagementOverride({
        ...nextEngagement,
        newsId: currentStory.id,
      });
    } catch (error) {
      setActionError(error.message);
    } finally {
      setIsSavingLike(false);
    }
  }

  function handleCommentAdded(nextEngagement) {
    setEngagementOverride({
      ...nextEngagement,
      newsId: currentStory.id,
    });
  }

  function openEditPost() {
    setEditForm({
      description: currentStory.summary || "",
      location: currentStory.location || "",
      tag: currentStory.category || "",
      title: currentStory.title || "",
    });
    setActionError("");
    setIsMenuOpen(false);
    setIsEditOpen(true);
  }

  async function handleEditSubmit(event) {
    event.preventDefault();

    setEditStatus("saving");
    setActionError("");

    try {
      const updatedPost = await updateUploadedPost(currentStory.id, editForm);
      setCurrentStory(updatedPost);
      onPostUpdated?.(updatedPost);
      setIsEditOpen(false);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setEditStatus("idle");
    }
  }

  async function handleDeletePost() {
    const shouldDelete = window.confirm("Delete this news post?");

    if (!shouldDelete) {
      setIsMenuOpen(false);
      return;
    }

    setEditStatus("deleting");
    setActionError("");

    try {
      await deleteUploadedPost(currentStory.id);
      onPostDeleted?.(currentStory.id);
    } catch (error) {
      setActionError(error.message);
      setEditStatus("idle");
    }
  }

  function openComments() {
    if (commentCloseTimerRef.current) {
      window.clearTimeout(commentCloseTimerRef.current);
      commentCloseTimerRef.current = null;
    }

    setCommentPanelState("open");
  }

  function closeComments() {
    setCommentPanelState("closing");

    commentCloseTimerRef.current = window.setTimeout(() => {
      setCommentPanelState("closed");
      commentCloseTimerRef.current = null;
    }, 280);
  }

  useEffect(() => {
    return () => {
      if (commentCloseTimerRef.current) {
        window.clearTimeout(commentCloseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return undefined;
    }

    if (!videoSrc) {
      video.pause();
      video.currentTime = 0;
      video.removeAttribute("src");
      video.load();
      return undefined;
    }

    if (!isActive) {
      video.pause();
      video.currentTime = 0;
      video.removeAttribute("src");
      video.load();
      return undefined;
    }

    if (video.src !== videoSrc) {
      video.src = videoSrc;
    }

    video.muted = isMuted;

    const playAttempt = video.play();

    if (playAttempt) {
      playAttempt.catch(() => {
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => {});
      });
    }

    return () => {
      video.pause();
      video.currentTime = 0;
    };
  }, [isActive, isMuted, videoSrc]);

  return (
    <article
      className="article-card relative max-md:sticky max-md:top-0 max-md:min-h-[calc(100svh-148px)] max-md:snap-start"
      data-index={index}
      data-news-card
      style={{ zIndex: isActive ? 20 : index + 1 }}
    >
      <div className="article-profile">
        <img alt="" src={reporterPhoto} />
        <div
          onClick={() => reporter.id && onOpenProfile?.(reporter.id)}
          onKeyDown={(event) => {
            if ((event.key === "Enter" || event.key === " ") && reporter.id) {
              onOpenProfile?.(reporter.id);
            }
          }}
          role={reporter.id ? "button" : undefined}
          tabIndex={reporter.id ? 0 : undefined}
        >
          <strong>{reporter.name}</strong>
          <span>
            {reporter.username || reporter.area} - {currentStory.feedPriority === "following" ? "Following" : currentStory.category}
          </span>
        </div>
        {canManagePost ? (
          <div className="relative">
            <button
              aria-label="Post actions"
              className="grid h-10 w-10 place-items-center rounded-2xl bg-white/90 text-[#111827]"
              onClick={() => setIsMenuOpen((current) => !current)}
              type="button"
            >
              <MoreVertical aria-hidden="true" size={19} strokeWidth={2.5} />
            </button>
            {isMenuOpen ? (
              <div className="absolute right-0 top-11 z-50 grid w-36 overflow-hidden rounded-2xl bg-white text-sm font-extrabold text-[#111827] shadow-xl">
                <button className="flex items-center gap-2 px-3 py-3 text-left" onClick={openEditPost} type="button">
                  <Edit3 aria-hidden="true" size={15} strokeWidth={2.5} />
                  Edit
                </button>
                <button className="flex items-center gap-2 px-3 py-3 text-left text-[#c5222f]" disabled={editStatus === "deleting"} onClick={handleDeletePost} type="button">
                  <Trash2 aria-hidden="true" size={15} strokeWidth={2.5} />
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <button className="flex gap-2" disabled={isSavingFollow} onClick={handleFollowClick} type="button">
            <Plus size={18} />
            {isFollowingReporter ? "Following" : "Follow"}
          </button>
        )}
      </div>

      <div className="article-media">
        {imageSrc ? (
          <img alt="" src={imageSrc} />
        ) : (
          <video loop playsInline poster={newsPreview} preload="none" ref={videoRef} />
        )}
        <span className="short-badge">Short</span>
        {videoSrc ? (
          <button
            aria-label={isMuted ? "Enable video sound" : "Mute video sound"}
            className="sound-button"
            onClick={() => setIsMuted((current) => !current)}
            type="button"
          >
            <SoundIcon aria-hidden="true" size={18} strokeWidth={2.4} />
          </button>
        ) : null}
      </div>

      <div className="article-body">
        <div className="article-meta">
          <span>{currentStory.category}</span>
          <time>{timeText}</time>
        </div>
        <h3>{currentStory.title}</h3>
        <p>{currentStory.summary}</p>

        <div className="article-actions" aria-label="News actions">
          <button aria-label="Like" disabled={isSavingLike} onClick={handleLikeClick} type="button">
            <Heart
              aria-hidden="true"
              fill={engagement.isLiked ? "currentColor" : "none"}
              size={20}
              strokeWidth={2.3}
            />
            <span>Like</span>
            {engagement.likesCount ? (
              <strong className="ml-0.5 rounded-full bg-white px-1.5 text-[11px] font-black text-[#111827]">
                {formatCount(engagement.likesCount)}
              </strong>
            ) : null}
          </button>
          <button aria-label="Comment" onClick={openComments} type="button">
            <MessageCircle aria-hidden="true" size={20} strokeWidth={2.3} />
            <span>Comment</span>
            {engagement.commentsCount ? (
              <strong className="ml-0.5 rounded-full bg-white px-1.5 text-[11px] font-black text-[#111827]">
                {formatCount(engagement.commentsCount)}
              </strong>
            ) : null}
          </button>
          <button aria-label="Share on WhatsApp" className="whatsapp-action" type="button">
            <Send aria-hidden="true" size={20} strokeWidth={2.3} />
            <span>WhatsApp</span>
          </button>
          <button aria-label="Share" type="button">
            <Share2 aria-hidden="true" size={20} strokeWidth={2.3} />
          </button>
        </div>
        {actionError ? <p className="mt-2 text-xs font-bold text-[#c5222f]">{actionError}</p> : null}
        {commentPanelState !== "closed" ? (
          <CommentPanel
            isOpen={commentPanelState === "open"}
            commentsCount={engagement.commentsCount}
            newsId={currentStory.id}
            onClose={closeComments}
            onCommentAdded={handleCommentAdded}
            onOpenProfile={onOpenProfile}
          />
        ) : null}
      </div>
      {isEditOpen ? (
        <section className="absolute inset-0 z-[90] grid place-items-center bg-black/45 p-4" aria-label="Edit news post">
          <form className="w-full max-w-sm rounded-[28px] bg-white p-4 shadow-2xl" onSubmit={handleEditSubmit}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-[#111827]">Edit news post</h2>
              <button
                aria-label="Close edit post"
                className="grid h-10 w-10 place-items-center rounded-2xl bg-[#f3f1ec] text-[#111827]"
                onClick={() => setIsEditOpen(false)}
                type="button"
              >
                <X aria-hidden="true" size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <input
                className="min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold outline-none focus:border-[#c5222f]"
                onChange={(event) => setEditForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Title"
                value={editForm.title}
              />
              <textarea
                className="min-h-28 resize-none rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 py-2 text-sm font-bold outline-none focus:border-[#c5222f]"
                onChange={(event) => setEditForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Description"
                value={editForm.description}
              />
              <input
                className="min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold outline-none focus:border-[#c5222f]"
                onChange={(event) => setEditForm((current) => ({ ...current, tag: event.target.value }))}
                placeholder="Category / tag"
                value={editForm.tag}
              />
              <input
                className="min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold outline-none focus:border-[#c5222f]"
                onChange={(event) => setEditForm((current) => ({ ...current, location: event.target.value }))}
                placeholder="Location"
                value={editForm.location}
              />
            </div>

            <button
              className="mt-4 min-h-12 w-full rounded-2xl bg-[#c5222f] px-4 text-sm font-black text-white disabled:bg-[#d8d2c8]"
              disabled={editStatus === "saving"}
              type="submit"
            >
              {editStatus === "saving" ? "Saving..." : "Save post"}
            </button>
          </form>
        </section>
      ) : null}
    </article>
  );
}

export default ArticleCard;
