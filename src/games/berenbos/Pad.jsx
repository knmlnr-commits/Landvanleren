import React, { useEffect, useState } from "react";
import VraagKaart from "./VraagKaart.jsx";
import { fetchBerenbosVragen } from "./questions.js";

const styles = {
  wrap: { position: "relative", marginBottom: 16 },
  trail: {
    position: "relative",
    background: "radial-gradient(ellipse at 50% 30%, #d8edbe 0%, #b8d09a 60%, #8ab070 100%)",
    border: "3px solid #6a7a3a",
    borderRadius: 22,
    padding: "20px 16px 26px",
    overflow: "hidden",
    boxShadow: "inset 0 0 30px rgba(60, 90, 30, 0.18), 0 6px 18px rgba(20, 60, 30, 0.20)",
  },
  trailHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 14, gap: 10, flexWrap: "wrap",
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
    background: "rgba(253, 250, 242, 0.92)",
    padding: "4px 10px", borderRadius: 999,
    fontWeight: 700,
  },
  trailTrees: {
    position: "absolute",
    fontSize: 24,
    opacity: 0.8,
    pointerEvents: "none",
  },
  track: {
    position: "relative",
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 4px",
    marginTop: 8,
  },
  trackPath: {
    position: "absolute",
    left: "3%", right: "3%",
    top: "50%",
    height: 22,
    transform: "translateY(-50%)",
    background: "linear-gradient(180deg, #d4ad7a 0%, #b88a58 100%)",
    border: "2px solid #8a6a40",
    borderRadius: 999,
    boxShadow: "inset 0 -3px 4px rgba(0,0,0,0.18), inset 0 2px 2px rgba(255,255,255,0.25)",
  },
  step: (passed, current, justEntered) => ({
    position: "relative",
    width: 30, height: 30,
    borderRadius: "50%",
    background: passed ? "#5a8a3a" : current ? "#fdfaf2" : "rgba(253, 250, 242, 0.55)",
    border: `2.5px solid ${current ? "#e8884a" : "#5a7a3a"}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, color: passed ? "white" : "#5a7a3a",
    boxShadow: current ? "0 0 0 4px rgba(232, 136, 74, 0.35)" : "0 2px 4px rgba(0,0,0,0.18)",
    transition: "all 0.3s ease",
    zIndex: 1,
    animation: justEntered ? "step-glow 0.7s ease-out" : "none",
  }),
  bear: (xPercent, anim) => ({
    position: "absolute",
    left: `calc(${xPercent}% - 22px)`,
    top: -10,
    fontSize: 38,
    transition: "left 0.55s cubic-bezier(0.4, 1.4, 0.6, 1)",
    filter: "drop-shadow(0 3px 4px rgba(0, 0, 0, 0.3))",
    zIndex: 3,
    animation:
      anim === "hop"     ? "bear-hop 0.7s ease-out" :
      anim === "stumble" ? "bear-stumble 0.7s ease-out" :
      "bob 2.4s ease-in-out infinite",
  }),
  bossEnd: {
    position: "absolute",
    right: 6, top: -12,
    fontSize: 38,
    filter: "drop-shadow(0 3px 4px rgba(0, 0, 0, 0.4))",
    opacity: 0.85,
    zIndex: 1,
    animation: "bob 3.2s ease-in-out infinite",
  },
  popup: (xPercent, color) => ({
    position: "absolute",
    left: `${xPercent}%`,
    top: -18,
    color, fontWeight: 800, fontSize: 14,
    fontFamily: "Georgia, serif",
    background: "rgba(255, 255, 255, 0.96)",
    padding: "4px 12px",
    borderRadius: 999,
    border: `2.5px solid ${color}`,
    pointerEvents: "none",
    whiteSpace: "nowrap",
    boxShadow: "0 3px 8px rgba(0, 0, 0, 0.25)",
    animation: "pop-bubble 1.4s ease-out forwards",
    zIndex: 6,
  }),
  sparkle: (left, top, delay) => ({
    position: "absolute",
    left, top,
    fontSize: 18,
    pointerEvents: "none",
    animation: `sparkle 0.9s ease-out ${delay}s forwards`,
    zIndex: 5,
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
  const [bearAnim, setBearAnim] = useState(null);    // null | "hop" | "stumble"
  const [popup, setPopup] = useState(null);          // { key, text, color, atPercent }
  const [sparkleKey, setSparkleKey] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);
  const [, setSource] = useState(null);

  // Vragen ophalen
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

  // Einde van pad bereikt?
  useEffect(() => {
    if (step >= niveau.padLengte) {
      onComplete();
    }
  }, [step, niveau.padLengte, onComplete]);

  function handleAnswer(correct) {
    let popupData;
    if (correct) {
      setStep((s) => Math.min(niveau.padLengte, s + 1));
      setConsecutiveWrong(0);
      setBearAnim("hop");
      popupData = { text: "+1 🐾", color: "#3aa050" };
      setShowSparkles(true);
      setSparkleKey((k) => k + 1);
      setTimeout(() => setShowSparkles(false), 900);
    } else {
      if (consecutiveWrong === 0) {
        setStep((s) => Math.max(0, s - 1));
        popupData = { text: "−1 stap", color: "#c84a3a" };
      } else {
        popupData = { text: "Houd vol!", color: "#e8884a" };
      }
      setConsecutiveWrong((c) => c + 1);
      setBearAnim("stumble");
    }
    setPopup({ ...popupData, key: Date.now() });
    setVraagIdx((idx) => (idx + 1) % Math.max(1, vragen.length));
    setTimeout(() => setBearAnim(null), 720);
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
        <span style={{ ...styles.trailTrees, left: 8,  bottom: 22 }} aria-hidden="true">🌳</span>
        <span style={{ ...styles.trailTrees, left: 80, top: 14 }}    aria-hidden="true">🌲</span>
        <span style={{ ...styles.trailTrees, right: 80, bottom: 18, fontSize: 22 }} aria-hidden="true">🌳</span>
        <span style={{ ...styles.trailTrees, right: 14, top: 18, fontSize: 22 }}    aria-hidden="true">🍄</span>

        <div style={styles.trailHeader}>
          <span style={styles.vakChip(vakInfo.color)}>
            {vakInfo.icon} {vakInfo.naam}
          </span>
          <span style={styles.stepCount}>
            Stap {step} van {niveau.padLengte}
          </span>
        </div>

        <div style={styles.track}>
          <div style={styles.trackPath} />
          {stepEntries.map((i) => {
            const passed = i < step;
            const current = i === step;
            const justEntered = current && bearAnim === "hop";
            return (
              <div key={i} style={styles.step(passed, current, justEntered)}>
                {passed ? "🐾" : ""}
              </div>
            );
          })}
          <span style={styles.bear(bearPercent, bearAnim)} aria-label="Beertje">🐻</span>
          <span style={styles.bossEnd} aria-hidden="true">{niveau.bossEmoji}</span>
          {popup && (
            <div key={popup.key} style={styles.popup(bearPercent, popup.color)}>
              {popup.text}
            </div>
          )}
          {showSparkles && (
            <>
              <span key={`s1-${sparkleKey}`} style={styles.sparkle(`calc(${bearPercent}% - 28px)`, -4, 0)}>✨</span>
              <span key={`s2-${sparkleKey}`} style={styles.sparkle(`calc(${bearPercent}% + 14px)`, 8, 0.15)}>⭐</span>
              <span key={`s3-${sparkleKey}`} style={styles.sparkle(`calc(${bearPercent}% - 4px)`, 28, 0.3)}>✨</span>
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        {huidigeVraag && (
          <VraagKaart
            key={`${vak}-${vraagIdx}`}
            vraag={huidigeVraag}
            vakInfo={vakInfo}
            timerSec={niveau.padTimerSec}
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
