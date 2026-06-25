import { Bot, Flame, Globe2, Landmark, ShieldAlert, Trophy, Zap } from 'lucide-react'

const topicFilters = [
  { label: 'Trending', icon: Flame, active: true },
  { label: 'War', icon: ShieldAlert },
  { label: 'AI Tech', icon: Bot },
  { label: 'Politics', icon: Landmark },
  { label: 'World', icon: Globe2 },
  { label: 'Sports', icon: Trophy },
  { label: 'Breaking', icon: Zap },
]

function TopicFilters() {
  return (
    <section className="topic-filters" aria-label="News topic filters">
      {topicFilters.map(({ label, icon: Icon, active }) => (
        <button className={active ? 'topic-card is-active' : 'topic-card'} key={label} type="button">
          <span className="topic-icon">
            <Icon aria-hidden="true" size={18} strokeWidth={2.35} />
          </span>
          <span>{label}</span>
        </button>
      ))}
    </section>
  )
}

export default TopicFilters
