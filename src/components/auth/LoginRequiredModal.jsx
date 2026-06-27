import { LogIn, X } from "lucide-react";

function LoginRequiredModal({ isOpen, onClose, onLogin }) {
  if (!isOpen) {
    return null;
  }

  return (
    <section
      aria-label="Login required"
      aria-modal="true"
      className="fixed inset-0 z-[120] grid place-items-center bg-black/45 px-4"
      role="dialog"
    >
      <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#c5222f]">Login required</p>
            <h2 className="mt-1 text-xl font-black leading-tight text-[#111827]">Please login first</h2>
          </div>
          <button
            aria-label="Close login prompt"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#f3f1ec] text-[#111827]"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={18} strokeWidth={2.5} />
          </button>
        </div>

        <p className="mt-3 text-sm font-semibold leading-6 text-[#667085]">
          Like, comment, follow, and upload features need an IINSAF News account.
        </p>

        <button
          className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] px-4 text-sm font-black text-white"
          onClick={onLogin}
          type="button"
        >
          <LogIn aria-hidden="true" size={18} strokeWidth={2.5} />
          Login
        </button>
      </div>
    </section>
  );
}

export default LoginRequiredModal;
