import React from "react";
import { Link } from "react-router-dom";
import { games } from "../games/index.js";

function WillowBand() {
  const count = 18;
  const branches = [];
  for (let i = 0; i < count; i++) {
    const x = (i + 0.5) * (1200 / count);
    const length = 110 + ((i * 41) % 80);
    const driftEnd = ((i * 17) % 60) - 30;
    const swayDelay = ((i * 11) % 30) / 10;
    branches.push({ x, length, driftEnd, swayDelay, key: i });
  }
  return (
    <svg
      viewBox="0 0 1200 260"
      preserveAspectRatio="xMidYMin slice"
      style={{ width: "100%", height: 220, display: "block", position: "absolute", top: 0, left: 0, zIndex: 1, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <rect x="0" y="0" width="1200" height="20" fill="#5a3a26" />
      <rect x="0" y="0" width="1200" height="7" fill="#7a5a3a" />
      {branches.map(({ x, length, driftEnd, swayDelay, key }) => {
        const tipX = x + driftEnd;
        const tipY = 20 + length;
        const midX = x + driftEnd * 0.55;
        const midY = 20 + length * 0.55;
        return (
          <g
            key={key}
            style={{
              transformBox: "view-box",
              transformOrigin: `${x}px 20px`,
              animation: `sway 5s ease-in-out ${swayDelay}s infinite`,
            }}
          >
            <path
              d={`M${x} 20 Q${midX} ${midY} ${tipX} ${tipY}`}
              stroke="#5a7a3a"
              strokeWidth="1.6"
              fill="none"
            />
            {[0.28, 0.46, 0.64, 0.82].map((t, j) => {
              const px = x + driftEnd * t;
              const py = 20 + length * t;
              const offset = j % 2 ? 5 : -5;
              const rot = j % 2 ? 28 : -28;
              return (
                <ellipse
                  key={j}
                  cx={px + offset}
                  cy={py + 6}
                  rx="3.2"
                  ry="9"
                  fill={j % 2 ? "#9bbf6a" : "#82a44a"}
                  transform={`rotate(${rot} ${px + offset} ${py + 6})`}
                />
              );
            })}
            <ellipse cx={tipX} cy={tipY + 6} rx="3.6" ry="10" fill="#a8cc7a" />
          </g>
        );
      })}
    </svg>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(180deg, #c9dfb8 0%, #dde9c8 30%, #efe9d2 100%)",
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
