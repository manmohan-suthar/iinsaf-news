import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews } from "../store/newsSlice";
import ArticleCard from "./ArticleCard";

function LatestNews({ onLoginRequired, onOpenProfile }) {
  const dispatch = useDispatch();
  const { error, items: latestStories, status } = useSelector((state) => state.news);
  const listRef = useRef(null);
  const frameRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNews());
    }
  }, [dispatch, status]);

  const updateActiveCard = useCallback(() => {
    const list = listRef.current;

    if (!list) {
      return;
    }

    const firstCard = list.querySelector("[data-news-card]");
    const cardHeight = firstCard?.offsetHeight || list.clientHeight;
    const nextActive = Math.min(
      latestStories.length - 1,
      Math.max(0, Math.round(list.scrollTop / Math.max(1, cardHeight))),
    );

    setActiveIndex(nextActive);
  }, [latestStories.length]);

  useEffect(() => {
    const list = listRef.current;

    if (!list) {
      return undefined;
    }

    updateActiveCard();
    const handleScroll = () => {
      if (frameRef.current) {
        return;
      }

      frameRef.current = requestAnimationFrame(() => {
        updateActiveCard();
        frameRef.current = null;
      });
    };

    list.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateActiveCard);

    return () => {
      list.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateActiveCard);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [updateActiveCard]);

  if (status === "loading") {
    return <section className="latest-section rounded-3xl bg-white p-4 text-sm font-bold text-[#667085]">Loading news...</section>;
  }

  if (status === "failed") {
    return <section className="latest-section rounded-3xl bg-white p-4 text-sm font-bold text-[#c5222f]">{error}</section>;
  }

  return (
    <section className="latest-section" aria-labelledby="latest-heading">
      <div
        className="article-list max-md:h-[calc(100svh-148px)] max-md:gap-0 max-md:overflow-y-auto max-md:snap-y max-md:snap-mandatory"
        ref={listRef}
      >
        {latestStories.map((story, index) => (
          <ArticleCard
            index={index}
            isActive={activeIndex === index}
            key={story.id || story.title}
            onLoginRequired={onLoginRequired}
            onFollowChange={() => dispatch(fetchNews())}
            onOpenProfile={onOpenProfile}
            onPostDeleted={() => dispatch(fetchNews())}
            onPostUpdated={() => dispatch(fetchNews())}
            story={story}
          />
        ))}
      </div>
    </section>
  );
}

export default LatestNews;
