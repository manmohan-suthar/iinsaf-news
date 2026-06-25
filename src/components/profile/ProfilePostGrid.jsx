import { Play } from 'lucide-react'
import { profilePosts } from './profileData'

function ProfilePostGrid() {
  return (
    <section className="grid gap-3" aria-label="Profile posts">
      {profilePosts.map((post) => (
        <article className="grid grid-cols-[96px_1fr] gap-3 rounded-[22px] bg-white p-2.5" key={post.title}>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#111827]">
            <video className="h-full w-full object-cover" muted playsInline preload="metadata">
              <source src={post.video} type="video/mp4" />
            </video>
            <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/55 text-white">
              <Play aria-hidden="true" fill="currentColor" size={13} strokeWidth={2.4} />
            </span>
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <span className="mb-1 text-xs font-extrabold text-[#c5222f]">Local Short</span>
            <h3 className="truncate text-base font-extrabold text-[#111827]">{post.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[#667085]">
              शहर की ताजा खबर और जरूरी अपडेट छोटे फॉर्मेट में।
            </p>
          </div>
        </article>
      ))}
    </section>
  )
}

export default ProfilePostGrid
