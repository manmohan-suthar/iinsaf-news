import { useCallback, useEffect, useRef, useState } from "react";
import { latestStories } from "../data/homePageContent";
import ArticleCard from "./ArticleCard";

function LatestNews() {
  const listRef = useRef(null);
  const frameRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
  }, []);

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

  return (
    <section className="latest-section" aria-labelledby="latest-heading">
      <div
        className="article-list max-md:h-[calc(100svh-148px)] max-md:gap-0 max-md:overflow-y-auto max-md:snap-y max-md:snap-mandatory"
        ref={listRef}
      >
        {latestStories.map((story, index) => (
          <ArticleCard index={index} isActive={activeIndex === index} key={story.title} story={story} />
        ))}
      </div>
    </section>
  );
}

export default LatestNews;
