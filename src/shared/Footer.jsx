import React from "react";

// Globals worden door vite.config.js (define) bij build-time vervangen.
// eslint-disable-next-line no-undef
const VERSION = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "dev";
// eslint-disable-next-line no-undef
const BUILD_DATE = typeof __BUILD_DATE__ !== "undefined" ? __BUILD_DATE__ : "";

const versionStyle = {
  display: "block",
  fontSize: 11,
  opacity: 0.65,
  marginTop: 2,
  fontStyle: "normal",
  letterSpacing: 0.4,
};

export default function Footer({ style }) {
  return (
    <div style={style}>
      🌿 Willow Games • © 2026
      <span style={versionStyle} aria-label={`Versie ${VERSION}`}>
        v {VERSION}{BUILD_DATE ? ` · ${BUILD_DATE}` : ""}
      </span>
    </div>
  );
}
