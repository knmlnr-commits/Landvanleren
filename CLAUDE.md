# Land van Leren

**Nederlandse educatieve games-portal** onder de signature **Willow Games**, gestart door Wilgje Molenaar (M4A, Koning Willem I College). Live op https://landvanleren.nl.

De portal host meerdere games; de eerste is een eilanden-veroverspel (werknaam "Eilandenavontuur"; definitieve naam nog te kiezen, zie sectie 11). Nieuwe games worden toegevoegd zonder de portal te herontwerpen.

---

## 1. Architectuur

Single Vite + React 18 project met React Router; Vercel serverless functions voor LLM-aanroepen.

```
landvanleren/
├── public/
├── src/
│   ├── main.jsx                    entry; React Router
│   ├── pages/
│   │   ├── Home.jsx                portal-homepage; lijst van games
│   │   └── About.jsx               (optioneel) korte info-pagina
│   ├── games/
│   │   └── eilanden/
│   │       ├── EilandenGame.jsx    de game zelf
│   │       └── fallbackQuestions.js statische vragenbank (fallback)
│   ├── shared/                     header, footer, layout
│   └── lib/
│       └── questions.js            client-side fetcher + caching
├── api/
│   └── generate-questions.js       Vercel serverless; proxy naar Anthropic API
├── index.html
├── package.json
├── vercel.json
└── CLAUDE.md
```

Routes:
- `/` portal-homepage met game-overzicht
- `/spel/eilanden` de eilanden-game
- `/over` optioneel

## 2. Games-catalogus als data

Games zijn data, geen losse hardgecodeerde links. Een nieuwe game toevoegen is één item in deze lijst plus één componentbestand:

```js
export const games = [
  {
    slug: "eilanden",
    title: "Eilandenavontuur",
    blurb: "Verover de vijf eilanden door vragen goed te beantwoorden.",
    levels: ["groep56", "groep78", "middelbaar"],
    icon: "🏝️",
    status: "live",                  // "live" | "beta" | "soon"
    component: EilandenGame,
  },
  // toekomstige games hier
];
```

Portal-homepage rendert deze lijst; games met `status: "soon"` tonen als "binnenkort".

## 3. Vragen genereren via LLM

**Doel:** elke ronde nieuwe vragen, zodat herspelen leuk blijft.

### Endpoint-contract

```
POST /api/generate-questions
Body: { niveau, eiland, aantal }
  niveau ∈ "groep56" | "groep78" | "middelbaar"
  eiland ∈ "rekenland" | "toppieland" | "engeland" | "spelling" | "historica"
  aantal: 6 (default; max 10)
Response: { questions: [{ q, a, options }, ...] }
```

### Implementatie in `api/generate-questions.js`

- Roept Anthropic API aan via `@anthropic-ai/sdk`
- API-key uit env-var `ANTHROPIC_API_KEY`; nooit in client-code, nooit in de repo
- Standaardmodel `claude-haiku-4-5-20251001` (kosten/snelheid); via env-var `MODEL` overschrijfbaar
- Strikt JSON-output via duidelijke instructie en schema-validatie aan response-zijde
- Bij parse-fout, schema-mismatch, of API-error: response 502 met body `{ error, fallback: true }`; client gebruikt dan `fallbackQuestions.js`

### System prompt (richtlijn voor de LLM)

```
Je genereert quiz-vragen voor een Nederlands educatief spel voor kinderen.
Niveau: {niveau}. Eiland (vakgebied): {eiland}.
Lever exact {aantal} vragen.

Regels:
- Vragen in het Nederlands; uitzondering: bij eiland "engeland" zijn vraag en antwoorden in het Engels.
- Antwoord "a" moet exact als string in "options" voorkomen.
- Vier opties per vraag; één correct, drie plausibele afleiders.
- Leeftijdsadequaat voor het opgegeven niveau.
- Geen kwetsende, uitsluitende of stereotyperende inhoud.
- Geen culturele, religieuze of politieke gevoeligheden.
- Geen toelichting of tekst buiten de JSON.

Output: alleen geldig JSON in dit schema:
{ "questions": [ { "q": string, "a": string, "options": [string, string, string, string] } ] }
```

### Veiligheid en kosten

- **Rate-limit per IP:** max 20 requests per minuut in de serverless function (in-memory of Vercel KV)
- **Caching:** resultaten per (niveau, eiland) gedurende ~10 minuten cachen, zodat parallelle spelers niet elk een API-call triggeren
- **Max tokens** in de Anthropic-call laag houden (genoeg voor 10 vragen, niet meer)
- **Schema-validatie** aan response-zijde; bij elke afwijking direct terugvallen op fallback
- **Geen user-input** in de prompt; alleen vooraf gevalideerde enums (niveau, eiland)

### Fallback-bank

`src/games/eilanden/fallbackQuestions.js` bevat de bestaande hardgecodeerde vragenbank in dezelfde shape. Wordt gebruikt wanneer:
- de serverless function 502 retourneert
- response niet aan schema voldoet
- offline/lokale ontwikkeling zonder API-key

## 4. Tech stack

- Vite 5 + React 18 + React Router 6
- Inline styles (geen Tailwind; consistent met bestaande game)
- Vercel serverless functions (Node)
- `@anthropic-ai/sdk` in de serverless function
- Geen database; serverless functions zijn stateless (cache in-memory of Vercel KV)
- JS, geen TypeScript

## 5. Lokaal draaien

```bash
npm install

# .env.local (NIET committen):
ANTHROPIC_API_KEY=sk-ant-...
MODEL=claude-haiku-4-5-20251001

vercel dev           # frontend + /api op :3000 (juiste modus voor LLM-tests)
npm run dev          # alleen frontend op :5173 (gebruikt fallback-vragen)
```

Node-versie: LTS (>= 20).

## 6. Deployment

```bash
vercel --prod
```

Env-vars in Vercel dashboard:
- `ANTHROPIC_API_KEY` (vereist)
- `MODEL` (optioneel; default `claude-haiku-4-5-20251001`)
- `RATE_LIMIT_PER_MIN` (optioneel; default 20)

DNS bij TransIP (ongewijzigd): `@` A `216.198.79.1`, `www` CNAME `cname.vercel-dns.com`. HTTPS regelt Vercel automatisch.

## 7. Branding

- Portal-titel: **Land van Leren**
- Studio-signature: **Willow Games** (footer op elke pagina)
- Footer: `🌿 Willow Games • © 2026`
- Stijl: speels en eilandenthema voor de eerste game; portal mag rustiger en navigerender zijn
- UI-taal: Nederlands; uitzondering: Engelse vragen op het eiland Engeland

## 8. Doelgroep en veiligheid

- **Geen tracking, analytics of cookies.** Doelgroep is minderjarig.
- **Geen logins, geen persistente serverstate.**
- **Geen reclame.**
- **Geen user-generated content.** Gegenereerde vragen zijn de enige dynamische inhoud; gevalideerd via schema en system prompt.
- API-keys nooit in client-code, nooit in de repo.

## 9. Codeerconventies

- React functionele componenten met hooks
- Inline styles als objecten; geen losse CSS-bestanden tenzij echt nodig
- Per game eigen folder onder `src/games/{slug}/`; geen onderlinge dependencies
- Gedeelde componenten in `src/shared/`
- Em-dashes vermijden in commentaar en UI-strings; gebruik komma of puntkomma
- Geen TypeScript

## 10. Veelvoorkomende taken

- **Nieuwe game toevoegen:** maak `src/games/{slug}/`, voeg component toe, voeg item toe aan games-array, voeg route toe in `main.jsx`
- **Nieuwe vragen-categorie:** breid de enums in de serverless function en in `fallbackQuestions.js` uit
- **System prompt aanpassen:** alleen in `api/generate-questions.js`; test daarna handmatig met `vercel dev`
- **Modelkeuze wijzigen:** wijzig `MODEL` env-var (geen code-deploy nodig)
- **Fallback aanvullen:** bewerk `src/games/eilanden/fallbackQuestions.js`

## 11. Open punten

- **Definitieve naam voor de eilanden-game.** Werknaam: "Eilandenavontuur". Alternatieven: "De Vijf Eilanden", "Eilandenrace". Wilgje kiest.
- **Caching-strategie.** Start met in-memory per serverless instance; bij groei eventueel Vercel KV.
- **Toegankelijkheid.** Alt-teksten en toetsenbordnavigatie zijn nu minimaal; uitbreiden in volgende iteratie.
- **Tweede game.** Nog te kiezen welk type (woordenspel, geheugen, taal); past in `src/games/{slug}/` zonder portal-aanpassing.

## 12. Contactpunten

- Eigenaar / maker: Wilgje Molenaar
- Technisch supporter: Koen Molenaar
- Vercel-account: Koen Molenaar
- Domein: TransIP, op naam van Koen Molenaar
- Anthropic API-account: Koen Molenaar (factureer naar persoonlijk account, niet Van Ameyde)
