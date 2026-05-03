import EilandenGame from "./eilanden/EilandenGame.jsx";

export const games = [
  {
    slug: "eilanden",
    title: "Eilandenavontuur",
    blurb: "Verover de vijf eilanden door vragen goed te beantwoorden. Telkens nieuwe vragen, dus altijd een ander spel.",
    levels: ["groep56", "groep78", "middelbaar"],
    icon: "🏝️",
    status: "live",
    component: EilandenGame,
  },
];
