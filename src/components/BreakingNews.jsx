import { breakingNews } from '../data/homePageContent'

function BreakingNews() {
  return (
    <section className="breaking-strip" aria-label="Breaking news">
      <strong>Breaking</strong>
      <p>{breakingNews}</p>
    </section>
  )
}

export default BreakingNews
