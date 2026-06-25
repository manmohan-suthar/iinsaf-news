function Newsletter() {
  return (
    <section className="newsletter-band" aria-labelledby="newsletter-heading">
      <div>
        <h2 id="newsletter-heading">Daily brief in your inbox</h2>
        <p>Get the most important public news and short updates every morning.</p>
      </div>

      <form>
        <label htmlFor="newsletter-email">Email address</label>
        <div>
          <input id="newsletter-email" name="email" placeholder="you@example.com" type="email" />
          <button type="submit">Sign up</button>
        </div>
      </form>
    </section>
  )
}

export default Newsletter
