import React from "react";
import { vakkenVoorNiveau } from "./config.js";

const styles = {
  // Steentjes-pad bovenaan met gevulde stenen voor voltooide paden
  stonesWrap: {
    background: "rgba(253, 250, 242, 0.92)",
    border: "2px solid #6a7a3a",
    borderRadius: 22,
    padding: "12px 14px",
    marginBottom: 14,
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(20, 60, 30, 0.18)",
  },
  stonesRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  stone: (done, color) => ({
    width: 50, height: 50,
    borderRadius: "50%",
    background: done ? color : "rgba(253, 250, 242, 0.95)",
    border: `3px solid ${color}`,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    fontSize: 22, lineHeight: 1,
    color: done ? "white" : color,
    fontFamily: "Georgia, serif", fontWeight: 800,
    boxShadow: done
      ? `0 4px 10px ${color}66, inset 0 -3px 0 rgba(0,0,0,0.18)`
      : "0 3px 6px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease",
    flexShrink: 0,
  }),
  stoneTrail: {
    width: 22, height: 4,
    background: "repeating-linear-gradient(90deg, #8a6a3a 0 5px, transparent 5px 10px)",
    borderRadius: 2,
    flexShrink: 0,
  },
  progressLabel: {
    fontSize: 13, color: "#3a4a2a",
    fontFamily: "Georgia, serif", fontWeight: 700,
  },
  intro: { textAlign: "center", marginBottom: 16 },
  bear: {
    fontSize: 56, display: "block", marginBottom: 4,
    animation: "bob 2.4s ease-in-out infinite",
    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))",
  },
  bearTagline: {
    color: "#fdfaf2",
    fontFamily: "Georgia, serif",
    fontSize: 17, margin: 0,
    textShadow: "0 1px 4px rgba(0, 40, 10, 0.5)",
    fontStyle: "italic",
  },
  pathGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 14,
    marginBottom: 16,
  },
  pathCard: (color, done) => ({
    background: done
      ? "linear-gradient(180deg, #f0ead5 0%, #d8cfa8 100%)"
      : "linear-gradient(180deg, #fdfaf2 0%, #f0e6c8 100%)",
    border: `3px solid ${done ? "#9a8a5a" : color}`,
    borderRadius: 22,
    padding: "20px 16px",
    cursor: done ? "default" : "pointer",
    textAlign: "center",
    color: done ? "#7a6a4a" : "#1f3a2a",
    fontFamily: "Georgia, serif",
    fontWeight: 700,
    boxShadow: done
      ? "inset 0 0 22px rgba(60, 80, 30, 0.18)"
      : "0 6px 16px rgba(20, 60, 30, 0.22)",
    transition: "transform 0.15s",
    width: "100%",
    position: "relative",
    overflow: "hidden",
  }),
  pathIcon: (done) => ({
    fontSize: 44, display: "block", marginBottom: 6,
    animation: done ? "none" : "bob 3s ease-in-out infinite",
    filter: done ? "saturate(0.55) opacity(0.85)" : "none",
  }),
  pathName: { fontSize: 18, color: "inherit" },
  pathHint: {
    fontSize: 12, marginTop: 4, fontWeight: 500, fontStyle: "italic",
    color: "inherit", opacity: 0.75,
  },
  voltooidBanner: {
    position: "absolute",
    top: 18, right: -38, width: 140,
    transform: "rotate(34deg)",
    background: "linear-gradient(180deg, #6abb56 0%, #4a9a3a 100%)",
    color: "white",
    textAlign: "center",
    fontSize: 11, fontWeight: 800, letterSpacing: 1.4,
    padding: "4px 0",
    fontFamily: "system-ui, sans-serif",
    boxShadow: "0 3px 8px rgba(0,0,0,0.30)",
    pointerEvents: "none",
    zIndex: 2,
    borderTop: "1px solid rgba(255,255,255,0.4)",
    borderBottom: "1px solid rgba(0,0,0,0.2)",
  },
  pawOverlay: (top, left, rot) => ({
    position: "absolute",
    top, left,
    fontSize: 22,
    opacity: 0.40,
    pointerEvents: "none",
    transform: `rotate(${rot}deg)`,
    filter: "saturate(0.6)",
  }),
  doneStamp: {
    position: "absolute",
    bottom: 8, left: "50%",
    transform: "translateX(-50%)",
    background: "#5aa850",
    color: "white",
    fontSize: 11, fontWeight: 800,
    padding: "2px 10px",
    borderRadius: 999,
    letterSpacing: 0.5,
    fontFamily: "system-ui, sans-serif",
    boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
    zIndex: 2,
  },
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
};

export default function Bos({ niveau, conquered, onPickVak }) {
  const vakken = vakkenVoorNiveau(niveau.id);
  const aantalKlaar = vakken.filter((v) => conquered?.has?.(v.slug)).length;
  const totaal = vakken.length;
  const allKlaar = aantalKlaar === totaal;

  return (
    <div>
      <div style={styles.stonesWrap}>
        <div style={styles.stonesRow} aria-label={`Voortgang ${aantalKlaar} van ${totaal} paden`}>
          {vakken.map((vak, i) => {
            const done = conquered?.has?.(vak.slug);
            return (
              <React.Fragment key={vak.slug}>
                <div style={styles.stone(done, vak.color)} title={vak.naam}>
                  {done ? "🐾" : vak.icon}
                </div>
                {i < vakken.length - 1 && <div style={styles.stoneTrail} aria-hidden="true" />}
              </React.Fragment>
            );
          })}
        </div>
        <div style={styles.progressLabel}>
          {allKlaar
            ? "Alle paden gelopen — tijd voor de wolf!"
            : `${aantalKlaar} van ${totaal} paden gelopen`}
        </div>
      </div>

      <div style={styles.intro}>
        <span style={styles.bear} aria-hidden="true">🐻</span>
        <p style={styles.bearTagline}>
          {aantalKlaar === 0
            ? "Welk pad neemt het beertje?"
            : `Nog ${totaal - aantalKlaar} pad${totaal - aantalKlaar === 1 ? "" : "en"} te gaan.`}
        </p>
      </div>

      <div style={styles.pathGrid}>
        {vakken.map((vak) => {
          const done = conquered?.has?.(vak.slug);
          return (
            <button
              key={vak.slug}
              style={styles.pathCard(vak.color, done)}
              onClick={() => !done && onPickVak(vak.slug)}
              disabled={done}
              type="button"
              aria-label={`Pad van ${vak.naam}${done ? " (voltooid)" : ""}`}
            >
              {done && <div style={styles.voltooidBanner}>VOLTOOID</div>}
              {done && (
                <>
                  <span style={styles.pawOverlay(12, 14, -18)}>🐾</span>
                  <span style={styles.pawOverlay(36, "auto", 22)} aria-hidden="true">🐾</span>
                  <span style={{ ...styles.pawOverlay(70, 26, -8), right: "auto" }}>🐾</span>
                </>
              )}
              <span style={styles.pathIcon(done)}>{vak.icon}</span>
              <div style={styles.pathName}>{vak.naam}</div>
              <div style={styles.pathHint}>
                {done ? "Beertje is hier al geweest" : `${niveau.padLengte} stappen door het bos`}
              </div>
              {done && <div style={styles.doneStamp}>✓ gelopen</div>}
            </button>
          );
        })}
      </div>

      <div style={styles.bossPreview}>
        Aan het einde wacht <strong>{niveau.bossEmoji} {niveau.bossNaam}</strong>.
        Eerst alle paden, dan het beest verslaan.
      </div>
    </div>
  );
}
