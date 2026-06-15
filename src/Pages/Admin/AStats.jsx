import { useState, useEffect } from 'react';
import { Users, Layers, Star, ClipboardCheck, Heart, Search } from 'lucide-react';
import './Admin.css';

const API_BASE = 'http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api';

export default function AStats() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/admin_stats.php`)
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.stats); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="adm-loading">Loading statistics...</div>;

  const cards = stats ? [
    { label: 'Total Users',         value: stats.total_users,        bg: 'rgba(99,102,241,0.12)',  icon: <Users size={20} color="#a5b4fc" /> },
    { label: 'Active Tools',        value: stats.active_tools,       bg: 'rgba(16,185,129,0.12)',  icon: <Layers size={20} color="#34d399" /> },
    { label: 'Total Reviews',       value: stats.total_reviews,      bg: 'rgba(245,158,11,0.12)',  icon: <Star size={20} color="#fbbf24" /> },
    { label: 'Pending Submissions', value: stats.pending_submissions, bg: 'rgba(239,68,68,0.12)',   icon: <ClipboardCheck size={20} color="#f87171" /> },
    { label: 'Total Favorites',     value: stats.total_favorites,    bg: 'rgba(236,72,153,0.12)',  icon: <Heart size={20} color="#f472b6" /> },
    { label: 'Total Searches',      value: stats.total_searches,     bg: 'rgba(14,165,233,0.12)',  icon: <Search size={20} color="#38bdf8" /> },
  ] : [];

  const maxViews = stats?.top_tools?.[0]?.views || 1;

  return (
    <div className="adm-page">

      <div className="adm-stats-grid">
        {cards.map(c => (
          <div className="adm-stat-card" key={c.label}>
            <div className="adm-stat-icon" style={{ background: c.bg }}>{c.icon}</div>
            <div>
              <div className="adm-stat-val">{c.value ?? '—'}</div>
              <div className="adm-stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="adm-section-title">Top Viewed Tools</h2>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr><th>#</th><th>Tool</th><th>Category</th><th>Views</th><th> </th></tr>
          </thead>
          <tbody>
            {stats?.top_tools?.length ? stats.top_tools.map((t, i) => (
              <tr key={t.id}>
                <td style={{ color: '#475569', width: 40 }}>{i + 1}</td>
                <td style={{ color: '#e2e8f0', fontWeight: 500 }}>{t.name}</td>
                <td style={{ color: '#64748b' }}>{t.category}</td>
                <td style={{ color: '#a5b4fc', fontWeight: 600 }}>{t.views}</td>
                <td style={{ width: 140 }}>
                  <div className="adm-bar-wrap">
                    <div className="adm-bar-fill" style={{ width: `${(t.views / maxViews) * 100}%` }} />
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#475569' }}>
                  No data yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}