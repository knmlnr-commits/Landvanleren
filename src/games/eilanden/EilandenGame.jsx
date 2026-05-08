import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchQuestions } from "../../lib/questions.js";
import Footer from "../../shared/Footer.jsx";

const ISLANDS = [
  { slug: "rekenland",  name: "Rekenland",  icon: "🔢", tint: "#3b82f6" },
  { slug: "toppieland", name: "Toppieland", icon: "🗺️", tint: "#10b981" },
  { slug: "engeland",   name: "Engeland",   icon: "🇬🇧", tint: "#ef4444" },
  { slug: "spelling",   name: "Spelling",   icon: "✏️", tint: "#8b5cf6" },
  { slug: "historica",  name: "Historica",  icon: "📜", tint: "#f59e0b" },
];

const NIVEAUS = [
  { slug: "groep56",    name: "Groep 5 en 6", desc: "Basisschool middenbouw", icon: "🌱" },
  { slug: "groep78",    name: "Groep 7 en 8", desc: "Basisschool bovenbouw",  icon: "🌿" },
  { slug: "middelbaar", name: "Middelbaar",   desc: "Brugklas en hoger",       icon: "🌳" },
];

const PLAYER_PROFILES = [
  { color: "#e8504a", icon: "🦜" },
  { color: "#3686d8", icon: "🦈" },
  { color: "#3aa050", icon: "🐢" },
  { color: "#d68a3a", icon: "🦀" },
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
      width="92"
      height="92"
      style={{
        position: "absolute", top: 12, right: 12, zIndex: 1,
        animation: "sun-pulse 4s ease-in-out infinite",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <line key={deg} x1="60" y1="20" x2="60" y2="6"
          stroke="#ffd766" strokeWidth="4" strokeLinecap="round"
          transform={`rotate(${deg} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="28" fill="#ffd766" />
      <circle cx="60" cy="60" r="22" fill="#ffe898" />
    </svg>
  );
}

function Waves() {
  const wave = (y, opacity) => (
    <path
      d={`M0 ${y} Q150 ${y - 14} 300 ${y} T600 ${y} T900 ${y} T1200 ${y} T1500 ${y} T1800 ${y} T2100 ${y} T2400 ${y} V200 H0 Z`}
      fill="#ffffff" opacity={opacity}
    />
  );
  return (
    <div
      style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 110, overflow: "hidden", pointerEvents: "none", zIndex: 1,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 2400 200" preserveAspectRatio="none"
        style={{ width: "200%", height: "100%", animation: "wave-slide 18s linear infinite" }}>
        {wave(60, 0.20)}
      </svg>
      <svg viewBox="0 0 2400 200" preserveAspectRatio="none"
        style={{ width: "200%", height: "100%", position: "absolute", inset: 0,
                 animation: "wave-slide 26s linear infinite reverse" }}>
        {wave(80, 0.30)}
      </svg>
    </div>
  );
}

function Island({ size = 130, conqueredBy, flagColor, flagIcon, icon }) {
  return (
    <svg
      viewBox="0 0 130 140"
      width={size}
      height={size * 140 / 130}
      style={{ display: "block", margin: "0 auto" }}
      aria-hidden="true"
    >
      <ellipse cx="65" cy="125" rx="48" ry="6" fill="rgba(0, 0, 0, 0.18)" />
      <ellipse cx="65" cy="108" rx="50" ry="20" fill="#e8c878" />
      <path d="M18 108 Q22 96 38 92 Q55 84 65 84 Q78 84 92 92 Q108 96 112 108 Z" fill="#f5d99a" />
      <path d="M22 116 Q30 113 38 116 T54 116" stroke="#f0e2bc" strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M76 118 Q86 115 96 118 T112 118" stroke="#f0e2bc" strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M64 84 Q60 70 62 50 Q63 40 66 28" stroke="#7a4a26" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M64 84 Q60 70 62 50 Q63 40 66 28" stroke="#9a6a3a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="26" rx="14" ry="5" fill="#4a8c2a" transform="rotate(-22 50 26)" />
      <ellipse cx="82" cy="26" rx="14" ry="5" fill="#4a8c2a" transform="rotate(22 82 26)" />
      <ellipse cx="46" cy="36" rx="14" ry="5" fill="#5aa838" transform="rotate(-46 46 36)" />
      <ellipse cx="86" cy="36" rx="14" ry="5" fill="#5aa838" transform="rotate(46 86 36)" />
      <ellipse cx="66" cy="18" rx="13" ry="4" fill="#6cc44a" />
      <circle cx="62" cy="32" r="2.4" fill="#5a3a22" />
      <circle cx="69" cy="33" r="2.4" fill="#5a3a22" />
      {icon && (
        <g>
          <rect x="48" y="92" width="34" height="22" rx="4" fill="#fdfaf2" stroke="#7a4a26" strokeWidth="1.6" />
          <text x="65" y="109" textAnchor="middle" fontSize="16">{icon}</text>
        </g>
      )}
      {conqueredBy !== null && conqueredBy !== undefined && (
        <g style={{ transformOrigin: "66px 28px", animation: "flag-raise 0.5s ease-out" }}>
          <line x1="66" y1="28" x2="66" y2="2" stroke="#7a4a26" strokeWidth="1.8" />
          <path d="M66 4 L86 9 L66 14 Z" fill={flagColor || "#e84a3a"} stroke="#7a4a26" strokeWidth="0.6" />
        </g>
      )}
    </svg>
  );
}

function Confetti() {
  const pieces = ["🎉", "✨", "🌟", "🎊", "💫", "🌴"];
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
      borderRadius: "inherit", zIndex: 0,
    }} aria-hidden="true">
      {Array.from({ length: 16 }).map((_, i) => {
        const left = (i * 7.3) % 100;
        const delay = (i * 0.13) % 1.5;
        return (
          <span
            key={i}
            style={{
              position: "absolute", left: `${left}%`, top: 0, fontSize: 22,
              animation: `confetti-fall 2.6s ease-in ${delay}s forwards`,
            }}
          >{pieces[i % pieces.length]}</span>
        );
      })}
    </div>
  );
}

// ---------- Styles ----------

const oceanGradient = "linear-gradient(180deg, #9bd1e8 0%, #b8def0 22%, #4ea0c8 60%, #2d7aa8 100%)";

const s = {
  page: {
    minHeight: "100vh", position: "relative", overflow: "hidden",
    background: oceanGradient, paddingBottom: 130,
  },
  content: {
    position: "relative", zIndex: 2, maxWidth: 880, margin: "0 auto",
    padding: "20px 18px 0",
  },
  back: {
    color: "#1f3a4a", textDecoration: "none", fontSize: 14,
    background: "rgba(255, 255, 255, 0.78)",
    padding: "6px 12px", borderRadius: 999, fontWeight: 600,
    display: "inline-block", marginBottom: 12, border: "none", cursor: "pointer",
  },
  title: {
    fontSize: 34, margin: "8px 0 4px",
    color: "#fdfaf2", fontFamily: "Georgia, serif", fontWeight: 700,
    textShadow: "0 2px 8px rgba(0, 60, 100, 0.4)", textAlign: "center",
  },
  sub: {
    color: "#fdfaf2", margin: "0 0 16px", textAlign: "center",
    textShadow: "0 1px 4px rgba(0, 60, 100, 0.3)", fontSize: 15,
  },
  panel: {
    background: "#fdfaf2", border: "3px solid #c8884a", borderRadius: 20,
    padding: 22,
    boxShadow: "0 10px 30px rgba(0, 60, 100, 0.25), inset 0 0 0 1px rgba(255,255,255,0.6)",
    animation: "pop-in 0.35s ease-out", position: "relative", overflow: "hidden",
  },
  panelHeader: {
    fontSize: 20, fontWeight: 700, color: "#5a3a26",
    fontFamily: "Georgia, serif", margin: "0 0 14px",
  },
  niveauList: { display: "grid", gap: 12, marginTop: 6 },
  niveauBtn: {
    background: "#fff5dc", border: "2.5px solid #c8884a", borderRadius: 14,
    padding: "14px 16px", textAlign: "left", cursor: "pointer",
    display: "flex", alignItems: "center", gap: 14,
  },
  niveauIcon: { fontSize: 32, lineHeight: 1 },
  niveauName: { fontWeight: 700, fontSize: 17, color: "#5a3a26", fontFamily: "Georgia, serif" },
  niveauDesc: { color: "#7a5a3a", fontSize: 14, marginTop: 2 },

  // Player setup
  playerRow: {
    display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
    background: "#fff5dc", border: "2px solid #c8884a", borderRadius: 14,
    padding: "8px 10px",
  },
  playerAvatar: (color) => ({
    width: 40, height: 40, borderRadius: "50%", background: color,
    color: "white", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 22, flexShrink: 0,
    boxShadow: "0 2px 4px rgba(0,0,0,0.15), inset 0 -2px 4px rgba(0,0,0,0.15)",
  }),
  playerInput: {
    flex: 1, border: "none", background: "transparent", fontSize: 16,
    color: "#3a2618", fontFamily: "Georgia, serif", fontWeight: 600,
    outline: "none", minWidth: 0, padding: "4px 0",
  },
  removeBtn: {
    background: "transparent", border: "none", color: "#7a5a3a",
    fontSize: 24, cursor: "pointer", padding: "0 6px", lineHeight: 1,
  },
  addBtn: {
    background: "transparent", border: "2px dashed #c8884a", color: "#7a5a3a",
    borderRadius: 14, padding: "12px", width: "100%", fontSize: 14,
    fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif",
    marginBottom: 14,
  },

  // Map
  scoreboard: {
    display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10,
    justifyContent: "center",
  },
  scoreChip: (color, active) => ({
    display: "inline-flex", alignItems: "center", gap: 6,
    background: active ? color : "rgba(255, 255, 255, 0.85)",
    color: active ? "white" : color,
    border: `2px solid ${color}`,
    borderRadius: 999, padding: "5px 12px", fontSize: 13, fontWeight: 700,
    fontFamily: "Georgia, serif",
    transform: active ? "scale(1.05)" : "scale(1)",
    boxShadow: active ? "0 4px 10px rgba(0,0,0,0.2)" : "0 2px 4px rgba(0,0,0,0.1)",
    transition: "transform 0.15s, background 0.15s, color 0.15s",
  }),
  turnBanner: (color) => ({
    background: "rgba(255,255,255,0.92)",
    border: `3px solid ${color}`,
    color: "#1f3a4a", borderRadius: 16, padding: "10px 16px",
    textAlign: "center", fontSize: 17, fontFamily: "Georgia, serif",
    fontWeight: 600, marginBottom: 14,
    boxShadow: "0 4px 12px rgba(0, 60, 100, 0.18)",
  }),
  islandGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 14, marginTop: 4, marginBottom: 18,
  },
  islandBtn: (delay, conquered) => ({
    background: "transparent", border: "none", padding: 6,
    cursor: conquered ? "default" : "pointer",
    display: "block", width: "100%",
    animation: `bob 4s ease-in-out ${delay}s infinite`,
  }),
  islandLabel: (tint, conquered, ownerColor) => ({
    marginTop: 4,
    background: conquered ? "#fff5dc" : "#fdfaf2",
    border: `2.5px solid ${conquered ? ownerColor : tint}`,
    borderRadius: 14, padding: "6px 10px", fontSize: 14,
    fontWeight: 700, color: "#1f3a4a",
    fontFamily: "Georgia, serif", textAlign: "center",
    boxShadow: "0 3px 8px rgba(0, 60, 100, 0.18)",
  }),
  ownerLine: (color) => ({
    fontSize: 11, color, fontWeight: 700, marginTop: 2,
  }),

  // Play
  question: {
    fontSize: 21, color: "#1f3a4a", margin: "0 0 18px",
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
    borderRadius: 14, padding: "13px 16px", fontSize: 16,
    textAlign: "left", color: "#3a2618", fontWeight: 600,
    cursor: state ? "default" : "pointer", width: "100%",
  }),
  primary: {
    background: "#e8884a", color: "white", border: "2px solid #b86a30",
    borderRadius: 14, padding: "12px 22px", fontSize: 16, fontWeight: 800,
    cursor: "pointer", marginTop: 16, boxShadow: "0 4px 0 #b86a30",
    fontFamily: "Georgia, serif",
  },
  secondary: {
    background: "#fff5dc", color: "#5a3a26", border: "2px solid #c8884a",
    borderRadius: 14, padding: "10px 18px", fontSize: 14, fontWeight: 700,
    cursor: "pointer", fontFamily: "Georgia, serif",
  },
  row: { display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" },
  hint: { color: "#7a5a3a", fontSize: 13, marginTop: 12, fontStyle: "italic" },
  loadingPanel: {
    textAlign: "center", padding: "32px 20px", color: "#5a3a26",
    fontSize: 16, fontFamily: "Georgia, serif",
  },
  bigEmoji: {
    fontSize: 48, display: "block", marginBottom: 10,
    animation: "bob 2s ease-in-out infinite", textAlign: "center",
  },
  victoryTitle: {
    fontSize: 28, fontFamily: "Georgia, serif", color: "#5a3a26",
    margin: "0 0 8px", textAlign: "center",
  },
  scoreLine: { color: "#5a3a26", textAlign: "center", margin: "0 0 12px", fontSize: 16 },
  progressBadge: {
    display: "inline-block", background: "rgba(255, 255, 255, 0.88)",
    color: "#1f3a4a", fontWeight: 700, fontSize: 13,
    padding: "4px 12px", borderRadius: 999, marginBottom: 12,
  },
  podium: { listStyle: "none", padding: 0, margin: "16px 0 0" },
  podiumRow: (color, isWinner) => ({
    display: "flex", alignItems: "center", gap: 12,
    background: isWinner ? "#fff0c8" : "#fdfaf2",
    border: `2.5px solid ${color}`,
    borderRadius: 14, padding: "10px 14px", marginBottom: 8,
    fontSize: 16, fontWeight: 700, color: "#3a2618",
    fontFamily: "Georgia, serif",
  }),
  footer: {
    position: "relative", zIndex: 2, textAlign: "center",
    color: "#fdfaf2", textShadow: "0 1px 4px rgba(0, 60, 100, 0.4)",
    fontSize: 13, padding: "16px 12px 8px", fontStyle: "italic",
  },
};

// Frame staat BUITEN de component zodat React hem niet bij elke render opnieuw
// definieert; anders unmount het input-veld bij elke toetsaanslag en verlies je focus.
function Frame({ children, hideSun }) {
  return (
    <div style={s.page}>
      {!hideSun && <Sun />}
      <Waves />
      <div style={s.content}>{children}</div>
      <Footer style={s.footer} />
    </div>
  );
}

// ---------- Component ----------

export default function EilandenGame() {
  const [phase, setPhase] = useState("niveau"); // niveau | players | map | loading | play | result | victory
  const [niveau, setNiveau] = useState(null);
  const [nameInputs, setNameInputs] = useState([""]);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [conquered, setConquered] = useState({}); // slug -> { playerIndex, score }
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

  const conqueredCount = Object.keys(conquered).length;
  const playerScore = (idx) =>
    Object.values(conquered).filter((c) => c.playerIndex === idx).length;

  function pickNiveau(slug) {
    setNiveau(slug);
    setPhase("players");
  }

  function updateName(i, val) {
    const next = [...nameInputs];
    next[i] = val.slice(0, 16);
    setNameInputs(next);
  }
  function addNameSlot() {
    if (nameInputs.length >= 4) return;
    setNameInputs([...nameInputs, ""]);
  }
  function removeNameSlot(i) {
    if (nameInputs.length <= 1) return;
    setNameInputs(nameInputs.filter((_, idx) => idx !== i));
  }
  function startGame() {
    const trimmed = nameInputs.map((n) => n.trim()).filter((n) => n.length > 0);
    if (trimmed.length === 0) return;
    const built = trimmed.map((name, i) => ({
      name,
      color: PLAYER_PROFILES[i].color,
      icon: PLAYER_PROFILES[i].icon,
    }));
    setPlayers(built);
    setCurrentPlayer(0);
    setConquered({});
    setPhase("map");
  }

  async function startIsland(slug) {
    if (conquered[slug]) return;
    setActiveIsland(slug);
    setPhase("loading");
    setQIndex(0);
    setPickedIndex(null);
    setCorrectCount(0);
    const result = await fetchQuestions({
      niveau, eiland: slug, aantal: QUESTIONS_PER_ISLAND,
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

  function continueAfterResult() {
    const won = correctCount >= WIN_THRESHOLD;
    let nextConquered = conquered;
    if (won) {
      nextConquered = {
        ...conquered,
        [activeIsland]: { playerIndex: currentPlayer, score: correctCount },
      };
      setConquered(nextConquered);
    }
    const allDone = Object.keys(nextConquered).length === ISLANDS.length;
    setActiveIsland(null);
    setQuestions([]);
    if (allDone) {
      setPhase("victory");
    } else {
      setCurrentPlayer((currentPlayer + 1) % players.length);
      setPhase("map");
    }
  }

  function replayWithSamePlayers() {
    setConquered({});
    setCurrentPlayer(0);
    setActiveIsland(null);
    setQuestions([]);
    setPhase("map");
  }

  function resetAll() {
    setNiveau(null);
    setNameInputs([""]);
    setPlayers([]);
    setConquered({});
    setCurrentPlayer(0);
    setActiveIsland(null);
    setQuestions([]);
    setPhase("niveau");
  }

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

  if (phase === "players") {
    const validCount = nameInputs.filter((n) => n.trim().length > 0).length;
    return (
      <Frame>
        <button style={s.back} onClick={() => setPhase("niveau")}>← Ander niveau</button>
        <h1 style={s.title}>Wie spelen er mee?</h1>
        <p style={s.sub}>Eén tot vier ontdekkingsreizigers. Geef ieder een naam.</p>
        <div style={s.panel}>
          {nameInputs.map((name, i) => {
            const profile = PLAYER_PROFILES[i];
            return (
              <div key={i} style={s.playerRow}>
                <div style={s.playerAvatar(profile.color)}>{profile.icon}</div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => updateName(i, e.target.value)}
                  placeholder={`Naam van speler ${i + 1}`}
                  maxLength={16}
                  autoComplete="off"
                  style={s.playerInput}
                />
                {nameInputs.length > 1 && (
                  <button
                    style={s.removeBtn}
                    onClick={() => removeNameSlot(i)}
                    aria-label={`Speler ${i + 1} verwijderen`}
                    type="button"
                  >×</button>
                )}
              </div>
            );
          })}
          {nameInputs.length < 4 && (
            <button style={s.addBtn} onClick={addNameSlot} type="button">
              + Speler toevoegen
            </button>
          )}
          <button
            style={{
              ...s.primary,
              opacity: validCount > 0 ? 1 : 0.5,
              cursor: validCount > 0 ? "pointer" : "not-allowed",
              width: "100%",
              marginTop: 4,
            }}
            onClick={startGame}
            disabled={validCount === 0}
            type="button"
          >
            Start avontuur ⛵
          </button>
        </div>
      </Frame>
    );
  }

  if (phase === "map") {
    const player = players[currentPlayer];
    const remaining = ISLANDS.length - conqueredCount;
    return (
      <Frame>
        <Link to="/" style={s.back}>← Land van Leren</Link>

        <div style={s.scoreboard}>
          {players.map((p, i) => (
            <div key={i} style={s.scoreChip(p.color, i === currentPlayer)}>
              <span style={{ fontSize: 16 }}>{p.icon}</span>
              <span>{p.name}</span>
              <span style={{ marginLeft: 4 }}>🏴 {playerScore(i)}</span>
            </div>
          ))}
        </div>

        {players.length > 1 ? (
          <div style={s.turnBanner(player.color)}>
            Aan de beurt: <strong style={{ color: player.color }}>{player.icon} {player.name}</strong>
          </div>
        ) : (
          <h1 style={s.title}>De vijf eilanden</h1>
        )}

        <p style={s.sub}>
          {remaining === ISLANDS.length
            ? "Kies een eiland om te beginnen."
            : remaining === 1
            ? "Nog één eiland te veroveren."
            : `Nog ${remaining} eilanden te veroveren.`}
        </p>

        <div style={s.islandGrid}>
          {ISLANDS.map((island, i) => {
            const owner = conquered[island.slug];
            const ownerColor = owner ? players[owner.playerIndex].color : null;
            return (
              <button
                key={island.slug}
                style={s.islandBtn((i % 5) * 0.4, !!owner)}
                onClick={() => !owner && startIsland(island.slug)}
                disabled={!!owner}
                aria-label={`${island.name}${owner ? ` (van ${players[owner.playerIndex].name})` : ""}`}
                type="button"
              >
                <Island
                  conqueredBy={owner ? owner.playerIndex : null}
                  flagColor={ownerColor}
                  icon={island.icon}
                />
                <div style={s.islandLabel(island.tint, !!owner, ownerColor)}>
                  {island.name}
                  {owner && (
                    <div style={s.ownerLine(ownerColor)}>
                      {players[owner.playerIndex].icon} {players[owner.playerIndex].name}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div style={s.row}>
          <button style={s.secondary} onClick={resetAll} type="button">
            Nieuw spel beginnen
          </button>
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
    const player = players[currentPlayer];
    const correctAnswer = currentQuestion.a;
    return (
      <Frame>
        <span style={s.progressBadge}>
          {island.icon} {island.name} • Vraag {qIndex + 1} van {questions.length}
        </span>
        {players.length > 1 && (
          <div style={{ ...s.turnBanner(player.color), padding: "6px 14px", fontSize: 14, marginBottom: 10 }}>
            <strong style={{ color: player.color }}>{player.icon} {player.name}</strong> aan zet
          </div>
        )}
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
                  type="button"
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {pickedIndex !== null && (
            <button style={s.primary} onClick={nextQuestion} type="button">
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
    const player = players[currentPlayer];
    const won = correctCount >= WIN_THRESHOLD;
    const willBeAllConquered = won && Object.keys(conquered).length + 1 === ISLANDS.length;
    const continueText = willBeAllConquered
      ? "Eindstand bekijken →"
      : players.length > 1
      ? "Volgende speler →"
      : "Door naar de kaart";
    return (
      <Frame>
        <div style={s.panel}>
          {won && <Confetti />}
          <div style={{ position: "relative", zIndex: 1 }}>
            <span style={{ ...s.bigEmoji, color: player.color }}>{won ? "🏴" : "💪"}</span>
            <h2 style={s.victoryTitle}>
              {won
                ? `${player.name} verovert ${island.name}!`
                : `Bijna ${player.name}!`}
            </h2>
            <p style={s.scoreLine}>
              {correctCount} van de {questions.length} vragen goed.
              {!won && players.length > 1 && " Een ander mag dit eiland proberen."}
              {!won && players.length === 1 && ` Je hebt minimaal ${WIN_THRESHOLD} nodig.`}
            </p>
            <div style={{ ...s.row, justifyContent: "center" }}>
              <button style={s.primary} onClick={continueAfterResult} type="button">
                {continueText}
              </button>
              {!won && players.length === 1 && (
                <button style={s.secondary} onClick={() => startIsland(activeIsland)} type="button">
                  Probeer opnieuw
                </button>
              )}
            </div>
          </div>
        </div>
      </Frame>
    );
  }

  if (phase === "victory") {
    const ranked = players
      .map((p, i) => ({ ...p, count: playerScore(i), index: i }))
      .sort((a, b) => b.count - a.count);
    const top = ranked[0].count;
    const winners = ranked.filter((r) => r.count === top);
    const headline =
      players.length === 1
        ? `Wat een avontuur, ${players[0].name}!`
        : winners.length === 1
        ? `${winners[0].icon} ${winners[0].name} wint!`
        : `Gelijkspel: ${winners.map((w) => w.name).join(" & ")}`;
    return (
      <Frame>
        <div style={s.panel}>
          <Confetti />
          <div style={{ position: "relative", zIndex: 1 }}>
            <span style={s.bigEmoji}>🏆</span>
            <h2 style={s.victoryTitle}>{headline}</h2>
            <p style={s.scoreLine}>Alle eilanden zijn veroverd. Eindstand:</p>
            <ol style={s.podium}>
              {ranked.map((p, i) => {
                const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
                const isWinner = p.count === top;
                return (
                  <li key={p.index} style={s.podiumRow(p.color, isWinner)}>
                    <span style={{ fontSize: 22 }}>{medal}</span>
                    <span style={{ flex: 1 }}>{p.icon} {p.name}</span>
                    <strong>{p.count} 🏴</strong>
                  </li>
                );
              })}
            </ol>
            <div style={{ ...s.row, justifyContent: "center" }}>
              <button style={s.primary} onClick={replayWithSamePlayers} type="button">
                Opnieuw spelen
              </button>
              <button style={s.secondary} onClick={resetAll} type="button">
                Nieuwe spelers
              </button>
            </div>
          </div>
        </div>
      </Frame>
    );
  }

  return null;
}
