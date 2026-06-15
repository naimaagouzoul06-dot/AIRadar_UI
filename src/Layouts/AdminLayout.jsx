import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, Layers, ClipboardCheck,
  FolderOpen, Tag, MessageSquare, AlertTriangle,
  BarChart2, LogOut, Menu, PlusCircle
} from 'lucide-react';
import './AdminLayout.css';

const NAV = [
  {
    section: 'Overview',
    items: [
      { to: '/admin',             label: 'Dashboard',          icon: <LayoutDashboard size={16} /> },
    ],
  },
  {
    section: 'Users',
    items: [
      { to: '/admin/users',       label: 'Manage Users',       icon: <Users size={16} /> },
    ],
  },
  {
    section: 'AI Tools',
    items: [
      { to: '/admin/tools',       label: 'Manage Tools',        icon: <Layers size={16} /> },
      { to: '/admin/add-tool',    label: 'Add AI Tool',         icon: <PlusCircle size={16} /> },
      { to: '/admin/submissions', label: 'Validate Submissions', icon: <ClipboardCheck size={16} /> },
      { to: '/admin/categories',  label: 'Categories',         icon: <FolderOpen size={16} /> },
      { to: '/admin/tags',        label: 'Tags',               icon: <Tag size={16} /> },
    ],
  },
  {
    section: 'Moderation',
    items: [
      { to: '/admin/reviews',     label: 'Comments',           icon: <MessageSquare size={16} /> },
      { to: '/admin/reports',     label: 'Reports',            icon: <AlertTriangle size={16} /> },
    ],
  },
  {
    section: 'Analytics',
    items: [
      { to: '/admin/stats',       label: 'Statistics',         icon: <BarChart2 size={16} /> },
    ],
  },
];

const PAGE_TITLES = {
  '/admin':             'Dashboard',
  '/admin/users':       'Manage Users',
  '/admin/tools':       'Manage AI Tools',
  '/admin/submissions': 'Validate Submissions',
  '/admin/categories':  'Categories',
  '/admin/tags':        'Tags',
  '/admin/reviews':     'Comments',
  '/admin/reports':     'Reports',
  '/admin/stats':       'Statistics',
  '/admin/add-tool':    'Add AI Tool',
};

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isActive = (to) =>
    to === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(to);

  const pageTitle = PAGE_TITLES[location.pathname] || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="adm-shell">

      {/* ── Sidebar ── */}
      <aside className={`adm-sidebar ${open ? 'open' : ''}`}>

        <div className="adm-sidebar-logo">
          <Link to="/admin" className="adm-logo-link">
            AI<span className="adm-logo-dot">Radar</span>
            <span className="adm-logo-badge">ADMIN</span>
          </Link>
        </div>

        <nav className="adm-nav">
          {NAV.map(({ section, items }) => (
            <div key={section}>
              <div className="adm-nav-section">{section}</div>
              {items.map(({ to, label, icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`adm-nav-link ${isActive(to) ? 'active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  {icon}
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="adm-sidebar-bottom">
          <div className="adm-user-card">
            <div className="adm-user-avatar">A</div>
            <div className="adm-user-info">
              <div className="adm-user-name">Admin</div>
              <div className="adm-user-role">Super Admin</div>
            </div>
          </div>
          <button className="adm-logout-btn" onClick={handleLogout}>
            <LogOut size={14} />
            Log out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="adm-main">
        <header className="adm-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="adm-hamburger" onClick={() => setOpen(v => !v)}>
              <Menu size={20} />
            </button>
            <span className="adm-topbar-title">{pageTitle}</span>
          </div>
          <div className="adm-topbar-right">
            <span className="adm-topbar-badge">AI Radar Admin Panel</span>
          </div>
        </header>

        <main className="adm-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}