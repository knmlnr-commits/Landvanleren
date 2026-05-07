import React, { useEffect, useMemo, useRef, useState } from "react";

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const styles = {
  card: {
    background: "#fdfaf2",
    border: "3px solid #5a8a4a",
    borderRadius: 22,
    padding: 22,
    boxShadow: "0 14px 30px rgba(20, 60, 30, 0.28)",
    position: "relative",
    overflow: "hidden",
    animation: "pop-in 0.3s ease-out",
  },
  vakBadge: (color) => ({
    display: "inline-flex", alignItems: "center", gap: 6,
    background: color, color: "white", fontWeight: 700,
    padding: "4px 12px", borderRadius: 999,
    fontSize: 13, marginBottom: 12,
    fontFamily: "Georgia, serif",
  }),
  vraag: {
    fontSize: 22, color: "#1f3a2a",
    margin: "0 0 16px", lineHeight: 1.4,
    fontFamily: "Georgia, serif", fontWeight: 600,
  },
  optieList: { display: "grid", gap: 10 },
  optie: (state, vakColor) => ({
    background:
      state === "correct" ? "#cdebc2" :
      state === "wrong"   ? "#f7c9c4" :
      state === "reveal"  ? "#cdebc2" :
      "#f5efde",
    border: `2.5px solid ${
      state === "correct" ? "#3aa050" :
      state === "wrong"   ? "#c84a3a" :
      state === "reveal"  ? "#3aa050" :
      vakColor || "#7a5a3a"
    }`,
    borderRadius: 14,
    padding: "13px 16px",
    fontSize: 16,
    textAlign: "left",
    color: "#1f3a2a",
    fontWeight: 600,
    cursor: state ? "default" : "pointer",
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontFamily: "system-ui, sans-serif",
  }),
  feedback: (kind) => ({
    marginTop: 14, padding: "12px 14px", borderRadius: 12,
    background: kind === "correct" ? "#dff5d4" : "#fde2dc",
    border: `2px solid ${kind === "correct" ? "#3aa050" : "#c84a3a"}`,
    color: "#1f3a2a", fontSize: 14, lineHeight: 1.5,
    fontFamily: "system-ui, sans-serif",
  }),
  feedbackTitle: { fontWeight: 800, marginBottom: 4, fontSize: 15 },
  primary: {
    background: "#5a8a4a", color: "white",
    border: "2px solid #3a6a2a", borderRadius: 14,
    padding: "11px 22px", fontSize: 16, fontWeight: 800,
    cursor: "pointer", marginTop: 14,
    fontFamily: "Georgia, serif",
    boxShadow: "0 4px 0 #3a6a2a",
  },
  timerWrap: {
    height: 8, background: "#e8e0c4",
    borderRadius: 999, overflow: "hidden", marginBottom: 14,
  },
  timerBar: (frac, urgent) => ({
    height: "100%", width: `${frac * 100}%`,
    background: urgent ? "#c84a3a" : "#5a8a4a",
    transition: "width 0.1s linear, background 0.2s",
  }),
  ico: { fontSize: 18 },
};

const PICK_TIMEOUT = -1;

export default function VraagKaart({ vraag, vakInfo, timerSec, onAnswer }) {
  const opties = useMemo(() => shuffle(vraag.opties), [vraag]);
  const [picked, setPicked] = useState(null); // index, of PICK_TIMEOUT bij time-out
  const [timeLeft, setTimeLeft] = useState(timerSec || 0);
  const submittedRef = useRef(false);

  useEffect(() => {
    setPicked(null);
    setTimeLeft(timerSec || 0);
    submittedRef.current = false;
  }, [vraag, timerSec]);

  useEffect(() => {
    if (!timerSec) return;
    if (picked !== null) return;
    if (timeLeft <= 0) {
      setPicked(PICK_TIMEOUT);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => Math.max(0, s - 0.1)), 100);
    return () => clearTimeout(t);
  }, [timeLeft, timerSec, picked]);

  function handlePick(idx) {
    if (picked !== null) return;
    setPicked(idx);
  }

  function handleNext() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const correct = picked !== null && picked >= 0 && opties[picked] === vraag.antwoord;
    onAnswer(correct);
  }

  const isTimeout = picked === PICK_TIMEOUT;
  const correct = !isTimeout && picked !== null && opties[picked] === vraag.antwoord;
  const showFeedback = picked !== null;
  const timerFrac = timerSec ? timeLeft / timerSec : 1;
  const urgent = timerSec && timeLeft < timerSec * 0.33;

  return (
    <div style={styles.card}>
      {vakInfo && (
        <span style={styles.vakBadge(vakInfo.color)}>
          <span style={styles.ico}>{vakInfo.icon}</span>
          {vakInfo.naam}
        </span>
      )}
      {timerSec ? (
        <div style={styles.timerWrap} aria-label={`Tijd: ${Math.ceil(timeLeft)} seconden`}>
          <div style={styles.timerBar(timerFrac, urgent)} />
        </div>
      ) : null}
      <p style={styles.vraag}>{vraag.vraag}</p>
      <div style={styles.optieList}>
        {opties.map((opt, idx) => {
          let state = null;
          if (picked !== null) {
            if (opt === vraag.antwoord) {
              state = idx === picked ? "correct" : "reveal";
            } else if (idx === picked) {
              state = "wrong";
            }
          }
          const indicator = state === "correct" || state === "reveal" ? "✓" :
                            state === "wrong" ? "✗" : "";
          const indicatorColor =
            state === "correct" || state === "reveal" ? "#3aa050" :
            state === "wrong" ? "#c84a3a" : "#7a5a3a";
          return (
            <button
              key={idx}
              style={styles.optie(state, vakInfo?.color)}
              onClick={() => handlePick(idx)}
              disabled={picked !== null}
              type="button"
            >
              <span style={{ width: 18, fontWeight: 800, color: indicatorColor }}>{indicator}</span>
              {opt}
            </button>
          );
        })}
      </div>
      {showFeedback && (
        <div style={styles.feedback(correct ? "correct" : "wrong")}>
          <div style={styles.feedbackTitle}>
            {isTimeout ? "⏱️ Tijd op!" : correct ? "✓ Goed gedaan!" : "✗ Net niet"}
          </div>
          {vraag.uitleg && correct && <div>{vraag.uitleg}</div>}
          {!correct && (
            <div>
              Het juiste antwoord was: <strong>{vraag.antwoord}</strong>
              {vraag.uitleg ? `. ${vraag.uitleg}` : "."}
            </div>
          )}
        </div>
      )}
      {showFeedback && (
        <button style={styles.primary} onClick={handleNext} type="button">
          Verder →
        </button>
      )}
    </div>
  );
}
