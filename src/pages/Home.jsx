import React from "react";
import { Link } from "react-router-dom";
import { games } from "../games/index.js";

const styles = {
  wrap: { maxWidth: 880, margin: "0 auto", padding: "48px 24px" },
  h1: { fontSize: 42, margin: "0 0 8px", color: "#1f3a2a", textAlign: "center" },
  tagline: { fontSize: 18, color: "#3a5a47", textAlign: "center", margin: "0 0 36px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 18,
  },
  card: {
    background: "white",
    borderRadius: 16,
    padding: 22,
    boxShadow: "0 4px 16px rgba(31, 58, 42, 0.08)",
    textDecoration: "none",
    color: "inherit",
    display: "block",
    transition: "transform 0.05s",
  },
  cardSoon: { opacity: 0.7, cursor: "not-allowed" },
  icon: { fontSize: 44, display: "block", marginBottom: 10 },
  cardTitle: { margin: "0 0 6px", fontSize: 22, color: "#1f3a2a" },
  blurb: { color: "#3a5a47", margin: 0, lineHeight: 1.5 },
  badge: (status) => ({
    display: "inline-block",
    fontSize: 12,
    padding: "2px 10px",
    borderRadius: 999,
    background: status === "live" ? "#dcfce7" : status === "beta" ? "#dbeafe" : "#fef3c7",
    color: status === "live" ? "#166534" : status === "beta" ? "#1e40af" : "#92400e",
    marginLeft: 8,
    verticalAlign: "middle",
    fontWeight: 600,
  }),
  badgeText: { live: "speel nu", beta: "beta", soon: "binnenkort" },
};

export default function Home() {
  return (
    <div style={styles.wrap}>
      <h1 style={styles.h1}>🌿 Land van Leren</h1>
      <p style={styles.tagline}>Speel, leer, ontdek. Educatieve games van Willow Games.</p>
      <div style={styles.grid}>
        {games.map((game) => {
          const cardStyle = game.status === "soon"
            ? { ...styles.card, ...styles.cardSoon }
            : styles.card;
          const inner = (
            <>
              <span style={styles.icon}>{game.icon}</span>
              <h2 style={styles.cardTitle}>
                {game.title}
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
  );
}
