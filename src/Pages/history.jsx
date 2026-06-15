import { useState, useEffect } from 'react';
import { getUser, isLoggedIn } from '../Js/useAuth';
import { useNavigate } from 'react-router-dom';



const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const ToolsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);




const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

  .hs-root {
    min-height: 100vh;
    background: #0d0f1a;
    font-family: 'Inter', sans-serif;
    color: #e2e8f0;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-x: hidden;
  }

  .hs-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    background:
      radial-gradient(ellipse 55% 40% at 80% 15%, rgba(99,102,241,0.14) 0%, transparent 60%),
      radial-gradient(ellipse 45% 35% at 20% 85%, rgba(16,185,129,0.08) 0%, transparent 60%),
      #0d0f1a;
  }

  .hs-grid {
    position: absolute;
    inset: 0;
    z-index: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* ── Body ── */
  .hs-body {
    position: relative;
    z-index: 10;
    flex: 1;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
    padding: 2.5rem 2rem 4rem;
  }

  /* ── Header ── */
  .hs-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 2rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .hs-title {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
    margin: 0 0 0.3rem;
  }

  .hs-sub {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
  }

  .hs-clear-btn {
    background: none;
    border: 1px solid rgba(239,68,68,0.18);
    color: #475569;
    font-size: 0.8rem;
    font-family: 'Inter', sans-serif;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .hs-clear-btn:hover {
    background: rgba(239,68,68,0.08);
    border-color: rgba(239,68,68,0.35);
    color: #f87171;
  }

  /* ── Tab bar ── */
  .hs-tabs {
    display: flex;
    gap: 0.25rem;
    margin-bottom: 2rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 4px;
    width: fit-content;
  }

  .hs-tab {
    background: none;
    border: none;
    color: #475569;
    font-size: 0.85rem;
    font-family: 'Inter', sans-serif;
    padding: 0.5rem 1.25rem;
    border-radius: 9px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    white-space: nowrap;
  }

  .hs-tab:hover { color: #94a3b8; }

  .hs-tab.active {
    background: rgba(99,102,241,0.18);
    color: #a5b4fc;
  }

  .hs-tab-count {
    background: rgba(99,102,241,0.20);
    color: #818cf8;
    font-size: 0.7rem;
    padding: 1px 6px;
    border-radius: 100px;
    font-weight: 600;
  }

  /* ── Search bar ── */
  .hs-search-wrap {
    position: relative;
    margin-bottom: 1.75rem;
  }

  .hs-search-ico {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: #475569;
    pointer-events: none;
  }

  .hs-search {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 0.7rem 0.85rem 0.7rem 2.6rem;
    color: #e2e8f0;
    font-size: 0.875rem;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .hs-search::placeholder { color: #334155; }

  .hs-search:focus {
    border-color: rgba(99,102,241,0.45);
    background: rgba(99,102,241,0.05);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.10);
  }

  /* ── Day group label ── */
  .hs-day-label {
    font-size: 0.72rem;
    font-weight: 600;
    color: #334155;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    margin: 1.75rem 0 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .hs-day-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.05);
  }

  .hs-day-label:first-child { margin-top: 0; }

  /* ── Session / tool row ── */
  .hs-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.9rem 1rem;
    border-radius: 12px;
    border: 1px solid transparent;
    transition: all 0.18s;
    cursor: pointer;
    margin-bottom: 0.35rem;
    animation: hs-fadeIn 0.3s ease both;
    text-decoration: none;
    color: inherit;
  }

  .hs-row:hover {
    background: rgba(255,255,255,0.03);
    border-color: rgba(255,255,255,0.07);
  }

  @keyframes hs-fadeIn {
    from { opacity: 0; transform: translateX(-6px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .hs-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 0.85rem;
    flex-shrink: 0;
    border: 1px solid rgba(255,255,255,0.07);
  }

  .hs-row-content { flex: 1; min-width: 0; }

  .hs-row-title {
    font-size: 0.9rem;
    font-weight: 500;
    color: #e2e8f0;
    margin: 0 0 0.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hs-row-meta {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.75rem;
    color: #475569;
  }

  .hs-row-tool {
    color: #6366f1;
    font-weight: 500;
  }

  .hs-row-sep {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #334155;
    flex-shrink: 0;
  }

  .hs-row-tag {
    font-size: 0.68rem;
    padding: 0.15rem 0.5rem;
    border-radius: 5px;
    font-weight: 500;
  }

  .hs-row-tag-cat {
    background: rgba(99,102,241,0.10);
    color: #818cf8;
    border: 1px solid rgba(99,102,241,0.18);
  }

  .hs-row-time {
    font-size: 0.75rem;
    color: #334155;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .hs-row-actions {
    display: flex;
    gap: 0.35rem;
    opacity: 0;
    transition: opacity 0.18s;
    flex-shrink: 0;
  }

  .hs-row:hover .hs-row-actions { opacity: 1; }

  .hs-row-action-btn {
    background: none;
    border: 1px solid rgba(255,255,255,0.08);
    color: #475569;
    padding: 0.3rem 0.55rem;
    border-radius: 6px;
    font-size: 0.72rem;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.18s;
  }

  .hs-row-action-btn:hover {
    background: rgba(239,68,68,0.08);
    border-color: rgba(239,68,68,0.25);
    color: #f87171;
  }

  /* ── Tool cards ── */
  .hs-tool-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 1rem 1.15rem;
    display: flex;
    align-items: center;
    gap: 0.85rem;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
    animation: hs-fadeIn 0.3s ease both;
    margin-bottom: 0.5rem;
  }

  .hs-tool-card:hover {
    border-color: rgba(99,102,241,0.28);
    background: rgba(99,102,241,0.04);
    transform: translateX(3px);
  }

  .hs-tool-card-content { flex: 1; min-width: 0; }

  .hs-tool-card-name {
    font-family: 'Syne', sans-serif;
    font-size: 0.92rem;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 0.2rem;
  }

  .hs-tool-card-meta {
    font-size: 0.75rem;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .hs-tool-card-visits {
    color: #6366f1;
    font-weight: 500;
  }

  .hs-tool-card-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.35rem;
    flex-shrink: 0;
  }

  .hs-last-used {
    font-size: 0.72rem;
    color: #334155;
  }

  .hs-visit-btn {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    background: rgba(99,102,241,0.10);
    border: 1px solid rgba(99,102,241,0.20);
    color: #818cf8;
    font-size: 0.72rem;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    padding: 0.3rem 0.7rem;
    border-radius: 6px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
  }

  .hs-visit-btn:hover {
    background: rgba(99,102,241,0.18);
    color: #a5b4fc;
  }

  /* ── Empty state ── */
  .hs-empty {
    text-align: center;
    padding: 5rem 2rem;
    animation: hs-fadeIn 0.3s ease both;
  }

  .hs-empty-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.14);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.2rem;
    color: #6366f1;
  }

  .hs-empty-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: #64748b;
    margin: 0 0 0.4rem;
  }

  .hs-empty-sub {
    font-size: 0.85rem;
    color: #334155;
    margin: 0;
  }

  /* ── Modal ── */
  .hs-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0,0,0,0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    backdrop-filter: blur(4px);
    animation: hs-fadeIn 0.2s ease both;
  }

  .hs-modal {
    background: #131627;
    border: 1px solid rgba(255,255,255,0.10);
    border-radius: 16px;
    padding: 1.75rem;
    max-width: 360px;
    width: 100%;
    animation: hs-fadeUp 0.25s ease both;
  }

  @keyframes hs-fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .hs-modal-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 800;
    color: #fff;
    margin: 0 0 0.5rem;
  }

  .hs-modal-sub {
    font-size: 0.85rem;
    color: #64748b;
    margin: 0 0 1.5rem;
    line-height: 1.6;
  }

  .hs-modal-actions {
    display: flex;
    gap: 0.6rem;
    justify-content: flex-end;
  }

  .hs-modal-cancel {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    color: #94a3b8;
    font-size: 0.875rem;
    font-family: 'Inter', sans-serif;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
  }

  .hs-modal-confirm {
    background: rgba(239,68,68,0.15);
    border: 1px solid rgba(239,68,68,0.30);
    color: #f87171;
    font-size: 0.875rem;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
  }

  @media (max-width: 600px) {
    .hs-body { padding: 1.75rem 1rem 3rem; }
    .hs-title { font-size: 1.5rem; }
    .hs-row-actions { opacity: 1; }
    .hs-tabs { width: 100%; }
    .hs-tab { flex: 1; justify-content: center; }
  }
`;




const ExternalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);

const EmptyClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);




export default function History() {
  const [tab, setTab] = useState('sessions');
  const [search, setSearch] = useState('');
  const [sessions, setSessions] = useState([]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  const API_BASE = 'http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api';

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    fetchHistory();
    fetchToolStats();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/get_history.php?user_id=${user.id}`);
      const data = await res.json();
      if (data.success) setSessions(data.sessions);
    } catch (err) { console.error(err); }
  };

  const fetchToolStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/get_tool_stats.php?user_id=${user.id}`);
      const data = await res.json();
      if (data.success) setTools(data.tools);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const clearAll = async () => {
    try {
      await fetch(`${API_BASE}/clear_history.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });
      setSessions([]);
      setTools([]);
      setShowClearModal(false);
    } catch (err) { console.error(err); }
  };

  const removeSession = (id) => {
    // Optionnel : appel API pour supprimer une session spécifique
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTools = tools.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const groups = ['Today', 'Yesterday', 'This Week', 'Older'].reduce((acc, g) => {
    const items = filteredSessions.filter(s => s.group === g);
    if (items.length) acc.push({ label: g, items });
    return acc;
  }, []);

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Chargement...</div>;

  return (
    <div className="hs-root">
      <style>{css}</style>
      <div className="hs-bg" />
      <div className="hs-grid" />
      <div className="hs-body">
        <div className="hs-header">
          <div>
            <h1 className="hs-title">History</h1>
            <p className="hs-sub">Your recent sessions and tool usage</p>
          </div>
          {(sessions.length > 0 || tools.length > 0) && (
            <button className="hs-clear-btn" onClick={() => setShowClearModal(true)}>Clear all history</button>
          )}
        </div>

        <div className="hs-tabs">
          <button className={`hs-tab${tab === 'sessions' ? ' active' : ''}`} onClick={() => setTab('sessions')}>
            <ClockIcon /> Recent sessions <span className="hs-tab-count">{sessions.length}</span>
          </button>
          <button className={`hs-tab${tab === 'tools' ? ' active' : ''}`} onClick={() => setTab('tools')}>
            <ToolsIcon /> Tools used <span className="hs-tab-count">{tools.length}</span>
          </button>
        </div>

        <div className="hs-search-wrap">
          <span className="hs-search-ico"><SearchIcon /></span>
          <input type="text" className="hs-search" placeholder={tab === 'sessions' ? 'Search sessions…' : 'Search tools…'} value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {tab === 'sessions' && (
          sessions.length === 0 ? (
            <div className="hs-empty"><div className="hs-empty-icon"><EmptyClockIcon /></div><h2 className="hs-empty-title">No history yet</h2><p className="hs-empty-sub">Your recent searches will appear here.</p></div>
          ) : filteredSessions.length === 0 ? (
            <div className="hs-empty"><div className="hs-empty-icon"><SearchIcon /></div><h2 className="hs-empty-title">No results</h2><p className="hs-empty-sub">Try a different search term.</p></div>
          ) : (
            groups.map(group => (
              <div key={group.label}>
                <div className="hs-day-label">{group.label}</div>
                {group.items.map(session => (
                  <div key={session.id} className="hs-row">
                    <div className="hs-avatar" style={{ background: `${session.toolColor}18`, color: session.toolColor }}>{session.initials}</div>
                    <div className="hs-row-content">
                      <p className="hs-row-title">{session.title}</p>
                      <div className="hs-row-meta"><span className="hs-row-tool">{session.category_icon} {session.category}</span></div>
                    </div>
                    <span className="hs-row-time">{session.time}</span>
                    <div className="hs-row-actions">
                      <button className="hs-row-action-btn" onClick={() => removeSession(session.id)}><TrashIcon /></button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )
        )}

        {tab === 'tools' && (
          filteredTools.length === 0 ? (
            <div className="hs-empty"><div className="hs-empty-icon"><SearchIcon /></div><h2 className="hs-empty-title">No results</h2><p className="hs-empty-sub">Try a different search term.</p></div>
          ) : (
            filteredTools.map(tool => (
              <div key={tool.id} className="hs-tool-card">
                <div className="hs-avatar" style={{ background: `${tool.color}18`, color: tool.color }}>{tool.initials}</div>
                <div className="hs-tool-card-content">
                  <p className="hs-tool-card-name">{tool.name}</p>
                  <div className="hs-tool-card-meta"><span>{tool.category_icon} {tool.category}</span><span className="hs-row-sep" /><span className="hs-tool-card-visits">{tool.visits} sessions</span></div>
                </div>
                <div className="hs-tool-card-right">
                  <span className="hs-last-used">Last used {tool.lastUsed}</span>
                  <a href={tool.website} target="_blank" rel="noreferrer" className="hs-visit-btn">Open <ExternalIcon /></a>
                </div>
              </div>
            ))
          )
        )}
      </div>

      {showClearModal && (
        <div className="hs-modal-overlay" onClick={() => setShowClearModal(false)}>
          <div className="hs-modal" onClick={e => e.stopPropagation()}>
            <h2 className="hs-modal-title">Clear all history?</h2>
            <p className="hs-modal-sub">This will permanently delete all your session history. This action cannot be undone.</p>
            <div className="hs-modal-actions">
              <button className="hs-modal-cancel" onClick={() => setShowClearModal(false)}>Cancel</button>
              <button className="hs-modal-confirm" onClick={clearAll}>Yes, clear all</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}