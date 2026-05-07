import React, { useEffect, useState } from "react";
import VraagKaart from "./VraagKaart.jsx";
import BosScene from "./BosScene.jsx";
import { fetchBerenbosVragen } from "./questions.js";

const styles = {
  wrap: { position: "relative", marginBottom: 16 },
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
  backRow: { display: "flex", justifyContent: "center", marginTop: 14 },
  backBtn: {
    background: "rgba(253, 250, 242, 0.94)",
    color: "#3a4a2a",
    border: "2px solid #7a8a5a",
    padding: "8px 16px",
    borderRadius: 999,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "Georgia, serif",
    fontSize: 13,
  },
};

export default function Pad({ niveau, vak, vakInfo, onComplete, onBackToBos }) {
  const [step, setStep] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [vragen, setVragen] = useState([]);
  const [vraagIdx, setVraagIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bearAnim, setBearAnim] = useState(null);
  const [popup, setPopup] = useState(null);
  const [popupKey, setPopupKey] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);
  const [sparkleKey, setSparkleKey] = useState(0);
  const [, setSource] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setStep(0);
    setVraagIdx(0);
    setConsecutiveWrong(0);
    setBearAnim(null);
    setPopup(null);

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
      setTimeout(() => setShowSparkles(false), 950);
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
    setPopup(popupData);
    setPopupKey((k) => k + 1);
    setVraagIdx((idx) => (idx + 1) % Math.max(1, vragen.length));
    setTimeout(() => setBearAnim(null), 720);
  }

  if (loading) {
    return (
      <div style={styles.loadBox}>
        <span style={styles.loadEmoji}>🐻</span>
        Beertje pakt zijn rugzak…
      </div>
    );
  }

  const huidigeVraag = vragen[vraagIdx];

  return (
    <div style={styles.wrap}>
      <BosScene
        niveau={niveau}
        vakInfo={vakInfo}
        step={step}
        bearAnim={bearAnim}
        popup={popup}
        popupKey={popupKey}
        showSparkles={showSparkles}
        sparkleKey={sparkleKey}
      />

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

      <div style={styles.backRow}>
        <button onClick={onBackToBos} style={styles.backBtn} type="button">
          ← Ander pad kiezen
        </button>
      </div>
    </div>
  );
}
