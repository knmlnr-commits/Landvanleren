// Berenbos configuratie. Definitieve naam volgt zodra Wilgje kiest.
// Wilgje kan vakken per niveau hier tunen.

export const NIVEAUS = [
  {
    id: 1,
    naam: "Avontuurlijk pad",
    desc: "Makkelijk, voor wie net begint",
    padLengte: 8,
    bossVragen: 3,
    timerSec: 15,
    padTimerSec: 25,
    bossNaam: "Wolf",
    bossEmoji: "🐺",
    bossKleur: "#5a5a6a",
    badge: "wolf-verslagen",
  },
  {
    id: 2,
    naam: "Stoutmoedig pad",
    desc: "Gemiddeld, voor de geoefende beer",
    padLengte: 10,
    bossVragen: 4,
    timerSec: 12,
    padTimerSec: 20,
    bossNaam: "Wild Zwijn",
    bossEmoji: "🐗",
    bossKleur: "#6a4a3a",
    badge: "zwijn-verslagen",
  },
  {
    id: 3,
    naam: "Heldhaftig pad",
    desc: "Uitdagend, voor doorgewinterde helden",
    padLengte: 12,
    bossVragen: 5,
    timerSec: 10,
    padTimerSec: 16,
    bossNaam: "Draak",
    bossEmoji: "🐉",
    bossKleur: "#a04a3a",
    badge: "draak-verslagen",
  },
];

export const VAKKEN = [
  { slug: "rekenen",        naam: "Rekenen",        icon: "🔢", color: "#3686d8" },
  { slug: "taal",           naam: "Taal",           icon: "✏️", color: "#9b5ad8" },
  { slug: "aardrijkskunde", naam: "Aardrijkskunde", icon: "🗺️", color: "#3aa050" },
  { slug: "engels",         naam: "Engels",         icon: "🇬🇧", color: "#e8504a" },
  { slug: "geschiedenis",   naam: "Geschiedenis",   icon: "📜", color: "#d68a3a" },
  { slug: "natuur",         naam: "Natuur",         icon: "🌿", color: "#5a8a4a" },
];

// Welke vakken (paden) zijn er per niveau? Fase 1: alleen niveau 1 met drie paden.
export const NIVEAU_VAKKEN = {
  1: ["rekenen", "taal", "aardrijkskunde"],
  2: ["rekenen", "taal", "aardrijkskunde", "engels", "geschiedenis", "natuur"],
  3: ["rekenen", "taal", "aardrijkskunde", "engels", "geschiedenis", "natuur"],
};

export const PROGRESS_KEY = "berenbos.progress.v1";

export const DEFAULT_PROGRESS = {
  hoogsteNiveau: 1,
  badges: [],
  totaalGoed: 0,
  totaalFout: 0,
  laatstGespeeld: null,
};

export function getNiveau(id) {
  return NIVEAUS.find((n) => n.id === id) || NIVEAUS[0];
}

export function getVak(slug) {
  return VAKKEN.find((v) => v.slug === slug);
}

export function vakkenVoorNiveau(niveauId) {
  return (NIVEAU_VAKKEN[niveauId] || []).map(getVak).filter(Boolean);
}
