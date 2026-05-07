import React, { useEffect, useState } from "react";
import VraagKaart from "./VraagKaart.jsx";
import { fetchBerenbosVragen } from "./questions.js";
import { vakkenVoorNiveau, getVak } from "./config.js";

const styles = {
  arena: {
    background: "linear-gradient(180deg, #2a4a3a 0%, #1f3a2a 100%)",
    border: "4px solid #5a3a2a",
    borderRadius: 22,
    padding: "20px 18px",
    marginBottom: 14,
    boxShadow: "0 14px 30px rgba(0, 0, 0, 0.4)",
    position: "relative",
    overflow: "hidden",
  },
  arenaTitle: {
    color: "#fdd966",
    fontFamily: "Georgia, serif",
    fontSize: 22,
    margin: "0 0 4px",
    textAlign: "center",
    fontStyle: "italic",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
  },
  arenaSub: {
    color: "#cdd9b8",
    textAlign: "center",
    margin: "0 0 14px",
    fontSize: 13,
    fontStyle: "italic",
  },
  bossWrap: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 14, padding: "8px 0",
  },
  bear: {
    fontSize: 52,
    filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.4))",
    animation: "bob 1.6s ease-in-out infinite",
  },
  vsLabel: {
    color: "#fdd966", fontFamily: "Georgia, serif", fontWeight: 800,
    fontSize: 18, fontStyle: "italic",
    textShadow: "0 1px 4px rgba(0, 0, 0, 0.6)",
  },
  boss: (shake) => ({
    fontSize: 64,
    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))",
    animation: shake ? "boss-shake 0.4s ease-out" : "bob 2.2s ease-in-out infinite",
  }),
  hpBarWrap: {
    background: "rgba(0, 0, 0, 0.45)",
    border: "2px solid #5a3a2a",
    borderRadius: 999,
    height: 18,
    overflow: "hidden",
    margin: "10px 0 4px",
    position: "relative",
  },
  hpBar: (frac) => ({
    height: "100%",
    width: `${frac * 100}%`,
    background: frac > 0.5 ? "#5aa850" : frac > 0.25 ? "#e8884a" : "#c84a3a",
    transition: "width 0.5s ease, background 0.3s",
  }),
  hpLabel: {
    position: "absolute", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "white", fontWeight: 800, fontSize: 12,
    fontFamily: "system-ui, sans-serif",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
  },
  hint: {
    color: "#cdd9b8", textAlign: "center", fontSize: 12,
    margin: "8px 0 0", fontStyle: "italic",
  },
  loseScreen: {
    background: "#fdfaf2",
    border: "3px solid #c84a3a",
    borderRadius: 22,
    padding: 22,
    textAlign: "center",
    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.25)",
  },
  loseEmoji: {
    fontSize: 50, display: "block", marginBottom: 8,
    animation: "bob 1.5s ease-in-out infinite",
  },
  loseTitle: {
    fontSize: 22, fontFamily: "Georgia, serif",
    color: "#c84a3a", margin: "0 0 8px",
    fontStyle: "italic",
  },
  losePara: { color: "#3a2618", margin: "0 0 14px", fontSize: 15, lineHeight: 1.5 },
  retry: {
    background: "#e8884a", color: "white",
    border: "2px solid #b86a30", borderRadius: 14,
    padding: "12px 22px", fontSize: 16, fontWeight: 800,
    cursor: "pointer", boxShadow: "0 4px 0 #b86a30",
    fontFamily: "Georgia, serif", marginRight: 10,
  },
  flee: {
    background: "#fdfaf2", color: "#5a3a26",
    border: "2px solid #7a5a3a", borderRadius: 14,
    padding: "10px 18px", fontSize: 14, fontWeight: 700,
    cursor: "pointer", fontFamily: "Georgia, serif",
  },
  loadBox: {
    background: "#fdfaf2",
    border: "3px solid #5a8a4a",
    borderRadius: 22,
    padding: 26, textAlign: "center",
    color: "#3a4a2a",
    fontFamily: "Georgia, serif",
    boxShadow: "0 6px 18px rgba(20, 60, 30, 0.18)",
  },
  loadEmoji: {
    fontSize: 40, display: "block", marginBottom: 8,
    animation: "bob 1.4s ease-in-out infinite",
  },
};

// Voor de boss-fight putten we vragen uit ALLE vakken die in dit niveau beschikbaar zijn,
// zodat het echt een eindbaas is. Per fight halen we 1 vraag per vak op en mengen die.

export default function BossFight({ niveau, onWin, onFlee }) {
  const [vragenPool, setVragenPool] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vraagIdx, setVraagIdx] = useState(0); // welke vraag uit de pool nu
  const [hits, setHits] = useState(0);          // hoeveel correcte vragen op rij in deze poging
  const [shaking, setShaking] = useState(false);
  const [phase, setPhase] = useState("fight"); // fight | lose

  // Vragen ophalen, een per vak
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const vakken = vakkenVoorNiveau(niveau.id);
    Promise.all(vakken.map((vak) =>
      fetchBerenbosVragen({ niveau: niveau.id, vak: vak.slug, aantal: 4 })
        .then((res) => res.vragen.map((v) => ({ ...v, vakSlug: vak.slug })))
    )).then((results) => {
      if (cancelled) return;
      const flat = results.flat().sort(() => Math.random() - 0.5);
      setVragenPool(flat);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [niveau.id]);

  function handleAnswer(correct) {
    if (correct) {
      const next = hits + 1;
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      if (next >= niveau.bossVragen) {
        setTimeout(() => onWin(), 600);
      } else {
        setHits(next);
        setVraagIdx((idx) => idx + 1);
      }
    } else {
      setPhase("lose");
    }
  }

  function retry() {
    setHits(0);
    setVraagIdx((idx) => idx + 1);
    setPhase("fight");
  }

  if (loading) {
    return (
      <div style={styles.loadBox}>
        <span style={styles.loadEmoji}>⚔️</span>
        Het beest komt naderbij…
      </div>
    );
  }

  if (phase === "lose") {
    return (
      <div style={styles.loseScreen}>
        <span style={styles.loseEmoji}>{niveau.bossEmoji}</span>
        <h2 style={styles.loseTitle}>{niveau.bossNaam} is sterker!</h2>
        <p style={styles.losePara}>
          Bij een fout begint het gevecht opnieuw. Houd je hoofd koel, denk goed na, je kunt het.
        </p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
          <button style={styles.retry} onClick={retry} type="button">
            Probeer opnieuw ⚔️
          </button>
          <button style={styles.flee} onClick={onFlee} type="button">
            Vlucht naar het bos
          </button>
        </div>
      </div>
    );
  }

  const huidig = vragenPool[vraagIdx % vragenPool.length];
  const vakInfo = getVak(huidig?.vakSlug);
  const hpFrac = (niveau.bossVragen - hits) / niveau.bossVragen;

  return (
    <div>
      <div style={styles.arena}>
        <h2 style={styles.arenaTitle}>
          ⚔️ {niveau.bossNaam}-gevecht
        </h2>
        <p style={styles.arenaSub}>
          {niveau.bossVragen} keer goed achter elkaar; één fout en je begint opnieuw.
        </p>
        <div style={styles.bossWrap}>
          <span style={styles.bear} aria-label="Beertje">🐻</span>
          <span style={styles.vsLabel}>VS</span>
          <span style={styles.boss(shaking)} aria-label={niveau.bossNaam}>{niveau.bossEmoji}</span>
        </div>
        <div style={styles.hpBarWrap} role="progressbar" aria-valuenow={Math.round(hpFrac * 100)}>
          <div style={styles.hpBar(hpFrac)} />
          <div style={styles.hpLabel}>
            {niveau.bossVragen - hits} treffer{niveau.bossVragen - hits === 1 ? "" : "s"} nodig
          </div>
        </div>
        <p style={styles.hint}>Tijd loopt; kies snel maar zorgvuldig.</p>
      </div>

      {huidig && (
        <VraagKaart
          key={vraagIdx}
          vraag={huidig}
          vakInfo={vakInfo}
          timerSec={niveau.timerSec}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
}
