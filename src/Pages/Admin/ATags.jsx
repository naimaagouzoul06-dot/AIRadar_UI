import { useState, useEffect } from 'react';
import { Plus, X, Search } from 'lucide-react';
import './Admin.css';

const API_BASE = 'http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api';

export default function ATags() {
  const [tags,    setTags]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTag,  setNewTag]  = useState('');
  const [adding,  setAdding]  = useState(false);
  const [search,  setSearch]  = useState('');
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchTags = () => {
    setLoading(true);
    fetch(`${API_BASE}/admin_tags.php`)
      .then(r => r.json())
      .then(d => { if (d.success) setTags(d.tags); })
      .catch(() => showToast('Failed to load tags', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTags(); }, []);

  const handleAdd = async () => {
    if (!newTag.trim()) { showToast('Tag name required', 'error'); return; }
    setAdding(true);
    try {
      const res  = await fetch(`${API_BASE}/admin_tags.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', name: newTag.trim() }),
      });
      const data = await res.json();
      if (data.success) { showToast('Tag ajouté ✓'); setNewTag(''); fetchTags(); }
      else showToast(data.error || 'Erreur', 'error');
    } catch { showToast('Erreur réseau', 'error'); }
    finally { setAdding(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce tag ?')) return;
    try {
      const res  = await fetch(`${API_BASE}/admin_tags.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', tag_id: id }),
      });
      const data = await res.json();
      if (data.success) { showToast('Tag supprimé'); fetchTags(); }
      else showToast(data.error || 'Erreur', 'error');
    } catch { showToast('Erreur réseau', 'error'); }
  };

  const filtered = tags.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="adm-page">

      {/* ── Ajouter un tag ── */}
      <div className="adm-add-form">
        <div className="adm-form-group">
          <label className="adm-form-label">Nom du tag</label>
          <input
            className="adm-form-input"
            placeholder="ex : text-to-image"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
        </div>
        <button className="adm-add-btn" onClick={handleAdd} disabled={adding}>
          <Plus size={15} /> {adding ? 'Ajout...' : 'Ajouter'}
        </button>
      </div>

      {/* ── Barre de recherche ── */}
      <div className="adm-toolbar" style={{ marginBottom: '1rem' }}>
        <div className="adm-search-wrap">
          <span className="adm-search-icon"><Search size={14} /></span>
          <input
            className="adm-search"
            placeholder="Rechercher un tag..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span style={{ fontSize: '0.8rem', color: '#475569', marginLeft: 'auto' }}>
          {filtered.length} / {tags.length} tag{tags.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Liste ── */}
      {loading ? <div className="adm-loading">Chargement des tags...</div> : (
        filtered.length ? (
          <div className="adm-tags-grid">
            {filtered.map(t => (
              <div className="adm-tag-item" key={t.id}>
                <span style={{ color: '#6366f1', marginRight: 4, opacity: 0.6 }}>#</span>
                {t.name}
                {t.tool_count > 0 && (
                  <span style={{
                    marginLeft: 6, fontSize: '0.68rem', color: '#475569',
                    background: 'rgba(255,255,255,0.05)', borderRadius: '99px',
                    padding: '1px 6px',
                  }}>
                    {t.tool_count}
                  </span>
                )}
                <button className="adm-tag-del" onClick={() => handleDelete(t.id)} title="Supprimer">
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="adm-empty">
            {search ? `Aucun tag trouvé pour "${search}"` : 'Aucun tag'}
          </div>
        )
      )}

      {toast && <div className={`adm-toast ${toast.type === 'error' ? 'error' : ''}`}>{toast.msg}</div>}
    </div>
  );
}