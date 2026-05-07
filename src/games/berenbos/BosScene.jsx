import React from "react";
import {
  BearSvg, BossKarakter,
  PineSilhouette, RoundTreeSilhouette,
} from "./Personages.jsx";

const styles = {
  scene: {
    position: "relative",
    height: 280,
    overflow: "hidden",
    borderRadius: 22,
    border: "3px solid #4a3020",
    background: "linear-gradient(180deg, #ffd9a3 0%, #ffe8c4 30%, #d8e8b8 65%, #b6d098 95%)",
    boxShadow: "inset 0 0 30px rgba(60, 90, 30, 0.18), 0 8px 22px rgba(20, 60, 30, 0.30)",
  },
  sunHalo: {
    position: "absolute",
    top: 8, right: 12,
    width: 80, height: 80,
    background: "radial-gradient(circle at center, rgba(255, 248, 168, 0.85) 0%, rgba(255, 215, 102, 0.4) 40%, rgba(255, 215, 102, 0) 70%)",
    borderRadius: "50%",
    zIndex: 1,
    pointerEvents: "none",
    animation: "sun-pulse 5s ease-in-out infinite",
  },
  sunDisc: {
    position: "absolute",
    top: 28, right: 32,
    width: 36, height: 36,
    background: "radial-gradient(circle at 35% 35%, #fff8c8 0%, #ffd766 60%, #f0a838 100%)",
    borderRadius: "50%",
    boxShadow: "0 0 22px rgba(255, 220, 110, 0.7)",
    zIndex: 1,
    pointerEvents: "none",
  },
  cloud: (left, top, scale) => ({
    position: "absolute",
    left, top,
    width: 60 * scale, height: 22 * scale,
    background: "rgba(255, 255, 255, 0.85)",
    borderRadius: 999,
    boxShadow: `${12 * scale}px ${-6 * scale}px 0 rgba(255, 255, 255, 0.85), ${-14 * scale}px ${-2 * scale}px 0 rgba(255, 255, 255, 0.85)`,
    zIndex: 1,
    pointerEvents: "none",
  }),
  ground: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    height: 80,
    background: "linear-gradient(180deg, #8aa56a 0%, #5a8a4a 60%, #3a6a2a 100%)",
    borderTop: "2px solid #2a4a1a",
    zIndex: 3,
  },
  groundShine: {
    position: "absolute",
    bottom: 75, left: 0, right: 0,
    height: 6,
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 100%)",
    zIndex: 3,
    pointerEvents: "none",
  },
  pathStripe: {
    position: "absolute",
    bottom: 24, left: -20, right: -20,
    height: 30,
    background: "linear-gradient(180deg, #d4ad7a 0%, #b88a58 100%)",
    border: "2px solid #8a6a40",
    boxShadow: "inset 0 -3px 4px rgba(0,0,0,0.18), inset 0 2px 2px rgba(255,255,255,0.25)",
    zIndex: 4,
    transform: "perspective(140px) rotateX(15deg)",
    transformOrigin: "center bottom",
  },
  parallaxLayer: {
    position: "absolute",
    left: 0,
    pointerEvents: "none",
    transition: "transform 0.55s ease",
  },
  bearWrap: {
    position: "absolute",
    bottom: 36,
    left: "26%",
    transform: "translateX(-50%)",
    zIndex: 6,
  },
  bossWrap: (progress) => ({
    position: "absolute",
    bottom: 36,
    left: `calc(${85 - progress * 50}% - 32px)`,
    transition: "left 0.55s ease, transform 0.55s ease",
    transform: `scale(${0.55 + progress * 0.45})`,
    transformOrigin: "bottom center",
    zIndex: 5,
  }),
  popup: (color) => ({
    position: "absolute",
    bottom: 110, left: "26%",
    color, fontWeight: 800, fontSize: 16,
    fontFamily: "Georgia, serif",
    background: "rgba(255, 255, 255, 0.97)",
    padding: "5px 12px",
    borderRadius: 999,
    border: `2.5px solid ${color}`,
    pointerEvents: "none",
    whiteSpace: "nowrap",
    boxShadow: "0 3px 8px rgba(0, 0, 0, 0.25)",
    animation: "pop-bubble 1.4s ease-out forwards",
    zIndex: 10,
  }),
  sparkle: (left, bottom, delay) => ({
    position: "absolute",
    left, bottom,
    fontSize: 22,
    pointerEvents: "none",
    animation: `sparkle 0.95s ease-out ${delay}s forwards`,
    zIndex: 9,
  }),
  vakChip: (color) => ({
    position: "absolute",
    top: 12, left: 12,
    display: "inline-flex", alignItems: "center", gap: 6,
    background: color, color: "white",
    padding: "4px 12px", borderRadius: 999,
    fontFamily: "Georgia, serif", fontWeight: 700,
    fontSize: 13, zIndex: 7,
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
  }),
  stepBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(253, 250, 242, 0.94)",
    border: "2px solid #6a7a3a",
    borderRadius: 999,
    padding: "8px 14px",
    marginTop: 10,
    gap: 8,
    flexWrap: "wrap",
  },
  stepLabel: {
    fontSize: 13, fontWeight: 700, color: "#3a4a2a",
    fontFamily: "Georgia, serif",
    whiteSpace: "nowrap",
  },
  stepDots: { display: "flex", gap: 6, flexWrap: "wrap" },
  stepDot: (passed, current) => ({
    width: 22, height: 22,
    borderRadius: "50%",
    background: passed ? "#5a8a3a" : current ? "#fdfaf2" : "rgba(180, 200, 160, 0.55)",
    border: `2px solid ${current ? "#e8884a" : "#5a7a3a"}`,
    color: passed ? "white" : "#5a7a3a",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11,
    boxShadow: current ? "0 0 0 3px rgba(232, 136, 74, 0.35)" : "none",
    transition: "all 0.3s ease",
  }),
};

// Genereer bomen-posities deterministisch zodat ze niet bij elke render verspringen.
function buildTreeRow(count, baseSize, color, layerKey) {
  const trees = [];
  for (let i = 0; i < count; i++) {
    const seed = i * 13 + layerKey * 7;
    const x = (i / count) * 100 + ((seed % 9) - 4);
    const yOffset = ((seed * 11) % 18) - 8;
    const sizeVar = baseSize + ((seed * 5) % 22) - 11;
    const isPine = (seed % 2 === 0);
    trees.push({ x, yOffset, sizeVar, isPine, color, key: i });
  }
  return trees;
}

const DISTANT_TREES = buildTreeRow(22, 36, "#7aa86a", 1);
const MID_TREES     = buildTreeRow(14, 70, "#3a5a2a", 2);
const CLOSE_BUSHES  = buildTreeRow(12, 36, "#2a4a1a", 3);

function Trees({ trees }) {
  return trees.map(({ x, yOffset, sizeVar, isPine, color, key }) => (
    <div
      key={key}
      style={{
        position: "absolute",
        left: `${x}%`,
        bottom: yOffset,
        transform: "translateX(-50%)",
      }}
    >
      {isPine
        ? <PineSilhouette size={sizeVar} color={color} />
        : <RoundTreeSilhouette size={sizeVar} color={color} />}
    </div>
  ));
}

export default function BosScene({
  niveau, vakInfo, step, bearAnim,
  popup, popupKey, showSparkles, sparkleKey,
}) {
  const progress = niveau.padLengte > 0 ? Math.min(1, step / niveau.padLengte) : 0;

  return (
    <>
      <div style={styles.scene}>
        <div style={styles.sunHalo} />
        <div style={styles.sunDisc} />

        <div style={styles.cloud("8%",  18, 1)} />
        <div style={styles.cloud("48%", 38, 0.7)} />
        <div style={styles.cloud("72%", 14, 0.85)} />

        {vakInfo && (
          <span style={styles.vakChip(vakInfo.color)}>
            {vakInfo.icon} {vakInfo.naam}
          </span>
        )}

        <div style={{ ...styles.parallaxLayer, bottom: 78, height: 80,  width: "260%", transform: `translateX(${progress * -55}%)`, zIndex: 1 }}>
          <Trees trees={DISTANT_TREES} />
        </div>

        <div style={{ ...styles.parallaxLayer, bottom: 56, height: 140, width: "300%", transform: `translateX(${progress * -120}%)`, zIndex: 2 }}>
          <Trees trees={MID_TREES} />
        </div>

        <div style={styles.ground} />
        <div style={styles.groundShine} />
        <div style={styles.pathStripe} />

        <div style={{ ...styles.parallaxLayer, bottom: 4, height: 64, width: "320%", transform: `translateX(${progress * -190}%)`, zIndex: 4 }}>
          <Trees trees={CLOSE_BUSHES} />
        </div>

        <div style={styles.bearWrap}>
          <BearSvg size={72} anim={bearAnim} />
        </div>

        <div style={styles.bossWrap(progress)}>
          <BossKarakter niveau={niveau} size={64} anim={null} />
        </div>

        {popup && (
          <div key={popupKey} style={styles.popup(popup.color)}>
            {popup.text}
          </div>
        )}

        {showSparkles && (
          <>
            <span key={`sa-${sparkleKey}`} style={styles.sparkle("calc(26% - 38px)", 130, 0)}>✨</span>
            <span key={`sb-${sparkleKey}`} style={styles.sparkle("calc(26% + 22px)", 150, 0.15)}>⭐</span>
            <span key={`sc-${sparkleKey}`} style={styles.sparkle("calc(26% + 4px)",  180, 0.30)}>✨</span>
          </>
        )}
      </div>

      <div style={styles.stepBar}>
        <span style={styles.stepLabel}>Stap {step}/{niveau.padLengte}</span>
        <div style={styles.stepDots}>
          {Array.from({ length: niveau.padLengte }, (_, i) => (
            <div key={i} style={styles.stepDot(i < step, i === step)}>
              {i < step ? "🐾" : ""}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
