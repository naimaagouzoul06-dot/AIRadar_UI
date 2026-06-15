import { useState, useEffect } from 'react';
import { Users, Layers, ClipboardCheck, AlertTriangle } from 'lucide-react';
import './Admin.css';

const API_BASE = 'http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api';


export default function ADashboard() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/admin_stats.php`)
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.stats); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = stats ? [
    { label: 'Total Users',          value: stats.total_users,         bg: 'rgba(99,102,241,0.12)',  icon: <Users size={20} color="#a5b4fc" /> },
    { label: 'Active Tools',         value: stats.active_tools,        bg: 'rgba(16,185,129,0.12)',  icon: <Layers size={20} color="#34d399" /> },
    { label: 'Pending Submissions',  value: stats.pending_submissions, bg: 'rgba(245,158,11,0.12)',  icon: <ClipboardCheck size={20} color="#fbbf24" /> },
    { label: 'Open Reports',         value: stats.pending_reports,     bg: 'rgba(239,68,68,0.12)',   icon: <AlertTriangle size={20} color="#f87171" /> },
  ] : [];

  return (
    <div className="adm-page">

      {loading ? (
        <div className="adm-loading">Loading dashboard...</div>
      ) : (
        <>
          <div className="adm-stats-grid">
            {STAT_CARDS.map(s => (
              <div className="adm-stat-card" key={s.label}>
                <div className="adm-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                <div>
                  <div className="adm-stat-val">{s.value ?? '—'}</div>
                  <div className="adm-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="adm-grid-2">
            <div>
              <h2 className="adm-section-title">Recent Users</h2>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Status</th></tr></thead>
                  <tbody>
                    {stats?.recent_users?.length ? stats.recent_users.map(u => (
                      <tr key={u.id}>
                        <td style={{ color:'#e2e8f0', fontWeight:500 }}>{u.name}</td>
                        <td style={{ color:'#64748b' }}>{u.email}</td>
                        <td><span className={`adm-badge ${u.status==='active'?'adm-badge-green':u.status==='suspended'?'adm-badge-red':'adm-badge-yellow'}`}>{u.status}</span></td>
                      </tr>
                    )) : <tr><td colSpan="3" style={{ textAlign:'center', color:'#475569' }}>No users yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="adm-section-title">Recent Submissions</h2>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead><tr><th>Tool</th><th>By</th><th>Status</th></tr></thead>
                  <tbody>
                    {stats?.recent_submissions?.length ? stats.recent_submissions.map(s => (
                      <tr key={s.id}>
                        <td style={{ color:'#e2e8f0', fontWeight:500 }}>{s.tool_name}</td>
                        <td style={{ color:'#64748b' }}>{s.submitter_name || '—'}</td>
                        <td><span className={`adm-badge ${s.status==='approved'?'adm-badge-green':s.status==='rejected'?'adm-badge-red':'adm-badge-yellow'}`}>{s.status}</span></td>
                      </tr>
                    )) : <tr><td colSpan="3" style={{ textAlign:'center', color:'#475569' }}>No submissions yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}