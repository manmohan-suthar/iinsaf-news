import { Bell, MapPin } from "lucide-react";
import { profile } from "./profileData";

function ProfileHeader() {
  return (
    <section className="rounded-[28px] bg-white p-4">
      <div className="flex items-start gap-4">
        <img
          alt=""
          className="h-20 w-20 shrink-0 rounded-3xl object-cover"
          src={profile.avatar}
        />

        <div className="min-w-0 flex-1 pt-1">
          <h1 className="truncate text-xl font-extrabold text-[#111827]">
            {profile.name}
          </h1>
          <p className="mt-0.5 text-sm font-bold text-[#667085]">
            {profile.username}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold leading-6 text-[#344054]">
        {profile.bio}
      </p>

      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-[#667085]">
        <MapPin aria-hidden="true" size={15} strokeWidth={2.4} />
        <span>India local news network</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {profile.stats.map((stat) => (
          <div className="rounded-2xl px-2.5 py-3 text-center" key={stat.label}>
            <strong className="block text-lg font-black leading-none text-[#111827]">
              {stat.value}
            </strong>
            <span className="mt-1 block text-[10px] font-extrabold uppercase tracking-wide text-[#8a7f76]">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
        <button
          className="min-h-11 rounded-2xl bg-[#111827] px-4 text-sm font-extrabold text-white"
          type="button"
        >
          Follow
        </button>
        <button
          aria-label="Profile notifications"
          className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f3f1ec] text-[#111827]"
          type="button"
        >
          <Bell aria-hidden="true" size={18} strokeWidth={2.4} />
        </button>
      </div>
    </section>
  );
}

export default ProfileHeader;
