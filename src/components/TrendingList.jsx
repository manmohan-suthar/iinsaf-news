import { trendingStories } from '../data/homePageContent'

function TrendingList() {
  return (
    <aside className="trending-panel" aria-labelledby="trending-heading">
      <h2 id="trending-heading">Trending Now</h2>
      <ol>
        {trendingStories.map((story) => (
          <li key={story}>
            <a href="/">{story}</a>
          </li>
        ))}
      </ol>
    </aside>
  )
}

export default TrendingList
