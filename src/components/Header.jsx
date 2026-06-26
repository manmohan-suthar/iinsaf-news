import { Bell, MapPin, Search } from "lucide-react";

function Header({ activeView, onChange, unreadCount = 0 }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="IINSAF News home">
        <img
          src="https://www.iinsaf.com/assets/icon.jpg"
          alt="logo"
          srcSet=""
          className="h-10 w-10 rounded-full object-cover"
        />
        <span>
          <small>
            <MapPin aria-hidden="true" size={13} strokeWidth={2.4} />
            Hisar, Haryana 125001
          </small>
        </span>
      </a>

      <div className="header-actions" aria-label="Header actions">
        <button
          aria-label="Search local news"
          className="icon-button"
          type="button"
        >
          <Search aria-hidden="true" size={21} strokeWidth={2.4} />
        </button>
        <button
          aria-label="Change location"
          className="icon-button"
          type="button"
        >
          <MapPin aria-hidden="true" size={21} strokeWidth={2.4} />
        </button>
        <button
          aria-label="Notifications"
          className={activeView === "notification" ? "icon-button is-active relative" : "icon-button relative"}
          onClick={() => onChange?.("notification")}
          type="button"
        >
          <Bell aria-hidden="true" size={21} strokeWidth={2.4} />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#c5222f] px-1 text-[11px] font-black text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </button>
      </div>
    </header>
  );
}

export default Header;
