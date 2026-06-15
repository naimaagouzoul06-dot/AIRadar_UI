import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600&display=swap');

  .nb-root {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(13,15,26,0.80);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.055);
    font-family: Inter, sans-serif;
  }

  .nb-inner {
    max-width: 2000px;
    margin: 0 auto;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.75rem;
  }

  .nb-logo {
    font-family: Syne, sans-serif;
    font-weight: 800;
    font-size: 1.1rem;
    color: #fff;
    text-decoration: none;
  }

  .nb-logo span {
    color: #6366f1;
  }

  /* NAV */
  .nb-links {
    display: flex;
    gap: 0.2rem;
    align-items: center;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 4px;
  }

  .nb-link {
    color: #475569;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0.42rem 0.9rem;
    border-radius: 9px;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    transition: 0.18s;
  }

  .nb-link:hover {
    color: #94a3b8;
    background: rgba(255,255,255,0.04);
  }

  .nb-link.active {
    color: #a5b4fc;
    background: rgba(99,102,241,0.16);
  }

  /* RIGHT */
  .nb-right {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .nb-submit {
    background: rgba(99,102,241,0.18);
    border: 1px solid rgba(99,102,241,0.3);
    color: #a5b4fc;
    font-size: 0.82rem;
    font-weight: 600;
    padding: 0.42rem 1rem;
    border-radius: 9px;
    text-decoration: none;
  }

  .nb-submit:hover {
    background: rgba(99,102,241,0.28);
  }

  .nb-logout {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: #cbd5e1;
    font-size: 0.82rem;
    font-weight: 600;
    padding: 0.42rem 0.9rem;
    border-radius: 9px;
    text-decoration: none;
  }

  .nb-logout:hover {
    background: rgba(255,0,0,0.08);
    border-color: rgba(255,0,0,0.2);
    color: #fca5a5;
  }

  /* MOBILE */
  .nb-drawer {
    display: none;
    flex-direction: column;
    padding: 0.8rem 1rem;
    border-top: 1px solid rgba(255,255,255,0.06);
    background: rgba(13,15,26,0.95);
  }

  .nb-drawer.open {
    display: flex;
  }

  @media (max-width: 768px) {
    .nb-links { display: none; }
    .nb-submit { display: none; }
  }
`;

/* ICONS */
const IconDashboard = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="8" height="8" rx="2"/>
    <rect x="13" y="3" width="8" height="5" rx="2"/>
    <rect x="13" y="10" width="8" height="11" rx="2"/>
    <rect x="3" y="13" width="8" height="8" rx="2"/>
  </svg>
);

const IconLibrary = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19h14a2 2 0 0 1 2 2V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14z"/>
    <path d="M8 2v20"/>
    <path d="M12 2v20"/>
  </svg>
);

const IconHistory = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);

const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

/* NAV (App Details removed) */
const NAV = [
  { to: "/app", label: "Dashboard", Icon: IconDashboard },
  { to: "/app/library", label: "Library", Icon: IconLibrary },
  { to: "/app/history", label: "History", Icon: IconHistory },
];

export default function Navbar() {
  const location = useLocation();

  const isActive = (to) =>
    to === "/app"
      ? location.pathname === "/app"
      : location.pathname.startsWith(to);

  return (
    <>
      <style>{css}</style>

      <header className="nb-root">
        <div className="nb-inner">

          {/* LOGO */}
          <Link to="/app" className="nb-logo">
            AI<span>Radar</span>
          </Link> 
          
          {/* NAV */}
          <nav className="nb-links">
            {NAV.map(({ to, label, Icon }) => (
              <Link
                key={to}
                to={to}
                className={`nb-link ${isActive(to) ? "active" : ""}`}
              >
                <Icon />
                {label}
              </Link>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="nb-right">
            <Link to="/app/submit_app" className="nb-submit">
              <IconPlus />
              Submit
            </Link>

            <Link to="/" className="nb-logout">
              Log out
            </Link>
          </div>

        </div>
      </header>
    </>
  );
}