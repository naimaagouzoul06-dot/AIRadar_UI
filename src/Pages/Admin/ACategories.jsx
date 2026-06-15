import { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import './Admin.css';

const API_BASE = 'http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api';

export default function ACategories() {
  const [cats,    setCats]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('');
  const [adding,  setAdding]  = useState(false);
  const [search,  setSearch]  = useState('');
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchCats = () => {
    setLoading(true);
    fetch(`${API_BASE}/admin_categories.php`)
      .then(r => r.json())
      .then(d => { if (d.success) setCats(d.categories); })
      .catch(() => showToast('Erreur de chargement', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCats(); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) { showToast('Le nom est requis', 'error'); return; }
    setAdding(true);
    try {
      const res  = await fetch(`${API_BASE}/admin_categories.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', name: newName.trim(), icon: newIcon.trim() }),
      });
      const data = await res.json();
      if (data.success) { showToast('Catégorie ajoutée ✓'); setNewName(''); setNewIcon(''); fetchCats(); }
      else showToast(data.error || 'Erreur', 'error');
    } catch { showToast('Erreur réseau', 'error'); }
    finally { setAdding(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    try {
      const res  = await fetch(`${API_BASE}/admin_categories.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', category_id: id }),
      });
      const data = await res.json();
      if (data.success) { showToast('Catégorie supprimée'); fetchCats(); }
      else showToast(data.error || 'Erreur', 'error');
    } catch { showToast('Erreur réseau', 'error'); }
  };

  const filtered = cats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="adm-page">

      {/* ── Ajouter une catégorie ── */}
      <div className="adm-add-form">
        <div className="adm-form-group">
          <label className="adm-form-label">Nom de la catégorie</label>
          <input
            className="adm-form-input"
            placeholder="ex : Image Generation"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
        </div>
        <div className="adm-form-group" style={{ maxWidth: 120 }}>
          <label className="adm-form-label">Icône (emoji)</label>
          <input
            className="adm-form-input"
            placeholder="ex : 🖼️"
            value={newIcon}
            onChange={e => setNewIcon(e.target.value)}
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
            placeholder="Rechercher une catégorie..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span style={{ fontSize: '0.8rem', color: '#475569', marginLeft: 'auto' }}>
          {filtered.length} / {cats.length} catégorie{cats.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Tableau ── */}
      {loading ? <div className="adm-loading">Chargement des catégories...</div> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>Icône</th><th>Nom</th><th>Outils</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length ? filtered.map(c => (
                <tr key={c.id}>
                  <td style={{ fontSize: '1.3rem' }}>{c.icon || '📁'}</td>
                  <td style={{ color: '#e2e8f0', fontWeight: 500 }}>{c.name}</td>
                  <td>
                    <span style={{
                      background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                      borderRadius: '99px', padding: '2px 10px',
                      fontSize: '0.78rem', color: '#a5b4fc',
                    }}>
                      {c.tools_count ?? 0} outil{c.tools_count > 1 ? 's' : ''}
                    </span>
                  </td>
                  <td>
                    <button className="adm-action-btn danger" onClick={() => handleDelete(c.id)}>
                      <Trash2 size={12} /> Supprimer
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="adm-empty">
                    {search ? `Aucune catégorie pour "${search}"` : 'Aucune catégorie'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {toast && <div className={`adm-toast ${toast.type === 'error' ? 'error' : ''}`}>{toast.msg}</div>}
    </div>
  );
}