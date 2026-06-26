import { MapPin } from "lucide-react";

function NewsTextFields({
  description,
  descriptionWords,
  location,
  maxDescriptionWords,
  onDescriptionChange,
  onLocationChange,
  onTitleChange,
  title,
}) {
  return (
    <>
      <label className="grid gap-2">
        <span className="text-sm font-extrabold text-[#111827]">Title</span>
        <input
          className="min-h-12 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-4 text-sm font-bold text-[#111827] outline-none focus:border-[#c5222f]"
          maxLength={90}
          onChange={onTitleChange}
          placeholder="Short news title"
          type="text"
          value={title}
        />
      </label>

      <label className="grid gap-2">
        <span className="flex items-center justify-between gap-3 text-sm font-extrabold text-[#111827]">
          <span>Description</span>
          <span className={descriptionWords >= maxDescriptionWords ? "text-[#c5222f]" : "text-[#667085]"}>
            {descriptionWords}/{maxDescriptionWords} words
          </span>
        </span>
        <textarea
          className="min-h-32 resize-none rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-4 py-3 text-sm font-semibold leading-6 text-[#111827] outline-none focus:border-[#c5222f]"
          onChange={onDescriptionChange}
          placeholder="Write news details in simple words"
          value={description}
        />
      </label>

      <label className="grid gap-2">
        <span className="flex items-center gap-2 text-sm font-extrabold text-[#111827]">
          <MapPin aria-hidden="true" size={16} strokeWidth={2.5} />
          Location
        </span>
        <input
          className="min-h-12 rounded-2xl border border-[#dedbd2] bg-[#fbfbf8] px-4 text-sm font-bold text-[#111827] outline-none focus:border-[#c5222f]"
          onChange={onLocationChange}
          placeholder="City, area or village"
          type="text"
          value={location}
        />
      </label>
    </>
  );
}

export default NewsTextFields;
