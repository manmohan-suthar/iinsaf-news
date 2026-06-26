import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Camera, CheckCircle2, Edit3, LogOut, MapPin, X } from "lucide-react";
import { fetchCurrentUser, logoutUser, updateUserProfile } from "../../store/authSlice";
import { apiAssetUrl, fetchJson } from "../../store/apiClient";

function ProfileHeader() {
  const dispatch = useDispatch();
  const { user: profile, status } = useSelector((state) => state.auth);
  const uploadedPostCount = useSelector((state) => state.userUploads.total);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [formError, setFormError] = useState("");
  const avatarUrl =
    profile?.avatarUrl ||
    profile?.photoURL ||
    profile?.picture ||
    profile?.image ||
    "";
  const displayAvatarUrl = apiAssetUrl(avatarPreview || avatarUrl);
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

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (!isEditing || !form?.username) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const query = encodeURIComponent(form.username);
      setUsernameStatus("checking");

      fetchJson(`/api/auth/username/check?username=${query}`)
        .then((result) => {
          setForm((current) => (current ? { ...current, username: result.username || current.username } : current));
          setUsernameStatus(result.available ? "available" : "taken");
        })
        .catch(() => setUsernameStatus("error"));
    }, 350);

    return () => window.clearTimeout(timer);
  }, [form?.username, isEditing]);

  if (!profile) {
    return (
      <section className="rounded-[28px] bg-white p-4 text-sm font-bold text-[#667085]">
        Loading profile...
      </section>
    );
  }

  const stats = [
    { label: "Posts", value: uploadedPostCount ?? profile.posts },
    { label: "Followers", value: profile.followers },
    { label: "Following", value: profile.following },
  ];
  const profileLocation =
    profile.location ||
    [profile.locality, profile.city, profile.district, profile.state]
      .filter(Boolean)
      .join(", ") ||
    "";

  function openEditor() {
    setForm({
      bio: profile.bio || "",
      city: profile.city || "",
      district: profile.district || "",
      locality: profile.locality || "",
      location: profile.location || "",
      name: profile.name || "",
      pincode: profile.pincode || "",
      state: profile.state || "",
      username: profile.username || "",
    });
    setAvatarFile(null);
    setAvatarPreview("");
    setFormError("");
    setUsernameStatus("idle");
    setSaveStatus("idle");
    setIsEditing(true);
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleProfileSave(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setFormError("Name is required");
      return;
    }

    if (usernameStatus === "taken") {
      setFormError("Username already exists");
      return;
    }

    setSaveStatus("saving");
    setFormError("");

    try {
      const manualLocation = [form.locality, form.city, form.district, form.state].filter(Boolean).join(", ");

      await dispatch(
        updateUserProfile({
          ...form,
          avatar: avatarFile,
          location: form.location.trim() || `${manualLocation}${form.pincode ? ` ${form.pincode}` : ""}`.trim(),
        }),
      ).unwrap();

      setIsEditing(false);
      setSaveStatus("idle");
    } catch (error) {
      setFormError(error.message || "Unable to save profile");
      setSaveStatus("idle");
    }
  }

  return (
    <section className="rounded-[28px] bg-white p-4">
      <div className="flex items-start gap-4">
        {displayAvatarUrl && failedAvatarUrl !== displayAvatarUrl ? (
          <img
            alt={
              profile.name ? `${profile.name} profile photo` : "Profile photo"
            }
            className="h-20 w-20 shrink-0 rounded-3xl bg-[#f3f1ec] object-cover"
            decoding="async"
            loading="eager"
            onError={() => setFailedAvatarUrl(displayAvatarUrl)}
            referrerPolicy="no-referrer"
            src={displayAvatarUrl}
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
          <p className="mt-0.5 text-sm font-bold text-[#667085]">
            {profile.username}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold leading-6 text-[#344054]">
        {profile.bio || "नया लोकल न्यूज़ यूजर"}
      </p>

      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-[#667085]">
        <MapPin aria-hidden="true" size={15} strokeWidth={2.4} />
        <span>
          {profileLocation ? `${profileLocation}` : "लोकेशन अभी सेव नहीं है"}
        </span>
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

      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
        <button
          className="min-h-11 rounded-2xl bg-[#111827] px-4 text-sm font-extrabold text-white"
          onClick={openEditor}
          type="button"
        >
          Edit profile
        </button>
        <button
          aria-label="Edit profile"
          className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f3f1ec] text-[#111827]"
          onClick={openEditor}
          type="button"
        >
          <Edit3 aria-hidden="true" size={18} strokeWidth={2.4} />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
        <button
          className="min-h-11 rounded-2xl bg-[#f3f1ec] px-4 text-sm font-extrabold text-[#111827]"
          onClick={() => dispatch(logoutUser())}
          type="button"
        >
          Logout
        </button>
        <button
          aria-label="Logout"
          className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f3f1ec] text-[#111827]"
          onClick={() => dispatch(logoutUser())}
          type="button"
        >
          <LogOut aria-hidden="true" size={18} strokeWidth={2.4} />
        </button>
      </div>

      {isEditing && form ? (
        <section className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-black/45 px-3 py-5" aria-label="Edit profile">
          <form className="w-full max-w-md rounded-[28px] bg-white p-4 shadow-2xl" onSubmit={handleProfileSave}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-[#111827]">Edit profile</h2>
              <button
                aria-label="Close edit profile"
                className="grid h-10 w-10 place-items-center rounded-2xl bg-[#f3f1ec] text-[#111827]"
                onClick={() => setIsEditing(false)}
                type="button"
              >
                <X aria-hidden="true" size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <img
                alt=""
                className="h-20 w-20 rounded-3xl bg-[#f3f1ec] object-cover"
                src={displayAvatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(form.name || "User")}`}
              />
              <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-2xl bg-[#111827] px-4 text-sm font-extrabold text-white">
                <Camera aria-hidden="true" size={17} strokeWidth={2.4} />
                Change photo
                <input accept="image/*" className="sr-only" onChange={handleAvatarChange} type="file" />
              </label>
            </div>

            <div className="mt-4 grid gap-3">
              <label className="grid gap-1.5">
                <span className="text-xs font-black uppercase text-[#667085]">Name</span>
                <input className="min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold outline-none focus:border-[#c5222f]" onChange={(event) => updateField("name", event.target.value)} value={form.name} />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-black uppercase text-[#667085]">Username</span>
                <input className="min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold outline-none focus:border-[#c5222f]" onChange={(event) => updateField("username", event.target.value)} value={form.username} />
                {usernameStatus === "checking" ? <span className="text-xs font-bold text-[#667085]">Checking username...</span> : null}
                {usernameStatus === "available" ? (
                  <span className="inline-flex items-center gap-1 text-xs font-black text-[#128c4a]"><CheckCircle2 size={13} /> Username available</span>
                ) : null}
                {usernameStatus === "taken" ? <span className="text-xs font-black text-[#c5222f]">Username already exists</span> : null}
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-black uppercase text-[#667085]">Bio</span>
                <textarea className="min-h-24 resize-none rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 py-2 text-sm font-bold outline-none focus:border-[#c5222f]" maxLength={180} onChange={(event) => updateField("bio", event.target.value)} value={form.bio} />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-black uppercase text-[#667085]">Full location</span>
                <input className="min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold outline-none focus:border-[#c5222f]" onChange={(event) => updateField("location", event.target.value)} value={form.location} />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <input className="min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold outline-none focus:border-[#c5222f]" onChange={(event) => updateField("locality", event.target.value)} placeholder="Locality" value={form.locality} />
                <input className="min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold outline-none focus:border-[#c5222f]" onChange={(event) => updateField("city", event.target.value)} placeholder="City" value={form.city} />
                <input className="min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold outline-none focus:border-[#c5222f]" onChange={(event) => updateField("district", event.target.value)} placeholder="District" value={form.district} />
                <input className="min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold outline-none focus:border-[#c5222f]" onChange={(event) => updateField("pincode", event.target.value)} placeholder="Pincode" value={form.pincode} />
                <input className="col-span-2 min-h-11 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-3 text-sm font-bold outline-none focus:border-[#c5222f]" onChange={(event) => updateField("state", event.target.value)} placeholder="State" value={form.state} />
              </div>
            </div>

            {formError ? <p className="mt-3 text-sm font-bold text-[#c5222f]">{formError}</p> : null}

            <button
              className="mt-4 min-h-12 w-full rounded-2xl bg-[#c5222f] px-4 text-sm font-black text-white disabled:bg-[#d8d2c8]"
              disabled={saveStatus === "saving" || usernameStatus === "taken" || usernameStatus === "checking"}
              type="submit"
            >
              {saveStatus === "saving" ? "Saving..." : "Save profile"}
            </button>
          </form>
        </section>
      ) : null}
    </section>
  );
}

export default ProfileHeader;
