import './HeroBanner.css';

export default function HeroBanner({ title, subtitle, icon }) {
  return (
    <section className="hero-banner">
      <div className="hero-banner-text">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <span className="hero-banner-icon" aria-hidden="true">
        {icon}
      </span>
    </section>
  );
}
