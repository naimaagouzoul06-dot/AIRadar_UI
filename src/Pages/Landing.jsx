import { Link } from 'react-router-dom';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

  .land-root {
    min-height: 100vh;
    background: #0d0f1a;
    font-family: 'Inter', sans-serif;
    color: #e2e8f0;
    overflow: hidden;
    position: relative;
  }

  .land-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background:
      radial-gradient(ellipse 80% 50% at 20% 20%, rgba(79,70,229,0.18) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(16,185,129,0.12) 0%, transparent 60%),
      #0d0f1a;
  }

  .land-nav {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 4rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .land-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.4rem;
    color: #fff;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .land-logo-dot { color: #6366f1; }

  .land-nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
    list-style: none;
    margin: 0; padding: 0;
  }

  .land-nav-links a {
    color: #94a3b8;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.2s;
  }

  .land-nav-links a:hover { color: #fff; }

  .land-nav-actions { display: flex; gap: 0.75rem; align-items: center; }

  .btn-ghost-nav {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.15);
    color: #e2e8f0;
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
  }

  .btn-ghost-nav:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.3);
  }

  .btn-accent-nav {
    background: #6366f1;
    border: none;
    color: #fff;
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
  }

  .btn-accent-nav:hover { background: #4f46e5; transform: translateY(-1px); }

  .land-hero {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 7rem 2rem 5rem;
  }


  .land-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #6366f1;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.3); }
  }

  .land-h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.8rem, 7vw, 5.5rem);
    font-weight: 800;
    line-height: 1.05;
    color: #fff;
    margin: 0 0 1.5rem;
    max-width: 820px;
    animation: fadeUp 0.6s 0.1s ease both;
  }

  .land-h1 span {
    background: linear-gradient(135deg, #6366f1, #10b981);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .land-sub {
    font-size: 1.15rem;
    color: #94a3b8;
    max-width: 540px;
    line-height: 1.7;
    margin: 0 0 2.5rem;
    font-weight: 300;
    animation: fadeUp 0.6s 0.2s ease both;
  }

  .land-cta {
    display: flex;
    gap: 1rem;
    animation: fadeUp 0.6s 0.3s ease both;
  }

  .btn-primary-lg {
    background: #6366f1;
    color: #fff;
    border: none;
    padding: 0.85rem 2rem;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-primary-lg:hover { background: #4f46e5; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }

  .btn-outline-lg {
    background: transparent;
    color: #e2e8f0;
    border: 1px solid rgba(255,255,255,0.15);
    padding: 0.85rem 2rem;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
  }

  .btn-outline-lg:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.3); }

  .land-stats {
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: center;
    gap: 4rem;
    padding: 3rem 2rem;
    border-top: 1px solid rgba(255,255,255,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    animation: fadeUp 0.6s 0.4s ease both;
  }

  .land-stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
  }

  .land-stat-num span { color: #6366f1; }
  .land-stat-label { font-size: 0.85rem; color: #64748b; margin-top: 0.25rem; }

  .land-features {
    position: relative;
    z-index: 10;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    padding: 5rem 4rem;
    max-width: 1100px;
    margin: 0 auto;
    animation: fadeUp 0.6s 0.5s ease both;
  }

  .land-feat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 1.75rem;
    transition: all 0.2s;
  }

  .land-feat-card:hover {
    background: rgba(99,102,241,0.06);
    border-color: rgba(99,102,241,0.25);
    transform: translateY(-3px);
  }

  .land-feat-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  .land-feat-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    color: #f1f5f9;
    margin: 0 0 0.5rem;
  }

  .land-feat-desc { font-size: 0.875rem; color: #64748b; line-height: 1.6; margin: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .land-nav { padding: 1rem 1.5rem; }
    .land-nav-links { display: none; }
    .land-features { grid-template-columns: 1fr; padding: 3rem 1.5rem; }
    .land-stats { gap: 2rem; flex-wrap: wrap; }
  }
`;

const features = [
  { icon: '🔍', bg: 'rgba(99,102,241,0.15)', title: 'Discover AI Tools', desc: 'Browse hundreds of curated AI applications across every category.' },
  { icon: '⭐', bg: 'rgba(16,185,129,0.15)', title: 'Save Favorites', desc: 'Bookmark the tools you love and access them instantly anytime.' },
  { icon: '📋', bg: 'rgba(245,158,11,0.15)', title: 'Submit Your App', desc: 'Share your AI project with thousands of developers and enthusiasts.' },
  { icon: '📰', bg: 'rgba(239,68,68,0.15)', title: 'Latest Trends', desc: 'Stay updated with news and trending tools in the AI ecosystem.' },
  { icon: '🗂️', bg: 'rgba(139,92,246,0.15)', title: 'Smart Filtering', desc: 'Filter by category, rating, date, and more to find exactly what you need.' },
  { icon: '📜', bg: 'rgba(6,182,212,0.15)', title: 'Usage History', desc: 'Track the tools you have visited and revisit them with one click.' },
];

export default function Landing() {
  return (
  <div className="land-root">
    <style>{css}</style>
    <div className="land-bg" />

    {/* HEADER */}
    <nav className="land-nav">
      <a href="/" className="land-logo">
        AI<span className="land-logo-dot">Radar</span>
      </a>

      <ul className="land-nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#about">About</a></li>
      </ul>

      <div className="land-nav-actions">
        <Link to="/login" className="btn-ghost-nav">Sign in</Link>
        <Link to="/signUp" className="btn-accent-nav">Get started</Link>
      </div>
    </nav>

    {/* HERO */}
    <section className="land-hero">

      <h1 className="land-h1">
        Explore the best<br />
        <span>AI tools</span> in one place
      </h1>

      <p className="land-sub">
        Discover, save, and share the most powerful AI applications.
        Your gateway to the future of productivity.
      </p>

      <div className="land-cta">
        <Link to="/tools" className="btn-primary-lg">Browse apps →</Link>
        <Link to="/signUp" className="btn-outline-lg">Create account</Link>
      </div>
    </section>

    {/* STATS */}
    
    {/* FEATURES */}
    <div className="land-features" id="features">
      {features.map(f => (
        <div key={f.title} className="land-feat-card">
          <div className="land-feat-icon" style={{ background: f.bg }}>
            {f.icon}
          </div>
          <p className="land-feat-title">{f.title}</p>
          <p className="land-feat-desc">{f.desc}</p>
        </div>
      ))}
    </div>

    {/* ABOUT SECTION */}
    <section id="about" style={{
      position: 'relative',
      zIndex: 10,
      padding: '5rem 2rem',
      textAlign: 'center',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h2 style={{
        fontFamily: 'Syne',
        fontSize: '4.2rem',
        color: '#fff',
        marginBottom: '1rem'
      }}>
        About AI Radar
      </h2>

      <p style={{
        color: '#94a3b8',
        lineHeight: 1.7,
        fontSize: '1rem'
      }}>
        <span color="blue">AIRadar </span>is a modern platform designed to help you discover,
        explore, and manage the best AI tools in one place.
        Whether you're a developer, student, or creator, we make it easy
        to stay ahead in the AI ecosystem.
      </p>
    </section>

    {/* FOOTER */}
    <footer style={{
      position: 'relative',
      zIndex: 10,
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '2.5rem 2rem',
      textAlign: 'center',
      color: '#64748b'
    }}>
      <div style={{ marginBottom: '0.5rem', color: '#e2e8f0' }}>
        AI<span style={{ color: '#6366f1' }}>Radar</span>
      </div>

      <p style={{ fontSize: '0.85rem' }}>
        © {new Date().getFullYear()} AI Radar. All rights reserved.
      </p>
    </footer>
  </div>
);
}   