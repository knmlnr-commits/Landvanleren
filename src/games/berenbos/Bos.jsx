import React from "react";
import { vakkenVoorNiveau } from "./config.js";

const styles = {
  intro: {
    textAlign: "center",
    marginBottom: 18,
  },
  bear: {
    fontSize: 68,
    display: "block",
    marginBottom: 6,
    animation: "bob 2.4s ease-in-out infinite",
    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))",
  },
  bearTagline: {
    color: "#fdfaf2",
    fontFamily: "Georgia, serif",
    fontSize: 17,
    margin: 0,
    textShadow: "0 1px 4px rgba(0, 40, 10, 0.5)",
    fontStyle: "italic",
  },
  pathsHeader: {
    background: "rgba(253, 250, 242, 0.92)",
    color: "#3a4a2a",
    fontFamily: "Georgia, serif",
    fontWeight: 700,
    padding: "8px 14px",
    borderRadius: 999,
    fontSize: 14,
    display: "inline-block",
    marginBottom: 14,
    boxShadow: "0 2px 6px rgba(20, 60, 30, 0.18)",
  },
  pathGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 14,
    marginBottom: 16,
  },
  pathCard: (color) => ({
    background: "linear-gradient(180deg, #fdfaf2 0%, #f0e6c8 100%)",
    border: `3px solid ${color}`,
    borderRadius: 22,
    padding: "20px 16px",
    cursor: "pointer",
    textAlign: "center",
    color: "#1f3a2a",
    fontFamily: "Georgia, serif",
    fontWeight: 700,
    boxShadow: "0 6px 16px rgba(20, 60, 30, 0.22)",
    transition: "transform 0.15s, box-shadow 0.15s",
    width: "100%",
    position: "relative",
    overflow: "hidden",
  }),
  pathIcon: {
    fontSize: 44,
    display: "block",
    marginBottom: 6,
    animation: "bob 3s ease-in-out infinite",
  },
  pathName: { fontSize: 18, color: "#3a4a2a" },
  pathHint: { fontSize: 12, color: "#6a7a5a", marginTop: 4, fontWeight: 500, fontStyle: "italic" },
  bossPreview: {
    marginTop: 8,
    background: "rgba(253, 250, 242, 0.92)",
    color: "#3a4a2a",
    padding: "10px 16px",
    borderRadius: 16,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Georgia, serif",
    border: "2px dashed #7a5a3a",
  },
  mushroom: (left, top, delay) => ({
    position: "absolute",
    left, top,
    fontSize: 22,
    pointerEvents: "none",
    animation: `bob 4s ease-in-out ${delay}s infinite`,
    opacity: 0.9,
    zIndex: 1,
  }),
};

export default function Bos({ niveau, onPickVak }) {
  const vakken = vakkenVoorNiveau(niveau.id);

  return (
    <div>
      <div style={styles.intro}>
        <span style={styles.bear} aria-hidden="true">🐻</span>
        <p style={styles.bearTagline}>
          Welk pad neemt het beertje?
        </p>
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={styles.pathsHeader}>
          🌲 Drie paden door het bos 🌲
        </div>
      </div>

      <div style={styles.pathGrid}>
        {vakken.map((vak) => (
          <button
            key={vak.slug}
            style={styles.pathCard(vak.color)}
            onClick={() => onPickVak(vak.slug)}
            type="button"
            aria-label={`Pad van ${vak.naam}`}
          >
            <span style={styles.pathIcon}>{vak.icon}</span>
            <div style={styles.pathName}>{vak.naam}</div>
            <div style={styles.pathHint}>{niveau.padLengte} stappen door het bos</div>
          </button>
        ))}
      </div>

      <div style={styles.bossPreview}>
        Aan het einde wacht <strong>{niveau.bossEmoji} {niveau.bossNaam}</strong>.
        Eerst alle paden, dan het beest verslaan.
      </div>
    </div>
  );
}
