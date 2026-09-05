export default function PageHero({ title, children }) {
  return (
    <section className="page-hero">
      <div className="wrap">
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  );
}
