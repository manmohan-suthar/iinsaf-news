import { useDispatch } from 'react-redux'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { startGoogleLogin } from '../../store/authSlice'

function LoginPage() {
  const dispatch = useDispatch()

  return (
    <section className="grid min-h-[calc(100svh-170px)] place-items-center pb-4" aria-label="Login page">
      <div className="w-full max-w-sm rounded-[30px] bg-white p-5">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#f5e8df] text-[#c5222f]">
          <ShieldCheck aria-hidden="true" size={30} strokeWidth={2.4} />
        </div>

        <div className="mt-5 text-center">
          <p className="text-xs font-extrabold uppercase tracking-wide text-[#c5222f]">IINSAF News</p>
          <h1 className="mt-2 text-2xl font-black leading-tight text-[#111827]">
            अपना लोकल न्यूज़ अकाउंट खोलें
          </h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#667085]">
            Google से login करें, रिपोर्टर को follow करें और अपनी पसंद की लोकल खबरें सेव करें।
          </p>
        </div>

        <button
          className="mt-6 flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-[#dedbd2] bg-white px-4 text-sm font-extrabold text-[#111827]"
          onClick={() => dispatch(startGoogleLogin())}
          type="button"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f3f1ec] text-base font-black text-[#c5222f]">
            G
          </span>
          Login with Google
        </button>

        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#f3f1ec] p-3">
          <Sparkles aria-hidden="true" className="mt-0.5 shrink-0 text-[#c5222f]" size={18} strokeWidth={2.4} />
          <p className="text-xs font-bold leading-5 text-[#667085]">
            पहली बार login करने पर आपका profile अपने आप बनेगा. Posts, Followers और Following शुरू में 0 रहेंगे।
          </p>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
