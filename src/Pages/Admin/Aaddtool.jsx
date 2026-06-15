import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Check, X, Globe, Monitor, Apple, Smartphone, Tablet } from 'lucide-react';
import { getUser } from '../../Js/useAuth';
import './Admin.css';

const API_BASE = 'http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api';

const PRICING_OPTIONS = ['free', 'freemium', 'paid', 'enterprise'];

export default function AAddTool() {
  const navigate     = useNavigate();
  const location     = useLocation();
  const admin        = getUser();

  // Si on vient de ASubmissions, la soumission est passée en state
  const fromSubmission = location.state?.submission ?? null;

  const [categories, setCategories] = useState([]);
  const [tags,       setTags]       = useState([]);
  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState(null);

  // Formulaire — prérempli depuis la soumission si disponible
  const [form, setForm] = useState({
    name:          fromSubmission?.tool_name   ?? '',
    tagline:       fromSubmission?.tagline     ?? '',
    description:   fromSubmission?.description ?? '',
    website_url:   fromSubmission?.website     ?? '',
    logo_url:      '',
    pricing_type:  fromSubmission?.pricing     ?? 'freemium',
    category_id:   '',
    release_date:  '',
    api_available: fromSubmission?.api_available === 'yes',
    is_new:        true,
    is_available_web:     true,
    is_available_windows: false,
    is_available_mac:     false,
    is_available_ios:     false,
    is_available_android: false,
  });
  const [selectedTags, setSelectedTags] = useState([]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Charger catégories + tags
  useEffect(() => {
    fetch(`${API_BASE}/admin_add_tool.php`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setCategories(d.categories);
          setTags(d.tags);
          // Pré-sélectionner la catégorie si soumission
          if (fromSubmission?.category) {
            try {
              const cats = JSON.parse(fromSubmission.category);
              if (cats.length && d.categories.length) {
                const match = d.categories.find(c =>
                  c.name.toLowerCase() === cats[0].toLowerCase()
                );
                if (match) setForm(f => ({ ...f, category_id: match.id }));
              }
            } catch {}
          }
        }
      });
  }, []);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleTag = (id) => {
    setSelectedTags(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!form.name.trim())        { showToast('Le nom est requis', 'error'); return; }
    if (!form.description.trim()) { showToast('La description est requise', 'error'); return; }
    if (!form.website_url.trim()) { showToast("L'URL du site est requise", 'error'); return; }
    if (!form.category_id)        { showToast('La catégorie est requise', 'error'); return; }

    setSaving(true);
    try {
      const res  = await fetch(`${API_BASE}/admin_add_tool.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tag_ids: selectedTags,
          admin_id: admin?.id ?? 0,
          submission_id: fromSubmission?.id ?? 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Outil ajouté avec succès ✓");
        setTimeout(() => navigate('/admin/tools'), 1500);
      } else {
        showToast(data.error || 'Erreur', 'error');
      }
    } catch { showToast('Erreur réseau', 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="adm-page">

      {/* Bannière soumission source */}
      {fromSubmission && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: '10px', padding: '0.75rem 1.1rem',
          marginBottom: '1.5rem', fontSize: '0.85rem', color: '#a5b4fc',
        }}>
          <Check size={16} />
          Formulaire prérempli depuis la soumission de&nbsp;
          <strong style={{ color: '#e2e8f0' }}>{fromSubmission.submitter_name || fromSubmission.submitter_email}</strong>
          &nbsp;— vérifiez et complétez les champs manquants.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* ── Colonne gauche ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

          <Field label="Nom de l'outil *">
            <input className="adm-form-input" value={form.name}
              onChange={e => set('name', e.target.value)} placeholder="ex : ChatGPT" />
          </Field>

          <Field label="Tagline">
            <input className="adm-form-input" value={form.tagline}
              onChange={e => set('tagline', e.target.value)} placeholder="Une phrase courte de description" />
          </Field>

          <Field label="Description *">
            <textarea className="adm-form-input" value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={4} placeholder="Description complète de l'outil..." />
          </Field>

          <Field label="URL du site *">
            <input className="adm-form-input" value={form.website_url}
              onChange={e => set('website_url', e.target.value)} placeholder="https://..." />
          </Field>

          <Field label="URL du logo">
            <input className="adm-form-input" value={form.logo_url}
              onChange={e => set('logo_url', e.target.value)} placeholder="https://..." />
          </Field>

          <Field label="Date de sortie">
            <input className="adm-form-input" type="date" value={form.release_date}
              onChange={e => set('release_date', e.target.value)} />
          </Field>

        </div>

        {/* ── Colonne droite ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

          <Field label="Catégorie principale *">
            <select className="adm-form-input adm-filter-select" value={form.category_id}
              onChange={e => set('category_id', e.target.value)}>
              <option value="">— Sélectionner —</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Tarification *">
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {PRICING_OPTIONS.map(p => (
                <button key={p} type="button"
                  onClick={() => set('pricing_type', p)}
                  style={{
                    padding: '5px 14px', borderRadius: '99px', cursor: 'pointer',
                    fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.15s',
                    border: form.pricing_type === p ? '1px solid #6366f1' : '1px solid #334155',
                    background: form.pricing_type === p ? 'rgba(99,102,241,0.18)' : 'transparent',
                    color: form.pricing_type === p ? '#a5b4fc' : '#64748b',
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </Field>

          {/* Plateformes */}
          <Field label="Plateformes disponibles">
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { key: 'is_available_web',     icon: <Globe size={14} />,       label: 'Web'     },
                { key: 'is_available_windows', icon: <Monitor size={14} />,     label: 'Windows' },
                { key: 'is_available_mac',     icon: <Apple size={14} />,       label: 'Mac'     },
                { key: 'is_available_ios',     icon: <Tablet size={14} />,      label: 'iOS'     },
                { key: 'is_available_android', icon: <Smartphone size={14} />,  label: 'Android' },
              ].map(({ key, icon, label }) => (
                <button key={key} type="button" onClick={() => set(key, !form[key])}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '5px 12px', borderRadius: '8px', cursor: 'pointer',
                    fontSize: '0.8rem', transition: 'all 0.15s',
                    border: form[key] ? '1px solid #22c55e' : '1px solid #334155',
                    background: form[key] ? 'rgba(34,197,94,0.12)' : 'transparent',
                    color: form[key] ? '#22c55e' : '#64748b',
                  }}>
                  {icon} {label}
                </button>
              ))}
            </div>
          </Field>

          {/* Checkboxes API + nouveau */}
          <Field label="Options">
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: '#94a3b8' }}>
                <input type="checkbox" checked={form.api_available}
                  onChange={e => set('api_available', e.target.checked)} />
                API disponible
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: '#94a3b8' }}>
                <input type="checkbox" checked={form.is_new}
                  onChange={e => set('is_new', e.target.checked)} />
                Marquer comme nouveau
              </label>
            </div>
          </Field>

          {/* Tags */}
          <Field label="Tags associés">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '150px', overflowY: 'auto', paddingRight: '4px' }}>
              {tags.map(t => {
                const selected = selectedTags.includes(t.id);
                return (
                  <button key={t.id} type="button" onClick={() => toggleTag(t.id)}
                    style={{
                      padding: '4px 12px', borderRadius: '99px', cursor: 'pointer',
                      fontSize: '0.78rem', transition: 'all 0.15s',
                      border: selected ? '1px solid #6366f1' : '1px solid #334155',
                      background: selected ? 'rgba(99,102,241,0.18)' : 'transparent',
                      color: selected ? '#a5b4fc' : '#64748b',
                    }}>
                    {selected && <Check size={10} style={{ marginRight: 4 }} />}
                    #{t.name}
                  </button>
                );
              })}
            </div>
          </Field>

        </div>
      </div>

      {/* ── Boutons ── */}
      <div style={{
        display: 'flex', gap: '10px', justifyContent: 'flex-end',
        marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #1e293b',
      }}>
        <button
          onClick={() => navigate(fromSubmission ? '/admin/submissions' : '/admin/tools')}
          style={{
            padding: '9px 22px', borderRadius: '8px', cursor: 'pointer',
            border: '1px solid #334155', background: 'transparent',
            color: '#94a3b8', fontSize: '0.85rem',
          }}>
          <X size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          Annuler
        </button>
        <button onClick={handleSubmit} disabled={saving}
          style={{
            padding: '9px 22px', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer',
            border: '1px solid #6366f1',
            background: saving ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.2)',
            color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
          {saving
            ? <><span className="adm-spinner" />Ajout en cours...</>
            : <><Plus size={14} />Ajouter l'outil</>
          }
        </button>
      </div>

      {toast && (
        <div className={`adm-toast ${toast.type === 'error' ? 'error' : ''}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// Composant helper Field
function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  );
}