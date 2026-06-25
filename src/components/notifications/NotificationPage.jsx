import { Bell, CheckCheck, Filter } from 'lucide-react'
import NotificationItem from './NotificationItem'
import { notificationGroups } from './notificationData'

const filters = ['All', 'Breaking', 'Comments', 'Followers']

function NotificationPage() {
  return (
    <section className="space-y-4 pb-4" aria-label="Notifications page">
      <div className="rounded-[28px] bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#c5222f]">Updates</p>
            <h1 className="mt-1 text-2xl font-black text-[#111827]">Notifications</h1>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f5e8df] text-[#c5222f]">
            <Bell aria-hidden="true" size={23} strokeWidth={2.4} />
          </span>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <button className="min-h-11 rounded-2xl bg-[#111827] px-4 text-sm font-extrabold text-white" type="button">
            Mark all read
          </button>
          <button
            aria-label="Notification filters"
            className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f3f1ec] text-[#111827]"
            type="button"
          >
            <Filter aria-hidden="true" size={19} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((filter, index) => (
          <button
            className={
              index === 0
                ? 'min-h-10 flex-none rounded-2xl bg-[#c5222f] px-4 text-sm font-extrabold text-white'
                : 'min-h-10 flex-none rounded-2xl bg-white px-4 text-sm font-extrabold text-[#667085]'
            }
            key={filter}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>

      {notificationGroups.map((group) => (
        <section className="space-y-2" key={group.title} aria-labelledby={`${group.title}-notifications`}>
          <div className="flex items-center gap-2 px-1">
            <CheckCheck aria-hidden="true" size={17} strokeWidth={2.4} className="text-[#667085]" />
            <h2 className="text-sm font-extrabold text-[#344054]" id={`${group.title}-notifications`}>
              {group.title}
            </h2>
          </div>

          <div className="grid gap-2">
            {group.items.map((item) => (
              <NotificationItem item={item} key={`${item.type}-${item.title}`} />
            ))}
          </div>
        </section>
      ))}
    </section>
  )
}

export default NotificationPage
