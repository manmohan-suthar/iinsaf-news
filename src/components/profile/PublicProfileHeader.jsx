import { useMemo, useState } from "react";
import { ArrowLeft, MapPin, MessageCircle, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { followUser, unfollowUser } from "../../store/followApi";
import { apiAssetUrl } from "../../store/apiClient";

function PublicProfileHeader({ follow, onBack, onLoginRequired, profile, totalPosts }) {
  const { user } = useSelector((state) => state.auth);
  const [followOverride, setFollowOverride] = useState(null);
  const [isSavingFollow, setIsSavingFollow] = useState(false);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState("");
  const initials = useMemo(() => {
    return (profile?.name || profile?.username || "User")
      .replace(/^@/, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [profile?.name, profile?.username]);

  const avatarUrl = apiAssetUrl(profile?.avatarUrl || "");
  const followState =
    followOverride?.profileId === profile.id
      ? followOverride
      : follow || {
          followersCount: 0,
          followingCount: 0,
          isFollowing: false,
        };
  const profileLocation =
    profile.location ||
    [
      profile.locality,
      profile.city,
      profile.district,
      profile.state,
      profile.pincode,
    ]
      .filter(Boolean)
      .join(", ") ||
    "";
  const whatsappText = encodeURIComponent(
    `Check ${profile.name}'s news profile on IINSAF News`,
  );
  const stats = [
    { label: "Posts", value: totalPosts },
    { label: "Followers", value: followState.followersCount || 0 },
    { label: "Following", value: followState.followingCount || 0 },
  ];

  async function handleFollowClick() {
    if (isSavingFollow) {
      return;
    }

    if (!user) {
      onLoginRequired?.();
      return;
    }

    setIsSavingFollow(true);

    try {
      const nextFollowState = followState.isFollowing ? await unfollowUser(profile.id) : await followUser(profile.id);
      setFollowOverride({
        ...nextFollowState,
        profileId: profile.id,
      });
    } finally {
      setIsSavingFollow(false);
    }
  }

  return (
    <section className="rounded-[28px] bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          aria-label="Back"
          className="grid h-10 w-10 place-items-center rounded-2xl bg-[#f3f1ec] text-[#111827]"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft aria-hidden="true" size={19} strokeWidth={2.5} />
        </button>
        <span className="rounded-full bg-[#f5e8df] px-3 py-1 text-xs font-extrabold text-[#c5222f]">
          {profile.username}
        </span>
      </div>

      <div className="flex items-start gap-4">
        {avatarUrl && failedAvatarUrl !== avatarUrl ? (
          <img
            alt={
              profile.name ? `${profile.name} profile photo` : "Profile photo"
            }
            className="h-20 w-20 shrink-0 rounded-3xl bg-[#f3f1ec] object-cover"
            onError={() => setFailedAvatarUrl(avatarUrl)}
            referrerPolicy="no-referrer"
            src={avatarUrl}
          />
        ) : (
          <div
            aria-label={
              profile.name ? `${profile.name} profile photo` : "Profile photo"
            }
            className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-[#f3f1ec] text-xl font-black text-[#111827]"
            role="img"
          >
            {initials || "U"}
          </div>
        )}

        <div className="min-w-0 flex-1 pt-1">
          <h1 className="truncate text-xl font-extrabold text-[#111827]">
            {profile.name}
          </h1>
          <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-[#344054]">
            {profile.bio || "Local news uploader"}
          </p>
          {profileLocation ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs font-bold leading-5 text-[#667085]">
              <MapPin aria-hidden="true" size={13} strokeWidth={2.5} />
              <span>{profileLocation}</span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {stats.map((stat) => (
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

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          className={
            followState.isFollowing
              ? "flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#f3f1ec] px-4 text-sm font-extrabold text-[#111827]"
              : "flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#111827] px-4 text-sm font-extrabold text-white"
          }
          disabled={isSavingFollow}
          onClick={handleFollowClick}
          type="button"
        >
          <Plus aria-hidden="true" size={18} strokeWidth={2.5} />
          {followState.isFollowing ? "Following" : "Follow"}
        </button>
        <a
          className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#25d366] px-4 text-sm font-extrabold text-white"
          href={`https://wa.me/?text=${whatsappText}`}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle aria-hidden="true" size={18} strokeWidth={2.5} />
          WhatsApp
        </a>
      </div>
    </section>
  );
}

export default PublicProfileHeader;
