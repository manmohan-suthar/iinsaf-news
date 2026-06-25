import { Bell, MapPin, Search } from "lucide-react";

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="IINSAF News home">
        <img
          src="https://www.iinsaf.com/assets/icon.jpg"
          alt="logo"
          srcset=""
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
          className="icon-button"
          type="button"
        >
          <Bell aria-hidden="true" size={21} strokeWidth={2.4} />
        </button>
      </div>
    </header>
  );
}

export default Header;
