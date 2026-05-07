import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  NIVEAUS,
  PROGRESS_KEY,
  DEFAULT_PROGRESS,
  getNiveau,
  vakkenVoorNiveau,
} from "./config.js";
import Bos from "./Bos.jsx";
import Pad from "./Pad.jsx";
import BossFight from "./BossFight.jsx";
import { BearSvg } from "./Personages.jsx";

// Een niveau is speelbaar als de speler het al ontgrendeld heeft. Niveau 1
// staat altijd open; hogere niveaus ontgrendelen na het verslaan van een boss.
function isSpeelbaar(niveauId, progress) {
  return niveauId <= (progress?.hoogsteNiveau ?? 1);
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {}
}

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(180deg, #c5e0a8 0%, #8ab87a 28%, #5a8a4a 70%, #3a6a3a 100%)",
    paddingBottom: 40,
  },
  treeLeft: {
    position: "absolute",
    left: -10, bottom: 0,
    fontSize: 110, opacity: 0.65,
    zIndex: 0, pointerEvents: "none",
  },
  treeRight: {
    position: "absolute",
    right: -8, bottom: 20,
    fontSize: 110, opacity: 0.65,
    zIndex: 0, pointerEvents: "none",
  },
  treeMidLeft: {
    position: "absolute",
    left: 24, top: 90,
    fontSize: 70, opacity: 0.45,
    zIndex: 0, pointerEvents: "none",
  },
  treeMidRight: {
    position: "absolute",
    right: 18, top: 70,
    fontSize: 80, opacity: 0.50,
    zIndex: 0, pointerEvents: "none",
  },
  butterfly1: {
    position: "absolute", left: "12%", top: 220,
    fontSize: 26, opacity: 0.85, zIndex: 0,
    animation: "bob 4s ease-in-out infinite",
    pointerEvents: "none",
  },
  butterfly2: {
    position: "absolute", right: "18%", top: 320,
    fontSize: 24, opacity: 0.8, zIndex: 0,
    animation: "bob 5s ease-in-out 1s infinite",
    pointerEvents: "none",
  },
  mushroom1: {
    position: "absolute", left: "8%", bottom: 60,
    fontSize: 28, opacity: 0.85, zIndex: 0,
    pointerEvents: "none",
  },
  mushroom2: {
    position: "absolute", right: "12%", bottom: 80,
    fontSize: 24, opacity: 0.85, zIndex: 0,
    pointerEvents: "none",
  },
  content: {
    position: "relative", zIndex: 2,
    maxWidth: 760, margin: "0 auto",
    padding: "20px 18px 0",
  },
  back: {
    color: "#1f3a2a", textDecoration: "none", fontSize: 14,
    background: "rgba(253, 250, 242, 0.92)",
    padding: "6px 12px", borderRadius: 999,
    fontWeight: 600, display: "inline-block", marginBottom: 12,
    fontFamily: "Georgia, serif", border: "none", cursor: "pointer",
  },
  title: {
    fontSize: 38, margin: "8px 0 4px",
    color: "#fdfaf2",
    fontFamily: "Georgia, serif", fontWeight: 700,
    fontStyle: "italic",
    textShadow: "0 2px 8px rgba(0, 40, 10, 0.55)",
    textAlign: "center",
  },
  sub: {
    color: "#fdfaf2", margin: "0 0 18px",
    textAlign: "center",
    textShadow: "0 1px 4px rgba(0, 40, 10, 0.45)",
    fontSize: 15, fontStyle: "italic",
  },
  // Intro
  panel: {
    background: "#fdfaf2",
    border: "3px solid #5a8a4a",
    borderRadius: 22,
    padding: 22,
    boxShadow: "0 12px 28px rgba(20, 60, 30, 0.30), inset 0 0 0 1px rgba(255,255,255,0.6)",
    animation: "pop-in 0.35s ease-out",
  },
  panelTitle: {
    fontSize: 22, color: "#3a4a2a",
    fontFamily: "Georgia, serif",
    margin: "0 0 12px", fontStyle: "italic",
  },
  niveauList: { display: "grid", gap: 12 },
  niveauCard: (locked) => ({
    background: locked ? "#ece7d5" : "#fff5dc",
    border: `2.5px solid ${locked ? "#b0a890" : "#5a8a4a"}`,
    borderRadius: 16,
    padding: "14px 16px",
    cursor: locked ? "default" : "pointer",
    display: "flex", alignItems: "center", gap: 14,
    fontFamily: "Georgia, serif",
    opacity: locked ? 0.78 : 1,
    width: "100%", textAlign: "left",
  }),
  niveauBoss: { fontSize: 38, lineHeight: 1, flexShrink: 0 },
  niveauNaam: { fontWeight: 700, fontSize: 17, color: "#3a4a2a" },
  niveauDesc: { color: "#6a7a5a", fontSize: 13, marginTop: 2 },
  niveauChip: (locked) => ({
    fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
    padding: "3px 10px", borderRadius: 999,
    background: locked ? "#e8c878" : "#5aa850",
    color: "white",
    marginLeft: "auto", flexShrink: 0,
    textTransform: "uppercase",
  }),
  progressLine: {
    color: "#3a4a2a",
    background: "rgba(253, 250, 242, 0.85)",
    padding: "8px 12px",
    borderRadius: 12,
    fontSize: 13,
    marginTop: 12,
    border: "1px dashed #7a8a5a",
  },
  // Bos progress
  pathProgress: {
    background: "rgba(253, 250, 242, 0.92)",
    borderRadius: 16,
    padding: "10px 14px",
    marginBottom: 12,
    display: "flex", flexWrap: "wrap", gap: 8,
    alignItems: "center",
    fontFamily: "Georgia, serif", fontSize: 14,
    color: "#3a4a2a",
  },
  vakDot: (color, done) => ({
    display: "inline-flex", alignItems: "center", gap: 4,
    background: done ? color : "transparent",
    color: done ? "white" : color,
    border: `2px solid ${color}`,
    padding: "3px 10px",
    borderRadius: 999,
    fontWeight: 700, fontSize: 12,
  }),
  bossButton: {
    display: "block", width: "100%",
    background: "linear-gradient(180deg, #c84a3a 0%, #9a3a2a 100%)",
    color: "#fdfaf2",
    border: "3px solid #5a2010",
    borderRadius: 22,
    padding: "16px 18px",
    fontSize: 18, fontWeight: 800,
    fontFamily: "Georgia, serif",
    cursor: "pointer",
    marginTop: 14,
    boxShadow: "0 6px 0 #5a2010, 0 12px 30px rgba(0,0,0,0.3)",
    animation: "pop-in 0.5s ease-out",
  },
  // Won screen
  wonPanel: {
    background: "#fdfaf2",
    border: "3px solid #5aa850",
    borderRadius: 22,
    padding: 24, textAlign: "center",
    boxShadow: "0 12px 28px rgba(20, 60, 30, 0.30)",
    position: "relative", overflow: "hidden",
    animation: "pop-in 0.4s ease-out",
  },
  wonEmoji: {
    fontSize: 64, display: "block", marginBottom: 8,
    animation: "bob 1.6s ease-in-out infinite",
  },
  wonTitle: {
    fontSize: 26, fontFamily: "Georgia, serif",
    color: "#3a6a2a", margin: "0 0 8px",
    fontStyle: "italic",
  },
  wonScore: {
    color: "#3a4a2a", margin: "0 0 14px", fontSize: 15,
  },
  wonRow: { display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" },
  victoryStage: {
    position: "relative", height: 130, marginBottom: 10,
    overflow: "visible",
  },
  bigBear: {
    position: "absolute", left: "50%", bottom: 0,
    transform: "translateX(-50%)", zIndex: 3,
  },
  wolfFlee: {
    position: "absolute", left: "55%", top: 14,
    fontSize: 38, animation: "wolf-flee 2.4s ease-out forwards",
    pointerEvents: "none", zIndex: 4, whiteSpace: "nowrap",
  },
  wolfAu: {
    position: "absolute", left: "60%", top: 4,
    fontSize: 18, fontWeight: 800, color: "#c84a3a",
    fontFamily: "Georgia, serif", fontStyle: "italic",
    background: "rgba(255, 255, 255, 0.95)",
    padding: "2px 10px", borderRadius: 999,
    border: "2px solid #c84a3a",
    animation: "pop-bubble 1.4s ease-out forwards",
    pointerEvents: "none", zIndex: 5,
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    whiteSpace: "nowrap",
  },
  victoryStar: {
    position: "absolute", fontSize: 18,
    animation: "sparkle 1.4s ease-out infinite",
    pointerEvents: "none", zIndex: 2,
  },
  funnyLine: {
    color: "#5a3a26", fontStyle: "italic",
    fontFamily: "Georgia, serif",
    margin: "0 0 12px", fontSize: 15,
  },
  primary: {
    background: "#5a8a4a", color: "white",
    border: "2px solid #3a6a2a", borderRadius: 14,
    padding: "12px 22px", fontSize: 16, fontWeight: 800,
    cursor: "pointer", fontFamily: "Georgia, serif",
    boxShadow: "0 4px 0 #3a6a2a",
  },
  secondary: {
    background: "#fff5dc", color: "#5a3a26",
    border: "2px solid #7a5a3a", borderRadius: 14,
    padding: "10px 18px", fontSize: 14, fontWeight: 700,
    cursor: "pointer", fontFamily: "Georgia, serif",
    textDecoration: "none", display: "inline-block",
  },
  footer: {
    position: "relative", zIndex: 2,
    textAlign: "center", color: "#fdfaf2",
    textShadow: "0 1px 4px rgba(0, 40, 10, 0.5)",
    fontSize: 13, padding: "16px 12px 8px", fontStyle: "italic",
  },
};

const LEAVES = [
  { left: "8%",  delay: 0,   duration: 9,  leaf: "🍂", size: 22 },
  { left: "22%", delay: 2.5, duration: 7,  leaf: "🍃", size: 20 },
  { left: "38%", delay: 5,   duration: 8,  leaf: "🍂", size: 24 },
  { left: "55%", delay: 1.5, duration: 10, leaf: "🍃", size: 20 },
  { left: "72%", delay: 3.8, duration: 8,  leaf: "🍂", size: 22 },
  { left: "88%", delay: 6,   duration: 9,  leaf: "🍃", size: 20 },
  { left: "30%", delay: 7.5, duration: 11, leaf: "🍂", size: 18 },
  { left: "65%", delay: 4.2, duration: 9.5, leaf: "🍃", size: 22 },
];

function WonConfetti() {
  const pieces = ["🎉", "✨", "🌟", "🎊", "💫", "🏆", "🍂"];
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      overflow: "hidden", borderRadius: "inherit", zIndex: 0,
    }}>
      {Array.from({ length: 18 }).map((_, i) => {
        const left = (i * 5.7) % 100;
        const delay = (i * 0.12) % 1.8;
        return (
          <span key={i} style={{
            position: "absolute", left: `${left}%`, top: 0,
            fontSize: 22,
            animation: `confetti-fall 2.8s ease-in ${delay}s forwards`,
          }}>{pieces[i % pieces.length]}</span>
        );
      })}
    </div>
  );
}

function FallingLeaves() {
  return (
    <>
      {LEAVES.map((l, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: l.left,
            top: 0,
            fontSize: l.size,
            animation: `leaf-fall ${l.duration}s linear ${l.delay}s infinite`,
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0.85,
            willChange: "transform",
          }}
        >
          {l.leaf}
        </span>
      ))}
    </>
  );
}

function ForestBackdrop() {
  return (
    <>
      <span style={styles.treeLeft} aria-hidden="true">🌲</span>
      <span style={styles.treeRight} aria-hidden="true">🌳</span>
      <span style={styles.treeMidLeft} aria-hidden="true">🌳</span>
      <span style={styles.treeMidRight} aria-hidden="true">🌲</span>
      <span style={styles.butterfly1} aria-hidden="true">🦋</span>
      <span style={styles.butterfly2} aria-hidden="true">🦋</span>
      <span style={styles.mushroom1} aria-hidden="true">🍄</span>
      <span style={styles.mushroom2} aria-hidden="true">🍄</span>
      <FallingLeaves />
    </>
  );
}

export default function Berenbos() {
  const [phase, setPhase] = useState("intro"); // intro | bos | pad | boss | won
  const [niveauId, setNiveauId] = useState(1);
  const [progress, setProgress] = useState(() => loadProgress());
  const [conquered, setConquered] = useState(new Set()); // vak slugs voltooid in deze run
  const [activeVak, setActiveVak] = useState(null);
  const [sessionGoed, setSessionGoed] = useState(0);
  const [sessionFout, setSessionFout] = useState(0);

  const niveau = useMemo(() => getNiveau(niveauId), [niveauId]);
  const vakken = useMemo(() => vakkenVoorNiveau(niveauId), [niveauId]);
  const allePadenKlaar = vakken.length > 0 && conquered.size >= vakken.length;

  // Track totalen per sessie (gepersisteerd bij niveau-overwinning)
  function recordAnswer(correct) {
    if (correct) setSessionGoed((g) => g + 1);
    else setSessionFout((f) => f + 1);
  }

  function startNiveau(id) {
    if (!isSpeelbaar(id, progress)) return;
    setNiveauId(id);
    setConquered(new Set());
    setActiveVak(null);
    setSessionGoed(0);
    setSessionFout(0);
    setPhase("bos");
  }

  function handlePadComplete() {
    if (!activeVak) return;
    setConquered((prev) => {
      const next = new Set(prev);
      next.add(activeVak);
      return next;
    });
    setActiveVak(null);
    setPhase("bos");
  }

  function handleBossWin() {
    const nieuw = {
      ...progress,
      hoogsteNiveau: Math.max(progress.hoogsteNiveau, niveauId + 1),
      badges: progress.badges.includes(niveau.badge)
        ? progress.badges
        : [...progress.badges, niveau.badge],
      totaalGoed: progress.totaalGoed + sessionGoed,
      totaalFout: progress.totaalFout + sessionFout,
      laatstGespeeld: new Date().toISOString(),
    };
    setProgress(nieuw);
    saveProgress(nieuw);
    setPhase("won");
  }

  function backToIntro() {
    setPhase("intro");
    setActiveVak(null);
    setConquered(new Set());
  }

  // ---------- Render ----------

  if (phase === "intro") {
    return (
      <div style={styles.page}>
        <ForestBackdrop />
        <div style={styles.content}>
          <Link to="/" style={styles.back}>← Land van Leren</Link>
          <h1 style={styles.title}>🐻 Berenbos</h1>
          <p style={styles.sub}>
            Wandel met het beertje door het bos. Antwoord goed, en je komt vooruit.
          </p>
          <div style={styles.panel}>
            <div style={styles.panelTitle}>Kies je avontuur</div>
            <div style={styles.niveauList}>
              {NIVEAUS.map((n) => {
                const speelbaar = isSpeelbaar(n.id, progress);
                return (
                  <button
                    key={n.id}
                    style={styles.niveauCard(!speelbaar)}
                    onClick={() => startNiveau(n.id)}
                    disabled={!speelbaar}
                    type="button"
                    aria-label={`${n.naam}${speelbaar ? "" : " (binnenkort)"}`}
                  >
                    <span style={styles.niveauBoss}>{n.bossEmoji}</span>
                    <span style={{ flex: 1 }}>
                      <div style={styles.niveauNaam}>{n.naam}</div>
                      <div style={styles.niveauDesc}>{n.desc} • boss: {n.bossNaam}</div>
                    </span>
                    <span style={styles.niveauChip(!speelbaar)}>
                      {speelbaar ? "speel" : "binnenkort"}
                    </span>
                  </button>
                );
              })}
            </div>
            <div style={styles.progressLine}>
              {progress.badges.length > 0
                ? `🏅 ${progress.badges.length} badge${progress.badges.length === 1 ? "" : "s"} verdiend; ${progress.totaalGoed} vragen goed beantwoord.`
                : "Nog geen badges; tijd om er een te verdienen!"}
            </div>
          </div>
        </div>
        <div style={styles.footer}>🌿 Willow Games • © 2026</div>
      </div>
    );
  }

  if (phase === "bos") {
    return (
      <div style={styles.page}>
        <ForestBackdrop />
        <div style={styles.content}>
          <button style={styles.back} onClick={backToIntro} type="button">
            ← Ander niveau
          </button>
          <h1 style={styles.title}>{niveau.naam}</h1>
          <p style={styles.sub}>
            {allePadenKlaar
              ? `Alle paden volbracht; tijd om ${niveau.bossNaam.toLowerCase()} onder ogen te komen.`
              : `Voltooi alle paden; dan kun je ${niveau.bossNaam.toLowerCase()} uitdagen.`}
          </p>

          <div style={styles.pathProgress}>
            <span>Paden:</span>
            {vakken.map((v) => (
              <span key={v.slug} style={styles.vakDot(v.color, conquered.has(v.slug))}>
                {v.icon} {v.naam}
                {conquered.has(v.slug) ? " ✓" : ""}
              </span>
            ))}
          </div>

          {allePadenKlaar ? (
            <button style={styles.bossButton} onClick={() => setPhase("boss")} type="button">
              ⚔️ Daag {niveau.bossNaam} {niveau.bossEmoji} uit
            </button>
          ) : (
            <Bos
              niveau={niveau}
              onPickVak={(slug) => {
                if (conquered.has(slug)) return;
                setActiveVak(slug);
                setPhase("pad");
              }}
            />
          )}
        </div>
        <div style={styles.footer}>🌿 Willow Games • © 2026</div>
      </div>
    );
  }

  if (phase === "pad" && activeVak) {
    const vakInfo = vakken.find((v) => v.slug === activeVak);
    return (
      <div style={styles.page}>
        <ForestBackdrop />
        <div style={styles.content}>
          <Pad
            niveau={niveau}
            vak={activeVak}
            vakInfo={vakInfo}
            onComplete={() => {
              recordAnswer(true);
              handlePadComplete();
            }}
            onBackToBos={() => {
              setActiveVak(null);
              setPhase("bos");
            }}
          />
        </div>
        <div style={styles.footer}>🌿 Willow Games • © 2026</div>
      </div>
    );
  }

  if (phase === "boss") {
    return (
      <div style={styles.page}>
        <ForestBackdrop />
        <div style={styles.content}>
          <BossFight
            niveau={niveau}
            onWin={() => {
              recordAnswer(true);
              handleBossWin();
            }}
            onFlee={() => setPhase("bos")}
          />
        </div>
        <div style={styles.footer}>🌿 Willow Games • © 2026</div>
      </div>
    );
  }

  if (phase === "won") {
    const heeftVolgend = niveau.id < 3;
    const grappigeRegel =
      niveau.bossNaam === "Wolf"      ? "Au! De wolf rent jankend het bos uit." :
      niveau.bossNaam === "Wild Zwijn" ? "Het zwijn snorkt en schuifelt het bos in." :
      niveau.bossNaam === "Draak"     ? "De draak hoest een rookwolkje en vliegt weg." :
      `De ${niveau.bossNaam.toLowerCase()} druipt af.`;
    return (
      <div style={styles.page}>
        <ForestBackdrop />
        <div style={styles.content}>
          <div style={styles.wonPanel}>
            <WonConfetti />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={styles.victoryStage}>
                <span style={{ ...styles.victoryStar, left: "30%", top: 6,  fontSize: 18, animationDelay: "0.0s" }}>⭐</span>
                <span style={{ ...styles.victoryStar, left: "62%", top: 30, fontSize: 16, animationDelay: "0.5s" }}>✨</span>
                <span style={{ ...styles.victoryStar, left: "44%", top: 64, fontSize: 18, animationDelay: "1.0s" }}>💫</span>
                <span style={{ ...styles.victoryStar, left: "26%", top: 50, fontSize: 14, animationDelay: "0.3s" }}>⭐</span>
                <span style={{ ...styles.victoryStar, left: "70%", top: 60, fontSize: 14, animationDelay: "0.7s" }}>✨</span>

                <span style={styles.wolfAu}>Au!</span>
                <span style={styles.wolfFlee} aria-hidden="true">{niveau.bossEmoji}💨</span>

                <div style={styles.bigBear}>
                  <BearSvg size={96} anim="celebrate" />
                </div>
              </div>

              <h2 style={styles.wonTitle}>🏆 {niveau.bossNaam} verslagen!</h2>
              <p style={styles.funnyLine}>{grappigeRegel}</p>
              <p style={styles.wonScore}>
                Niveau "{niveau.naam}" voltooid. Badge: <strong>{niveau.bossEmoji} {niveau.bossNaam.toLowerCase()}-verslagen</strong>.
              </p>
              <p style={styles.wonScore}>
                Deze ronde: {sessionGoed} goed, {sessionFout} fout.
              </p>

              <div style={styles.wonRow}>
                {heeftVolgend && (
                  <button style={styles.primary} onClick={() => startNiveau(niveau.id + 1)} type="button">
                    Volgende niveau →
                  </button>
                )}
                <button
                  style={heeftVolgend ? styles.secondary : styles.primary}
                  onClick={() => startNiveau(niveau.id)}
                  type="button"
                >
                  Speel opnieuw
                </button>
                <button style={styles.secondary} onClick={backToIntro} type="button">
                  Terug naar start
                </button>
              </div>

              {!heeftVolgend && (
                <p style={{ ...styles.wonScore, marginTop: 12, fontStyle: "italic" }}>
                  Je hebt het hele bos uitgespeeld; alle bosbewoners verslagen!
                </p>
              )}
            </div>
          </div>
        </div>
        <div style={styles.footer}>🌿 Willow Games • © 2026</div>
      </div>
    );
  }

  return null;
}
