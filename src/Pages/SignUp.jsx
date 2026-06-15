import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

  /* ── Divider ── */
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


  /* ── Social buttons ── */
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



  /* ROOT */
  .auth-root {
    min-height: 100vh;
    background: #0d0f1a;
    font-family: Inter, sans-serif;
    color: #e2e8f0;
    display: flex;
    flex-direction: column;
  }

  /* BACKGROUND */
  .auth-bg {
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 50% at 20% 20%, rgba(79,70,229,0.18), transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(16,185,129,0.12), transparent 60%),
      #0d0f1a;
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


  /* CONTENT */
  .auth-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 10;
    padding: 2rem;
  }

  .auth-card {
    width: 420px;
    padding: 2.5rem;
    border-radius: 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(12px);
    animation: fadeUp 0.6s ease both;
  }

  .auth-title {
    font-family: Syne, sans-serif;
    font-size: 2rem;
    font-weight: 710;
    color: #fff;
    margin-bottom: 0.5rem;
  }

  .auth-sub {
    color: #94a3b8;
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }

  .auth-input {
    width: 100%;
    padding: 0.85rem 1rem;
    margin-bottom: 1rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(0,0,0,0.25);
    color: #fff;
    outline: none;
    font-size: 0.9rem;
  }

  .auth-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
  }

  .auth-btn {
    width: 100%;
    padding: 0.9rem;
    border-radius: 10px;
    border: none;
    background: #6366f1;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
  }

  .auth-btn:hover {
    background: #4f46e5;
    transform: translateY(-2px);
  }
  
  .auth-btn:disabled {
    background: #4338ca;
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .auth-footer {
    position: relative;
    z-index: 10;
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 1.5rem;
    text-align: center;
    font-size: 0.85rem;
    color: #64748b;
  }

  .auth-switch {
    margin-top: 1rem;
    font-size: 0.85rem;
    color: #94a3b8;
    text-align: center;
  }

  .auth-link {
    color: #6366f1;
    text-decoration: none;
    transition: 0.2s;
    font-weight: 500;
  }

  .auth-link:hover {
    color: #a5b4fc;
    text-decoration: underline;
  }

  .auth-error {
    color: #f87171;
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
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
export default function SignUp() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirm = form.confirm.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (!name) return setError("Full name is required");
    if (!emailRegex.test(email)) return setError("Invalid email format");
    if (!passwordRegex.test(password))
      return setError("Password must be 8+ chars with letters and numbers");
    if (password !== confirm) return setError("Passwords do not match");

    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed");
      }

      // Stocker l'utilisateur
      localStorage.setItem("user", JSON.stringify(data.user));

      // Rediriger vers le dashboard
      navigate("/app/dashboard");
    } catch (err) {
      setError(err.message || "Network error — is XAMPP running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <style>{css}</style>
      <div className="auth-bg" />

      <nav className="lr-nav">
        <Link to="/" className="lr-logo">
          AI<span className="lr-logo-dot">Radar</span>
        </Link>
        <Link to="/" className="lr-nav-back">
          &larr; Back to home
        </Link>
      </nav>

      <div className="auth-content">
        <div className="auth-card">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-sub">Join AI Radar and explore AI tools.</p>

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
            <input className="auth-input" type="text" name="name" placeholder="Full name" required />
            <input className="auth-input" type="email" name="email" placeholder="Email" required />
            <input className="auth-input" type="password" name="password" placeholder="Password" required />
            <input className="auth-input" type="password" name="confirm" placeholder="Confirm password" required />

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Sign up"}
            </button>

            <div className="auth-switch">
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      <footer className="auth-footer">
        <div>AI Radar • Explore the future of AI tools</div>
      </footer>
    </div>
  );
}