import { useState, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { getUser } from '../Js/useAuth';

const API_BASE = 'http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api';

const STATUS_CONFIG = {
  'accepté':    { icon: <CheckCircle size={18} color="#22c55e" />, badge: { bg: 'rgba(34,197,94,0.1)',  color: '#22c55e'  }, label: 'Accepté'    },
  'refusé':     { icon: <XCircle     size={18} color="#ef4444" />, badge: { bg: 'rgba(239,68,68,0.1)',  color: '#ef4444'  }, label: 'Refusé'     },
  'en_attente': { icon: <Clock       size={18} color="#f59e0b" />, badge: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b'  }, label: 'En attente' },
  'traité':     { icon: <CheckCircle size={18} color="#6366f1" />, badge: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1'  }, label: 'Traité'     },
};

export default function Notifications() {
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('all');
  const [unread, setUnread]   = useState(0);

  // Récupérer l'utilisateur depuis localStorage OU sessionStorage (remember me ou non)
  const user = getUser();

  const fetchNotifs = () => {
    if (!user?.id) {
      setLoading(false); // ← évite le chargement infini si user non connecté
      return;
    }
    setLoading(true);
    fetch(`${API_BASE}/notifications.php?user_id=${user.id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setNotifs(d.notifications);
          setUnread(d.notifications.filter(n => !n.lu).length);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifs(); }, []);

  const markAllRead = async () => {
    if (!user?.id) return;
    await fetch(`${API_BASE}/notifications.php`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark_all_read', user_id: user.id }),
    });
    fetchNotifs();
  };

  const filtered = tab === 'all'
    ? notifs
    : notifs.filter(n => n.type === tab);

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bell size={22} color="#6366f1" />
          <h1 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#e2e8f0', margin: 0 }}>
            Mes notifications
          </h1>
          {unread > 0 && (
            <span style={{
              background: 'rgba(99,102,241,0.2)', color: '#6366f1',
              fontSize: '0.75rem', fontWeight: 600,
              padding: '2px 10px', borderRadius: '99px',
            }}>
              {unread} non lue{unread > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} style={{
            fontSize: '0.8rem', color: '#6366f1',
            background: 'none', border: 'none', cursor: 'pointer',
            textDecoration: 'underline',
          }}>
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem' }}>
        {[
          { key: 'all',        label: 'Toutes'       },
          { key: 'soumission', label: 'Soumissions'  },
          { key: 'signalement', label: 'Signalements' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            fontSize: '0.82rem', padding: '6px 14px',
            borderRadius: '99px', cursor: 'pointer',
            border: tab === t.key ? '1px solid #6366f1' : '1px solid #334155',
            background: tab === t.key ? 'rgba(99,102,241,0.15)' : 'transparent',
            color: tab === t.key ? '#6366f1' : '#64748b',
            fontWeight: tab === t.key ? 600 : 400,
            transition: 'all 0.15s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#475569', padding: '3rem' }}>
          Chargement...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#475569', padding: '3rem' }}>
          Aucune notification
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(n => {
            const cfg = STATUS_CONFIG[n.statut] || STATUS_CONFIG['en_attente'];
            const isSuspendWarning = n.message_admin?.includes('suspendu');

            return (
              <div key={n.id} style={{
                background: '#1e293b',
                border: `1px solid ${n.lu ? '#1e293b' : '#334155'}`,
                borderLeft: n.lu ? '1px solid #1e293b' : '3px solid #6366f1',
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                opacity: n.lu ? 0.75 : 1,
                transition: 'opacity 0.2s',
              }}>
                {/* Icône */}
                <div style={{ marginTop: '2px', flexShrink: 0 }}>{cfg.icon}</div>

                {/* Contenu */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '4px' }}>
                    {n.type === 'soumission' ? 'Soumission' : 'Signalement'} #{n.ref_id}
                  </div>

                  {n.message_admin && (
                    <div style={{
                      fontSize: '0.83rem', color: '#94a3b8',
                      lineHeight: 1.55, marginBottom: '8px',
                    }}>
                      {n.message_admin}
                    </div>
                  )}

                  {/* Warning suspension */}
                  {isSuspendWarning && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '6px', padding: '6px 10px',
                      fontSize: '0.8rem', color: '#ef4444', marginBottom: '8px',
                    }}>
                      <AlertTriangle size={14} />
                      Votre compte est maintenant suspendu. Contactez l'administrateur.
                    </div>
                  )}

                  {/* Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.75rem', padding: '2px 10px', borderRadius: '99px',
                      background: cfg.badge.bg, color: cfg.badge.color, fontWeight: 500,
                    }}>
                      {cfg.label}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#475569' }}>
                      {new Date(n.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                    <span style={{
                      fontSize: '0.72rem', color: '#334155', textTransform: 'capitalize',
                    }}>
                      {n.type}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}