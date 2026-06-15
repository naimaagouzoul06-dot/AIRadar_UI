import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { isLoggedIn, getUser } from "../Js/useAuth";
import Chatbot from '../Components/Chatbot.jsx';

const API_BASE = 'http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

  .db-root {
    min-height: 100vh;
    background: #0d0f1a;
    font-family: 'Inter', sans-serif;
    color: #e2e8f0;
    position: relative;
    overflow-x: hidden;
  }

  .db-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background:
      radial-gradient(ellipse 60% 45% at 80% 10%, rgba(99,102,241,0.13) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 10% 80%, rgba(16,185,129,0.07) 0%, transparent 60%),
      #0d0f1a;
    pointer-events: none;
  }

  .db-grid-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .db-body {
    position: relative;
    z-index: 10;
    max-width: 1100px;
    margin: 0 auto;
    padding: 2.5rem 2rem 5rem;
  }

  .db-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2.5rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .db-logo {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.02em;
  }
  .db-logo span { color: #6366f1; }

  .db-user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .db-user-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(99,102,241,0.15);
    border: 1px solid rgba(99,102,241,0.25);
    color: #a5b4fc;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .db-user-welcome { font-size: 0.78rem; color: #475569; }
  .db-user-name { font-size: 0.9rem; font-weight: 600; color: #e2e8f0; font-family: 'Syne', sans-serif; }
  .db-logout-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.18);
    color: #f87171;
    font-size: 0.8rem;
    padding: 0.45rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .db-logout-btn:hover {
    background: rgba(239,68,68,0.15);
    border-color: rgba(239,68,68,0.30);
    color: #fca5a5;
  }

  .db-hero {
    text-align: center;
    padding: 3rem 1rem 2.5rem;
    margin-bottom: 2.5rem;
  }
  .db-hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(99,102,241,0.10);
    border: 1px solid rgba(99,102,241,0.20);
    color: #818cf8;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.3rem 0.85rem;
    border-radius: 100px;
    margin-bottom: 1.4rem;
    letter-spacing: 0.04em;
  }
  .db-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 800;
    color: #fff;
    line-height: 1.15;
    margin-bottom: 1rem;
    letter-spacing: -0.03em;
  }
  .db-hero-title span { color: #6366f1; }
  .db-hero-sub {
    font-size: 1rem;
    color: #475569;
    max-width: 500px;
    margin: 0 auto 2rem;
    line-height: 1.7;
  }

  .db-search-wrap {
    max-width: 580px;
    margin: 0 auto;
    position: relative;
  }
  .db-search-ico {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #475569;
    pointer-events: none;
  }
  .db-search {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 14px;
    padding: 0.9rem 1rem 0.9rem 3rem;
    color: #e2e8f0;
    font-size: 0.95rem;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
  }
  .db-search::placeholder { color: #334155; }
  .db-search:focus {
    border-color: rgba(99,102,241,0.45);
    background: rgba(99,102,241,0.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.10);
  }
  .db-search-kbd {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    color: #334155;
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    border-radius: 5px;
  }

  .db-stats {
    display: flex;
    justify-content: center;
    gap: 2.5rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }
  .db-stat { text-align: center; }
  .db-stat-val { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; color: #f1f5f9; }
  .db-stat-lbl { font-size: 0.75rem; color: #334155; margin-top: 0.15rem; }

  .db-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
    gap: 1rem;
  }
  .db-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 800;
    color: #fff;
  }
  .db-see-all {
    background: none;
    border: none;
    color: #6366f1;
    font-size: 0.8rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0;
    transition: color 0.2s;
  }
  .db-see-all:hover { color: #a5b4fc; }

  .db-cats {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }
  .db-cat {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: #e2e8f0;
    padding: 0.45rem 2rem 0.45rem 1rem;
    border-radius: 100px;
    font-size: 0.8rem;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>");
    background-repeat: no-repeat;
    background-position: right 0.7rem center;
  }
  .db-cat:hover { color: #94a3b8; border-color: rgba(255,255,255,0.14); }
  .db-cat.active {
    background: rgba(99,102,241,0.15);
    border-color: rgba(99,102,241,0.30);
    color: #a5b4fc;
  }

  .db-featured {
    background: rgba(99,102,241,0.07);
    border: 1px solid rgba(99,102,241,0.18);
    border-radius: 20px;
    padding: 1.75rem 2rem;
    margin-bottom: 2rem;
    display: flex;
    gap: 1.5rem;
    align-items: center;
    flex-wrap: wrap;
    cursor: pointer;
    transition: all 0.2s;
  }
  .db-featured:hover {
    background: rgba(99,102,241,0.11);
    border-color: rgba(99,102,241,0.28);
    transform: translateY(-2px);
  }
  .db-featured-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: rgba(99,102,241,0.20);
    border: 1px solid rgba(99,102,241,0.28);
    color: #818cf8;
    font-size: 0.68rem;
    font-weight: 600;
    padding: 0.2rem 0.6rem;
    border-radius: 5px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    width: fit-content;
  }
  .db-featured-info { flex: 1; min-width: 200px; }
  .db-featured-name { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 0.35rem; }
  .db-featured-desc { font-size: 0.875rem; color: #64748b; line-height: 1.65; margin-bottom: 0.85rem; }
  .db-featured-meta { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .db-featured-actions { display: flex; flex-direction: column; gap: 0.6rem; flex-shrink: 0; align-items: flex-end; }
  .db-open-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(99,102,241,0.20);
    border: 1px solid rgba(99,102,241,0.30);
    color: #a5b4fc;
    font-size: 0.875rem;
    font-weight: 600;
    padding: 0.65rem 1.4rem;
    border-radius: 10px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .db-open-btn:hover { background: rgba(99,102,241,0.30); color: #c7d2fe; }

  .db-tool-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
    margin-bottom: 2.5rem;
  }

  .db-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 1.3rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    animation: db-fadeIn 0.3s ease both;
    text-decoration: none;
    color: inherit;
  }
  .db-card:hover {
    border-color: rgba(99,102,241,0.25);
    background: rgba(99,102,241,0.04);
    transform: translateY(-3px);
  }
  @keyframes db-fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .db-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
  }
  .db-avatar {
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
  .db-card-badges {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.35rem;
  }
  .db-badge {
    font-size: 0.68rem;
    padding: 0.2rem 0.55rem;
    border-radius: 5px;
    font-weight: 500;
    white-space: nowrap;
  }
  .db-badge-free {
    background: rgba(16,185,129,0.10);
    color: #34d399;
    border: 1px solid rgba(16,185,129,0.18);
  }
  .db-badge-paid {
    background: rgba(245,158,11,0.10);
    color: #fbbf24;
    border: 1px solid rgba(245,158,11,0.18);
  }
  .db-badge-new {
    background: rgba(99,102,241,0.12);
    color: #818cf8;
    border: 1px solid rgba(99,102,241,0.20);
  }
  .db-card-name {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 0.2rem;
  }
  .db-card-cat { font-size: 0.75rem; color: #475569; }
  .db-card-desc { font-size: 0.82rem; color: #64748b; line-height: 1.6; }
  .db-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255,255,255,0.05);
  flex-wrap: wrap; /* Permet le retour à la ligne si nécessaire */
}

/* Dans le bloc .db-card-footer, assurez flex-wrap et espacement */
.db-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255,255,255,0.05);
  flex-wrap: wrap;  /* ← crucial pour passer à la ligne */
}

/* Pour le conteneur des boutons (le div qui contient les 4 boutons) */
.db-card-footer > div:last-child {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: flex-end;
  flex: 1;
}

/* Pour les très petits écrans, on centre et on étire */
@media (max-width: 560px) {
  .db-card-footer {
    flex-direction: column;
    align-items: stretch;
  }
  .db-card-footer > div:last-child {
    justify-content: center;
  }
  .db-card-footer button,
  .db-card-footer a {
    flex: 1;
    text-align: center;
  }
}

  .db-stars {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  .db-stars-row {
    display: flex;
    gap: 2px;
  }
  .db-star {
    font-size: 12px;
    color: #fbbf24;
  }
  .db-star.empty { color: #1e293b; }
  .db-rating-val {
    font-size: 0.8rem;
    font-weight: 500;
    color: #94a3b8;
  }
  .db-reviews {
    font-size: 0.72rem;
    color: #334155;
  }
  .db-card-arrow {
    color: #334155;
    transition: all 0.2s;
    display: flex;
    align-items: center;
  }
  .db-card:hover .db-card-arrow {
    color: #6366f1;
    transform: translateX(2px);
  }

  .db-trending {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 2.5rem;
  }
  .db-trend-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.85rem 1rem;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.05);
    background: rgba(255,255,255,0.02);
    cursor: pointer;
    transition: all 0.18s;
  }
  .db-trend-row:hover {
    border-color: rgba(99,102,241,0.20);
    background: rgba(99,102,241,0.03);
  }
  .db-trend-rank {
    font-family: 'Syne', sans-serif;
    font-size: 0.85rem;
    font-weight: 800;
    color: #1e293b;
    width: 22px;
    text-align: center;
  }
  .db-trend-rank.top { color: #6366f1; }
  .db-trend-info { flex: 1; min-width: 0; }
  .db-trend-name { font-size: 0.9rem; font-weight: 500; color: #e2e8f0; margin-bottom: 0.15rem; }
  .db-trend-cat { font-size: 0.72rem; color: #475569; }
  .db-trend-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.2rem;
    flex-shrink: 0;
  }
  .db-trend-up { font-size: 0.72rem; color: #34d399; font-weight: 500; }
  .db-trend-users { font-size: 0.72rem; color: #334155; }

  .db-empty {
    text-align: center;
    padding: 4rem 2rem;
    grid-column: 1 / -1;
  }
  .db-empty-title { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: #475569; margin-bottom: 0.4rem; }
  .db-empty-sub { font-size: 0.85rem; color: #334155; }

  .db-search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #1e1f2e;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    margin-top: 4px;
    z-index: 20;
  }

  @media (max-width: 640px) {
    .db-body { padding: 1.5rem 1rem 4rem; }
    .db-hero { padding: 1.5rem 0 1.5rem; }
    .db-tool-grid { grid-template-columns: 1fr; }
    .db-featured { flex-direction: column; }
    .db-featured-actions { align-items: flex-start; }
  }
`;

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const StarRow = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="db-stars-row">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`db-star${i <= full ? '' : (i === full + 1 && half ? '' : ' empty')}`}>
          {i <= full ? '★' : (i === full + 1 && half ? '½' : '★')}
        </span>
      ))}
    </div>
  );
};

export default function Dashboard({ onOpenTool }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState(['Toutes']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupTool, setPopupTool] = useState(null);
  const navigate = useNavigate();

  const [reviewTool, setReviewTool] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [filtreCategorie, setFiltreCategorie] = useState('Toutes');
  const [filtreTarif, setFiltreTarif] = useState('Tous');
  const [filtreEntreprise, setFiltreEntreprise] = useState('Toutes');
  const [ordreTri, setOrdreTri] = useState('rating_desc');
  const [tarifsDisponibles, setTarifsDisponibles] = useState([]);
  const [entreprisesDisponibles, setEntreprisesDisponibles] = useState([]);

  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [favorites, setFavorites] = useState([]);

  const user = getUser();

  // Signalement
const [reportModal, setReportModal] = useState({ open: false, toolId: null, commentId: null });
const [reportReason, setReportReason] = useState('');
const [reporting, setReporting] = useState(false);

  useEffect(() => {
    const styleId = 'dashboard-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = css;
      document.head.appendChild(style);
    }
    return () => {
      const style = document.getElementById(styleId);
      if (style) style.remove();
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login'); return; }
    fetchTools();
  }, [navigate]);

  useEffect(() => {
    if (user) fetchRecentSearches();
  }, [user]);

  useEffect(() => {
  if (user) fetchFavorites();
}, [user]);




  const fetchTools = async () => {
    try {
      const res = await fetch(`${API_BASE}/getApps.php`);
      const data = await res.json();
      if (data.success) {
        setTools(data.tools);
        const tarifs = [...new Set(data.tools.map(t => t.pricing_type))];
        setTarifsDisponibles(tarifs);
        const entreprises = [...new Set(data.tools.map(t => t.company_name).filter(Boolean))];
        setEntreprisesDisponibles(['Toutes', ...entreprises]);
        const cats = ['Toutes', ...new Set(data.tools.map(t => t.category))];
        setCategories(cats);
      }
    } catch (err) {
      setError('Failed to load tools');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentSearches = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/get_history.php?user_id=${user.id}`);
      const data = await res.json();
      if (data.success) {
        const unique = [...new Map(data.sessions.map(s => [s.title, s])).values()];
        setRecentSearches(unique.slice(0, 5));
      }
    } catch (err) { console.error(err); }
  };

  const saveSearch = async (query) => {
    if (!user || !query.trim()) return;
    try {
      await fetch(`${API_BASE}/save_search.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, query: query.trim() })
      });
      fetchRecentSearches();
    } catch (err) { console.error(err); }
  };

  const recordView = async (toolId) => {
    if (!user) return;
    try {
      await fetch(`${API_BASE}/record_tool_view.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, tool_id: toolId })
      });
    } catch (err) { console.error(err); }
  };

  const loadReviews = async (toolId) => {
    setLoadingReviews(true);
    try {
      const res = await fetch(`${API_BASE}/getReviews.php?tool_id=${toolId}`);
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch (err) { console.error(err); }
    finally { setLoadingReviews(false); }
  };

  const submitReview = async () => {
    if (!user) { alert('Veuillez vous connecter'); return; }
    if (!userComment.trim()) { alert('Veuillez écrire un commentaire'); return; }
    setSubmitting(true);
   try {
  const response = await fetch(`${API_BASE}/submitReviews.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: user.id,
      tool_id: reviewTool.id,
      rating: userRating,
      comment: userComment
    })
  });

  // Lire la réponse brute
  const text = await response.text();
  console.log('Réponse brute:', text);  // <-- utile pour debug

  // Essayer de parser du JSON
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error('La réponse n\'est pas du JSON valide', text);
    alert('Erreur serveur : la réponse n\'est pas du JSON. Voir console.');
    return;
  }

  if (data.success) {
    await loadReviews(reviewTool.id);
    setUserComment('');
    setUserRating(5);
    fetchTools();
  } else {
    alert('Erreur: ' + (data.error || 'unknown'));
  }
} catch (err) {
  console.error('Submit error:', err);
  alert('Erreur réseau : ' + err.message);
} finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn()) return null;

  const filteredAndSorted = tools
    .filter(t => {
      if (filtreCategorie !== 'Toutes' && t.category !== filtreCategorie) return false;
      if (filtreTarif !== 'Tous' && t.pricing_type !== filtreTarif) return false;
      if (filtreEntreprise !== 'Toutes' && t.company_name !== filtreEntreprise) return false;
      const q = search.toLowerCase();
      if (q && !t.name.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
      return true;
    })
    .sort((a, b) => {
      switch (ordreTri) {
        case 'alpha_asc': return a.name.localeCompare(b.name);
        case 'alpha_desc': return b.name.localeCompare(a.name);
        case 'rating_desc': return b.global_rating - a.global_rating;
        case 'rating_asc': return a.global_rating - b.global_rating;
        default: return 0;
      }
    });



    const fetchFavorites = async () => {
  if (!user) return;
  try {
    const res = await fetch(`${API_BASE}/getFavorites.php?user_id=${user.id}`);
    const data = await res.json();
    if (data.success) {
      setFavorites(data.tools.map(t => t.id));
    }
  } catch (err) { console.error(err); }
};

const toggleFavorite = async (toolId) => {
  if (!user) return;
  try {
    const res = await fetch(`${API_BASE}/toggle_favorite.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, tool_id: toolId })
    });
    const data = await res.json();
    if (data.success) {
      if (data.action === 'added') {
        setFavorites(prev => [...prev, toolId]);
      } else {
        setFavorites(prev => prev.filter(id => id !== toolId));
      }
    }
  } catch (err) { console.error(err); }
};


const submitReport = async () => {
  if (!reportReason.trim()) {
    alert('Veuillez entrer une raison');
    return;
  }
  setReporting(true);
  try {
    const res = await fetch(`${API_BASE}/report.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        tool_id: reportModal.toolId,
        comment_id: reportModal.commentId,
        reason: reportReason
      })
    });
    const data = await res.json();
    if (data.success) {
      alert('Signalement envoyé. Merci.');
      setReportModal({ open: false, toolId: null, commentId: null });
      setReportReason('');
    } else {
      alert('Erreur: ' + (data.error || 'unknown'));
    }
  } catch (err) {
    alert('Erreur réseau');
  } finally {
    setReporting(false);
  }
};


  return (
    <div className="db-root">
      <div className="db-bg" />
      <div className="db-grid-bg" />
      <div className="db-body">
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#475569' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⟳</div>
            <p>Loading tools...</p>
          </div>
        )}
        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#f87171', background: 'rgba(239,68,68,0.08)', borderRadius: '12px', margin: '2rem 0' }}>
            {error}
          </div>
        )}
        {!loading && !error && (
          <>
            <div className="db-hero">
              <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
                Welcome back, <span style={{ color: '#a5b4fc', fontWeight: 600 }}>{user?.name || 'User'}</span> 👋
              </p>
              <button 
  onClick={() => navigate('/app/notifications')}
  style={{
    background: 'rgba(99,102,241,0.12)',
    border: '1px solid rgba(99,102,241,0.25)',
    color: '#a5b4fc',
    fontSize: '0.8rem',
    padding: '0.45rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  }}
>
  🔔 Messages
</button>
              <h1 className="db-hero-title">Discover the best<br /><span>AI tools</span> for your workflow</h1>
              <p className="db-hero-sub">Find, compare, and launch the world's most powerful AI tools — all in one place.</p>

              <div className="db-search-wrap">
                <span className="db-search-ico"><SearchIcon /></span>
                <input
                  className="db-search"
                  type="text"
                  placeholder="Search tools, categories, use cases…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && search.trim()) {
                      await saveSearch(search.trim());
                    }
                  }}
                />
                
                <span className="db-search-kbd"><button onClick={() => saveSearch(search)}>Rechercher</button></span>
                {showSuggestions && recentSearches.length > 0 && (
                  <div className="db-search-suggestions">
                    {recentSearches.map(s => (
                      <div key={s.id} style={{ padding: '0.5rem 1rem', cursor: 'pointer', color: '#e2e8f0', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }} onClick={() => { setSearch(s.title); saveSearch(s.title); setShowSuggestions(false); }}>
                        🔍 {s.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
              <select className="db-cat" value={filtreCategorie} onChange={e => setFiltreCategorie(e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="db-cat" value={filtreTarif} onChange={e => setFiltreTarif(e.target.value)}>
                <option value="Tous">Tous les tarifs</option>
                {tarifsDisponibles.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select className="db-cat" value={filtreEntreprise} onChange={e => setFiltreEntreprise(e.target.value)}>
                {entreprisesDisponibles.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <select className="db-cat" value={ordreTri} onChange={e => setOrdreTri(e.target.value)}>
                <option value="rating_desc">⭐ Meilleures notes</option>
                <option value="rating_asc">⭐ Moins bien notés</option>
                <option value="alpha_asc">🔤 Ordre alphabétique (A→Z)</option>
                <option value="alpha_desc">🔤 Ordre alphabétique (Z→A)</option>
              </select>
            </div>

            <div className="db-section-header">
              <span className="db-section-title">
                {activeCategory === 'Toutes' ? 'All tools' : activeCategory}
                <span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '0.8rem', color: '#334155', marginLeft: '0.6rem' }}>
                  {filteredAndSorted.length} tools
                </span>
              </span>
              <button className="db-see-all">View all <ArrowIcon /></button>
            </div>

            <div className="db-tool-grid">
              {filteredAndSorted.length === 0 ? (
                <div className="db-empty">
                  <div className="db-empty-title">No tools found</div>
                  <p className="db-empty-sub">Try a different search or category.</p>
                </div>
              ) : (
                filteredAndSorted.map((tool, i) => (
                  <div key={tool.id} className="db-card" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="db-card-top">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {tool.logo_url ? (
                          <img src={tool.logo_url} alt={tool.name} style={{ width: 46, height: 46, borderRadius: 12, objectFit: 'contain', background: '#fff', padding: 4 }} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                        ) : null}
                        <div className="db-avatar" style={{ display: tool.logo_url ? 'none' : 'flex', background: `${tool.color}22`, color: tool.color, borderColor: `${tool.color}33` }}>
                          {tool.initials}
                        </div>
                        <div>
                          <div className="db-card-name">{tool.name}</div>
                          <div className="db-card-cat">{tool.category_icon} {tool.category}</div>
                        </div>
                      </div>
                      <div className="db-card-badges">
                        <span className={`db-badge ${tool.pricing_type === 'free' ? 'db-badge-free' : tool.pricing_type === 'freemium' ? 'db-badge-free' : 'db-badge-paid'}`}>
                          {tool.pricing_type}
                        </span>
                        {tool.is_new && <span className="db-badge db-badge-new">New</span>}
                      </div>
                    </div>
                    <p className="db-card-desc">{tool.description}</p>
                    <div className="db-card-footer">
                      <div className="db-stars">
                        <StarRow rating={tool.global_rating} />
                        <span className="db-rating-val">{tool.global_rating}</span>
                        <span className="db-reviews">({tool.review_count})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button onClick={() => setPopupTool(tool)} style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc', fontSize: '0.72rem', padding: '0.3rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Inter', whiteSpace: 'nowrap' }}>
                          Voir plus
                        </button>
                        <button
  onClick={() => toggleFavorite(tool.id)}
  style={{
    background: favorites.includes(tool.id) ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.12)',
    border: '1px solid rgba(99,102,241,0.25)',
    color: favorites.includes(tool.id) ? '#fbbf24' : '#a5b4fc',
    fontSize: '0.72rem',
    padding: '0.3rem 0.7rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'Inter',
    whiteSpace: 'nowrap'
  }}
>
  {favorites.includes(tool.id) ? '★ In Library' : '☆ Add to Library'}
</button>
                        <button onClick={() => { setReviewTool(tool); loadReviews(tool.id); }} style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', fontSize: '0.72rem', padding: '0.3rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Inter', whiteSpace: 'nowrap' }}>
                          Noter
                        </button>
                        <button
  onClick={() => setReportModal({ open: true, toolId: tool.id, commentId: null })}
  style={{
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    color: '#f87171',
    fontSize: '0.68rem',
    padding: '0.25rem 0.6rem',
    borderRadius: '6px',
    cursor: 'pointer'
  }}
>
  ⚠️ Signaler
</button>
                        <a href={tool.website_url} target="_blank" rel="noreferrer" className="db-card-arrow" onClick={(e) => { e.stopPropagation(); recordView(tool.id); }}>
                          <ArrowIcon />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {popupTool && (
        <div onClick={() => setPopupTool(null)} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0f1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '85vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {popupTool.logo_url ? (
                  <img src={popupTool.logo_url} alt={popupTool.name} style={{ width: 56, height: 56, borderRadius: 14, objectFit: 'contain', background: '#fff', padding: 6 }} />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: `${popupTool.color}22`, color: popupTool.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 800, fontSize: '1.1rem', border: `1px solid ${popupTool.color}33` }}>
                    {popupTool.initials}
                  </div>
                )}
                <div>
                  <h2 style={{ fontFamily: 'Syne', fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>{popupTool.name}</h2>
                  <p style={{ color: '#475569', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
                    {popupTool.category_icon} {popupTool.category}
                    {popupTool.company_name && ` • ${popupTool.company_name} (${popupTool.company_country})`}
                  </p>
                </div>
              </div>
              <button onClick={() => setPopupTool(null)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1 }}>×</button>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>{popupTool.description}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <StarRow rating={popupTool.global_rating} />
              <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{popupTool.global_rating}</span>
              <span style={{ color: '#334155', fontSize: '0.8rem' }}>({popupTool.review_count} avis)</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                ['💰 Pricing', popupTool.pricing_type],
                ['🌐 Languages', popupTool.supported_languages],
                ['🆓 Free plan', popupTool.free_plan_details],
                ['⭐ Pro plan', popupTool.pro_plan_details],
                ['🔌 API', popupTool.api_available ? 'Available' : 'Not available'],
                ['📅 Released', popupTool.release_date || 'N/A'],
              ].map(([label, value]) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '0.75rem' }}>
                  <div style={{ fontSize: '0.72rem', color: '#475569', marginBottom: '0.25rem' }}>{label}</div>
                  <div style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 500 }}>{value || 'N/A'}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.5rem' }}>📱 Platforms</p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {[
                  [popupTool.is_available_web, 'Web'],
                  [popupTool.is_available_windows, 'Windows'],
                  [popupTool.is_available_mac, 'Mac'],
                  [popupTool.is_available_ios, 'iOS'],
                  [popupTool.is_available_android, 'Android'],
                ].filter(([v]) => v).map(([, label]) => (
                  <span key={label} style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc', fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: 6 }}>{label}</span>
                ))}
              </div>
            </div>
            {popupTool.integrations && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.5rem' }}>🔗 Integrations</p>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{popupTool.integrations}</p>
              </div>
            )}
            <a href={popupTool.website_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#6366f1', border: 'none', borderRadius: 10, padding: '0.85rem', color: '#fff', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }} onClick={() => recordView(popupTool.id)}>
              Visit official website ↗
            </a>
          </div>
        </div>
      )}

      {reviewTool && (
        <div onClick={() => setReviewTool(null)} style={{ position: 'fixed', inset: 0, zIndex: 1001, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0f1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, width: '100%', maxWidth: 650, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'Syne', margin: 0, color: '#fff' }}>{reviewTool.name} - Avis et notes</h3>
              <button onClick={() => setReviewTool(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
              {user && (
                <div style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                  <div style={{ marginBottom: '0.75rem', fontWeight: 600, color: '#cbd5e1' }}>Donnez votre avis</div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ color: '#94a3b8' }}>Note :</span>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      {[1,2,3,4,5].map(star => (
                        <span key={star} onClick={() => setUserRating(star)} style={{ fontSize: '1.5rem', cursor: 'pointer', color: star <= userRating ? '#fbbf24' : '#334155' }}>★</span>
                      ))}
                    </div>
                  </div>
                  <textarea value={userComment} onChange={e => setUserComment(e.target.value)} placeholder="Partagez votre expérience avec cet outil..." rows="3" style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem', color: '#e2e8f0', fontFamily: 'Inter', fontSize: '0.85rem', resize: 'vertical', marginBottom: '0.75rem' }} />
                  <button onClick={submitReview} disabled={submitting} style={{ background: '#6366f1', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', color: '#fff', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1 }}>{submitting ? 'Envoi...' : 'Envoyer mon avis'}</button>
                </div>
              )}
              <div>
                <div style={{ marginBottom: '1rem', fontWeight: 600, color: '#cbd5e1' }}>{reviews.length} avis</div>
                {loadingReviews && <div style={{ color: '#475569' }}>Chargement...</div>}
                {!loadingReviews && reviews.length === 0 && (
                  <div style={{ color: '#475569', textAlign: 'center', padding: '2rem' }}>Aucun avis pour le moment. Soyez le premier à commenter !</div>
                )}
                {reviews.map(rev => (
                  <div key={rev.id} style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <img src={rev.profile_url || 'https://i.pravatar.cc/150'} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 500, color: '#e2e8f0', fontSize: '0.85rem' }}>{rev.user_name}</div>
                        <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.2rem' }}>
                          {[1,2,3,4,5].map(s => (
                            <span key={s} style={{ fontSize: '0.7rem', color: s <= rev.rating ? '#fbbf24' : '#334155' }}>★</span>
                          ))}
                        </div>
                        <button
  onClick={() => setReportModal({ open: true, toolId: null, commentId: rev.id })}
  style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.7rem', cursor: 'pointer', marginLeft: '0.5rem' }}
>
  Signaler
</button>
                      </div>
                      <div style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#334155' }}>{new Date(rev.created_at).toLocaleDateString()}</div>
                    </div>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>{rev.comment}</p>
                  </div>
                ))}
                
              </div>
            </div>
          </div>
        </div>
      )}
      {reportModal.open && (
  <div
    onClick={() => setReportModal({ open: false, toolId: null, commentId: null })}
    style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{
        background: '#0f1120',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20,
        width: '100%', maxWidth: 400,
        padding: '1.5rem'
      }}
    >
      <h3 style={{ fontFamily: 'Syne', marginTop: 0, marginBottom: '0.5rem', color: '#fff' }}>
        Signaler
      </h3>
      <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
        {reportModal.toolId ? 'Signaler cet outil (lien cassé, contenu inapproprié, etc.)' : 'Signaler ce commentaire'}
      </p>
      <textarea
        className="sa-textarea"
        rows="3"
        placeholder="Décrivez le problème..."
        value={reportReason}
        onChange={e => setReportReason(e.target.value)}
        style={{ marginBottom: '1rem', width: '100%' }}
      />
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setReportModal({ open: false, toolId: null, commentId: null })}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', color: '#94a3b8' }}
        >
          Annuler
        </button>
        <button
          onClick={submitReport}
          disabled={reporting}
          style={{ background: '#ef4444', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', color: '#fff' }}
        >
          {reporting ? 'Envoi...' : 'Envoyer'}
        </button>
      </div>
    </div>
  </div>
)}
    <Chatbot />
    </div>
  );
}