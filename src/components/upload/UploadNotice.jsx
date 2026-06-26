import { CheckCircle2 } from "lucide-react";

function UploadNotice() {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-[#ecfdf3] px-4 py-3 text-sm font-extrabold text-[#027a48]">
      <CheckCircle2 aria-hidden="true" size={19} strokeWidth={2.5} />
      News uploaded successfully.
    </div>
  );
}

export default UploadNotice;
