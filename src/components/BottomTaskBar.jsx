import { Bell, Home, Search, SquarePlus, User } from 'lucide-react'

const taskBarItems = [
  { label: 'Home', view: 'home', icon: Home },
  { label: 'Search', view: 'search', icon: Search },
  { label: 'Add', view: 'add', icon: SquarePlus },
  { label: 'Notification', view: 'notification', icon: Bell },
  { label: 'Profile', view: 'profile', icon: User },
]

function BottomTaskBar({ activeView, onChange, unreadCount = 0 }) {
  return (
    <nav className="bottom-taskbar" aria-label="App task bar">
      {taskBarItems.map(({ label, view, icon: Icon }) => (
        <button
          aria-current={activeView === view ? 'page' : undefined}
          className={activeView === view ? 'taskbar-item is-active' : 'taskbar-item'}
          key={label}
          onClick={() => onChange(view)}
          type="button"
        >
          <span className="relative">
            <Icon aria-hidden="true" size={24} strokeWidth={2.3} />
            {view === 'notification' && unreadCount > 0 ? (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#c5222f] px-1 text-[11px] font-black text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            ) : null}
          </span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomTaskBar
