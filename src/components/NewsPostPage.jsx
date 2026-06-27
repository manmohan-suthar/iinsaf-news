import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchJson } from "../store/apiClient";
import ArticleCard from "./ArticleCard";

function NewsPostPage({ newsId, onBack, onLoginRequired, onOpenProfile }) {
  const [story, setStory] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!newsId) {
      return undefined;
    }

    let isActive = true;
    setStatus("loading");
    setError("");

    fetchJson(`/api/news/post/${newsId}`)
      .then((data) => {
        if (!isActive) {
          return;
        }

        setStory(data);
        setStatus("succeeded");
      })
      .catch((requestError) => {
        if (!isActive) {
          return;
        }

        setError(requestError.message);
        setStatus("failed");
      });

    return () => {
      isActive = false;
    };
  }, [newsId]);

  return (
    <section className="space-y-3 pb-4" aria-label="News post">
      <button
        className="inline-flex min-h-10 items-center gap-2 rounded-2xl bg-white px-3 text-sm font-extrabold text-[#111827]"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft aria-hidden="true" size={18} strokeWidth={2.5} />
        Back
      </button>

      {status === "loading" ? (
        <section className="rounded-[22px] bg-white p-5 text-sm font-bold text-[#667085]">Loading news post...</section>
      ) : null}

      {status === "failed" ? (
        <section className="rounded-[22px] bg-white p-5 text-sm font-bold text-[#c5222f]">
          {error || "Unable to open news post"}
        </section>
      ) : null}

      {story ? (
        <ArticleCard
          index={0}
          isActive
          onLoginRequired={onLoginRequired}
          onOpenProfile={onOpenProfile}
          onPostDeleted={onBack}
          onPostUpdated={setStory}
          story={story}
        />
      ) : null}
    </section>
  );
}

export default NewsPostPage;
