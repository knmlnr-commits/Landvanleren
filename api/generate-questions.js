// Vercel serverless function: proxy naar Anthropic API voor het genereren van quiz-vragen.
// Contract en gedrag staan beschreven in CLAUDE.md sectie 3.
//
// Body: { niveau, eiland, aantal }
//   niveau ∈ "groep56" | "groep78" | "middelbaar"
//   eiland ∈ "rekenland" | "toppieland" | "engeland" | "spelling" | "historica"
//   aantal: 1..10 (default 6)
// Response: { questions: [{ q, a, options: [s,s,s,s] }, ...] }
// Bij elke fout: HTTP 502 met body { error, fallback: true }; client moet fallback gebruiken.

import Anthropic from "@anthropic-ai/sdk";

const NIVEAUS = ["groep56", "groep78", "middelbaar"];
const EILANDEN = ["rekenland", "toppieland", "engeland", "spelling", "historica"];

const DEFAULT_MODEL = "claude-haiku-4-5-20251001";
const MAX_AANTAL = 10;
const DEFAULT_AANTAL = 6;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minuten
const RATE_WINDOW_MS = 60 * 1000;    // 1 minuut

// Module-level state. In Vercel leeft deze per serverless instance; meerdere instances
// delen geen state. Voldoende voor een dempende laag, niet voor strikte limieten.
const responseCache = new Map(); // key -> { expires, payload }
const rateBuckets = new Map();   // ip -> [timestamps]

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

function buildSystemPrompt(niveau, eiland, aantal) {
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

function extractJson(text) {
  if (typeof text !== "string") return null;
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  const slice = text.slice(start, end + 1);
  try {
    return JSON.parse(slice);
  } catch {
    return null;
  }
}

function validateQuestions(payload, aantal) {
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
  if (cleaned.length < Math.min(aantal, 1)) return null;
  return cleaned.slice(0, aantal);
}

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

  const niveau = body.niveau;
  const eiland = body.eiland;
  let aantal = Number.parseInt(body.aantal ?? DEFAULT_AANTAL, 10);
  if (!Number.isFinite(aantal) || aantal < 1) aantal = DEFAULT_AANTAL;
  if (aantal > MAX_AANTAL) aantal = MAX_AANTAL;

  if (!NIVEAUS.includes(niveau)) return fail(res, 400, "invalid_niveau");
  if (!EILANDEN.includes(eiland)) return fail(res, 400, "invalid_eiland");

  const cacheKey = `${niveau}|${eiland}|${aantal}`;
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
      max_tokens: 1500,
      temperature: 0.8,
      system: buildSystemPrompt(niveau, eiland, aantal),
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
  const questions = validateQuestions(parsed, aantal);
  if (!questions) return fail(res, 502, "schema_mismatch");

  const payload = { questions };
  responseCache.set(cacheKey, { expires: now + CACHE_TTL_MS, payload });
  return res.status(200).json(payload);
}
