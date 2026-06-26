import { Tag } from "lucide-react";

function TagSelector({ onChange, selectedTag, tags }) {
  return (
    <div className="grid gap-2">
      <span className="flex items-center gap-2 text-sm font-extrabold text-[#111827]">
        <Tag aria-hidden="true" size={16} strokeWidth={2.5} />
        Tag
      </span>
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tags.map((tag) => (
          <button
            className={
              selectedTag === tag
                ? "min-h-10 flex-none rounded-full bg-[#111827] px-4 text-sm font-extrabold text-white"
                : "min-h-10 flex-none rounded-full bg-[#f3f1ec] px-4 text-sm font-extrabold text-[#667085]"
            }
            key={tag}
            onClick={() => onChange(tag)}
            type="button"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TagSelector;
