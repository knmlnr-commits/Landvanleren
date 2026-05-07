import React from "react";

// SVG-personages. Pure SVG, geen externe assets, geen dependencies.

export function BearSvg({ size = 64, anim }) {
  const wrapperAnim =
    anim === "hop"       ? "bear-hop 0.7s ease-out" :
    anim === "stumble"   ? "bear-stumble 0.7s ease-out" :
    anim === "celebrate" ? "bear-celebrate 1.2s ease-in-out infinite" :
    "bob 2.4s ease-in-out infinite";

  // Walking cycle staat alleen aan in idle/celebrate; tijdens hop/stumble pauze
  // zodat de pootjes geen rare botsing maken met de hop-animatie.
  const walkRunning = anim !== "hop" && anim !== "stumble";
  const legA = walkRunning ? "leg-walk-a 0.55s ease-in-out infinite" : "none";
  const legB = walkRunning ? "leg-walk-b 0.55s ease-in-out infinite" : "none";

  return (
    <svg
      viewBox="0 0 100 90"
      width={size}
      height={size * 0.9}
      style={{ display: "block", animation: wrapperAnim, filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))" }}
      aria-label="Beertje"
    >
      <ellipse cx="50" cy="86" rx="30" ry="3" fill="rgba(0, 0, 0, 0.30)" />
      <ellipse cx="34" cy="76" rx="9" ry="6" fill="#5a3a22" style={{ animation: legA }} />
      <ellipse cx="66" cy="76" rx="9" ry="6" fill="#5a3a22" style={{ animation: legB }} />
      <ellipse cx="50" cy="58" rx="24" ry="22" fill="#9a7340" />
      <ellipse cx="50" cy="62" rx="14" ry="14" fill="#d4a065" />
      <ellipse cx="40" cy="74" rx="6" ry="5" fill="#7a5028" style={{ animation: legB }} />
      <ellipse cx="60" cy="74" rx="6" ry="5" fill="#7a5028" style={{ animation: legA }} />
      <circle cx="50" cy="30" r="20" fill="#9a7340" />
      <circle cx="34" cy="16" r="7" fill="#9a7340" />
      <circle cx="66" cy="16" r="7" fill="#9a7340" />
      <circle cx="34" cy="17" r="3.5" fill="#d4a065" />
      <circle cx="66" cy="17" r="3.5" fill="#d4a065" />
      <ellipse cx="50" cy="38" rx="11" ry="8" fill="#e8c578" />
      <ellipse cx="50" cy="34" rx="3" ry="2.2" fill="#1a0e08" />
      <ellipse cx="49" cy="33.5" rx="0.8" ry="0.5" fill="white" opacity="0.5" />
      <circle cx="42" cy="27" r="2.5" fill="#1a0e08" />
      <circle cx="58" cy="27" r="2.5" fill="#1a0e08" />
      <circle cx="43" cy="26" r="0.8" fill="white" />
      <circle cx="59" cy="26" r="0.8" fill="white" />
      <path d="M44 41 Q50 44 56 41" stroke="#1a0e08" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="32" cy="36" rx="4" ry="2.5" fill="#d68080" opacity="0.5" />
      <ellipse cx="68" cy="36" rx="4" ry="2.5" fill="#d68080" opacity="0.5" />
    </svg>
  );
}

export function WolfSvg({ size = 56, anim }) {
  const animation =
    anim === "shake" ? "boss-shake 0.4s ease-out" :
    "bob 2.6s ease-in-out infinite";

  return (
    <svg
      viewBox="0 0 100 90"
      width={size}
      height={size * 0.9}
      style={{ display: "block", animation, filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4))" }}
      aria-label="Wolf"
    >
      <ellipse cx="50" cy="86" rx="28" ry="2.5" fill="rgba(0, 0, 0, 0.35)" />
      <ellipse cx="34" cy="76" rx="8" ry="6" fill="#3a3a4a" />
      <ellipse cx="66" cy="76" rx="8" ry="6" fill="#3a3a4a" />
      <ellipse cx="50" cy="58" rx="22" ry="20" fill="#5a5a6a" />
      <ellipse cx="50" cy="62" rx="13" ry="13" fill="#8a8a9a" />
      <ellipse cx="40" cy="74" rx="6" ry="5" fill="#3a3a4a" />
      <ellipse cx="60" cy="74" rx="6" ry="5" fill="#3a3a4a" />
      <ellipse cx="50" cy="32" rx="18" ry="16" fill="#5a5a6a" />
      <path d="M34 22 L32 6 L42 18 Z" fill="#5a5a6a" stroke="#3a3a4a" strokeWidth="0.5" />
      <path d="M66 22 L68 6 L58 18 Z" fill="#5a5a6a" stroke="#3a3a4a" strokeWidth="0.5" />
      <path d="M34 18 L34 10 L40 16 Z" fill="#7a7a8a" />
      <path d="M66 18 L66 10 L60 16 Z" fill="#7a7a8a" />
      <ellipse cx="50" cy="40" rx="13" ry="9" fill="#7a7a8a" />
      <ellipse cx="42" cy="26" rx="3" ry="2.5" fill="#fdc864" />
      <ellipse cx="58" cy="26" rx="3" ry="2.5" fill="#fdc864" />
      <ellipse cx="42" cy="26" rx="1.2" ry="2" fill="#1a0e08" />
      <ellipse cx="58" cy="26" rx="1.2" ry="2" fill="#1a0e08" />
      <ellipse cx="50" cy="36" rx="3" ry="2" fill="#1a0e08" />
      <path d="M44 44 L50 47 L56 44" stroke="#1a0e08" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M46 43 L47 46" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M53 46 L54 43" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M70 60 Q86 50 80 70 Q74 64 70 60 Z" fill="#5a5a6a" />
    </svg>
  );
}

// Boss-switcher. Vooralsnog alleen wolf met SVG; andere bosses vallen terug op emoji.
export function BossKarakter({ niveau, size = 56, anim }) {
  if (niveau.bossEmoji === "🐺") return <WolfSvg size={size} anim={anim} />;
  return (
    <span
      style={{
        fontSize: size,
        display: "inline-block",
        animation: anim === "shake" ? "boss-shake 0.4s ease-out" : "bob 2.6s ease-in-out infinite",
        filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4))",
      }}
      aria-label={niveau.bossNaam}
    >
      {niveau.bossEmoji}
    </span>
  );
}

export function PineSilhouette({ size = 60, color = "#3a5a2a", trunkColor = "#4a3020" }) {
  return (
    <svg viewBox="0 0 60 100" width={size} height={(size * 100) / 60} style={{ display: "block" }} aria-hidden="true">
      <rect x="26" y="80" width="8" height="18" fill={trunkColor} />
      <path d="M30 8 L48 38 L40 38 L52 60 L42 60 L54 80 L6 80 L18 60 L8 60 L20 38 L12 38 Z" fill={color} />
    </svg>
  );
}

export function RoundTreeSilhouette({ size = 50, color = "#5a8a3a", trunkColor = "#4a3020" }) {
  return (
    <svg viewBox="0 0 60 90" width={size} height={(size * 90) / 60} style={{ display: "block" }} aria-hidden="true">
      <rect x="26" y="68" width="8" height="20" fill={trunkColor} />
      <ellipse cx="30" cy="38" rx="22" ry="32" fill={color} />
      <ellipse cx="22" cy="32" rx="10" ry="14" fill={color} opacity="0.7" />
      <ellipse cx="38" cy="44" rx="9" ry="12" fill={color} opacity="0.6" />
    </svg>
  );
}
