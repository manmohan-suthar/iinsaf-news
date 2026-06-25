import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Plus, Send, Share2, Volume2, VolumeX } from "lucide-react";
import video1 from "../assets/videos/video1.mp4";
import video2 from "../assets/videos/video2.mp4";
import video3 from "../assets/videos/video3.mp4";
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

function ArticleCard({ index, isActive, story }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const videoSrc = storyVideos[story.video];
  const reporter = story.reporter || { name: "Local Reporter", username: "@local.news" };
  const reporterPhoto = reporterPhotos[reporter.photo] || newsPreview;
  const SoundIcon = isMuted ? VolumeX : Volume2;

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
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
      className="article-card max-md:sticky max-md:top-0 max-md:min-h-[calc(100svh-148px)] max-md:snap-start"
      data-index={index}
      data-news-card
      style={{ zIndex: isActive ? 20 : index + 1 }}
    >
      <div className="article-profile">
        <img alt="" src={reporterPhoto} />
        <div>
          <strong>{reporter.name}</strong>
          <span>
            {reporter.username} - {story.category}
          </span>
        </div>
        <button className="flex gap-2" type="button">
          <Plus size={18} />
          Follow
        </button>
      </div>

      <div className="article-media">
        <video loop playsInline poster={newsPreview} preload="none" ref={videoRef} />
        <span className="short-badge">Short</span>
        <button
          aria-label={isMuted ? "Enable video sound" : "Mute video sound"}
          className="sound-button"
          onClick={() => setIsMuted((current) => !current)}
          type="button"
        >
          <SoundIcon aria-hidden="true" size={18} strokeWidth={2.4} />
        </button>
      </div>

      <div className="article-body">
        <div className="article-meta">
          <span>{story.category}</span>
          <time>{story.time}</time>
        </div>
        <h3>{story.title}</h3>
        <p>{story.summary}</p>

        <div className="article-actions" aria-label="News actions">
          <button aria-label="Like" type="button">
            <Heart aria-hidden="true" size={20} strokeWidth={2.3} />
            <span>Like</span>
          </button>
          <button aria-label="Comment" type="button">
            <MessageCircle aria-hidden="true" size={20} strokeWidth={2.3} />
            <span>Comment</span>
          </button>
          <button aria-label="Share on WhatsApp" className="whatsapp-action" type="button">
            <Send aria-hidden="true" size={20} strokeWidth={2.3} />
            <span>WhatsApp</span>
          </button>
          <button aria-label="Share" type="button">
            <Share2 aria-hidden="true" size={20} strokeWidth={2.3} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;
