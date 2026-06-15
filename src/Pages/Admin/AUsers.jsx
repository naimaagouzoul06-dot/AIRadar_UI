import { useState, useEffect } from 'react';
import { Search, Ban, CheckCircle, Trash2, Clock, X, AlertTriangle } from 'lucide-react';
import './Admin.css';

const API_BASE = 'http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api';

const DURATIONS = [
  { value: '1d',        label: '1 jour' },
  { value: '3d',        label: '3 jours' },
  { value: '7d',        label: '7 jours' },
  { value: '14d',       label: '14 jours' },
  { value: '30d',       label: '30 jours' },
  { value: '90d',       label: '90 jours' },
  { value: 'permanent', label: 'Permanent' },
];

// ── Modal de suspension avec choix de durée ────────────────────────────────
function SuspendModal({ user, onConfirm, onCancel }) {
  const [duration, setDuration] = useState('7d');
  const [reason,   setReason]   = useState('');

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{
        background: '#1e293b', border: '1px solid #334155',
        borderRadius: '14px', width: '460px', maxWidth: '95vw',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem', borderBottom: '1px solid #334155',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ban size={18} color="#f97316" />
            <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.95rem' }}>
              Suspendre l'utilisateur
            </span>
          </div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

          {/* Info utilisateur */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#0f172a', border: '1px solid #1e3a5f',
            borderRadius: '9px', padding: '0.65rem 0.9rem',
          }}>
            <span style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#f87171', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
            }}>
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.88rem' }}>{user.name}</div>
              <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{user.email}</div>
            </div>
          </div>

          {/* Durée */}
          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
              <Clock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              Durée de la suspension
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {DURATIONS.map(d => (
                <button key={d.value} type="button"
                  onClick={() => setDuration(d.value)}
                  style={{
                    padding: '6px 14px', borderRadius: '99px', cursor: 'pointer',
                    fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.15s',
                    border: duration === d.value
                      ? d.value === 'permanent' ? '1px solid #ef4444' : '1px solid #f97316'
                      : '1px solid #334155',
                    background: duration === d.value
                      ? d.value === 'permanent' ? 'rgba(239,68,68,0.15)' : 'rgba(249,115,22,0.15)'
                      : 'transparent',
                    color: duration === d.value
                      ? d.value === 'permanent' ? '#f87171' : '#fb923c'
                      : '#64748b',
                  }}>
                  {d.value === 'permanent' && <AlertTriangle size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />}
                  {d.label}
                </button>
              ))}
            </div>

            {/* Aperçu de la date de fin */}
            {duration !== 'permanent' && (
              <div style={{
                marginTop: '8px', fontSize: '0.78rem', color: '#64748b',
                display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                <Clock size={11} />
                Fin prévue : <span style={{ color: '#fb923c' }}>{computeEndLabel(duration)}</span>
              </div>
            )}
            {duration === 'permanent' && (
              <div style={{ marginTop: '8px', fontSize: '0.78rem', color: '#f87171' }}>
                ⚠ Suspension permanente — l'utilisateur devra être réactivé manuellement.
              </div>
            )}
          </div>

          {/* Raison */}
          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
              Raison <span style={{ color: '#475569' }}>(optionnel — visible dans la notification)</span>
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Ex : Violation des conditions d'utilisation, spams répétés..."
              rows={2}
              style={{
                width: '100%', background: '#0f172a',
                border: '1px solid #334155', borderRadius: '8px',
                padding: '8px 12px', color: '#e2e8f0',
                fontSize: '0.82rem', fontFamily: 'inherit',
                resize: 'vertical', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Boutons */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button onClick={onCancel} style={{
              fontSize: '0.82rem', padding: '7px 18px',
              border: '1px solid #334155', borderRadius: '8px',
              background: 'transparent', color: '#94a3b8', cursor: 'pointer',
            }}>
              Annuler
            </button>
            <button
              onClick={() => onConfirm({ duration, reason: reason.trim() })}
              style={{
                fontSize: '0.82rem', padding: '7px 18px',
                border: duration === 'permanent' ? '1px solid #ef4444' : '1px solid #f97316',
                borderRadius: '8px',
                background: duration === 'permanent' ? 'rgba(239,68,68,0.15)' : 'rgba(249,115,22,0.15)',
                color: duration === 'permanent' ? '#f87171' : '#fb923c',
                cursor: 'pointer', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
              <Ban size={13} />
              Confirmer la suspension
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Calculer l'aperçu de la date de fin
function computeEndLabel(duration) {
  const map = { '1d': 1, '3d': 3, '7d': 7, '14d': 14, '30d': 30, '90d': 90 };
  const days = map[duration];
  if (!days) return '';
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Afficher le temps restant d'une suspension
function SuspendBadge({ user }) {
  if (user.status !== 'suspended') return null;

  if (!user.suspension_end) {
    return (
      <div style={{ fontSize: '0.7rem', color: '#f87171', marginTop: '2px' }}>
        Permanent
      </div>
    );
  }

  const end  = new Date(user.suspension_end);
  const now  = new Date();
  const diff = end - now;

  if (diff <= 0) return null;

  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  let label = '';
  if (days > 0)        label = `${days}j restant${days > 1 ? 's' : ''}`;
  else if (hours > 0)  label = `${hours}h restantes`;
  else                 label = `${minutes}min restantes`;

  return (
    <div style={{ fontSize: '0.7rem', color: '#fb923c', marginTop: '2px' }}>
      <Clock size={10} style={{ marginRight: 3, verticalAlign: 'middle' }} />
      {label} · fin le {end.toLocaleDateString('fr-FR')}
    </div>
  );
}

// ── Composant principal ────────────────────────────────────────────────────
export default function AUsers() {
  const [users,        setUsers]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [filter,       setFilter]       = useState('all');
  const [toast,        setToast]        = useState(null);
  const [suspendModal, setSuspendModal] = useState(null); // user object

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${API_BASE}/admin_users.php`)
      .then(r => r.json())
      .then(d => { if (d.success) setUsers(d.users); })
      .catch(() => showToast('Erreur de chargement', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  // Confirmer la suspension avec durée
  const handleSuspend = async (userId, { duration, reason }) => {
    try {
      const res  = await fetch(`${API_BASE}/admin_users.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'suspend', user_id: userId, duration, reason }),
      });
      const data = await res.json();
      if (data.success) {
        const dur = DURATIONS.find(d => d.value === duration)?.label ?? duration;
        showToast(`Utilisateur suspendu · ${dur}`);
        fetchUsers();
      } else showToast(data.error || 'Échec', 'error');
    } catch { showToast('Erreur réseau', 'error'); }
  };

  const handleAction = async (userId, action) => {
    if (action === 'delete' && !window.confirm('Supprimer cet utilisateur définitivement ?')) return;
    try {
      const res  = await fetch(`${API_BASE}/admin_users.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, user_id: userId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(action === 'reactivate' ? 'Compte réactivé ✓' : 'Utilisateur supprimé');
        fetchUsers();
      } else showToast(data.error || 'Échec', 'error');
    } catch { showToast('Erreur réseau', 'error'); }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="adm-page">

      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <span className="adm-search-icon"><Search size={14} /></span>
          <input className="adm-search" placeholder="Rechercher un utilisateur..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="adm-filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">Tous</option>
          <option value="active">Actifs</option>
          <option value="suspended">Suspendus</option>
          <option value="pending">En attente</option>
        </select>
      </div>

      {loading ? <div className="adm-loading">Chargement des utilisateurs...</div> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Refus</th>
                <th>Inscrit le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="adm-avatar">{u.name.charAt(0).toUpperCase()}</span>
                      <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#64748b' }}>{u.email}</td>
                  <td>
                    <span className={`adm-badge ${u.role === 'admin' ? 'adm-badge-blue' : 'adm-badge-green'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`adm-badge ${
                      u.status === 'active'    ? 'adm-badge-green' :
                      u.status === 'suspended' ? 'adm-badge-red'   : 'adm-badge-yellow'
                    }`}>
                      {u.status}
                    </span>
                    <SuspendBadge user={u} />
                  </td>
                  <td style={{ color: u.nb_refus >= 3 ? '#f87171' : '#64748b', fontWeight: u.nb_refus >= 3 ? 700 : 400 }}>
                    {u.nb_refus ?? 0}
                  </td>
                  <td style={{ color: '#475569' }}>
                    {new Date(u.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td>
                    {u.status === 'active' || u.status === 'pending' ? (
                      <button className="adm-action-btn warn"
                        onClick={() => setSuspendModal(u)}>
                        <Ban size={12} /> Suspendre
                      </button>
                    ) : (
                      <button className="adm-action-btn success"
                        onClick={() => handleAction(u.id, 'reactivate')}>
                        <CheckCircle size={12} /> Réactiver
                      </button>
                    )}
                    <button className="adm-action-btn danger"
                      onClick={() => handleAction(u.id, 'delete')}>
                      <Trash2 size={12} /> Supprimer
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="adm-empty">Aucun utilisateur trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal suspension */}
      {suspendModal && (
        <SuspendModal
          user={suspendModal}
          onConfirm={({ duration, reason }) => {
            handleSuspend(suspendModal.id, { duration, reason });
            setSuspendModal(null);
          }}
          onCancel={() => setSuspendModal(null)}
        />
      )}

      {toast && (
        <div className={`adm-toast ${toast.type === 'error' ? 'error' : ''}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}