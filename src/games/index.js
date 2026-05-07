import EilandenGame from "./eilanden/EilandenGame.jsx";
import Berenbos from "./berenbos/Berenbos.jsx";

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
  {
    slug: "berenbos",
    title: "Berenbos",
    blurb: "Wandel met het beertje door het bos. Goed antwoord, een stap vooruit; aan het einde wacht de wolf.",
    levels: ["groep78"],
    icon: "🐻",
    status: "live",
    component: Berenbos,
  },
];
