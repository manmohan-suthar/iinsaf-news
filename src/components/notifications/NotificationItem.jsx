import { BellRing, ExternalLink, Heart, MapPin, MessageCircle, Radio, UserPlus } from 'lucide-react'
import { apiAssetUrl } from '../../store/apiClient'

const typeStyles = {
  breaking: {
    icon: Radio,
    className: 'bg-[#fff0eb] text-[#c5222f]',
  },
  like: {
    icon: Heart,
    className: 'bg-[#f5e8df] text-[#c5222f]',
  },
  comment: {
    icon: MessageCircle,
    className: 'bg-[#eef4ff] text-[#2563eb]',
  },
  follow: {
    icon: UserPlus,
    className: 'bg-[#ecfdf3] text-[#128c4a]',
  },
  area: {
    icon: MapPin,
    className: 'bg-[#f3f1ec] text-[#344054]',
  },
}

function NotificationItem({ item, onOpenNews, onOpenProfile }) {
  const style = typeStyles[item.type] || {
    icon: BellRing,
    className: 'bg-[#f3f1ec] text-[#344054]',
  }
  const Icon = style.icon
  const actor = item.actor
  const isUnread = !item.isRead

  return (
    <article
      className={`flex w-full min-w-0 gap-2.5 rounded-[22px] border p-2.5 transition sm:gap-3 sm:p-3 ${
        isUnread ? 'border-[#f5d0c2] bg-[#fffaf7]' : 'border-transparent bg-white'
      }`}
    >
      <button
        aria-label={actor ? `Open ${actor.name} profile` : item.title}
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl sm:h-12 sm:w-12 ${style.className}`}
        disabled={!actor?.id || !onOpenProfile}
        onClick={() => actor?.id && onOpenProfile?.(actor.id)}
        type="button"
      >
        {actor?.avatarUrl ? (
          <img alt="" className="h-full w-full rounded-2xl object-cover" src={apiAssetUrl(actor.avatarUrl)} />
        ) : (
          <Icon aria-hidden="true" size={20} strokeWidth={2.4} />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-extrabold text-[#111827]">{item.title}</h3>
            {actor ? (
              <button
                className="block max-w-full truncate text-left text-xs font-bold text-[#667085]"
                onClick={() => onOpenProfile?.(actor.id)}
                type="button"
              >
                {actor.name} <span className="font-semibold">{actor.username}</span>
              </button>
            ) : null}
          </div>
          <time className="m-0 text-[11px] font-bold text-[#667085] sm:shrink-0 sm:text-xs" dateTime={item.createdAt}>
            {item.timeLabel || item.time}
          </time>
        </div>
        <p className="mt-1 break-words text-sm font-semibold leading-5 text-[#667085]">{item.text}</p>
        {item.news ? (
          <button
            className="mt-2 flex w-full min-w-0 items-center gap-1 rounded-xl bg-[#fff0eb] px-2.5 py-1.5 text-left text-xs font-extrabold text-[#c5222f] sm:w-fit sm:max-w-full"
            onClick={() => onOpenNews?.(item.news.id)}
            type="button"
          >
            <ExternalLink aria-hidden="true" className="shrink-0" size={13} strokeWidth={2.5} />
            <span className="min-w-0 truncate">{item.news.title}</span>
          </button>
        ) : null}
      </div>
    </article>
  )
}

export default NotificationItem
