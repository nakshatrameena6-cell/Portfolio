export default function NotFound() {
  return (
    <main id="main" className="section notfound">
      <p className="stage__meta">
        <span className="stage__n">404</span>
        <span>No such page</span>
      </p>
      <h1 className="case__title">Off the chart.</h1>
      <p className="case__kicker">That address is not on this site.</p>
      <p>
        <a href="/" className="links__primary">
          Back to the opening <span aria-hidden="true">→</span>
        </a>
      </p>
    </main>
  );
}
