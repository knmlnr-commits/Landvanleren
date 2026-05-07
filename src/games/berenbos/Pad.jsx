import React, { useEffect, useState } from "react";
import VraagKaart from "./VraagKaart.jsx";
import { fetchBerenbosVragen } from "./questions.js";

const styles = {
  wrap: { position: "relative", marginBottom: 16 },
  trail: {
    position: "relative",
    background: "linear-gradient(180deg, #d4e9b8 0%, #b8dca0 100%)",
    border: "3px solid #6a7a3a",
    borderRadius: 22,
    padding: "20px 16px",
    overflow: "hidden",
    boxShadow: "inset 0 0 30px rgba(60, 90, 30, 0.18), 0 6px 18px rgba(20, 60, 30, 0.20)",
  },
  trailHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 12, gap: 10, flexWrap: "wrap",
  },
  vakChip: (color) => ({
    display: "inline-flex", alignItems: "center", gap: 8,
    background: color, color: "white",
    padding: "6px 14px", borderRadius: 999,
    fontFamily: "Georgia, serif", fontWeight: 700,
    fontSize: 14,
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  }),
  stepCount: {
    fontSize: 13, color: "#3a4a2a",
    background: "rgba(253, 250, 242, 0.9)",
    padding: "4px 10px", borderRadius: 999,
    fontWeight: 700,
  },
  track: {
    position: "relative",
    height: 92,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 4px",
  },
  trackLine: {
    position: "absolute",
    left: "5%", right: "5%",
    top: "50%",
    height: 6,
    transform: "translateY(-50%)",
    background: "repeating-linear-gradient(90deg, #8a6a3a 0 6px, transparent 6px 12px)",
    borderRadius: 3,
    opacity: 0.5,
  },
  step: (passed, current) => ({
    position: "relative",
    width: 26, height: 26,
    borderRadius: "50%",
    background: passed ? "#5a8a3a" : current ? "#fdfaf2" : "rgba(253, 250, 242, 0.5)",
    border: `2.5px solid ${current ? "#e8884a" : "#5a7a3a"}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, color: passed ? "white" : "#5a7a3a",
    boxShadow: current ? "0 0 0 4px rgba(232, 136, 74, 0.35)" : "0 2px 4px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease",
    zIndex: 1,
  }),
  bear: (xPercent) => ({
    position: "absolute",
    left: `calc(${xPercent}% - 22px)`,
    top: -6,
    fontSize: 36,
    transition: "left 0.55s cubic-bezier(0.4, 1.4, 0.6, 1)",
    filter: "drop-shadow(0 3px 4px rgba(0, 0, 0, 0.3))",
    zIndex: 2,
    animation: "bob 2.4s ease-in-out infinite",
  }),
  bossEnd: {
    position: "absolute",
    right: 6, top: -10,
    fontSize: 36,
    filter: "drop-shadow(0 3px 4px rgba(0, 0, 0, 0.4))",
    opacity: 0.85,
    zIndex: 1,
  },
  butterfly: (left, top, delay) => ({
    position: "absolute",
    left, top,
    fontSize: 18,
    animation: `bob 3s ease-in-out ${delay}s infinite`,
    pointerEvents: "none",
    opacity: 0.85,
  }),
  loadBox: {
    background: "#fdfaf2",
    border: "3px solid #5a8a4a",
    borderRadius: 22,
    padding: 26,
    textAlign: "center",
    color: "#3a4a2a",
    fontFamily: "Georgia, serif",
    fontSize: 16,
    boxShadow: "0 6px 18px rgba(20, 60, 30, 0.18)",
  },
  loadEmoji: {
    fontSize: 40, display: "block", marginBottom: 8,
    animation: "bob 1.4s ease-in-out infinite",
  },
};

export default function Pad({ niveau, vak, vakInfo, onComplete, onBackToBos }) {
  const [step, setStep] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [vragen, setVragen] = useState([]);
  const [vraagIdx, setVraagIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [, setSource] = useState(null);

  // Haal vragen op (8 stappen + paar buffer)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setStep(0);
    setVraagIdx(0);
    setConsecutiveWrong(0);

    fetchBerenbosVragen({
      niveau: niveau.id,
      vak,
      aantal: Math.min(10, niveau.padLengte + 2),
    }).then((res) => {
      if (cancelled) return;
      setVragen(res.vragen);
      setSource(res.source);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [niveau.id, vak]);

  // Kijk of we het einde gehaald hebben
  useEffect(() => {
    if (step >= niveau.padLengte) {
      onComplete();
    }
  }, [step, niveau.padLengte, onComplete]);

  function handleAnswer(correct) {
    if (correct) {
      setStep((s) => Math.min(niveau.padLengte, s + 1));
      setConsecutiveWrong(0);
    } else {
      // 1e fout: stap terug. 2e fout op rij: blijft staan.
      if (consecutiveWrong === 0) {
        setStep((s) => Math.max(0, s - 1));
      }
      setConsecutiveWrong((c) => c + 1);
    }
    // Volgende vraag (cycle als de bank klein is)
    setVraagIdx((idx) => (idx + 1) % Math.max(1, vragen.length));
  }

  const huidigeVraag = vragen[vraagIdx];
  const stepEntries = Array.from({ length: niveau.padLengte }, (_, i) => i);
  const bearPercent = niveau.padLengte > 0 ? (step / niveau.padLengte) * 100 : 0;

  if (loading) {
    return (
      <div style={styles.loadBox}>
        <span style={styles.loadEmoji}>🐻</span>
        Beertje pakt zijn rugzak…
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.trail}>
        <div style={styles.trailHeader}>
          <span style={styles.vakChip(vakInfo.color)}>
            {vakInfo.icon} {vakInfo.naam}
          </span>
          <span style={styles.stepCount}>
            Stap {step} van {niveau.padLengte}
          </span>
        </div>
        <div style={styles.track}>
          <div style={styles.trackLine} />
          {stepEntries.map((i) => {
            const passed = i < step;
            const current = i === step;
            return (
              <div key={i} style={styles.step(passed, current)}>
                {passed ? "🐾" : ""}
              </div>
            );
          })}
          <span style={styles.bear(bearPercent)}>🐻</span>
          <span style={styles.bossEnd} aria-hidden="true">{niveau.bossEmoji}</span>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        {huidigeVraag && (
          <VraagKaart
            vraag={huidigeVraag}
            vakInfo={vakInfo}
            onAnswer={handleAnswer}
          />
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
        <button
          onClick={onBackToBos}
          style={{
            background: "rgba(253, 250, 242, 0.92)",
            color: "#3a4a2a",
            border: "2px solid #7a8a5a",
            padding: "8px 16px",
            borderRadius: 999,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "Georgia, serif",
            fontSize: 13,
          }}
          type="button"
        >
          ← Ander pad kiezen
        </button>
      </div>
    </div>
  );
}
