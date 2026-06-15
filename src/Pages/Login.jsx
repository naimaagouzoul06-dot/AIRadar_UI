import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

  .lr-root {
    min-height: 100vh;
    background: #0d0f1a;
    font-family: 'Inter', sans-serif;
    color: #e2e8f0;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .lr-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background:
      radial-gradient(ellipse 70% 50% at 15% 25%, rgba(79,70,229,0.20) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 85% 75%, rgba(16,185,129,0.10) 0%, transparent 60%),
      #0d0f1a;
  }

  .lr-grid {
    position: fixed;
    inset: 0;
    z-index: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .lr-nav {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 3rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .lr-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.4rem;
    color: #fff;
    text-decoration: none;
  }

  .lr-logo-dot { color: #6366f1; }

  .lr-nav-back {
    color: #94a3b8;
    font-size: 0.875rem;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    transition: color 0.2s;
  }

  .lr-nav-back:hover { color: #fff; }

  .lr-body {
    position: relative;
    z-index: 10;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
  }

  .lr-card {
    width: 100%;
    max-width: 440px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 2.5rem;
    backdrop-filter: blur(12px);
    animation: lr-fadeUp 0.5s ease both;
  }

  @keyframes lr-fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lr-head { text-align: center; margin-bottom: 2rem; }

  .lr-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.6rem;
    font-weight: 800;
    color: #fff;
    margin: 0 0 0.4rem;
  }

  .lr-sub { font-size: 0.875rem; color: #64748b; margin: 0; }
  .lr-sub a { color: #6366f1; text-decoration: none; }
  .lr-sub a:hover { text-decoration: underline; }

  .lr-social { display: flex; gap: 0.75rem; margin-bottom: 0; }

  .lr-soc-btn {
    flex: 1;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 0.65rem;
    color: #94a3b8;
    font-size: 0.82rem;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }

  .lr-soc-btn:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.18);
    color: #e2e8f0;
  }

  .lr-soc-ico { width: 17px; height: 17px; flex-shrink: 0; }

  .lr-divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .lr-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }

  .lr-divider-txt {
    font-size: 0.75rem;
    color: #475569;
    white-space: nowrap;
  }

  .lr-field { margin-bottom: 1.1rem; }

  .lr-label {
    display: block;
    font-size: 0.8rem;
    font-weight: 500;
    color: #94a3b8;
    margin-bottom: 0.45rem;
    letter-spacing: 0.02em;
  }

  .lr-input-wrap { position: relative; }

  .lr-input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.10);
    border-radius: 10px;
    padding: 0.7rem 0.85rem;
    color: #e2e8f0;
    font-size: 0.9rem;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .lr-input-wrap .lr-input { padding-right: 2.8rem; }

  .lr-input::placeholder { color: #334155; }

  .lr-input:focus {
    border-color: rgba(99,102,241,0.50);
    background: rgba(99,102,241,0.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }

  .lr-eye {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #475569;
    cursor: pointer;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }

  .lr-eye:hover { color: #94a3b8; }

  .lr-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.4rem;
  }

  .lr-check-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.82rem;
    color: #64748b;
    cursor: pointer;
  }

  .lr-check { accent-color: #6366f1; width: 14px; height: 14px; }

  .lr-forgot { font-size: 0.82rem; color: #6366f1; text-decoration: none; }
  .lr-forgot:hover { text-decoration: underline; }

  .lr-error {
    background: rgba(239,68,68,0.10);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 8px;
    padding: 0.6rem 0.85rem;
    font-size: 0.82rem;
    color: #f87171;
    margin-bottom: 1rem;
  }

  .lr-btn {
    width: 100%;
    background: #6366f1;
    border: none;
    color: #fff;
    padding: 0.85rem;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
  }

  .lr-btn:hover {
    background: #4f46e5;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(99,102,241,0.35);
  }

  .lr-btn:active { transform: translateY(0); }

  .lr-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .lr-footer {
    position: relative;
    z-index: 10;
    text-align: center;
    padding: 1.5rem;
    color: #334155;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    .lr-nav { padding: 1rem 1.25rem; }
    .lr-card { padding: 1.75rem 1.25rem; border-radius: 16px; }
    .lr-social { flex-direction: column; }
  }
`;




/* ── SVG icons (no emojis) ── */

const GoogleIcon = () => (
  <svg className="lr-soc-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = () => (
  <svg className="lr-soc-ico" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483
      0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
      -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832
      .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688
      -.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844
      a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651
      .64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855
      0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const EyeIcon = ({ open }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);



export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Système de tentatives
  const [attempts, setAttempts] = useState(() => {
    return parseInt(localStorage.getItem('loginAttempts') || '0');
  });

  const [blockedUntil, setBlockedUntil] = useState(() => {
    const val = localStorage.getItem('loginBlockedUntil');
    return val ? parseInt(val) : null;
  });

  const MAX_ATTEMPTS = 3;

  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const isBlocked = () => blockedUntil && Date.now() < blockedUntil;

  const getRemainingTime = () => {
    if (!blockedUntil) return '';
    const diff = Math.max(0, blockedUntil - Date.now());
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${m}m ${s}s`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked()) {
      setError(`Too many attempts. Try again in ${getRemainingTime()}`);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Invalid email format');
      return;
    }
    if (!form.password) {
      setError('Password is required');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('loginAttempts', newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          const until = Date.now() + 60 * 60 * 1000;
          setBlockedUntil(until);
          localStorage.setItem('loginBlockedUntil', until);
          setError('Too many failed attempts. Try again in 60m 0s');
        } else {
          const left = MAX_ATTEMPTS - newAttempts;
          setError(`${data.error} — ${left} attempt${left > 1 ? 's' : ''} left`);
        }
        return;
      }

      // Succès : réinitialiser les tentatives
      setAttempts(0);
      setBlockedUntil(null);
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('loginBlockedUntil');

      // Préparer les données utilisateur
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,      // ← doit être 'admin' ou 'user' (ou autre)
      };

      // Sauvegarde
      if (form.remember) {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('rememberMe', 'true');
      } else {
        sessionStorage.setItem('user', JSON.stringify(userData));
      }

      // Redirection selon le rôle
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/app/dashboard');
      }
    } catch (err) {
      setError('Network error — is XAMPP running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lr-root">
      <style>{css}</style>
      <div className="lr-bg" />
      <div className="lr-grid" />

      <nav className="lr-nav">
        <Link to="/" className="lr-logo">
          AI<span className="lr-logo-dot">Radar</span>
        </Link>
        <Link to="/" className="lr-nav-back">
          &larr; Back to home
        </Link>
      </nav>

      <div className="lr-body">
        <div className="lr-card">
          <div className="lr-head">
            <h1 className="lr-title">Welcome back</h1>
            <p className="lr-sub">
              Don't have an account?{' '}
              <Link to="/signup">Sign up free</Link>
            </p>
          </div>

          <div className="lr-social">
            <button type="button" className="lr-soc-btn">
              <GoogleIcon /> Google
            </button>
            <button type="button" className="lr-soc-btn">
              <GithubIcon /> GitHub
            </button>
          </div>

          <div className="lr-divider">
            <div className="lr-divider-line" />
            <span className="lr-divider-txt">or continue with email</span>
            <div className="lr-divider-line" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="lr-field">
              <label className="lr-label" htmlFor="lr-email">
                Email address
              </label>
              <input
                id="lr-email"
                type="email"
                name="email"
                className="lr-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="lr-field">
              <label className="lr-label" htmlFor="lr-password">
                Password
              </label>
              <div className="lr-input-wrap">
                <input
                  id="lr-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="lr-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="lr-eye"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <div className="lr-row">
              <label className="lr-check-label">
                <input
                  type="checkbox"
                  name="remember"
                  className="lr-check"
                  checked={form.remember}
                  onChange={handleChange}
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="lr-forgot">
                Forgot password?
              </Link>
            </div>

            {error && <div className="lr-error">{error}</div>}

            <button
              type="submit"
              className="lr-btn"
              disabled={loading || isBlocked()}
            >
              {loading
                ? 'Signing in...'
                : isBlocked()
                ? `Blocked — ${getRemainingTime()}`
                : 'Sign in'}
            </button>
          </form>
        </div>
      </div>

      <footer className="lr-footer">
        &copy; {new Date().getFullYear()} AI Radar
      </footer>
    </div>
  );
}