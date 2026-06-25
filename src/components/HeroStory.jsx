import { leadStory } from '../data/homePageContent'

function HeroStory() {
  return (
    <article className="lead-story">
      <div className="lead-content">
        <span>{leadStory.category}</span>
        <h1>{leadStory.title}</h1>
        <p>{leadStory.summary}</p>
        <time>{leadStory.time}</time>
      </div>
    </article>
  )
}

export default HeroStory
