import React from "react";
import { Link } from "react-router-dom";
import { games } from "../games/index.js";
import WillowBand from "../shared/WillowBand.jsx";

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(180deg, #c9dfb8 0%, #dde9c8 30%, #efe9d2 100%)",
  },
  topNav: {
    position: "absolute",
    top: 14, right: 14,
    zIndex: 3,
  },
  topLink: {
    display: "inline-block",
    background: "rgba(253, 250, 242, 0.92)",
    color: "#3a5a2a",
    padding: "6px 12px",
    borderRadius: 999,
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 600,
    border: "1px solid #cadeb4",
    fontFamily: "Georgia, serif",
    boxShadow: "0 2px 6px rgba(58, 90, 42, 0.15)",
  },
  content: {
    position: "relative",
    zIndex: 2,
    maxWidth: 880,
    margin: "0 auto",
    padding: "200px 22px 24px",
  },
  hero: { textAlign: "center", marginBottom: 36 },
  title: {
    fontSize: 52,
    margin: "0 0 10px",
    color: "#3a5a2a",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontStyle: "italic",
    fontWeight: 700,
    letterSpacing: -1,
    textShadow: "0 2px 0 rgba(255, 255, 255, 0.55)",
    lineHeight: 1.05,
  },
  tagline: {
    fontSize: 17,
    color: "#5a6a4a",
    margin: 0,
    fontStyle: "italic",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 18,
  },
  card: {
    background: "#fdfaf2",
    borderRadius: 22,
    padding: "22px 22px 20px",
    boxShadow: "0 6px 18px rgba(58, 90, 42, 0.14), inset 0 0 0 1px rgba(255,255,255,0.6)",
    textDecoration: "none",
    color: "inherit",
    display: "block",
    border: "2px solid #cadeb4",
    position: "relative",
    overflow: "hidden",
    animation: "pop-in 0.4s ease-out",
  },
  cardSoon: { opacity: 0.65, cursor: "default" },
  leafAccent: {
    position: "absolute",
    top: -10,
    right: -10,
    fontSize: 50,
    transform: "rotate(20deg)",
    opacity: 0.25,
    pointerEvents: "none",
  },
  icon: { fontSize: 50, display: "block", marginBottom: 8 },
  cardTitle: {
    margin: "0 0 6px",
    fontSize: 22,
    color: "#3a5a2a",
    fontFamily: "Georgia, serif",
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  blurb: { color: "#5a6a4a", margin: 0, lineHeight: 1.5, fontSize: 15 },
  badge: (status) => ({
    display: "inline-block",
    fontSize: 11,
    padding: "3px 10px",
    borderRadius: 999,
    background:
      status === "live" ? "#86c060" :
      status === "beta" ? "#88b3d8" :
      "#e8c878",
    color: "white",
    fontWeight: 700,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  }),
  badgeText: { live: "speel nu", beta: "beta", soon: "binnenkort" },
  footer: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    color: "#5a6a4a",
    fontSize: 13,
    fontStyle: "italic",
    padding: "24px 16px 28px",
  },
};

export default function Home() {
  return (
    <div style={styles.page}>
      <WillowBand />
      <nav style={styles.topNav}>
        <Link to="/voor-leraren" style={styles.topLink}>voor leraren →</Link>
      </nav>
      <div style={styles.content}>
        <header style={styles.hero}>
          <h1 style={styles.title}>Land van Leren</h1>
          <p style={styles.tagline}>Een rustige plek om te leren, onder de wilgen.</p>
        </header>
        <div style={styles.grid}>
          {games.map((game) => {
            const cardStyle = game.status === "soon"
              ? { ...styles.card, ...styles.cardSoon }
              : styles.card;
            const inner = (
              <>
                <span style={styles.leafAccent}>🌿</span>
                <span style={styles.icon}>{game.icon}</span>
                <h2 style={styles.cardTitle}>
                  <span>{game.title}</span>
                  <span style={styles.badge(game.status)}>{styles.badgeText[game.status]}</span>
                </h2>
                <p style={styles.blurb}>{game.blurb}</p>
              </>
            );
            if (game.status === "soon") {
              return <div key={game.slug} style={cardStyle}>{inner}</div>;
            }
            return (
              <Link key={game.slug} to={`/spel/${game.slug}`} style={cardStyle}>
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
      <div style={styles.footer}>🌿 Willow Games • © 2026</div>
    </div>
  );
}
