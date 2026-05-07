// Berenbos client-side fetcher.
// Roept POST /api/generate-questions met gameType="berenbos".
// Cachet gevulde antwoorden in sessionStorage zodat een sessie geen herhaalde calls doet.
// Valt terug op de hardcoded bank bij elke fout.

import { getFallback } from "./questions.fallback.js";

const SESSION_PREFIX = "berenbos.cache.";
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minuten in deze tab

function cacheKey(niveau, vak, aantal) {
  return `${SESSION_PREFIX}${niveau}|${vak}|${aantal}`;
}

function readSessionCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.expires < Date.now()) return null;
    return parsed.vragen;
  } catch {
    return null;
  }
}

function writeSessionCache(key, vragen) {
  try {
    sessionStorage.setItem(key, JSON.stringify({
      expires: Date.now() + SESSION_TTL_MS,
      vragen,
    }));
  } catch {}
}

function isValid(vragen) {
  if (!Array.isArray(vragen) || vragen.length === 0) return false;
  return vragen.every((v) => {
    if (!v || typeof v !== "object") return false;
    if (typeof v.vraag !== "string" || v.vraag.length === 0) return false;
    if (typeof v.antwoord !== "string" || v.antwoord.length === 0) return false;
    if (!Array.isArray(v.opties) || v.opties.length !== 4) return false;
    if (!v.opties.every((o) => typeof o === "string" && o.length > 0)) return false;
    return v.opties.includes(v.antwoord);
  });
}

export async function fetchBerenbosVragen({ niveau, vak, aantal = 8, signal } = {}) {
  const key = cacheKey(niveau, vak, aantal);

  const cached = readSessionCache(key);
  if (cached && isValid(cached)) {
    return { vragen: cached, source: "cache" };
  }

  try {
    const res = await fetch("/api/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameType: "berenbos", niveau, vak, aantal }),
      signal,
    });

    if (!res.ok) {
      return { vragen: getFallback(vak, niveau, aantal), source: "fallback", reason: `http_${res.status}` };
    }
    const data = await res.json();
    if (!isValid(data?.vragen)) {
      return { vragen: getFallback(vak, niveau, aantal), source: "fallback", reason: "invalid_shape" };
    }

    writeSessionCache(key, data.vragen);
    return { vragen: data.vragen, source: "llm" };
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    return { vragen: getFallback(vak, niveau, aantal), source: "fallback", reason: "network_error" };
  }
}
