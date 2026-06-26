function UploadProgress({ progress, status }) {
  if (status !== "uploading") {
    return null;
  }

  return (
    <div className="grid gap-2 rounded-2xl bg-[#f3f1ec] px-4 py-3">
      <div className="flex items-center justify-between gap-3 text-sm font-extrabold text-[#111827]">
        <span>Uploading news</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-[#c5222f] transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export default UploadProgress;
