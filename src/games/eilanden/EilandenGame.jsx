import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchQuestions } from "../../lib/questions.js";

const ISLANDS = [
  { slug: "rekenland", name: "Rekenland", icon: "🔢", color: "#3b82f6" },
  { slug: "toppieland", name: "Toppieland", icon: "🗺️", color: "#10b981" },
  { slug: "engeland", name: "Engeland", icon: "🇬🇧", color: "#ef4444" },
  { slug: "spelling", name: "Spelling", icon: "✏️", color: "#8b5cf6" },
  { slug: "historica", name: "Historica", icon: "📜", color: "#f59e0b" },
];

const NIVEAUS = [
  { slug: "groep56", name: "Groep 5 en 6", desc: "Basisschool middenbouw" },
  { slug: "groep78", name: "Groep 7 en 8", desc: "Basisschool bovenbouw" },
  { slug: "middelbaar", name: "Middelbaar", desc: "Brugklas en hoger" },
];

const QUESTIONS_PER_ISLAND = 6;
const WIN_THRESHOLD = 4;

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const styles = {
  page: { maxWidth: 880, margin: "0 auto", padding: "32px 20px" },
  back: { color: "#3a5a47", textDecoration: "none", fontSize: 14 },
  h1: { fontSize: 36, margin: "12px 0 4px", color: "#1f3a2a" },
  sub: { color: "#3a5a47", margin: "0 0 24px" },
  card: {
    background: "white",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 4px 16px rgba(31, 58, 42, 0.08)",
  },
  niveauGrid: { display: "grid", gridTemplateColumns: "1fr", gap: 12, marginTop: 16 },
  niveauBtn: {
    background: "white",
    border: "2px solid #d6ecdf",
    borderRadius: 14,
    padding: 18,
    textAlign: "left",
    cursor: "pointer",
    fontSize: 16,
    transition: "transform 0.05s, border-color 0.1s",
  },
  niveauName: { fontWeight: 700, fontSize: 18, color: "#1f3a2a" },
  niveauDesc: { color: "#3a5a47", fontSize: 14, marginTop: 4 },
  islandGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: 16,
    marginTop: 24,
  },
  island: (color, conquered) => ({
    background: conquered ? "#fef3c7" : "white",
    border: `3px solid ${conquered ? "#f59e0b" : color}`,
    borderRadius: 16,
    padding: 18,
    cursor: "pointer",
    textAlign: "center",
    fontSize: 16,
    fontWeight: 700,
    color: "#1f3a2a",
    transition: "transform 0.05s",
    position: "relative",
  }),
  icon: { fontSize: 44, display: "block", marginBottom: 6 },
  conqueredTag: {
    position: "absolute",
    top: 6,
    right: 8,
    fontSize: 11,
    background: "#f59e0b",
    color: "white",
    padding: "2px 8px",
    borderRadius: 999,
    fontWeight: 700,
  },
  progress: { color: "#3a5a47", fontSize: 14, margin: "0 0 16px" },
  question: {
    fontSize: 22,
    margin: "0 0 20px",
    color: "#1f3a2a",
    lineHeight: 1.4,
  },
  options: { display: "grid", gap: 10 },
  option: (state) => ({
    background:
      state === "correct" ? "#dcfce7" :
      state === "wrong" ? "#fee2e2" :
      state === "reveal" ? "#dcfce7" :
      "white",
    border: `2px solid ${
      state === "correct" ? "#16a34a" :
      state === "wrong" ? "#dc2626" :
      state === "reveal" ? "#16a34a" :
      "#d6ecdf"
    }`,
    borderRadius: 12,
    padding: "14px 16px",
    fontSize: 16,
    textAlign: "left",
    cursor: state ? "default" : "pointer",
    color: "#1f3a2a",
    fontWeight: 500,
  }),
  primary: {
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "12px 22px",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 18,
  },
  secondary: {
    background: "white",
    color: "#1f3a2a",
    border: "2px solid #d6ecdf",
    borderRadius: 12,
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  row: { display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" },
  resultTitle: { fontSize: 28, margin: "0 0 8px", color: "#1f3a2a" },
  hint: { color: "#3a5a47", fontSize: 13, marginTop: 12 },
  loading: { textAlign: "center", padding: "40px 20px", color: "#3a5a47" },
};

export default function EilandenGame() {
  const [phase, setPhase] = useState("niveau"); // niveau | map | loading | play | result | victory
  const [niveau, setNiveau] = useState(null);
  const [conquered, setConquered] = useState(new Set());
  const [activeIsland, setActiveIsland] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [source, setSource] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [pickedIndex, setPickedIndex] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = questions[qIndex];
  const shuffledOptions = useMemo(
    () => (currentQuestion ? shuffle(currentQuestion.options) : []),
    [currentQuestion]
  );

  useEffect(() => {
    if (conquered.size === ISLANDS.length && phase !== "victory") {
      setPhase("victory");
    }
  }, [conquered, phase]);

  function pickNiveau(slug) {
    setNiveau(slug);
    setConquered(new Set());
    setPhase("map");
  }

  async function startIsland(islandSlug) {
    setActiveIsland(islandSlug);
    setPhase("loading");
    setQIndex(0);
    setPickedIndex(null);
    setCorrectCount(0);
    const result = await fetchQuestions({
      niveau,
      eiland: islandSlug,
      aantal: QUESTIONS_PER_ISLAND,
    });
    setQuestions(result.questions);
    setSource(result.source);
    setPhase("play");
  }

  function pickAnswer(idx) {
    if (pickedIndex !== null) return;
    setPickedIndex(idx);
    if (shuffledOptions[idx] === currentQuestion.a) {
      setCorrectCount((c) => c + 1);
    }
  }

  function nextQuestion() {
    if (qIndex + 1 >= questions.length) {
      setPhase("result");
      return;
    }
    setQIndex(qIndex + 1);
    setPickedIndex(null);
  }

  function finishIsland(won) {
    if (won) {
      const next = new Set(conquered);
      next.add(activeIsland);
      setConquered(next);
    }
    setActiveIsland(null);
    setQuestions([]);
    setPhase(conquered.size + (won ? 1 : 0) === ISLANDS.length ? "victory" : "map");
  }

  function resetAll() {
    setNiveau(null);
    setConquered(new Set());
    setActiveIsland(null);
    setQuestions([]);
    setQIndex(0);
    setPickedIndex(null);
    setCorrectCount(0);
    setPhase("niveau");
  }

  // ---------- Render ----------
  if (phase === "niveau") {
    return (
      <div style={styles.page}>
        <Link to="/" style={styles.back}>← Terug naar Land van Leren</Link>
        <h1 style={styles.h1}>🏝️ Eilandenavontuur</h1>
        <p style={styles.sub}>Verover alle vijf de eilanden door vragen goed te beantwoorden.</p>
        <div style={styles.card}>
          <strong style={{ fontSize: 18, color: "#1f3a2a" }}>Kies je niveau</strong>
          <div style={styles.niveauGrid}>
            {NIVEAUS.map((n) => (
              <button key={n.slug} style={styles.niveauBtn} onClick={() => pickNiveau(n.slug)}>
                <div style={styles.niveauName}>{n.name}</div>
                <div style={styles.niveauDesc}>{n.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "map") {
    const remaining = ISLANDS.length - conquered.size;
    return (
      <div style={styles.page}>
        <Link to="/" style={styles.back}>← Terug naar Land van Leren</Link>
        <h1 style={styles.h1}>De vijf eilanden</h1>
        <p style={styles.sub}>
          {remaining === ISLANDS.length
            ? "Klik op een eiland om te beginnen."
            : `Nog ${remaining} eiland${remaining === 1 ? "" : "en"} te veroveren.`}
        </p>
        <div style={styles.islandGrid}>
          {ISLANDS.map((island) => {
            const isConquered = conquered.has(island.slug);
            return (
              <button
                key={island.slug}
                style={styles.island(island.color, isConquered)}
                onClick={() => startIsland(island.slug)}
              >
                {isConquered && <span style={styles.conqueredTag}>veroverd</span>}
                <span style={styles.icon}>{island.icon}</span>
                {island.name}
              </button>
            );
          })}
        </div>
        <div style={styles.row}>
          <button style={styles.secondary} onClick={resetAll}>Ander niveau</button>
        </div>
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.loading}>Vragen laden…</div>
        </div>
      </div>
    );
  }

  if (phase === "play" && currentQuestion) {
    const island = ISLANDS.find((i) => i.slug === activeIsland);
    const correctAnswer = currentQuestion.a;
    return (
      <div style={styles.page}>
        <p style={styles.progress}>
          {island.icon} {island.name} • Vraag {qIndex + 1} van {questions.length}
        </p>
        <div style={styles.card}>
          <p style={styles.question}>{currentQuestion.q}</p>
          <div style={styles.options}>
            {shuffledOptions.map((opt, idx) => {
              let state = null;
              if (pickedIndex !== null) {
                if (opt === correctAnswer) state = idx === pickedIndex ? "correct" : "reveal";
                else if (idx === pickedIndex) state = "wrong";
              }
              return (
                <button
                  key={idx}
                  style={styles.option(state)}
                  onClick={() => pickAnswer(idx)}
                  disabled={pickedIndex !== null}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {pickedIndex !== null && (
            <button style={styles.primary} onClick={nextQuestion}>
              {qIndex + 1 >= questions.length ? "Resultaat" : "Volgende vraag"}
            </button>
          )}
          {source === "fallback" && (
            <p style={styles.hint}>Offline-vragen (geen verbinding met vragen-server).</p>
          )}
        </div>
      </div>
    );
  }

  if (phase === "result") {
    const island = ISLANDS.find((i) => i.slug === activeIsland);
    const won = correctCount >= WIN_THRESHOLD;
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.resultTitle}>
            {won ? `🎉 ${island.name} veroverd!` : `💪 Bijna! Nog een keer?`}
          </h2>
          <p style={styles.sub}>
            Je had {correctCount} van de {questions.length} vragen goed.
            {won ? "" : ` Je hebt er minimaal ${WIN_THRESHOLD} nodig om het eiland te veroveren.`}
          </p>
          <div style={styles.row}>
            <button style={styles.primary} onClick={() => finishIsland(won)}>
              {won ? "Door naar de kaart" : "Terug naar de kaart"}
            </button>
            {!won && (
              <button style={styles.secondary} onClick={() => startIsland(activeIsland)}>
                Probeer dit eiland opnieuw
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "victory") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.resultTitle}>🏆 Alle eilanden veroverd!</h2>
          <p style={styles.sub}>
            Je hebt het hele Eilandenavontuur uitgespeeld. Bedankt voor het spelen!
          </p>
          <div style={styles.row}>
            <button style={styles.primary} onClick={resetAll}>Opnieuw spelen</button>
            <Link to="/" style={{ ...styles.secondary, textDecoration: "none", display: "inline-block" }}>
              Terug naar Land van Leren
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
