import { useState, useEffect } from 'react';
import { EyeOff, Eye, Trash2, AlertCircle } from 'lucide-react';
import './Admin.css';

const API_BASE = 'http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api';

export default function AReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [filter, setFilter]   = useState('all');
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchReviews = () => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/admin_reviews.php?status=${filter}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => {
        if (d.success) {
          setReviews(d.reviews);
        } else {
          setError(d.error || 'Erreur serveur');
        }
      })
      .catch(err => setError(`Impossible de charger les commentaires : ${err.message}`))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, [filter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return;
    try {
      const res  = await fetch(`${API_BASE}/admin_reviews.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', review_id: id }),
      });
      const data = await res.json();
      if (data.success) { showToast('Commentaire supprimé ✓'); fetchReviews(); }
      else showToast(data.error || 'Échec', 'error');
    } catch { showToast('Erreur réseau', 'error'); }
  };

  const handleModerate = async (id, status) => {
    try {
      const res  = await fetch(`${API_BASE}/admin_reviews.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'moderate', review_id: id, status }),
      });
      const data = await res.json();
      if (data.success) { showToast(`Statut mis à jour : ${status}`); fetchReviews(); }
      else showToast(data.error || 'Échec', 'error');
    } catch { showToast('Erreur réseau', 'error'); }
  };

  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <div className="adm-page">
      <div className="adm-toolbar">
        <select className="adm-filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Erreur API */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '8px', padding: '0.75rem 1rem',
          color: '#ef4444', fontSize: '0.85rem', margin: '0 0 1rem 0',
        }}>
          <AlertCircle size={16} />
          {error}
          <button onClick={fetchReviews} style={{
            marginLeft: 'auto', fontSize: '0.8rem', padding: '4px 12px',
            border: '1px solid #ef4444', borderRadius: '6px',
            background: 'transparent', color: '#ef4444', cursor: 'pointer',
          }}>
            Réessayer
          </button>
        </div>
      )}

      {loading ? (
        <div className="adm-loading">Chargement des commentaires...</div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Tool</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length ? reviews.map(r => (
                <tr key={r.id}>
                  <td style={{ color: '#e2e8f0', fontWeight: 500 }}>{r.user_name}</td>
                  <td style={{ color: '#64748b' }}>{r.tool_name}</td>
                  <td>
                    <span className="adm-stars" title={`${r.rating}/5`}>
                      {stars(parseInt(r.rating))}
                    </span>
                  </td>
                  <td>
                    <div className="adm-comment">{r.comment || '—'}</div>
                  </td>
                  <td style={{ color: '#475569', whiteSpace: 'nowrap' }}>
                    {new Date(r.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td>
                    <span className={`adm-badge ${
                      r.moderation_status === 'active'   ? 'adm-badge-green'  :
                      r.moderation_status === 'inactive' ? 'adm-badge-red'    :
                      'adm-badge-yellow'
                    }`}>
                      {r.moderation_status}
                    </span>
                  </td>
                  <td>
                    {r.moderation_status !== 'inactive' ? (
                      <button className="adm-action-btn warn" onClick={() => handleModerate(r.id, 'inactive')}>
                        <EyeOff size={12} /> Hide
                      </button>
                    ) : (
                      <button className="adm-action-btn success" onClick={() => handleModerate(r.id, 'active')}>
                        <Eye size={12} /> Restore
                      </button>
                    )}
                    <button className="adm-action-btn danger" onClick={() => handleDelete(r.id)}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="adm-empty">
                    {error ? 'Erreur de chargement' : 'No reviews found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {toast && (
        <div className={`adm-toast ${toast.type === 'error' ? 'error' : ''}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}