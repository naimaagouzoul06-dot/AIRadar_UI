import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";

export default function Layout() {
  const css = `
    .app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #0d0f1a;
    }

    .content {
      flex: 1;
    }
  `;

  return (
    <div className="app">
      <style>{css}</style>

      <Navbar />

      <main className="content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}