import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { games } from "./games/index.js";

const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    background: "linear-gradient(180deg, #eaf5ee 0%, #d6ecdf 100%)",
    color: "#1f3a2a",
  },
  main: { flex: 1 },
  footer: {
    padding: "16px 24px",
    textAlign: "center",
    color: "#3a5a47",
    fontSize: 14,
  },
};

function GameRoute() {
  const { slug } = useParams();
  const game = games.find((g) => g.slug === slug && g.status !== "soon");
  if (!game) return <Navigate to="/" replace />;
  const Component = game.component;
  return <Component />;
}

function App() {
  return (
    <div style={styles.app}>
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spel/:slug" element={<GameRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer style={styles.footer}>🌿 Willow Games • © 2026</footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
