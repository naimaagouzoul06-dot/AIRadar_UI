import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MessageSquare, X, AlertTriangle, MessageCircle } from 'lucide-react';
import './Admin.css';

const API_BASE = 'http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api';

// Modal de traitement avec message optionnel
function ReportActionModal({ report, action, onConfirm, onCancel }) {
  const [message, setMessage] = useState('');
  const isReviewed = action === 'reviewed';

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
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem', borderBottom: '1px solid #334155',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isReviewed
              ? <CheckCircle size={18} color="#22c55e" />
              : <XCircle size={18} color="#ef4444" />}
            <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.95rem' }}>
              {isReviewed ? 'Marquer comme traité' : 'Rejeter le signalement'}
            </span>
          </div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Info signalement */}
          <div style={{
            background: '#0f172a', border: '1px solid #1e3a5f',
            borderRadius: '8px', padding: '0.6rem 0.9rem',
            fontSize: '0.83rem', color: '#94a3b8',
          }}>
            <strong style={{ color: '#e2e8f0' }}>Signalement #{report.id}</strong>
            <br />
            <span>Raison : {report.reason}</span>
            {report.tool_name && <span> · Outil : <strong style={{ color: '#e2e8f0' }}>{report.tool_name}</strong></span>}
            {report.reported_comment && <span> · Commentaire signalé</span>}
          </div>

          {/* Message admin optionnel */}
          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
              <MessageSquare size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              Message pour l'utilisateur <span style={{ color: '#475569' }}>(optionnel)</span>
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={isReviewed
                ? "Ex : Merci, l'outil a été mis à jour suite à votre signalement."
                : "Ex : Ce signalement ne correspond pas à notre politique."}
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

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={onCancel} style={{
              fontSize: '0.82rem', padding: '7px 16px',
              border: '1px solid #334155', borderRadius: '8px',
              background: 'transparent', color: '#94a3b8', cursor: 'pointer',
            }}>
              Annuler
            </button>
            <button onClick={() => onConfirm(message.trim())} style={{
              fontSize: '0.82rem', padding: '7px 16px',
              border: `1px solid ${isReviewed ? '#22c55e' : '#ef4444'}`,
              borderRadius: '8px',
              background: isReviewed ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
              color: isReviewed ? '#22c55e' : '#ef4444',
              cursor: 'pointer', fontWeight: 600,
            }}>
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal de détail d'un signalement
function ReportDetailModal({ report, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#1e293b', border: '1px solid #334155',
        borderRadius: '12px', width: '500px', maxWidth: '95vw',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem', borderBottom: '1px solid #334155',
        }}>
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Détail — Signalement #{report.id}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
          <Row label="Signalé par" value={`${report.reporter_name || '—'} (${report.reporter_email || '—'})`} />
          <Row label="Raison" value={report.reason} highlight />
          {report.tool_name && <Row label="Outil concerné" value={report.tool_name} />}
          {report.reported_comment && (
            <div>
              <div style={{ color: '#64748b', marginBottom: 4 }}>Commentaire signalé :</div>
              <div style={{
                background: '#0f172a', border: '1px solid #334155',
                borderRadius: '8px', padding: '0.6rem 0.9rem',
                color: '#94a3b8', fontStyle: 'italic',
              }}>
                "{report.reported_comment}"
                {report.comment_author && <span style={{ color: '#475569', marginLeft: 8 }}>— {report.comment_author}</span>}
              </div>
            </div>
          )}
          <Row label="Date" value={new Date(report.created_at).toLocaleString()} />
          <Row label="Statut" value={report.status} />
          {report.admin_response && <Row label="Réponse admin" value={report.admin_response} />}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <span style={{ color: '#64748b', minWidth: '130px', flexShrink: 0 }}>{label} :</span>
      <span style={{ color: highlight ? '#f59e0b' : '#e2e8f0' }}>{value}</span>
    </div>
  );
}

export default function AReports() {
  const [reports, setReports]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('pending');
  const [toast, setToast]         = useState(null);
  const [actionModal, setActionModal] = useState(null); // { report, action }
  const [detailModal, setDetailModal] = useState(null); // report

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchReports = () => {
    setLoading(true);
    fetch(`${API_BASE}/admin_reports.php?status=${filter}`)
      .then(r => r.json())
      .then(d => { if (d.success) setReports(d.reports); })
      .catch(() => showToast('Erreur de chargement', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, [filter]);

  const handleAction = async (id, action, adminMessage = '') => {
    try {
      const res  = await fetch(`${API_BASE}/admin_reports.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, report_id: id, admin_message: adminMessage }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(action === 'reviewed' ? 'Signalement marqué traité ✓' : 'Signalement rejeté ✓');
        fetchReports();
      } else showToast(data.error || 'Erreur', 'error');
    } catch { showToast('Erreur réseau', 'error'); }
  };

  return (
    <div className="adm-page">
      <div className="adm-toolbar">
        <select className="adm-filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="pending">En attente</option>
          <option value="reviewed">Traités</option>
          <option value="rejected">Rejetés</option>
          <option value="all">Tous</option>
        </select>
      </div>

      {loading ? (
        <div className="adm-loading">Chargement des signalements...</div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Raison</th>
                <th>Cible</th>
                <th>Signalé par</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length ? reports.map(r => (
                <tr key={r.id}>
                  {/* Type : outil ou commentaire */}
                  <td>
                    {r.tool_id ? (
                      <span className="adm-badge adm-badge-blue" style={{ display:'flex', alignItems:'center', gap:4, width:'fit-content' }}>
                        <AlertTriangle size={11} /> Outil
                      </span>
                    ) : (
                      <span className="adm-badge adm-badge-yellow" style={{ display:'flex', alignItems:'center', gap:4, width:'fit-content' }}>
                        <MessageCircle size={11} /> Commentaire
                      </span>
                    )}
                  </td>

                  {/* Raison */}
                  <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.reason}
                  </td>

                  {/* Cible (nom outil ou aperçu commentaire) */}
                  <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#94a3b8' }}>
                    {r.tool_name
                      ? <span style={{ color: '#e2e8f0' }}>{r.tool_name}</span>
                      : r.reported_comment
                        ? <span style={{ fontStyle: 'italic', color: '#64748b' }}>"{r.reported_comment.slice(0, 40)}{r.reported_comment.length > 40 ? '…' : ''}"</span>
                        : '—'
                    }
                  </td>

                  {/* Signalé par */}
                  <td style={{ color: '#64748b' }}>{r.reporter_name || '—'}</td>

                  {/* Date */}
                  <td style={{ color: '#475569', whiteSpace: 'nowrap' }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>

                  {/* Statut */}
                  <td>
                    <span className={`adm-badge ${
                      r.status === 'reviewed' ? 'adm-badge-green' :
                      r.status === 'rejected' ? 'adm-badge-red' :
                      'adm-badge-yellow'
                    }`}>
                      {r.status === 'reviewed' ? 'traité' : r.status === 'rejected' ? 'rejeté' : 'en attente'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <button
                      className="adm-action-btn"
                      style={{ color: '#6366f1', borderColor: '#6366f1' }}
                      onClick={() => setDetailModal(r)}
                    >
                      <MessageSquare size={12} /> Détail
                    </button>

                    {r.status === 'pending' && (
                      <>
                        <button className="adm-action-btn success" onClick={() => setActionModal({ report: r, action: 'reviewed' })}>
                          <CheckCircle size={12} /> Traiter
                        </button>
                        <button className="adm-action-btn danger" onClick={() => setActionModal({ report: r, action: 'rejected' })}>
                          <XCircle size={12} /> Rejeter
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="adm-empty">Aucun signalement trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal action (traiter / rejeter) */}
      {actionModal && (
        <ReportActionModal
          report={actionModal.report}
          action={actionModal.action}
          onConfirm={(msg) => {
            handleAction(actionModal.report.id, actionModal.action, msg);
            setActionModal(null);
          }}
          onCancel={() => setActionModal(null)}
        />
      )}

      {/* Modal détail */}
      {detailModal && (
        <ReportDetailModal
          report={detailModal}
          onClose={() => setDetailModal(null)}
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