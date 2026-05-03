import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { games } from "./games/index.js";

function GameRoute() {
  const { slug } = useParams();
  const game = games.find((g) => g.slug === slug && g.status !== "soon");
  if (!game) return <Navigate to="/" replace />;
  const Component = game.component;
  return <Component />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/spel/:slug" element={<GameRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
