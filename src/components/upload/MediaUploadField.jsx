import { ImagePlus, Upload, Video, X } from "lucide-react";

function MediaUploadField({ fileInputRef, mediaItems, onChange, onRemove }) {
  return (
    <div>
      <input
        accept="image/*,video/*"
        className="sr-only"
        multiple
        onChange={onChange}
        ref={fileInputRef}
        type="file"
      />

      {mediaItems.length ? (
        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-[#111827]">Selected media</p>
              <p className="text-xs font-bold text-[#667085]">{mediaItems.length} file selected</p>
            </div>
            <button
              className="min-h-10 rounded-full bg-[#f5e8df] px-4 text-sm font-extrabold text-[#c5222f]"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              Add more
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {mediaItems.map((item, index) => {
              const isVideo = item.file.type.startsWith("video/");

              return (
                <article
                  className={
                    index === 0
                      ? "col-span-2 overflow-hidden rounded-3xl border border-[#dedbd2] bg-[#111827] sm:col-span-2"
                      : "overflow-hidden rounded-3xl border border-[#dedbd2] bg-[#111827]"
                  }
                  key={item.id}
                >
                  <div className={index === 0 ? "relative aspect-[16/10]" : "relative aspect-square"}>
                    {isVideo ? (
                      <video className="h-full w-full object-contain" controls playsInline src={item.previewUrl} />
                    ) : (
                      <img alt="News media preview" className="h-full w-full object-cover" src={item.previewUrl} />
                    )}
                    <button
                      aria-label={`Remove media ${index + 1}`}
                      className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white text-[#111827] shadow-lg"
                      onClick={() => onRemove(item.id)}
                      type="button"
                    >
                      <X aria-hidden="true" size={17} strokeWidth={2.5} />
                    </button>
                    <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-extrabold text-white">
                      {isVideo ? <Video aria-hidden="true" size={13} /> : <ImagePlus aria-hidden="true" size={13} />}
                      {isVideo ? "Video" : "Photo"}
                    </span>
                  </div>
                  <div className="px-3 py-2">
                    <p className="truncate text-xs font-bold text-white">{item.file.name}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          className="grid min-h-[220px] w-full place-items-center rounded-3xl border-2 border-dashed border-[#dedbd2] bg-[#fbfbf8] px-5 text-center"
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          <span>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#f5e8df] text-[#c5222f]">
              <Upload aria-hidden="true" size={25} strokeWidth={2.5} />
            </span>
            <span className="mt-3 block text-base font-black text-[#111827]">Photo or video upload</span>
            <span className="mt-1 block text-sm font-bold text-[#667085]">Tap to select multiple photos or videos</span>
          </span>
        </button>
      )}
    </div>
  );
}

export default MediaUploadField;
