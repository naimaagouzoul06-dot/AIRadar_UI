import { useState, useEffect } from 'react';
import { Search, ToggleLeft, ToggleRight, Trash2, Pencil, X, Check,
         Globe, Monitor, Apple, Smartphone, Tablet } from 'lucide-react';
import './Admin.css';

const API_BASE   = 'http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api';
const PRICING    = ['free', 'freemium', 'paid', 'enterprise'];

// ── Modal d'édition ────────────────────────────────────────────────────────
function EditModal({ toolId, onSaved, onClose }) {
  const [tool,     setTool]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [selTags,  setSelTags]  = useState([]);
  const [error,    setError]    = useState(null);

  // Charger les données complètes de l'outil
  useEffect(() => {
    fetch(`${API_BASE}/admin_tools.php?tool_id=${toolId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setTool(d.tool);
          setSelTags(d.tool.tag_ids.map(Number));
        } else setError(d.error || 'Erreur de chargement');
      })
      .catch(() => setError('Erreur réseau'))
      .finally(() => setLoading(false));
  }, [toolId]);

  const set = (key, val) => setTool(t => ({ ...t, [key]: val }));

  const toggleTag = (id) =>
    setSelTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res  = await fetch(`${API_BASE}/admin_tools.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action:      'edit',
          tool_id:     toolId,
          name:        tool.name,
          description: tool.description,
          website_url: tool.website_url,
          logo_url:    tool.logo_url || '',
          pricing_type:          tool.pricing_type,
          category_id:           tool.categorie_principale_id,
          api_available:         tool.api_available,
          is_new:                tool.is_new,
          release_date:          tool.release_date || '',
          is_available_web:      tool.is_available_web,
          is_available_windows:  tool.is_available_windows,
          is_available_mac:      tool.is_available_mac,
          is_available_ios:      tool.is_available_ios,
          is_available_android:  tool.is_available_android,
          tag_ids: selTags,
        }),
      });
      const data = await res.json();
      if (data.success) onSaved();
      else setError(data.error || 'Erreur de sauvegarde');
    } catch { setError('Erreur réseau'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem',
    }}>
      <div style={{
        background: '#1e293b', border: '1px solid #334155',
        borderRadius: '14px', width: '820px', maxWidth: '98vw',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 28px 80px rgba(0,0,0,0.55)',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.4rem', borderBottom: '1px solid #334155', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Pencil size={17} color="#6366f1" />
            <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '1rem' }}>
              Modifier l'outil
              {tool && <span style={{ color: '#6366f1', marginLeft: 8 }}>{tool.name}</span>}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '1.4rem', flex: 1 }}>
          {loading ? (
            <div className="adm-loading">Chargement...</div>
          ) : error ? (
            <div style={{ color: '#f87171', padding: '1rem', textAlign: 'center' }}>{error}</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>

              {/* ── Colonne gauche ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                <Field label="Nom *">
                  <input className="adm-form-input" value={tool.name || ''}
                    onChange={e => set('name', e.target.value)} />
                </Field>

                <Field label="Description *">
                  <textarea className="adm-form-input" value={tool.description || ''}
                    onChange={e => set('description', e.target.value)}
                    rows={4} style={{ resize: 'vertical' }} />
                </Field>

                <Field label="URL du site *">
                  <input className="adm-form-input" value={tool.website_url || ''}
                    onChange={e => set('website_url', e.target.value)} placeholder="https://..." />
                </Field>

                <Field label="URL du logo">
                  <input className="adm-form-input" value={tool.logo_url || ''}
                    onChange={e => set('logo_url', e.target.value)} placeholder="https://..." />
                </Field>

                <Field label="Date de sortie">
                  <input className="adm-form-input" type="date"
                    value={tool.release_date ? tool.release_date.slice(0, 10) : ''}
                    onChange={e => set('release_date', e.target.value)} />
                </Field>

              </div>

              {/* ── Colonne droite ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                <Field label="Catégorie *">
                  <select className="adm-form-input adm-filter-select"
                    value={tool.categorie_principale_id || ''}
                    onChange={e => set('categorie_principale_id', e.target.value)}>
                    <option value="">— Sélectionner —</option>
                    {(tool._categories || []).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Tarification *">
                  <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                    {PRICING.map(p => (
                      <button key={p} type="button" onClick={() => set('pricing_type', p)}
                        style={{
                          padding: '5px 14px', borderRadius: '99px', cursor: 'pointer',
                          fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.15s',
                          border: tool.pricing_type === p ? '1px solid #6366f1' : '1px solid #334155',
                          background: tool.pricing_type === p ? 'rgba(99,102,241,0.18)' : 'transparent',
                          color: tool.pricing_type === p ? '#a5b4fc' : '#64748b',
                        }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Plateformes">
                  <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                    {[
                      { key: 'is_available_web',     icon: <Globe size={13}/>,      label: 'Web'     },
                      { key: 'is_available_windows', icon: <Monitor size={13}/>,    label: 'Windows' },
                      { key: 'is_available_mac',     icon: <Apple size={13}/>,      label: 'Mac'     },
                      { key: 'is_available_ios',     icon: <Tablet size={13}/>,     label: 'iOS'     },
                      { key: 'is_available_android', icon: <Smartphone size={13}/>, label: 'Android' },
                    ].map(({ key, icon, label }) => (
                      <button key={key} type="button"
                        onClick={() => set(key, tool[key] ? 0 : 1)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '5px 11px', borderRadius: '8px', cursor: 'pointer',
                          fontSize: '0.78rem', transition: 'all 0.15s',
                          border:      tool[key] ? '1px solid #22c55e' : '1px solid #334155',
                          background:  tool[key] ? 'rgba(34,197,94,0.12)' : 'transparent',
                          color:       tool[key] ? '#22c55e' : '#64748b',
                        }}>
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Options">
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', fontSize: '0.83rem', color: '#94a3b8' }}>
                      <input type="checkbox"
                        checked={!!tool.api_available}
                        onChange={e => set('api_available', e.target.checked ? 1 : 0)} />
                      API disponible
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', fontSize: '0.83rem', color: '#94a3b8' }}>
                      <input type="checkbox"
                        checked={!!tool.is_new}
                        onChange={e => set('is_new', e.target.checked ? 1 : 0)} />
                      Marquer comme nouveau
                    </label>
                  </div>
                </Field>

                <Field label="Tags">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '130px', overflowY: 'auto', paddingRight: '2px' }}>
                    {(tool._tags || []).map(t => {
                      const sel = selTags.includes(Number(t.id));
                      return (
                        <button key={t.id} type="button" onClick={() => toggleTag(Number(t.id))}
                          style={{
                            padding: '3px 11px', borderRadius: '99px', cursor: 'pointer',
                            fontSize: '0.76rem', transition: 'all 0.15s',
                            border:     sel ? '1px solid #6366f1' : '1px solid #334155',
                            background: sel ? 'rgba(99,102,241,0.18)' : 'transparent',
                            color:      sel ? '#a5b4fc' : '#64748b',
                            display: 'flex', alignItems: 'center', gap: 4,
                          }}>
                          {sel && <Check size={9} />}#{t.name}
                        </button>
                      );
                    })}
                  </div>
                </Field>

              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && (
          <div style={{
            display: 'flex', gap: '8px', justifyContent: 'flex-end',
            padding: '1rem 1.4rem', borderTop: '1px solid #1e293b', flexShrink: 0,
          }}>
            <button onClick={onClose} style={{
              padding: '8px 20px', borderRadius: '8px', cursor: 'pointer',
              border: '1px solid #334155', background: 'transparent',
              color: '#94a3b8', fontSize: '0.85rem',
            }}>
              Annuler
            </button>
            <button onClick={handleSave} disabled={saving} style={{
              padding: '8px 20px', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer',
              border: '1px solid #6366f1',
              background: saving ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.22)',
              color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              {saving ? <><span className="adm-spinner" />Sauvegarde...</> : <><Check size={14} />Sauvegarder</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  );
}

// ── Page principale ATools ─────────────────────────────────────────────────
export default function ATools() {
  const [tools,     setTools]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('all');
  const [toast,     setToast]     = useState(null);
  const [editId,    setEditId]    = useState(null); // id de l'outil en cours d'édition

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchTools = () => {
    setLoading(true);
    fetch(`${API_BASE}/admin_tools.php`)
      .then(r => r.json())
      .then(d => { if (d.success) setTools(d.tools); })
      .catch(() => showToast('Erreur de chargement', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTools(); }, []);

  const handleAction = async (id, action) => {
    if (action === 'delete' && !window.confirm('Supprimer cet outil définitivement ?')) return;
    try {
      const res  = await fetch(`${API_BASE}/admin_tools.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, tool_id: id }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(action === 'delete' ? 'Outil supprimé' : action === 'activate' ? 'Outil activé ✓' : 'Outil désactivé');
        fetchTools();
      } else showToast(data.error || 'Échec', 'error');
    } catch { showToast('Erreur réseau', 'error'); }
  };

  const filtered = tools.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                        (t.category || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || t.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="adm-page">

      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <span className="adm-search-icon"><Search size={14} /></span>
          <input className="adm-search" placeholder="Rechercher un outil..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="adm-filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
          <option value="pending">En attente</option>
        </select>
      </div>

      {loading ? <div className="adm-loading">Chargement des outils...</div> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>Outil</th><th>Catégorie</th><th>Pricing</th><th>Rating</th><th>Statut</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length ? filtered.map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{t.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#475569' }}>{t.company_name || '—'}</div>
                  </td>
                  <td style={{ color: '#64748b' }}>{t.category}</td>
                  <td><span className="adm-badge adm-badge-blue">{t.pricing_type}</span></td>
                  <td style={{ color: '#fbbf24' }}>★ {t.global_rating}</td>
                  <td>
                    <span className={`adm-badge ${
                      t.status === 'active'   ? 'adm-badge-green' :
                      t.status === 'inactive' ? 'adm-badge-red'   : 'adm-badge-yellow'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {/* Modifier */}
                    <button className="adm-action-btn"
                      style={{ color: '#6366f1', borderColor: 'rgba(99,102,241,0.4)' }}
                      onClick={() => setEditId(t.id)}>
                      <Pencil size={12} /> Modifier
                    </button>

                    {/* Activer / Désactiver */}
                    {t.status === 'active' ? (
                      <button className="adm-action-btn warn" onClick={() => handleAction(t.id, 'deactivate')}>
                        <ToggleLeft size={12} /> Désactiver
                      </button>
                    ) : (
                      <button className="adm-action-btn success" onClick={() => handleAction(t.id, 'activate')}>
                        <ToggleRight size={12} /> Activer
                      </button>
                    )}

                    {/* Supprimer */}
                    <button className="adm-action-btn danger" onClick={() => handleAction(t.id, 'delete')}>
                      <Trash2 size={12} /> Supprimer
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="adm-empty">
                  {search ? `Aucun outil pour "${search}"` : 'Aucun outil trouvé'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal édition */}
      {editId && (
        <EditModal
          toolId={editId}
          onSaved={() => { showToast('Outil mis à jour ✓'); setEditId(null); fetchTools(); }}
          onClose={() => setEditId(null)}
        />
      )}

      {toast && <div className={`adm-toast ${toast.type === 'error' ? 'error' : ''}`}>{toast.msg}</div>}
    </div>
  );
}