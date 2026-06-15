import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

  /* Styles du header/footer (repris de Landing) */
  .public-root {
    min-height: 100vh;
    background: #0d0f1a;
    font-family: 'Inter', sans-serif;
    color: #e2e8f0;
    position: relative;
  }

  .public-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background:
      radial-gradient(ellipse 80% 50% at 20% 20%, rgba(79,70,229,0.18) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(16,185,129,0.12) 0%, transparent 60%),
      #0d0f1a;
  }

  .public-nav {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 4rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-wrap: wrap;
    gap: 1rem;
  }

  .public-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.4rem;
    color: #fff;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .public-logo-dot { color: #6366f1; }

  .public-nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
    list-style: none;
    margin: 0; padding: 0;
  }
  .public-nav-links a {
    color: #94a3b8;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.2s;
  }
  .public-nav-links a:hover { color: #fff; }

  .public-nav-actions { display: flex; gap: 0.75rem; align-items: center; }

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

  /* Styles du corps (grille des outils) */
  .public-body {
    position: relative;
    z-index: 10;
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 2rem 4rem;
  }

  .public-hero {
    text-align: center;
    padding: 3rem 1rem 2rem;
    margin-bottom: 2rem;
  }
  .public-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    color: #fff;
    margin-bottom: 1rem;
  }
  .public-hero-title span { color: #6366f1; }
  .public-hero-sub {
    font-size: 1rem;
    color: #94a3b8;
    max-width: 500px;
    margin: 0 auto 1.5rem;
  }

  .public-search-wrap {
    max-width: 580px;
    margin: 0 auto;
    position: relative;
  }
  .public-search-ico {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #475569;
    pointer-events: none;
  }
  .public-search {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 14px;
    padding: 0.8rem 1rem 0.8rem 3rem;
    color: #e2e8f0;
    font-size: 0.95rem;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
  }
  .public-search:focus {
    border-color: rgba(99,102,241,0.45);
    background: rgba(99,102,241,0.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.10);
  }

  .public-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
    gap: 1rem;
  }
  .public-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 800;
    color: #fff;
  }

  .public-tool-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
    margin-bottom: 2.5rem;
  }

  .public-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 1.3rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    transition: all 0.2s;
    cursor: default;
  }
  .public-card:hover {
    border-color: rgba(99,102,241,0.25);
    background: rgba(99,102,241,0.04);
    transform: translateY(-3px);
  }

  .public-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
  }
  .public-avatar {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 0.9rem;
    flex-shrink: 0;
    border: 1px solid rgba(255,255,255,0.07);
  }
  .public-card-badges {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.35rem;
  }
  .public-badge {
    font-size: 0.68rem;
    padding: 0.2rem 0.55rem;
    border-radius: 5px;
    font-weight: 500;
    white-space: nowrap;
  }
  .public-badge-free {
    background: rgba(16,185,129,0.10);
    color: #34d399;
    border: 1px solid rgba(16,185,129,0.18);
  }
  .public-badge-paid {
    background: rgba(245,158,11,0.10);
    color: #fbbf24;
    border: 1px solid rgba(245,158,11,0.18);
  }
  .public-badge-new {
    background: rgba(99,102,241,0.12);
    color: #818cf8;
    border: 1px solid rgba(99,102,241,0.20);
  }

  .public-card-name {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 0.2rem;
  }
  .public-card-cat { font-size: 0.75rem; color: #475569; }
  .public-card-desc { font-size: 0.82rem; color: #64748b; line-height: 1.6; }

  .public-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255,255,255,0.05);
  }

  .public-stars {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  .public-stars-row {
    display: flex;
    gap: 2px;
  }
  .public-star {
    font-size: 12px;
    color: #fbbf24;
  }
  .public-star.empty { color: #1e293b; }
  .public-rating-val {
    font-size: 0.8rem;
    font-weight: 500;
    color: #94a3b8;
  }
  .public-reviews {
    font-size: 0.72rem;
    color: #334155;
  }

  .public-empty {
    text-align: center;
    padding: 4rem 2rem;
    grid-column: 1 / -1;
  }
  .public-empty-title { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: #475569; margin-bottom: 0.4rem; }
  .public-empty-sub { font-size: 0.85rem; color: #334155; }

  @media (max-width: 768px) {
    .public-nav { padding: 1rem 1.5rem; }
    .public-nav-links { display: none; }
    .public-body { padding: 1.5rem 1rem 3rem; }
    .public-tool-grid { grid-template-columns: 1fr; }
  }
`;

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const StarRow = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="public-stars-row">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`public-star${i <= full ? '' : (i === full + 1 && half ? '' : ' empty')}`}>
          {i <= full ? '★' : (i === full + 1 && half ? '½' : '★')}
        </span>
      ))}
    </div>
  );
};

export default function PublicDashboard() {
  const [search, setSearch] = useState('');
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const res = await fetch(`${API_BASE}/getApps.php`);
      const data = await res.json();
      if (data.success) {
        setTools(data.tools);
      } else {
        setError('Failed to load tools');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const filteredTools = tools.filter(t => {
    const q = search.toLowerCase();
    return !q || t.name.toLowerCase().includes(q) || (t.category && t.category.toLowerCase().includes(q)) || (t.description && t.description.toLowerCase().includes(q));
  });

  return (
    <div className="public-root">
      <style>{css}</style>
      <div className="public-bg" />

      {/* Header identique à Landing */}
      <nav className="public-nav">
        <Link to="/" className="public-logo">
          AI<span className="public-logo-dot">Radar</span>
        </Link>
        <ul className="public-nav-links">
          <li><a href="/#features">Features</a></li>
          <li><a href="/#about">About</a></li>
        </ul>
        <div className="public-nav-actions">
          <Link to="/login" className="btn-ghost-nav">Sign in</Link>
          <Link to="/signUp" className="btn-accent-nav">Get started</Link>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="public-body">
        <div className="public-hero">
          <h1 className="public-hero-title">
            Discover the best <span>AI tools</span>
          </h1>
          <p className="public-hero-sub">
            Explore hundreds of AI applications — all in one place.
          </p>
          <div className="public-search-wrap">
            <span className="public-search-ico"><SearchIcon /></span>
            <input
              type="text"
              className="public-search"
              placeholder="Search tools, categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="public-section-header">
          <span className="public-section-title">
            All tools
            <span style={{ fontSize: '0.8rem', color: '#334155', marginLeft: '0.6rem' }}>
              {filteredTools.length} tools
            </span>
          </span>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#475569' }}>
            <div style={{ fontSize: '2rem' }}>⟳</div>
            <p>Loading tools...</p>
          </div>
        )}
        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#f87171' }}>{error}</div>
        )}
        {!loading && !error && (
          <div className="public-tool-grid">
            {filteredTools.length === 0 ? (
              <div className="public-empty">
                <div className="public-empty-title">No tools found</div>
                <p className="public-empty-sub">Try a different search term.</p>
              </div>
            ) : (
              filteredTools.map((tool, i) => (
                <div key={tool.id} className="public-card">
                  <div className="public-card-top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {tool.logo_url ? (
                        <img src={tool.logo_url} alt={tool.name} style={{ width: 46, height: 46, borderRadius: 12, objectFit: 'contain', background: '#fff', padding: 4 }} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                      ) : null}
                      <div className="public-avatar" style={{ display: tool.logo_url ? 'none' : 'flex', background: `${tool.color}22`, color: tool.color, borderColor: `${tool.color}33` }}>
                        {tool.initials}
                      </div>
                      <div>
                        <div className="public-card-name">{tool.name}</div>
                        <div className="public-card-cat">{tool.category_icon} {tool.category}</div>
                      </div>
                    </div>
                    <div className="public-card-badges">
                      <span className={`public-badge ${tool.pricing_type === 'free' ? 'public-badge-free' : tool.pricing_type === 'freemium' ? 'public-badge-free' : 'public-badge-paid'}`}>
                        {tool.pricing_type}
                      </span>
                      {tool.is_new && <span className="public-badge public-badge-new">New</span>}
                    </div>
                  </div>
                  <p className="public-card-desc">{tool.description}</p>
                  <div className="public-card-footer">
                    <div className="public-stars">
                      <StarRow rating={tool.global_rating} />
                      <span className="public-rating-val">{tool.global_rating}</span>
                      <span className="public-reviews">({tool.review_count})</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer identique à Landing */}
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