import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Bell, CheckCheck, Filter } from 'lucide-react'
import NotificationItem from './NotificationItem'
import { markNotificationsRead } from '../../store/notificationSlice'

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Reels', value: 'upload' },
  { label: 'Comments', value: 'comment' },
  { label: 'Likes', value: 'like' },
  { label: 'Followers', value: 'follow' },
]

function NotificationPage({ onOpenNews, onOpenProfile }) {
  const dispatch = useDispatch()
  const [activeFilter, setActiveFilter] = useState('all')
  const { items: notifications, status } = useSelector((state) => state.notifications)
  const unreadCount = useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications])
  const filteredNotifications = useMemo(
    () => (activeFilter === 'all' ? notifications : notifications.filter((item) => item.type === activeFilter)),
    [activeFilter, notifications],
  )
  const notificationGroups = useMemo(() => {
    return filteredNotifications.reduce((groups, item) => {
      const group = groups.find((entry) => entry.title === item.group)

      if (group) {
        group.items.push(item)
      } else {
        groups.push({ title: item.group, items: [item] })
      }

      return groups
    }, [])
  }, [filteredNotifications])

  function handleMarkAllRead() {
    dispatch(markNotificationsRead())
  }

  if (status === 'loading' && !notifications.length) {
    return (
      <section className="rounded-[22px] bg-white p-5 text-sm font-bold text-[#667085]">
        Loading notifications...
      </section>
    )
  }

  if (status === 'failed') {
    return (
      <section className="rounded-[22px] bg-white p-5 text-sm font-bold text-[#c5222f]">
        Failed to load notifications.
      </section>
    )
  }

  return (
    <section className="min-w-0 space-y-4 overflow-x-hidden pb-4" aria-label="Notifications page">
      <div className="min-w-0 rounded-[28px] bg-white p-4">
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
          <button
            className="min-h-11 rounded-2xl bg-[#111827] px-4 text-sm font-extrabold text-white"
            onClick={handleMarkAllRead}
            type="button"
          >
            {unreadCount ? `Mark all read (${unreadCount})` : 'All read'}
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
        {filters.map((filter) => (
          <button
            className={
              activeFilter === filter.value
                ? 'min-h-10 flex-none rounded-2xl bg-[#c5222f] px-4 text-sm font-extrabold text-white'
                : 'min-h-10 flex-none rounded-2xl bg-white px-4 text-sm font-extrabold text-[#667085]'
            }
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </div>

      {notificationGroups.length ? notificationGroups.map((group) => (
        <section className="min-w-0 space-y-2" key={group.title} aria-labelledby={`${group.title}-notifications`}>
          <div className="flex items-center gap-2 px-1">
            <CheckCheck aria-hidden="true" size={17} strokeWidth={2.4} className="text-[#667085]" />
            <h2 className="text-sm font-extrabold text-[#344054]" id={`${group.title}-notifications`}>
              {group.title}
            </h2>
          </div>

          <div className="grid min-w-0 gap-2">
            {group.items.map((item) => (
              <NotificationItem
                item={item}
                key={`${item.id}-${item.type}-${item.title}`}
                onOpenNews={item.news?.id ? onOpenNews : undefined}
                onOpenProfile={item.actor?.id ? onOpenProfile : undefined}
              />
            ))}
          </div>
        </section>
      )) : (
        <div className="rounded-[22px] bg-white p-5 text-center">
          <p className="text-sm font-black text-[#111827]">No notifications yet</p>
          <p className="mt-1 text-xs font-bold text-[#667085]">Likes, comments, follows, and new uploads will appear here.</p>
        </div>
      )}
    </section>
  )
}

export default NotificationPage
