import React from "react";

export default function WillowBand() {
  const count = 18;
  const branches = [];
  for (let i = 0; i < count; i++) {
    const x = (i + 0.5) * (1200 / count);
    const length = 110 + ((i * 41) % 80);
    const driftEnd = ((i * 17) % 60) - 30;
    const swayDelay = ((i * 11) % 30) / 10;
    branches.push({ x, length, driftEnd, swayDelay, key: i });
  }
  return (
    <svg
      viewBox="0 0 1200 260"
      preserveAspectRatio="xMidYMin slice"
      style={{
        width: "100%", height: 220, display: "block",
        position: "absolute", top: 0, left: 0, zIndex: 1,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <rect x="0" y="0" width="1200" height="20" fill="#5a3a26" />
      <rect x="0" y="0" width="1200" height="7" fill="#7a5a3a" />
      {branches.map(({ x, length, driftEnd, swayDelay, key }) => {
        const tipX = x + driftEnd;
        const tipY = 20 + length;
        const midX = x + driftEnd * 0.55;
        const midY = 20 + length * 0.55;
        return (
          <g
            key={key}
            style={{
              transformBox: "view-box",
              transformOrigin: `${x}px 20px`,
              animation: `sway 5s ease-in-out ${swayDelay}s infinite`,
            }}
          >
            <path
              d={`M${x} 20 Q${midX} ${midY} ${tipX} ${tipY}`}
              stroke="#5a7a3a" strokeWidth="1.6" fill="none"
            />
            {[0.28, 0.46, 0.64, 0.82].map((t, j) => {
              const px = x + driftEnd * t;
              const py = 20 + length * t;
              const offset = j % 2 ? 5 : -5;
              const rot = j % 2 ? 28 : -28;
              return (
                <ellipse
                  key={j}
                  cx={px + offset} cy={py + 6}
                  rx="3.2" ry="9"
                  fill={j % 2 ? "#9bbf6a" : "#82a44a"}
                  transform={`rotate(${rot} ${px + offset} ${py + 6})`}
                />
              );
            })}
            <ellipse cx={tipX} cy={tipY + 6} rx="3.6" ry="10" fill="#a8cc7a" />
          </g>
        );
      })}
    </svg>
  );
}
