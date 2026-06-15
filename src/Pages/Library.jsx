import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, getUser } from '../Js/useAuth';

const API_BASE = 'http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

.lib-root {
  min-height: 100vh;
  background: #0d0f1a;
  font-family: 'Inter', sans-serif;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  position: relative;
}

.lib-bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(99,102,241,0.18), transparent 55%),
    radial-gradient(circle at 80% 80%, rgba(16,185,129,0.10), transparent 55%),
    #0d0f1a;
  pointer-events: none;
}

.lib-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.lib-body {
  position: relative;
  z-index: 2;
  max-width: 1100px;
  margin: auto;
  width: 100%;
  padding: 2rem;
}

.lib-title {
  font-family: 'Syne', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.lib-sub { color: #64748b; font-size: 0.85rem; margin-bottom: 1.5rem; }

.lib-search {
  width: 100%;
  padding: 0.7rem 0.9rem 0.7rem 2.5rem;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.05);
  color: #e2e8f0;
  font-size: 0.9rem;
  box-sizing: border-box;
}
.lib-search::placeholder { color: #475569; }
.lib-search:focus { outline: none; border-color: #6366f1; }

.lib-cat-pill {
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.08);
  background: transparent;
  color: #64748b;
  cursor: pointer;
  transition: 0.2s;
}
.lib-cat-pill.active {
  background: rgba(99,102,241,0.15);
  color: #a5b4fc;
}

.lib-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 1.2rem;
  transition: 0.2s;
}
.lib-card:hover {
  transform: translateY(-2px);
  border-color: rgba(99,102,241,0.3);
}

.lib-tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}
.lib-tag-cat { color: #818cf8; background: rgba(99,102,241,0.1); }
.lib-tag-free { color: #34d399; background: rgba(16,185,129,0.1); }
.lib-tag-paid { color: #fbbf24; background: rgba(245,158,11,0.1); }
.lib-tag-freemium { color: #a5b4fc; background: rgba(99,102,241,0.08); }

.lib-visit-btn {
  background: rgba(99,102,241,0.15);
  border: 1px solid rgba(99,102,241,0.25);
  color: #a5b4fc;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.8rem;
  transition: 0.2s;
}
.lib-visit-btn:hover { background: rgba(99,102,241,0.25); }

.lib-remove-btn {
  background: transparent;
  border: 1px solid rgba(239,68,68,0.2);
  color: #94a3b8;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: 0.2s;
}
.lib-remove-btn:hover { color: #f87171; border-color: rgba(239,68,68,0.4); }

.lib-grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
`;

export default function Library() {
  const [tools, setTools] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${API_BASE}/getFavorites.php?user_id=${user.id}`);
      const data = await res.json();
      if (data.success) setTools(data.tools);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const removeFavorite = async (toolId) => {
    try {
      const res = await fetch(`${API_BASE}/toggle_favorite.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, tool_id: toolId })
      });
      const data = await res.json();
      if (data.success && data.action === 'removed') {
        setTools(prev => prev.filter(t => t.id !== toolId));
      }
    } catch (err) { console.error(err); }
  };

  const filtered = tools.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                        (t.tagline && t.tagline.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === 'All' || t.category === category;
    return matchSearch && matchCat;
  });

  const categories = ['All', ...new Set(tools.map(t => t.category))];

  const pricingClass = (type) => {
    const t = type.toLowerCase();
    if (t === 'free') return 'lib-tag lib-tag-free';
    if (t === 'paid') return 'lib-tag lib-tag-paid';
    return 'lib-tag lib-tag-freemium';
  };

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Chargement...</div>;

  return (
    <div className="lib-root">
      <style>{css}</style>
      <div className="lib-bg" />
      <div className="lib-grid" />
      <div className="lib-body">
        <h1 className="lib-title">My Library</h1>
        <p className="lib-sub">{tools.length} tools saved</p>

        <input
          className="lib-search"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div style={{ display: 'flex', gap: 8, margin: '1rem 0', flexWrap: 'wrap' }}>
          {categories.map((c) => (
            <button
              key={c}
              className={`lib-cat-pill ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="lib-grid-cards">
          {filtered.map((t) => (
            <div key={t.id} className="lib-card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: `${t.color}22`,
                      color: t.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{t.category}</div>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 13, color: '#94a3b8' }}>{t.tagline || (t.description?.slice(0,80))}</p>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span className="lib-tag lib-tag-cat">{t.category}</span>
                <span className={pricingClass(t.pricing)}>{t.pricing}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                <a className="lib-visit-btn" href={t.website_url} target="_blank" rel="noreferrer">
                  Visit
                </a>
                <button className="lib-remove-btn" onClick={() => removeFavorite(t.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              No tools in your library yet. Add some from the Dashboard!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}