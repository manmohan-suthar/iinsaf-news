import { BellRing, Heart, MapPin, MessageCircle, Radio, UserPlus } from 'lucide-react'

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

function NotificationItem({ item }) {
  const style = typeStyles[item.type] || {
    icon: BellRing,
    className: 'bg-[#f3f1ec] text-[#344054]',
  }
  const Icon = style.icon

  return (
    <article className="flex gap-3 rounded-[22px] bg-white p-3">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${style.className}`}>
        <Icon aria-hidden="true" size={22} strokeWidth={2.4} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-extrabold text-[#111827]">{item.title}</h3>
          <time className="m-0 shrink-0 text-xs font-bold text-[#667085]">{item.time}</time>
        </div>
        <p className="mt-1 text-sm font-semibold leading-5 text-[#667085]">{item.text}</p>
      </div>
    </article>
  )
}

export default NotificationItem
