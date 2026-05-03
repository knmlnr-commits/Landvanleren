// Client-side fetcher voor quiz-vragen.
// Roept POST /api/generate-questions aan; valt terug op fallbackQuestions.js bij elke fout.
// Cachet succesvolle responses kort in-memory om snelle herstarts goedkoop te maken.

import { getFallbackQuestions, NIVEAUS, EILANDEN } from "../games/eilanden/fallbackQuestions.js";

const CACHE_TTL_MS = 5 * 60 * 1000;
const memCache = new Map(); // key -> { expires, questions }

function cacheKey(niveau, eiland, aantal) {
  return `${niveau}|${eiland}|${aantal}`;
}

function isValidShape(questions, aantal) {
  if (!Array.isArray(questions) || questions.length === 0) return false;
  if (questions.length > aantal) return false;
  return questions.every((item) => {
    if (!item || typeof item !== "object") return false;
    const { q, a, options } = item;
    if (typeof q !== "string" || q.length === 0) return false;
    if (typeof a !== "string" || a.length === 0) return false;
    if (!Array.isArray(options) || options.length !== 4) return false;
    if (!options.every((o) => typeof o === "string" && o.length > 0)) return false;
    return options.includes(a);
  });
}

export async function fetchQuestions({ niveau, eiland, aantal = 6, signal } = {}) {
  if (!NIVEAUS.includes(niveau)) {
    return { questions: getFallbackQuestions("groep56", eiland, aantal), source: "fallback", reason: "invalid_niveau" };
  }
  if (!EILANDEN.includes(eiland)) {
    return { questions: getFallbackQuestions(niveau, "rekenland", aantal), source: "fallback", reason: "invalid_eiland" };
  }

  const key = cacheKey(niveau, eiland, aantal);
  const now = Date.now();
  const cached = memCache.get(key);
  if (cached && cached.expires > now) {
    return { questions: cached.questions, source: "cache" };
  }

  try {
    const res = await fetch("/api/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niveau, eiland, aantal }),
      signal,
    });

    if (!res.ok) {
      return { questions: getFallbackQuestions(niveau, eiland, aantal), source: "fallback", reason: `http_${res.status}` };
    }

    const data = await res.json();
    if (!isValidShape(data?.questions, aantal)) {
      return { questions: getFallbackQuestions(niveau, eiland, aantal), source: "fallback", reason: "invalid_shape" };
    }

    memCache.set(key, { expires: now + CACHE_TTL_MS, questions: data.questions });
    return { questions: data.questions, source: "llm" };
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    return { questions: getFallbackQuestions(niveau, eiland, aantal), source: "fallback", reason: "network_error" };
  }
}

export function clearQuestionCache() {
  memCache.clear();
}
