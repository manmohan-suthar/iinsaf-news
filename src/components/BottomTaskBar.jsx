import { Bell, Home, Search, SquarePlus, User } from 'lucide-react'

const taskBarItems = [
  { label: 'Home', view: 'home', icon: Home },
  { label: 'Search', view: 'search', icon: Search },
  { label: 'Add', view: 'add', icon: SquarePlus },
  { label: 'Notification', view: 'notification', icon: Bell },
  { label: 'Profile', view: 'profile', icon: User },
]

function BottomTaskBar({ activeView, onChange }) {
  return (
    <nav className="bottom-taskbar" aria-label="App task bar">
      {taskBarItems.map(({ label, view, icon: Icon }) => (
        <button
          aria-current={activeView === view ? 'page' : undefined}
          className={activeView === view ? 'taskbar-item is-active' : 'taskbar-item'}
          key={label}
          onClick={() =>
            onChange(view === 'search' || view === 'notification' || view === 'profile' ? view : 'home')
          }
          type="button"
        >
          <Icon aria-hidden="true" size={24} strokeWidth={2.3} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomTaskBar
