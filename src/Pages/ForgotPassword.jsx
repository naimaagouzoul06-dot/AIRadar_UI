import { useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api';

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

  .lr-icon-wrap {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
  }

  .lr-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.6rem;
    font-weight: 800;
    color: #fff;
    margin: 0 0 0.4rem;
  }

  .lr-sub { font-size: 0.875rem; color: #64748b; margin: 0; line-height: 1.6; }
  .lr-sub a { color: #6366f1; text-decoration: none; }
  .lr-sub a:hover { text-decoration: underline; }

  .lr-field { margin-bottom: 1.4rem; }

  .lr-label {
    display: block;
    font-size: 0.8rem;
    font-weight: 500;
    color: #94a3b8;
    margin-bottom: 0.45rem;
    letter-spacing: 0.02em;
  }

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

  .lr-input::placeholder { color: #334155; }

  .lr-input:focus {
    border-color: rgba(99,102,241,0.50);
    background: rgba(99,102,241,0.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }

  .lr-input-wrap { position: relative; }
  .lr-input-wrap .lr-input { padding-right: 2.8rem; }

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

  .lr-error {
    background: rgba(239,68,68,0.10);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 8px;
    padding: 0.6rem 0.85rem;
    font-size: 0.82rem;
    color: #f87171;
    margin-bottom: 1rem;
  }

  .lr-success {
    background: rgba(16,185,129,0.10);
    border: 1px solid rgba(16,185,129,0.25);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .lr-success-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(16,185,129,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 0.75rem;
  }

  .lr-success-title {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #34d399;
    margin: 0 0 0.4rem;
  }

  .lr-success-text {
    font-size: 0.82rem;
    color: #6ee7b7;
    margin: 0;
    line-height: 1.5;
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
    margin-bottom: 1rem;
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

  .lr-btn-ghost {
    width: 100%;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.08);
    color: #94a3b8;
    padding: 0.75rem;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
    text-decoration: none;
    display: block;
    text-align: center;
  }

  .lr-btn-ghost:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.15);
    color: #e2e8f0;
  }

  .lr-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.75rem;
  }

  .lr-step {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    color: #475569;
  }

  .lr-step.active { color: #a5b4fc; }
  .lr-step.done   { color: #34d399; }

  .lr-step-dot {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.10);
    font-size: 0.65rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .lr-step.active .lr-step-dot {
    background: rgba(99,102,241,0.20);
    border-color: rgba(99,102,241,0.45);
    color: #a5b4fc;
  }

  .lr-step.done .lr-step-dot {
    background: rgba(16,185,129,0.15);
    border-color: rgba(16,185,129,0.35);
    color: #34d399;
  }

  .lr-step-line {
    width: 32px;
    height: 1px;
    background: rgba(255,255,255,0.08);
  }

  .lr-hint {
    font-size: 0.75rem;
    color: #475569;
    margin-top: 0.35rem;
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
  }
`;

/* ── Icons ── */
const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
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

export default function ForgotPassword() {
  // step 1 = saisie email | step 2 = saisie nouveau mdp | step 3 = succès final
  const [step, setStep]               = useState(1);
  const [email, setEmail]             = useState('');
  const [token, setToken]             = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPwd, setConfirmPwd]   = useState('');
  const [showPwd, setShowPwd]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  /* ── Étape 1 : vérifier l'email et envoyer le token ── */
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/forgot_password.php`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'request', email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      // En local on reçoit le token directement dans la réponse
      setToken(data.token);
      setStep(2);

    } catch {
      setError('Network error — is XAMPP running?');
    } finally {
      setLoading(false);
    }
  };

  /* ── Étape 2 : réinitialiser le mot de passe ── */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(newPassword)) {
      setError('Password must contain letters and numbers.');
      return;
    }
    if (newPassword !== confirmPwd) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/forgot_password.php`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'reset', token, new_password: newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Reset failed. Please try again.');
        return;
      }

      setStep(3);

    } catch {
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
        <Link to="/login" className="lr-nav-back">
          &larr; Back to login
        </Link>
      </nav>

      <div className="lr-body">
        <div className="lr-card">

          {/* ── Indicateur d'étapes ── */}
          {step < 3 && (
            <div className="lr-steps">
              <div className={`lr-step ${step === 1 ? 'active' : 'done'}`}>
                <div className="lr-step-dot">
                  {step > 1 ? <CheckIcon /> : '1'}
                </div>
                <span>Email</span>
              </div>
              <div className="lr-step-line" />
              <div className={`lr-step ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>
                <div className="lr-step-dot">2</div>
                <span>New password</span>
              </div>
            </div>
          )}

          {/* ══════════════ ÉTAPE 1 ══════════════ */}
          {step === 1 && (
            <>
              <div className="lr-head">
                <div className="lr-icon-wrap">
                  <LockIcon />
                </div>
                <h1 className="lr-title">Forgot password?</h1>
                <p className="lr-sub">
                  Enter the email linked to your account and<br />
                  we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleRequestReset}>
                <div className="lr-field">
                  <label className="lr-label" htmlFor="fp-email">
                    Email address
                  </label>
                  <input
                    id="fp-email"
                    type="email"
                    className="lr-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                  />
                </div>

                {error && <div className="lr-error">{error}</div>}

                <button type="submit" className="lr-btn" disabled={loading}>
                  {loading ? 'Checking...' : 'Send reset link'}
                </button>

                <Link to="/login" className="lr-btn-ghost">
                  Back to Sign in
                </Link>
              </form>
            </>
          )}

          {/* ══════════════ ÉTAPE 2 ══════════════ */}
          {step === 2 && (
            <>
              <div className="lr-head">
                <div className="lr-icon-wrap">
                  <LockIcon />
                </div>
                <h1 className="lr-title">New password</h1>
                <p className="lr-sub">
                  Choose a strong password for<br />
                  <strong style={{ color: '#a5b4fc' }}>{email}</strong>
                </p>
              </div>

              <form onSubmit={handleResetPassword}>
                <div className="lr-field">
                  <label className="lr-label" htmlFor="fp-newpwd">
                    New password
                  </label>
                  <div className="lr-input-wrap">
                    <input
                      id="fp-newpwd"
                      type={showPwd ? 'text' : 'password'}
                      className="lr-input"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      autoFocus
                    />
                    <button
                      type="button"
                      className="lr-eye"
                      onClick={() => setShowPwd((v) => !v)}
                      aria-label={showPwd ? 'Hide password' : 'Show password'}
                    >
                      <EyeIcon open={showPwd} />
                    </button>
                  </div>
                  <p className="lr-hint">Min. 8 characters, with letters and numbers.</p>
                </div>

                <div className="lr-field">
                  <label className="lr-label" htmlFor="fp-confirmpwd">
                    Confirm password
                  </label>
                  <div className="lr-input-wrap">
                    <input
                      id="fp-confirmpwd"
                      type={showConfirm ? 'text' : 'password'}
                      className="lr-input"
                      placeholder="••••••••"
                      value={confirmPwd}
                      onChange={(e) => setConfirmPwd(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="lr-eye"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      <EyeIcon open={showConfirm} />
                    </button>
                  </div>
                </div>

                {error && <div className="lr-error">{error}</div>}

                <button type="submit" className="lr-btn" disabled={loading}>
                  {loading ? 'Updating...' : 'Reset password'}
                </button>
              </form>
            </>
          )}

          {/* ══════════════ ÉTAPE 3 — SUCCÈS ══════════════ */}
          {step === 3 && (
            <>
              <div className="lr-head">
                <div className="lr-success">
                  <div className="lr-success-icon">
                    <CheckIcon />
                  </div>
                  <p className="lr-success-title">Password updated!</p>
                  <p className="lr-success-text">
                    Your password has been successfully reset.<br />
                    You can now sign in with your new password.
                  </p>
                </div>
              </div>

              <Link to="/login" className="lr-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                Back to Sign in
              </Link>
            </>
          )}

        </div>
      </div>

      <footer className="lr-footer">
        &copy; {new Date().getFullYear()} AI Radar
      </footer>
    </div>
  );
}