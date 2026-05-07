// Vercel serverless function: proxy naar Anthropic API voor het genereren van quiz-vragen.
// Ondersteunt twee games via de gameType parameter.
//
// Body: { gameType, niveau, ..., aantal }
//   gameType ∈ "eilanden" | "berenbos" (default: "eilanden" voor backward compat)
//
// Eilanden: { gameType: "eilanden", niveau, eiland, aantal }
//   niveau ∈ "groep56" | "groep78" | "middelbaar"
//   eiland ∈ "rekenland" | "toppieland" | "engeland" | "spelling" | "historica"
//   Response: { questions: [{ q, a, options: [s,s,s,s] }, ...] }
//
// Berenbos: { gameType: "berenbos", niveau, vak, aantal }
//   niveau ∈ 1 | 2 | 3
//   vak ∈ "rekenen" | "engels" | "aardrijkskunde" | "geschiedenis" | "taal" | "natuur"
//   Response: { vragen: [{ vraag, antwoord, opties: [s,s,s,s], uitleg }, ...] }
//
// Bij elke fout: HTTP 502 met body { error, fallback: true }; client moet fallback gebruiken.

import Anthropic from "@anthropic-ai/sdk";

const NIVEAUS_EILANDEN = ["groep56", "groep78", "middelbaar"];
const EILANDEN = ["rekenland", "toppieland", "engeland", "spelling", "historica"];

const NIVEAUS_BERENBOS = [1, 2, 3];
const VAKKEN_BERENBOS = ["rekenen", "engels", "aardrijkskunde", "geschiedenis", "taal", "natuur"];

const DEFAULT_MODEL = "claude-haiku-4-5-20251001";
const MAX_AANTAL = 10;
const DEFAULT_AANTAL = 6;
const CACHE_TTL_MS = 10 * 60 * 1000;
const RATE_WINDOW_MS = 60 * 1000;

const responseCache = new Map();
const rateBuckets = new Map();

function rateLimit(ip, limit) {
  const now = Date.now();
  const arr = rateBuckets.get(ip) ?? [];
  const recent = arr.filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= limit) {
    rateBuckets.set(ip, recent);
    return false;
  }
  recent.push(now);
  rateBuckets.set(ip, recent);
  return true;
}

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress ?? "unknown";
}

function fail(res, status, error) {
  res.status(status).json({ error, fallback: true });
}

function extractJson(text) {
  if (typeof text !== "string") return null;
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

// ---------- Eilanden ----------

function buildPromptEilanden(niveau, eiland, aantal) {
  return [
    "Je genereert quiz-vragen voor een Nederlands educatief spel voor kinderen.",
    `Niveau: ${niveau}. Eiland (vakgebied): ${eiland}.`,
    `Lever exact ${aantal} vragen.`,
    "",
    "Regels:",
    "- Vragen in het Nederlands; uitzondering: bij eiland \"engeland\" zijn vraag en antwoorden in het Engels.",
    "- Antwoord \"a\" moet exact als string in \"options\" voorkomen.",
    "- Vier opties per vraag; een correct, drie plausibele afleiders.",
    "- Leeftijdsadequaat voor het opgegeven niveau.",
    "- Geen kwetsende, uitsluitende of stereotyperende inhoud.",
    "- Geen culturele, religieuze of politieke gevoeligheden.",
    "- Geen toelichting of tekst buiten de JSON.",
    "",
    "Output: alleen geldig JSON in dit schema:",
    "{ \"questions\": [ { \"q\": string, \"a\": string, \"options\": [string, string, string, string] } ] }",
  ].join("\n");
}

function validateEilanden(payload, aantal) {
  if (!payload || typeof payload !== "object") return null;
  const arr = payload.questions;
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const cleaned = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") return null;
    const { q, a, options } = item;
    if (typeof q !== "string" || q.trim().length === 0) return null;
    if (typeof a !== "string" || a.trim().length === 0) return null;
    if (!Array.isArray(options) || options.length !== 4) return null;
    if (!options.every((o) => typeof o === "string" && o.trim().length > 0)) return null;
    if (!options.includes(a)) return null;
    if (new Set(options).size !== 4) return null;
    cleaned.push({ q: q.trim(), a, options });
  }
  if (cleaned.length < 1) return null;
  return { questions: cleaned.slice(0, aantal) };
}

// ---------- Berenbos ----------

function buildPromptBerenbos(niveau, vak, aantal) {
  const moeilijkheid = niveau === 1 ? "makkelijk" : niveau === 2 ? "gemiddeld" : "uitdagend";
  return [
    "Je genereert quiz-vragen voor een Nederlands educatief beren-bos-spel voor kinderen van groep 7/8.",
    `Niveau: ${niveau} (${moeilijkheid}). Vak: ${vak}.`,
    `Lever exact ${aantal} vragen.`,
    "",
    "Regels:",
    "- Vragen in het Nederlands; uitzondering: bij vak \"engels\" zijn vraag en opties in het Engels (de uitleg blijft Nederlands).",
    "- Vier opties per vraag; een correct, drie plausibele afleiders.",
    "- \"antwoord\" moet exact als string in \"opties\" voorkomen.",
    "- \"uitleg\" is een korte, vriendelijke toelichting in het Nederlands (maximaal twee zinnen) waarom het antwoord goed is.",
    "- Leeftijdsadequaat voor groep 7/8 op het genoemde niveau.",
    "- Geen kwetsende, uitsluitende of stereotyperende inhoud.",
    "- Geen culturele, religieuze of politieke gevoeligheden.",
    "- Geen tekst buiten het JSON-object.",
    "",
    "Output: alleen geldig JSON in dit schema:",
    "{ \"vragen\": [ { \"vraag\": string, \"antwoord\": string, \"opties\": [string, string, string, string], \"uitleg\": string } ] }",
  ].join("\n");
}

function validateBerenbos(payload, aantal) {
  if (!payload || typeof payload !== "object") return null;
  const arr = payload.vragen;
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const cleaned = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") return null;
    const { vraag, antwoord, opties, uitleg } = item;
    if (typeof vraag !== "string" || vraag.trim().length === 0) return null;
    if (typeof antwoord !== "string" || antwoord.trim().length === 0) return null;
    if (!Array.isArray(opties) || opties.length !== 4) return null;
    if (!opties.every((o) => typeof o === "string" && o.trim().length > 0)) return null;
    if (!opties.includes(antwoord)) return null;
    if (new Set(opties).size !== 4) return null;
    const uitlegStr = typeof uitleg === "string" ? uitleg.trim() : "";
    cleaned.push({ vraag: vraag.trim(), antwoord, opties, uitleg: uitlegStr });
  }
  if (cleaned.length < 1) return null;
  return { vragen: cleaned.slice(0, aantal) };
}

// ---------- Body parsing ----------

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  return await new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => { data += chunk; });
    req.on("end", () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch { resolve(null); }
    });
    req.on("error", () => resolve(null));
  });
}

// ---------- Handler ----------

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return fail(res, 405, "method_not_allowed");
  }

  const ip = clientIp(req);
  const limit = Number.parseInt(process.env.RATE_LIMIT_PER_MIN ?? "20", 10) || 20;
  if (!rateLimit(ip, limit)) return fail(res, 429, "rate_limited");

  const body = await readJsonBody(req);
  if (!body || typeof body !== "object") return fail(res, 400, "invalid_body");

  const gameType = body.gameType ?? "eilanden";
  let aantal = Number.parseInt(body.aantal ?? DEFAULT_AANTAL, 10);
  if (!Number.isFinite(aantal) || aantal < 1) aantal = DEFAULT_AANTAL;
  if (aantal > MAX_AANTAL) aantal = MAX_AANTAL;

  let prompt, validate, cacheKey;

  if (gameType === "eilanden") {
    const { niveau, eiland } = body;
    if (!NIVEAUS_EILANDEN.includes(niveau)) return fail(res, 400, "invalid_niveau");
    if (!EILANDEN.includes(eiland)) return fail(res, 400, "invalid_eiland");
    prompt = buildPromptEilanden(niveau, eiland, aantal);
    validate = (parsed) => validateEilanden(parsed, aantal);
    cacheKey = `eilanden|${niveau}|${eiland}|${aantal}`;
  } else if (gameType === "berenbos") {
    const niveau = Number.parseInt(body.niveau, 10);
    const { vak } = body;
    if (!NIVEAUS_BERENBOS.includes(niveau)) return fail(res, 400, "invalid_niveau");
    if (!VAKKEN_BERENBOS.includes(vak)) return fail(res, 400, "invalid_vak");
    prompt = buildPromptBerenbos(niveau, vak, aantal);
    validate = (parsed) => validateBerenbos(parsed, aantal);
    cacheKey = `berenbos|${niveau}|${vak}|${aantal}`;
  } else {
    return fail(res, 400, "invalid_gameType");
  }

  const now = Date.now();
  const cached = responseCache.get(cacheKey);
  if (cached && cached.expires > now) {
    return res.status(200).json(cached.payload);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return fail(res, 502, "missing_api_key");

  const model = process.env.MODEL || DEFAULT_MODEL;
  const client = new Anthropic({ apiKey });

  let raw;
  try {
    const completion = await client.messages.create({
      model,
      max_tokens: 2000,
      temperature: 0.8,
      system: prompt,
      messages: [
        { role: "user", content: `Genereer ${aantal} vragen. Antwoord met enkel het JSON-object.` },
      ],
    });
    const block = completion?.content?.find?.((c) => c.type === "text");
    raw = block?.text;
  } catch (err) {
    return fail(res, 502, `upstream_error:${err?.name ?? "unknown"}`);
  }

  const parsed = extractJson(raw);
  const validated = validate(parsed);
  if (!validated) return fail(res, 502, "schema_mismatch");

  responseCache.set(cacheKey, { expires: now + CACHE_TTL_MS, payload: validated });
  return res.status(200).json(validated);
}
