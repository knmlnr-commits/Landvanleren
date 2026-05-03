import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";

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

function App() {
  return (
    <div style={styles.app}>
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
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
