import { Bot, Flame, MapPin, Mic2, Search, ShieldAlert, Trophy, Tv } from "lucide-react";
import video1 from "../assets/videos/video1.mp4";
import video2 from "../assets/videos/video2.mp4";
import video3 from "../assets/videos/video3.mp4";
import TopicFilters from "./TopicFilters";

const categories = [
  { label: "लोकल", count: "128 खबरें", icon: MapPin },
  { label: "ट्रेंडिंग", count: "84 अपडेट", icon: Flame },
  { label: "AI टेक", count: "32 खबरें", icon: Bot },
  { label: "वार", count: "19 अपडेट", icon: ShieldAlert },
  { label: "स्पोर्ट्स", count: "51 खबरें", icon: Trophy },
  { label: "वीडियो", count: "76 शॉर्ट्स", icon: Tv },
];

const trendingVideos = [
  {
    title: "शहर के मुख्य बाजार में नई ट्रैफिक व्यवस्था लागू",
    video: video1,
  },
  {
    title: "एआई नियमों पर सरकार की नई गाइडलाइन जारी",
    video: video2,
  },
  {
    title: "स्थानीय अस्पताल में गर्मी से बचाव की तैयारी तेज",
    video: video3,
  },
];

const reporters = [
  {
    name: "Ramesh Kumar",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Ram Pratap",
    photo: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    name: "Suresh Yadav",
    photo: "https://randomuser.me/api/portraits/men/54.jpg",
  },
  {
    name: "Neha Sharma",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

function SearchPage() {
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
          {categories.map(({ count, icon: Icon, label }) => (
            <button
              className="flex items-center gap-3 rounded-2xl border border-[#dedbd2] bg-white p-3 text-left"
              key={label}
              type="button"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f5e8df] text-[#c5222f]">
                <Icon aria-hidden="true" size={21} strokeWidth={2.4} />
              </span>
              <span className="min-w-0">
                <strong className="block truncate text-sm text-[#111827]">{label}</strong>
                <small className="block truncate text-xs font-bold text-[#667085]">{count}</small>
              </span>
            </button>
          ))}
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
          {trendingVideos.map(({ title, video }) => (
            <article className="w-[72vw] max-w-[270px] flex-none overflow-hidden rounded-2xl bg-white" key={title}>
              <div className="relative aspect-[16/10] bg-[#111827]">
                <video autoPlay loop muted playsInline preload="metadata" className="h-full w-full object-contain">
                  <source src={video} type="video/mp4" />
                </video>
                <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-extrabold text-white">
                  Video
                </span>
              </div>
              <h3 className="p-3 text-sm font-extrabold leading-snug text-[#111827]">{title}</h3>
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

        <div className="grid grid-cols-4 gap-3">
          {reporters.map(({ name, photo }) => (
            <article className="min-w-0 p-2.5 text-center" key={name}>
              <img
                alt=""
                className="mx-auto h-16 w-16 rounded-full border-2 border-[#f5e8df] object-cover"
                src={photo}
              />
              <h3 className="mt-2 truncate text-xs font-extrabold text-[#111827]">{name}</h3>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default SearchPage;
