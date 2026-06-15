export default function Footer() {
  return (
    <footer className="ft-root">
      <div className="ft-container">

        <div className="ft-left">
          <div className="ft-logo">AI<span>Radar</span></div>
          <p className="ft-text">
            Discover, track, and manage the best AI tools in one place.
          </p>
        </div>

        <div className="ft-links">
          <div>
            <h4>Product</h4>
            <a href="#">Explore</a>
            <a href="#">Library</a>
            <a href="#">History</a>
          </div>

          <div>
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Careers</a>
          </div>

          <div>
            <h4>Legal</h4>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>

      <div className="ft-bottom">
        <span>© {new Date().getFullYear()} AI Radar. All rights reserved.</span>
      </div>

      {/* CSS */}
      <style>{`
        .ft-root {
          background: #0d0f1a;
          border-top: 1px solid rgba(255,255,255,0.06);
          color: #94a3b8;
          padding: 3rem 2rem 1.5rem;
          font-family: Inter, sans-serif;
        }

        .ft-container {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .ft-logo {
          font-family: Syne, sans-serif;
          font-size: 1.3rem;
          font-weight: 800;
          color: #fff;
        }

        .ft-logo span {
          color: #6366f1;
        }

        .ft-text {
          max-width: 260px;
          font-size: 0.85rem;
          color: #64748b;
          margin-top: 0.5rem;
          line-height: 1.5;
        }

        .ft-links {
          display: flex;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .ft-links h4 {
          color: #e2e8f0;
          font-size: 0.85rem;
          margin-bottom: 0.75rem;
        }

        .ft-links a {
          display: block;
          font-size: 0.82rem;
          color: #64748b;
          text-decoration: none;
          margin-bottom: 0.4rem;
          transition: 0.2s;
        }

        .ft-links a:hover {
          color: #a5b4fc;
        }

        .ft-bottom {
          max-width: 1100px;
          margin: 2rem auto 0;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.8rem;
          font-size: 0.75rem;
          color: #475569;
          flex-wrap: wrap;
        }

        .ft-dot {
          width: 4px;
          height: 4px;
          background: #334155;
          border-radius: 50%;
        }

        @media (max-width: 600px) {
          .ft-container {
            flex-direction: column;
          }
        }
      `}</style>
    </footer>
  );
}