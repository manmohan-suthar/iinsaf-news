import { Grid3X3, Repeat2, Tags } from 'lucide-react'
import { profileTabs } from './profileData'

const icons = {
  Posts: Grid3X3,
  Tagged: Tags,
  Repost: Repeat2,
}

function ProfileTabs() {
  return (
    <nav className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Profile tabs">
      {profileTabs.map((tab, index) => {
        const Icon = icons[tab]

        return (
          <button
            className={
              index === 0
                ? 'flex min-h-11 flex-none items-center justify-center gap-2 rounded-2xl bg-[#111827] px-4 text-sm font-extrabold text-white'
                : 'flex min-h-11 flex-none items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-extrabold text-[#667085]'
            }
            key={tab}
            type="button"
          >
            <Icon aria-hidden="true" size={18} strokeWidth={2.4} />
            <span>{tab}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default ProfileTabs
