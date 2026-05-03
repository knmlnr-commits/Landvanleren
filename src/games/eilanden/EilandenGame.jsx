import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchQuestions } from "../../lib/questions.js";

const ISLANDS = [
  { slug: "rekenland",  name: "Rekenland",  icon: "🔢", tint: "#3b82f6" },
  { slug: "toppieland", name: "Toppieland", icon: "🗺️", tint: "#10b981" },
  { slug: "engeland",   name: "Engeland",   icon: "🇬🇧", tint: "#ef4444" },
  { slug: "spelling",   name: "Spelling",   icon: "✏️", tint: "#8b5cf6" },
  { slug: "historica",  name: "Historica",  icon: "📜", tint: "#f59e0b" },
];

const NIVEAUS = [
  { slug: "groep56",    name: "Groep 5 en 6", desc: "Basisschool middenbouw", icon: "🐢" },
  { slug: "groep78",    name: "Groep 7 en 8", desc: "Basisschool bovenbouw",  icon: "🦜" },
  { slug: "middelbaar", name: "Middelbaar",   desc: "Brugklas en hoger",       icon: "🦈" },
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

// ---------- Decorative SVGs ----------

function Sun() {
  return (
    <svg
      viewBox="0 0 120 120"
      width="100"
      height="100"
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 1,
        animation: "sun-pulse 4s ease-in-out infinite",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <line
          key={deg}
          x1="60" y1="20" x2="60" y2="6"
          stroke="#ffd766"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${deg} 60 60)`}
        />
      ))}
      <circle cx="60" cy="60" r="28" fill="#ffd766" />
      <circle cx="60" cy="60" r="22" fill="#ffe898" />
    </svg>
  );
}

function Waves() {
  // SVG width = 200% so we can translate -50% for a seamless loop.
  const wave = (y, fill, opacity) => (
    <path
      d={`M0 ${y} Q150 ${y - 14} 300 ${y} T600 ${y} T900 ${y} T1200 ${y} T1500 ${y} T1800 ${y} T2100 ${y} T2400 ${y} V200 H0 Z`}
      fill={fill}
      opacity={opacity}
    />
  );
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: 110,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 2400 200"
        preserveAspectRatio="none"
        style={{ width: "200%", height: "100%", animation: "wave-slide 18s linear infinite" }}
      >
        {wave(60, "#ffffff", 0.20)}
      </svg>
      <svg
        viewBox="0 0 2400 200"
        preserveAspectRatio="none"
        style={{ width: "200%", height: "100%", position: "absolute", inset: 0, animation: "wave-slide 26s linear infinite reverse" }}
      >
        {wave(80, "#ffffff", 0.30)}
      </svg>
    </div>
  );
}

function Island({ size = 130, conquered, locked, icon }) {
  return (
    <svg
      viewBox="0 0 130 140"
      width={size}
      height={size * 140 / 130}
      style={{ display: "block", margin: "0 auto", filter: locked ? "grayscale(0.8) brightness(0.85)" : "none" }}
      aria-hidden="true"
    >
      {/* water reflection */}
      <ellipse cx="65" cy="125" rx="48" ry="6" fill="rgba(0, 0, 0, 0.18)" />
      {/* sand body */}
      <ellipse cx="65" cy="108" rx="50" ry="20" fill="#e8c878" />
      <path d="M18 108 Q22 96 38 92 Q55 84 65 84 Q78 84 92 92 Q108 96 112 108 Z" fill="#f5d99a" />
      {/* tiny waves on sand */}
      <path d="M22 116 Q30 113 38 116 T54 116" stroke="#f0e2bc" strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M76 118 Q86 115 96 118 T112 118" stroke="#f0e2bc" strokeWidth="1.5" fill="none" opacity="0.7" />
      {/* palm trunk */}
      <path d="M64 84 Q60 70 62 50 Q63 40 66 28" stroke="#7a4a26" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M64 84 Q60 70 62 50 Q63 40 66 28" stroke="#9a6a3a" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* palm leaves */}
      <ellipse cx="50" cy="26" rx="14" ry="5" fill="#4a8c2a" transform="rotate(-22 50 26)" />
      <ellipse cx="82" cy="26" rx="14" ry="5" fill="#4a8c2a" transform="rotate(22 82 26)" />
      <ellipse cx="46" cy="36" rx="14" ry="5" fill="#5aa838" transform="rotate(-46 46 36)" />
      <ellipse cx="86" cy="36" rx="14" ry="5" fill="#5aa838" transform="rotate(46 86 36)" />
      <ellipse cx="66" cy="18" rx="13" ry="4" fill="#6cc44a" />
      {/* coconuts */}
      <circle cx="62" cy="32" r="2.4" fill="#5a3a22" />
      <circle cx="69" cy="33" r="2.4" fill="#5a3a22" />
      {/* subject icon as a small "sign" planted in sand */}
      {icon && (
        <g>
          <rect x="48" y="92" width="34" height="22" rx="4" fill="#fdfaf2" stroke="#7a4a26" strokeWidth="1.6" />
          <text x="65" y="109" textAnchor="middle" fontSize="16">{icon}</text>
        </g>
      )}
      {/* victory flag */}
      {conquered && (
        <g>
          <line x1="66" y1="28" x2="66" y2="2" stroke="#7a4a26" strokeWidth="1.8" />
          <path d="M66 4 L84 9 L66 14 Z" fill="#e84a3a" />
        </g>
      )}
    </svg>
  );
}

// ---------- Styles ----------

const oceanGradient = "linear-gradient(180deg, #9bd1e8 0%, #b8def0 22%, #4ea0c8 60%, #2d7aa8 100%)";

const s = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background: oceanGradient,
    paddingBottom: 130,
  },
  content: { position: "relative", zIndex: 2, maxWidth: 880, margin: "0 auto", padding: "24px 18px 0" },
  back: {
    color: "#1f3a4a", textDecoration: "none", fontSize: 14,
    background: "rgba(255, 255, 255, 0.7)",
    padding: "6px 12px", borderRadius: 999, fontWeight: 600,
    display: "inline-block", marginBottom: 12,
  },
  title: {
    fontSize: 38,
    margin: "8px 0 4px",
    color: "#fdfaf2",
    fontFamily: "Georgia, serif",
    fontWeight: 700,
    textShadow: "0 2px 8px rgba(0, 60, 100, 0.4)",
    textAlign: "center",
  },
  sub: {
    color: "#fdfaf2",
    margin: "0 0 22px",
    textAlign: "center",
    textShadow: "0 1px 4px rgba(0, 60, 100, 0.3)",
    fontSize: 16,
  },
  panel: {
    background: "#fdfaf2",
    border: "3px solid #c8884a",
    borderRadius: 20,
    padding: 22,
    boxShadow: "0 10px 30px rgba(0, 60, 100, 0.25), inset 0 0 0 1px rgba(255,255,255,0.6)",
    animation: "pop-in 0.35s ease-out",
  },
  panelHeader: {
    fontSize: 20, fontWeight: 700, color: "#5a3a26",
    fontFamily: "Georgia, serif",
    margin: "0 0 14px",
  },
  niveauList: { display: "grid", gap: 12, marginTop: 6 },
  niveauBtn: {
    background: "#fff5dc",
    border: "2.5px solid #c8884a",
    borderRadius: 14,
    padding: "14px 16px",
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 14,
    transition: "transform 0.08s",
  },
  niveauIcon: { fontSize: 36, lineHeight: 1 },
  niveauName: { fontWeight: 700, fontSize: 17, color: "#5a3a26", fontFamily: "Georgia, serif" },
  niveauDesc: { color: "#7a5a3a", fontSize: 14, marginTop: 2 },
  islandGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 18,
    marginTop: 8,
    marginBottom: 18,
  },
  islandBtn: (delay) => ({
    background: "transparent",
    border: "none",
    padding: 6,
    cursor: "pointer",
    display: "block",
    width: "100%",
    animation: `bob 4s ease-in-out ${delay}s infinite`,
  }),
  islandLabel: (tint, conquered) => ({
    marginTop: 4,
    background: conquered ? "#fde6a8" : "#fdfaf2",
    border: `2.5px solid ${conquered ? "#d49a3a" : tint}`,
    borderRadius: 999,
    padding: "6px 12px",
    fontSize: 15,
    fontWeight: 700,
    color: conquered ? "#7a5022" : "#1f3a4a",
    fontFamily: "Georgia, serif",
    textAlign: "center",
    boxShadow: "0 3px 8px rgba(0, 60, 100, 0.18)",
  }),
  question: {
    fontSize: 22, color: "#1f3a4a", margin: "0 0 18px",
    lineHeight: 1.4, fontFamily: "Georgia, serif",
  },
  optionList: { display: "grid", gap: 10 },
  option: (state) => ({
    background:
      state === "correct" ? "#cdebc2" :
      state === "wrong"   ? "#f7c9c4" :
      state === "reveal"  ? "#cdebc2" :
      "#fff5dc",
    border: `2.5px solid ${
      state === "correct" ? "#3aa050" :
      state === "wrong"   ? "#c84a3a" :
      state === "reveal"  ? "#3aa050" :
      "#c8884a"
    }`,
    borderRadius: 14,
    padding: "13px 16px",
    fontSize: 16,
    textAlign: "left",
    color: "#3a2618",
    fontWeight: 600,
    cursor: state ? "default" : "pointer",
    transition: "transform 0.08s",
  }),
  primary: {
    background: "#e8884a",
    color: "white",
    border: "2px solid #b86a30",
    borderRadius: 14,
    padding: "12px 22px",
    fontSize: 16,
    fontWeight: 800,
    cursor: "pointer",
    marginTop: 18,
    boxShadow: "0 4px 0 #b86a30",
    fontFamily: "Georgia, serif",
  },
  secondary: {
    background: "#fff5dc",
    color: "#5a3a26",
    border: "2px solid #c8884a",
    borderRadius: 14,
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "Georgia, serif",
  },
  row: { display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" },
  hint: { color: "#7a5a3a", fontSize: 13, marginTop: 12, fontStyle: "italic" },
  loadingPanel: {
    textAlign: "center",
    padding: "32px 20px",
    color: "#5a3a26",
    fontSize: 16,
    fontFamily: "Georgia, serif",
  },
  bigEmoji: { fontSize: 44, display: "block", marginBottom: 10, animation: "bob 2s ease-in-out infinite" },
  victoryTitle: {
    fontSize: 32, fontFamily: "Georgia, serif", color: "#5a3a26",
    margin: "0 0 8px", textAlign: "center",
  },
  scoreLine: { color: "#5a3a26", textAlign: "center", margin: "0 0 16px", fontSize: 16 },
  progressBadge: {
    display: "inline-block",
    background: "rgba(255, 255, 255, 0.85)",
    color: "#1f3a4a",
    fontWeight: 700,
    fontSize: 13,
    padding: "4px 12px",
    borderRadius: 999,
    marginBottom: 12,
  },
  footer: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    color: "#fdfaf2",
    textShadow: "0 1px 4px rgba(0, 60, 100, 0.4)",
    fontSize: 13,
    padding: "16px 12px 8px",
    fontStyle: "italic",
  },
};

// ---------- Component ----------

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
    let nextConquered = conquered;
    if (won) {
      nextConquered = new Set(conquered);
      nextConquered.add(activeIsland);
      setConquered(nextConquered);
    }
    setActiveIsland(null);
    setQuestions([]);
    if (nextConquered.size === ISLANDS.length) {
      setPhase("victory");
    } else {
      setPhase("map");
    }
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

  // ---------- Render frame ----------
  const Frame = ({ children, hideSun }) => (
    <div style={s.page}>
      {!hideSun && <Sun />}
      <Waves />
      <div style={s.content}>{children}</div>
      <div style={s.footer}>🌿 Willow Games • © 2026</div>
    </div>
  );

  // ---------- Phases ----------
  if (phase === "niveau") {
    return (
      <Frame>
        <Link to="/" style={s.back}>← Land van Leren</Link>
        <h1 style={s.title}>🏝️ Eilandenavontuur</h1>
        <p style={s.sub}>Verover alle vijf de eilanden door vragen goed te beantwoorden.</p>
        <div style={s.panel}>
          <div style={s.panelHeader}>Kies je niveau</div>
          <div style={s.niveauList}>
            {NIVEAUS.map((n) => (
              <button key={n.slug} style={s.niveauBtn} onClick={() => pickNiveau(n.slug)}>
                <span style={s.niveauIcon}>{n.icon}</span>
                <span>
                  <div style={s.niveauName}>{n.name}</div>
                  <div style={s.niveauDesc}>{n.desc}</div>
                </span>
              </button>
            ))}
          </div>
        </div>
      </Frame>
    );
  }

  if (phase === "map") {
    const remaining = ISLANDS.length - conquered.size;
    return (
      <Frame>
        <Link to="/" style={s.back}>← Land van Leren</Link>
        <h1 style={s.title}>De vijf eilanden</h1>
        <p style={s.sub}>
          {remaining === ISLANDS.length
            ? "Klik op een eiland om je avontuur te beginnen."
            : `Nog ${remaining} eiland${remaining === 1 ? "" : "en"} te veroveren.`}
        </p>
        <div style={s.islandGrid}>
          {ISLANDS.map((island, i) => {
            const isConquered = conquered.has(island.slug);
            return (
              <button
                key={island.slug}
                style={s.islandBtn((i % 5) * 0.4)}
                onClick={() => startIsland(island.slug)}
                aria-label={`${island.name}${isConquered ? " (veroverd)" : ""}`}
              >
                <Island conquered={isConquered} icon={island.icon} />
                <div style={s.islandLabel(island.tint, isConquered)}>{island.name}</div>
              </button>
            );
          })}
        </div>
        <div style={s.row}>
          <button style={s.secondary} onClick={resetAll}>Ander niveau kiezen</button>
        </div>
      </Frame>
    );
  }

  if (phase === "loading") {
    return (
      <Frame>
        <div style={s.panel}>
          <div style={s.loadingPanel}>
            <span style={s.bigEmoji}>⛵</span>
            Vragen laden, op weg naar het eiland…
          </div>
        </div>
      </Frame>
    );
  }

  if (phase === "play" && currentQuestion) {
    const island = ISLANDS.find((i) => i.slug === activeIsland);
    const correctAnswer = currentQuestion.a;
    return (
      <Frame>
        <span style={s.progressBadge}>
          {island.icon} {island.name} • Vraag {qIndex + 1} van {questions.length}
        </span>
        <div style={s.panel}>
          <p style={s.question}>{currentQuestion.q}</p>
          <div style={s.optionList}>
            {shuffledOptions.map((opt, idx) => {
              let state = null;
              if (pickedIndex !== null) {
                if (opt === correctAnswer) state = idx === pickedIndex ? "correct" : "reveal";
                else if (idx === pickedIndex) state = "wrong";
              }
              return (
                <button
                  key={idx}
                  style={s.option(state)}
                  onClick={() => pickAnswer(idx)}
                  disabled={pickedIndex !== null}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {pickedIndex !== null && (
            <button style={s.primary} onClick={nextQuestion}>
              {qIndex + 1 >= questions.length ? "Resultaat bekijken" : "Volgende vraag →"}
            </button>
          )}
          {source === "fallback" && (
            <p style={s.hint}>Offline-vragen gebruikt (geen verbinding met vragen-server).</p>
          )}
        </div>
      </Frame>
    );
  }

  if (phase === "result") {
    const island = ISLANDS.find((i) => i.slug === activeIsland);
    const won = correctCount >= WIN_THRESHOLD;
    return (
      <Frame>
        <div style={s.panel}>
          <div style={{ textAlign: "center" }}>
            <span style={s.bigEmoji}>{won ? "🚩" : "💪"}</span>
          </div>
          <h2 style={s.victoryTitle}>
            {won ? `${island.name} veroverd!` : "Bijna gelukt!"}
          </h2>
          <p style={s.scoreLine}>
            Je had {correctCount} van de {questions.length} vragen goed.
            {won ? "" : ` Je hebt er minimaal ${WIN_THRESHOLD} nodig.`}
          </p>
          <div style={{ ...s.row, justifyContent: "center" }}>
            <button style={s.primary} onClick={() => finishIsland(won)}>
              {won ? "Door naar de kaart" : "Terug naar de kaart"}
            </button>
            {!won && (
              <button style={s.secondary} onClick={() => startIsland(activeIsland)}>
                Probeer opnieuw
              </button>
            )}
          </div>
        </div>
      </Frame>
    );
  }

  if (phase === "victory") {
    return (
      <Frame>
        <div style={s.panel}>
          <div style={{ textAlign: "center" }}>
            <span style={s.bigEmoji}>🏆</span>
          </div>
          <h2 style={s.victoryTitle}>Alle eilanden veroverd!</h2>
          <p style={s.scoreLine}>
            Je hebt het hele Eilandenavontuur uitgespeeld. Wat een avonturier!
          </p>
          <div style={{ ...s.row, justifyContent: "center" }}>
            <button style={s.primary} onClick={resetAll}>Opnieuw spelen</button>
            <Link
              to="/"
              style={{ ...s.secondary, textDecoration: "none", display: "inline-block" }}
            >
              Land van Leren
            </Link>
          </div>
        </div>
      </Frame>
    );
  }

  return null;
}
