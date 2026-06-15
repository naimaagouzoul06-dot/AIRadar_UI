import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X, PlusCircle } from 'lucide-react';
import { getUser } from '../../Js/useAuth';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const API_BASE = 'http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api';

const REJECTION_REASONS = [
  'Informations incorrectes',
  'Outil déjà existant',
  'Lien invalide',
  'Catégorie incorrecte',
  'Contenu inapproprié',
];

// Modal de refus avec raison et commentaire
function RejectModal({ submission, onConfirm, onCancel }) {
  const [reason, setReason]   = useState('');
  const [comment, setComment] = useState('');

  const handleConfirm = () => {
    if (!reason) return;
    onConfirm({ reason, comment });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#1e293b', border: '1px solid #334155',
        borderRadius: '12px', width: '440px', maxWidth: '95vw',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid #334155',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <XCircle size={18} color="#ef4444" />
            <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.95rem' }}>
              Refuser la soumission
            </span>
          </div>
          <button onClick={onCancel} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#64748b', padding: '2px',
          }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            background: '#0f172a', border: '1px solid #1e3a5f',
            borderRadius: '8px', padding: '0.6rem 0.9rem',
            fontSize: '0.85rem', color: '#94a3b8',
          }}>
            Outil : <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{submission.tool_name}</span>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
              Raison du refus <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {REJECTION_REASONS.map(r => (
                <button key={r} onClick={() => setReason(r)} style={{
                  fontSize: '0.78rem', padding: '5px 12px',
                  borderRadius: '99px', cursor: 'pointer',
                  border: reason === r ? '1px solid #ef4444' : '1px solid #334155',
                  background: reason === r ? 'rgba(239,68,68,0.15)' : '#0f172a',
                  color: reason === r ? '#ef4444' : '#94a3b8',
                  transition: 'all 0.15s',
                }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
              Commentaire additionnel (optionnel)
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Ex : Le lien fourni redirige vers une page inexistante..."
              rows={3}
              style={{
                width: '100%', background: '#0f172a',
                border: '1px solid #334155', borderRadius: '8px',
                padding: '8px 12px', color: '#e2e8f0',
                fontSize: '0.82rem', fontFamily: 'inherit',
                resize: 'vertical', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button onClick={onCancel} style={{
              fontSize: '0.82rem', padding: '7px 16px',
              border: '1px solid #334155', borderRadius: '8px',
              background: 'transparent', color: '#94a3b8', cursor: 'pointer',
            }}>
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={!reason}
              style={{
                fontSize: '0.82rem', padding: '7px 16px',
                border: '1px solid #ef4444', borderRadius: '8px',
                background: reason ? 'rgba(239,68,68,0.15)' : '#1e293b',
                color: reason ? '#ef4444' : '#475569',
                cursor: reason ? 'pointer' : 'not-allowed',
                fontWeight: 600, transition: 'all 0.15s',
              }}
            >
              Confirmer le refus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ASubmissions() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('pending');
  const [toast, setToast]     = useState(null);
  const [rejectModal, setRejectModal] = useState(null); // { submission }

  const navigate  = useNavigate();
  const adminUser = getUser();

  // Naviguer vers AAddTool avec la soumission préremplie
  const handleAddTool = (submission) => {
    navigate('/admin/add-tool', { state: { submission } });
  };

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchItems = () => {
    setLoading(true);
    fetch(`${API_BASE}/admin_submissions.php?status=${filter}`)
      .then(r => r.json())
      .then(d => { if (d.success) setItems(d.submissions); })
      .catch(() => showToast('Failed to load submissions', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, [filter]);

  // Approbation simple
  const handleApprove = async (id) => {
    try {
      const res  = await fetch(`${API_BASE}/admin_submissions.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', submission_id: id, admin_id: adminUser?.id || 0 }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); }
      catch { showToast('Erreur serveur : ' + text.slice(0, 120), 'error'); return; }
      if (data.success) { showToast('Soumission approuvée ✓'); fetchItems(); }
      else showToast(data.error || 'Erreur', 'error');
    } catch (e) { showToast('Erreur réseau : ' + e.message, 'error'); }
  };

  // Rejet avec raison + commentaire (envoi des champs séparés attendus par le PHP)
  const handleRejectWithMessage = async (id, { reason, comment }) => {
    try {
      const res = await fetch(`${API_BASE}/admin_submissions.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          submission_id: id,
          admin_id: adminUser?.id || 0,
          rejection_reason: reason,
          rejection_comment: comment,
        }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); }
      catch { showToast('Erreur serveur : ' + text.slice(0, 120), 'error'); return; }
      if (data.success) { showToast('Soumission rejetée ✓'); fetchItems(); }
      else showToast(data.error || 'Erreur', 'error');
    } catch (e) { showToast('Erreur réseau : ' + e.message, 'error'); }
  };

  return (
    <div className="adm-page">
      <div className="adm-toolbar">
        <select className="adm-filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </select>
      </div>

      {loading ? <div className="adm-loading">Loading submissions...</div> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>Tool</th><th>Description</th><th>Submitted by</th><th>Pricing</th><th>Date</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {items.length ? items.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontWeight:600, color:'#e2e8f0' }}>{s.tool_name}</div>
                    <a href={s.website} target="_blank" rel="noreferrer" style={{ fontSize:'0.72rem', color:'#6366f1', textDecoration:'none' }}>{s.website}</a>
                   </td>
                  <td><div className="adm-desc">{s.description}</div></td>
                  <td style={{ color:'#64748b' }}>{s.submitter_name || '—'}</td>
                  <td><span className="adm-badge adm-badge-blue">{s.pricing}</span></td>
                  <td style={{ color:'#475569' }}>{new Date(s.submitted_at).toLocaleDateString()}</td>
                  <td><span className={`adm-badge ${s.status==='approved'?'adm-badge-green':s.status==='rejected'?'adm-badge-red':'adm-badge-yellow'}`}>{s.status}</span></td>
                  <td>
                    {s.status === 'pending' && (
                      <>
                        <button className="adm-action-btn" style={{ color: '#6366f1', borderColor: '#6366f1' }}
                          onClick={() => handleAddTool(s)}>
                          <PlusCircle size={12} /> Ajouter
                        </button>
                        <button className="adm-action-btn success" onClick={() => handleApprove(s.id)}>
                          <CheckCircle size={12} /> Approve
                        </button>
                        <button className="adm-action-btn danger" onClick={() => setRejectModal({ submission: s })}>
                          <XCircle size={12} /> Reject
                        </button>
                      </>
                    )}
                    {s.status !== 'pending' && <span style={{ color:'#334155', fontSize:'0.78rem' }}>— done —</span>}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="adm-empty">No submissions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {rejectModal && (
        <RejectModal
          submission={rejectModal.submission}
          onConfirm={({ reason, comment }) => {
            handleRejectWithMessage(rejectModal.submission.id, { reason, comment });
            setRejectModal(null);
          }}
          onCancel={() => setRejectModal(null)}
        />
      )}

      {toast && <div className={`adm-toast ${toast.type==='error'?'error':''}`}>{toast.msg}</div>}
    </div>
  );
}