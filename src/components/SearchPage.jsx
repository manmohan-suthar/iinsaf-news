import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bot, Flame, MapPin, Mic2, Search, ShieldAlert, Trophy, Tv } from "lucide-react";
import { apiAssetUrl } from "../store/apiClient";
import { fetchCategories } from "../store/categorySlice";
import { fetchNews } from "../store/newsSlice";
import { fetchReporters } from "../store/reporterSlice";
import TopicFilters from "./TopicFilters";

const categoryIcons = {
  local: MapPin,
  trending: Flame,
  "ai-tech": Bot,
  war: ShieldAlert,
  sports: Trophy,
  video: Tv,
};

function SearchPage({ onOpenProfile }) {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.items);
  const categoriesStatus = useSelector((state) => state.categories.status);
  const news = useSelector((state) => state.news.items);
  const newsStatus = useSelector((state) => state.news.status);
  const reporters = useSelector((state) => state.reporters.items);
  const reportersStatus = useSelector((state) => state.reporters.status);

  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
    if (newsStatus === "idle") {
      dispatch(fetchNews());
    }
    if (reportersStatus === "idle") {
      dispatch(fetchReporters());
    }
  }, [categoriesStatus, dispatch, newsStatus, reportersStatus]);

  return (
    <section className="search-page space-y-5 pb-4" aria-label="Search news page">
      <div className="rounded-2xl border border-[#dedbd2] bg-white p-3">
        <label className="flex min-h-12 items-center gap-3 rounded-xl bg-[#f3f1ec] px-4 text-[#667085]">
          <Search aria-hidden="true" size={20} strokeWidth={2.4} />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#667085]"
            placeholder="अपना शहर, खबर या रिपोर्टर खोजें"
            type="search"
          />
          <Mic2 aria-hidden="true" size={19} strokeWidth={2.4} />
        </label>
      </div>

      <TopicFilters />

      <section aria-labelledby="category-heading">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-lg font-extrabold text-[#111827]" id="category-heading">
            कैटेगरी
          </h2>
          <button className="text-sm font-bold text-[#c5222f]" type="button">
            सभी देखें
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug] || Flame;

            return (
              <button
                className="flex items-center gap-3 rounded-2xl border border-[#dedbd2] bg-white p-3 text-left"
                key={category.id}
                type="button"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f5e8df] text-[#c5222f]">
                  <Icon aria-hidden="true" size={21} strokeWidth={2.4} />
                </span>
                <span className="min-w-0">
                  <strong className="block truncate text-sm text-[#111827]">{category.label}</strong>
                  <small className="block truncate text-xs font-bold text-[#667085]">{category.count} खबरें</small>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="trending-video-heading">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-lg font-extrabold text-[#111827]" id="trending-video-heading">
            ट्रेंडिंग वीडियो
          </h2>
          <button className="text-sm font-bold text-[#c5222f]" type="button">
            और देखें
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {news.map((story) => (
            <article className="w-[72vw] max-w-[270px] flex-none overflow-hidden rounded-2xl bg-white" key={story.id}>
              <div className="relative aspect-[16/10] bg-[#111827]">
                <video autoPlay loop muted playsInline preload="metadata" className="h-full w-full object-contain">
                  <source src={apiAssetUrl(story.videoUrl)} type="video/mp4" />
                </video>
                <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-extrabold text-white">
                  Video
                </span>
              </div>
              <h3 className="p-3 text-sm font-extrabold leading-snug text-[#111827]">{story.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="reporter-heading">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-lg font-extrabold text-[#111827]" id="reporter-heading">
            आपके इलाके के पॉपुलर रिपोर्टर
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {reportersStatus === "loading" && !reporters.length ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div className="min-w-0 rounded-2xl bg-white p-3 text-center" key={index}>
                <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-[#f3f1ec]" />
                <div className="mx-auto mt-2 h-3 w-20 animate-pulse rounded-full bg-[#f3f1ec]" />
              </div>
            ))
          ) : reporters.map((reporter) => (
            <button
              className="min-w-0 rounded-2xl bg-white p-3 text-center"
              key={reporter.id}
              onClick={() => onOpenProfile?.(reporter.id)}
              type="button"
            >
              <img
                alt=""
                className="mx-auto h-16 w-16 rounded-full border-2 border-[#f5e8df] object-cover"
                src={apiAssetUrl(reporter.avatarUrl)}
              />
              <h3 className="mt-2 truncate text-xs font-extrabold text-[#111827]">{reporter.name}</h3>
              <p className="truncate text-[11px] font-bold text-[#667085]">{reporter.username}</p>
              <p className="mt-1 truncate text-[10px] font-bold text-[#8a7f76]">{reporter.area}</p>
              <p className="mt-1 text-[10px] font-black text-[#c5222f]">
                {reporter.postsCount || 0} posts · {reporter.followersCount || 0} followers
              </p>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

export default SearchPage;
