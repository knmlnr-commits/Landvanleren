import React from "react";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "64px 24px",
    textAlign: "center",
  },
  h1: { fontSize: 40, margin: "0 0 12px", color: "#1f3a2a" },
  tagline: { fontSize: 18, color: "#3a5a47", margin: "0 0 32px" },
  card: {
    background: "white",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 4px 16px rgba(31, 58, 42, 0.08)",
    textAlign: "left",
  },
  cardTitle: { margin: "0 0 8px", fontSize: 22 },
  badge: {
    display: "inline-block",
    fontSize: 12,
    padding: "2px 10px",
    borderRadius: 999,
    background: "#fef3c7",
    color: "#92400e",
    marginLeft: 8,
    verticalAlign: "middle",
  },
  blurb: { color: "#3a5a47", margin: 0 },
};

export default function Home() {
  return (
    <div style={styles.wrap}>
      <h1 style={styles.h1}>Land van Leren</h1>
      <p style={styles.tagline}>Speel, leer, ontdek. Educatieve games van Willow Games.</p>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          Eilandenavontuur
          <span style={styles.badge}>binnenkort</span>
        </h2>
        <p style={styles.blurb}>
          Verover de vijf eilanden door vragen goed te beantwoorden. De vragen worden
          telkens opnieuw gegenereerd, zodat herspelen leuk blijft.
        </p>
      </div>
    </div>
  );
}
