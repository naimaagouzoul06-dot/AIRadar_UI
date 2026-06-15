import { useState } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.ad-root {
  background: #0d0f1a;
  font-family: 'Inter', sans-serif;
  color: #e2e8f0;
  position: relative;
  overflow-x: hidden;

  /* FIXED: removed 100vh */
  min-height: auto;
  padding-bottom: 2rem;
}

.ad-bg,
ad-grid {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
  background-size: 48px 48px;
}

.ad-body {
  position: relative;
  z-index: 10;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  padding: 2.5rem 2rem 4rem;
}

/* باقي CSS بدون تغيير */
.ad-hero {
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.2rem;
}

.ad-avatar {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 1.3rem;
}

.ad-hero-name {
  font-family: 'Syne', sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
  color: #fff;
}

.ad-hero-tagline {
  font-size: 0.9rem;
  color: #64748b;
  margin-top: 0.4rem;
}

.ad-badges {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.ad-badge {
  font-size: 0.72rem;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  background: rgba(99,102,241,0.12);
  color: #818cf8;
}

.ad-hero-actions {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.ad-cta {
  background: rgba(99,102,241,0.18);
  border: 1px solid rgba(99,102,241,0.3);
  color: #a5b4fc;
  padding: 0.65rem 1.2rem;
  border-radius: 10px;
  text-decoration: none;
  text-align: center;
}

.ad-fav {
  background: none;
  border: 1px solid rgba(255,255,255,0.07);
  color: #64748b;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}

.ad-fav.active {
  color: #fbbf24;
  border-color: rgba(251,191,36,0.4);
  background: rgba(251,191,36,0.08);
}

.ad-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.ad-stat {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  padding: 1rem;
  border-radius: 14px;
}

.ad-stat-val {
  font-family: 'Syne';
  font-size: 1.5rem;
  font-weight: 800;
}

.ad-stat-lbl {
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
}

.ad-grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.ad-section {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  padding: 1.3rem;
  border-radius: 16px;
}

.ad-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 1rem;
}

.ad-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-size: 0.85rem;
  color: #94a3b8;
}

.ad-plan {
  display: flex;
  justify-content: space-between;
  padding: 0.7rem;
  border-radius: 10px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  margin-bottom: 0.5rem;
}

.ad-link {
  display: flex;
  justify-content: space-between;
  padding: 0.7rem;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.05);
  margin-bottom: 0.5rem;
  text-decoration: none;
  color: inherit;
}

.ad-session {
  display: flex;
  justify-content: space-between;
  padding: 0.7rem;
  border-radius: 10px;
  background: rgba(255,255,255,0.02);
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}
`;

export default function AppDetails() {
  const [fav, setFav] = useState(false);

  return (
    <div className="ad-root">
      <style>{css}</style>

      <div className="ad-bg" />
      <div className="ad-grid" />

      <div className="ad-body">

        <div className="ad-hero">
          <div className="ad-avatar" style={{ background: "#10a37f22", color: "#10a37f" }}>
            CG
          </div>

          <div>
            <h1 className="ad-hero-name">ChatGPT</h1>
            <p className="ad-hero-tagline">
              AI assistant for writing, coding, research and creativity.
            </p>

            <div className="ad-badges">
              <span className="ad-badge">Text AI</span>
              <span className="ad-badge">Freemium</span>
              <span className="ad-badge">API</span>
            </div>
          </div>

          <div className="ad-hero-actions">
            <a className="ad-cta" href="#">Open tool</a>
            <button
              className={`ad-fav ${fav ? "active" : ""}`}
              onClick={() => setFav(!fav)}
            >
              {fav ? "Saved ★" : "Add ☆"}
            </button>
          </div>
        </div>

        <div className="ad-stats">
          <div className="ad-stat"><div className="ad-stat-val">34</div><div className="ad-stat-lbl">Sessions</div></div>
          <div className="ad-stat"><div className="ad-stat-val">12h</div><div className="ad-stat-lbl">Time</div></div>
          <div className="ad-stat"><div className="ad-stat-val">#1</div><div className="ad-stat-lbl">Rank</div></div>
          <div className="ad-stat"><div className="ad-stat-val">2m</div><div className="ad-stat-lbl">Last use</div></div>
        </div>

        <div className="ad-grid2">

          <div className="ad-section">
            <div className="ad-title">About</div>
            AI model that understands and generates text.
          </div>

          <div className="ad-section">
            <div className="ad-title">Features</div>
            <div className="ad-list">
              <div>• Text generation</div>
              <div>• Code help</div>
              <div>• Reasoning</div>
              <div>• Image understanding</div>
            </div>
          </div>

          <div className="ad-section">
            <div className="ad-title">Pricing</div>
            <div className="ad-plan"><span>Free</span><span>$0</span></div>
            <div className="ad-plan"><span>Plus</span><span>$20</span></div>
          </div>

          <div className="ad-section">
            <div className="ad-title">Links</div>
            <a className="ad-link" href="#"><span>Website</span><span>open ↗</span></a>
            <a className="ad-link" href="#"><span>API</span><span>docs ↗</span></a>
          </div>

          <div className="ad-section" style={{ gridColumn: "1 / -1" }}>
            <div className="ad-title">Recent sessions</div>
            <div className="ad-session">
              <span>Write a blog post</span><span>2m ago</span>
            </div>
            <div className="ad-session">
              <span>Debug code</span><span>1d ago</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}