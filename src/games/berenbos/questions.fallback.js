// Fallback-vragen voor Berenbos: gebruikt wanneer de LLM-call faalt of er geen API-key is.
// Schema: { vraag, antwoord, opties: [s,s,s,s], uitleg }
// Antwoord moet exact in opties voorkomen.
// Per (vak, niveau) ongeveer 8 tot 12 vragen; genoeg voor een complete pad-loop.

const f = (vraag, antwoord, opties, uitleg) => ({ vraag, antwoord, opties, uitleg });

export const fallbackQuestions = {
  rekenen: {
    1: [
      f("Hoeveel is 7 × 8?", "56", ["48", "54", "56", "63"], "Tafel van 7: 7 keer 8 is 56."),
      f("Hoeveel is 144 : 12?", "12", ["10", "11", "12", "14"], "Twaalf keer twaalf is 144, dus 144 gedeeld door 12 is 12."),
      f("Hoeveel is 25 + 38?", "63", ["53", "62", "63", "73"], "25 + 38 = 25 + 35 + 3 = 60 + 3 = 63."),
      f("Hoeveel is 100 - 47?", "53", ["43", "53", "57", "63"], "Van 47 naar 100 is 53 (47 + 53 = 100)."),
      f("Hoeveel is de helft van 86?", "43", ["41", "42", "43", "44"], "86 gedeeld door 2 is 43."),
      f("Hoeveel minuten zitten er in 2 uur?", "120", ["60", "100", "120", "180"], "Een uur is 60 minuten, dus 2 uur is 120 minuten."),
      f("Hoeveel is 9 × 6?", "54", ["48", "52", "54", "56"], "Tafel van 9: 9 keer 6 is 54."),
      f("Hoeveel is 75 : 5?", "15", ["12", "13", "15", "25"], "5 keer 15 is 75."),
      f("Wat is 0,5 als breuk?", "1/2", ["1/4", "1/3", "1/2", "2/3"], "0,5 is een half, dus 1/2."),
      f("Een pak melk kost € 1,20. Wat kosten 3 pakken?", "€ 3,60", ["€ 3,00", "€ 3,40", "€ 3,60", "€ 4,20"], "3 keer 1,20 is 3,60."),
    ],
    2: [
      f("Hoeveel is 13 × 14?", "182", ["172", "178", "182", "196"], "13 × 14 = 13 × 10 + 13 × 4 = 130 + 52 = 182."),
      f("Hoeveel is 0,25 als breuk?", "1/4", ["1/2", "1/3", "1/4", "1/5"], "0,25 is een kwart, dus 1/4."),
      f("Wat is 15% van 200?", "30", ["15", "20", "30", "45"], "10% van 200 is 20, plus de helft daarvan (10) is 30."),
      f("Hoeveel is 81 : 9?", "9", ["7", "8", "9", "11"], "9 keer 9 is 81."),
      f("Hoeveel is 2 tot de macht 5?", "32", ["10", "16", "25", "32"], "2 × 2 × 2 × 2 × 2 = 32."),
      f("Wat is de omtrek van een vierkant met zijde 7?", "28", ["14", "21", "28", "49"], "Vier zijden van 7 cm samen is 28."),
    ],
    3: [
      f("Wat is de wortel van 169?", "13", ["11", "12", "13", "14"], "13 × 13 = 169."),
      f("Hoeveel is 3/4 + 1/2?", "5/4", ["1", "5/4", "4/6", "7/8"], "3/4 + 2/4 = 5/4."),
      f("Wat is 20% van 350?", "70", ["50", "60", "70", "80"], "10% van 350 is 35, dus 20% is 70."),
      f("Los op: 3x = 27. Wat is x?", "9", ["3", "6", "9", "12"], "27 gedeeld door 3 is 9."),
    ],
  },

  taal: {
    1: [
      f("Welk woord is goed gespeld?", "vrolijk", ["vrolik", "vrolijk", "vroolijk", "vrolijck"], "Vrolijk schrijf je met -ijk aan het einde."),
      f("Hoe schrijf je het meervoud van 'kind'?", "kinderen", ["kinden", "kinderen", "kinds", "kindjes"], "Kind heeft een onregelmatig meervoud: kinderen."),
      f("Wat is de juiste vorm: 'Hij ___ naar school.'", "fietst", ["fietst", "fiets", "fietsd", "fietste"], "Hij fietst: stam (fiets) + t."),
      f("Welk woord is een werkwoord?", "rennen", ["mooi", "rennen", "snel", "huis"], "Rennen drukt een handeling uit, dat is een werkwoord."),
      f("Hoe schrijf je 'paard' in het meervoud?", "paarden", ["paards", "paarden", "paardes", "parden"], "Het meervoud van paard is paarden."),
      f("Welk woord is goed gespeld?", "huisje", ["huisje", "huisie", "huijsje", "huiesje"], "Verkleinwoord van huis: huisje."),
      f("Wat is correct: 'Ik heb hem ___.' (zien)", "gezien", ["gezien", "geziet", "geziend", "ziengezien"], "Voltooid deelwoord van zien is gezien."),
      f("Welk woord rijmt op 'maan'?", "baan", ["bos", "baan", "tuin", "lief"], "Maan en baan eindigen allebei op -aan."),
      f("Welk woord is een zelfstandig naamwoord?", "tafel", ["lopen", "snel", "tafel", "rood"], "Een tafel is een ding, dat is een zelfstandig naamwoord."),
      f("Wat is de juiste vorm: 'Wij ___ samen.'", "spelen", ["speelt", "speel", "spelen", "speelde"], "Bij wij eindigt het werkwoord op -en: spelen."),
    ],
  },

  aardrijkskunde: {
    1: [
      f("Wat is de hoofdstad van Nederland?", "Amsterdam", ["Den Haag", "Rotterdam", "Amsterdam", "Utrecht"], "Amsterdam is de hoofdstad. Den Haag is de regeringszetel."),
      f("Hoeveel provincies heeft Nederland?", "12", ["10", "11", "12", "13"], "Nederland heeft 12 provincies, sinds Flevoland erbij kwam in 1986."),
      f("Welke rivier stroomt door Rotterdam?", "De Maas", ["De Rijn", "De Maas", "De IJssel", "De Waal"], "De Maas stroomt door Rotterdam naar de Noordzee."),
      f("In welke provincie ligt de stad Groningen?", "Groningen", ["Friesland", "Drenthe", "Groningen", "Overijssel"], "De stad Groningen is de hoofdstad van de provincie Groningen."),
      f("Welk land grenst aan Nederland in het oosten?", "Duitsland", ["Belgie", "Frankrijk", "Duitsland", "Denemarken"], "In het oosten grenst Nederland aan Duitsland."),
      f("Wat is de langste rivier van Nederland?", "De Rijn", ["De Rijn", "De Maas", "De Schelde", "De IJssel"], "De Rijn is de langste rivier in Nederland."),
      f("Welk land ligt direct ten zuiden van Nederland?", "Belgie", ["Belgie", "Duitsland", "Frankrijk", "Luxemburg"], "Belgie ligt ten zuiden van Nederland."),
      f("Hoe heet de zee ten westen van Nederland?", "Noordzee", ["Noordzee", "Oostzee", "Middellandse Zee", "Waddenzee"], "De Noordzee ligt ten westen van Nederland."),
      f("Wat is de hoogste 'berg' van Nederland?", "Vaalserberg", ["Mont Blanc", "Vaalserberg", "Posbank", "Sint-Pietersberg"], "De Vaalserberg in Limburg is met 322 meter het hoogste punt."),
      f("In welke provincie liggen de Waddeneilanden voornamelijk?", "Friesland", ["Groningen", "Friesland", "Noord-Holland", "Drenthe"], "De meeste Waddeneilanden liggen in Friesland."),
    ],
  },

  engels: {
    1: [
      f("How do you say 'hond' in English?", "dog", ["cat", "dog", "horse", "bird"], "Hond in het Engels is dog."),
      f("Translate: 'Ik ben blij'.", "I am happy", ["I am sad", "I am tired", "I am happy", "I am angry"], "Blij betekent happy."),
      f("Wat betekent 'school' in het Nederlands?", "school", ["huis", "school", "winkel", "boom"], "School blijft school in het Nederlands."),
      f("How do you say 'twee' in English?", "two", ["one", "two", "three", "four"], "Twee in het Engels is two."),
      f("Wat betekent 'apple'?", "appel", ["banaan", "appel", "peer", "kers"], "Apple is appel."),
      f("Translate: 'Het regent.'", "It is raining", ["The sun shines", "It is raining", "It is snowing", "The wind blows"], "Regenen is to rain."),
      f("How do you ask someone's name?", "What is your name?", ["How old are you?", "Where do you live?", "What is your name?", "How are you?"], "Bij naam vragen gebruik je 'What is your name?'."),
      f("Wat betekent 'difficult'?", "moeilijk", ["makkelijk", "moeilijk", "groot", "klein"], "Difficult is moeilijk."),
    ],
  },

  geschiedenis: {
    1: [
      f("Wie was de eerste koning van Nederland?", "Willem I", ["Willem I", "Willem II", "Willem-Alexander", "Lodewijk Napoleon"], "Willem I werd in 1815 onze eerste koning."),
      f("In welk jaar eindigde de Tweede Wereldoorlog?", "1945", ["1918", "1939", "1945", "1950"], "De Tweede Wereldoorlog eindigde in 1945."),
      f("Wie ontdekte Amerika voor de Europeanen in 1492?", "Columbus", ["Marco Polo", "Columbus", "Magellaan", "Vasco da Gama"], "Christoffel Columbus zette in 1492 voet aan land in Amerika."),
      f("Wie schilderde 'De Nachtwacht'?", "Rembrandt", ["Rembrandt", "Vermeer", "Van Gogh", "Frans Hals"], "Rembrandt van Rijn schilderde De Nachtwacht in 1642."),
      f("Welke periode heet 'de Gouden Eeuw'?", "17e eeuw", ["15e eeuw", "16e eeuw", "17e eeuw", "18e eeuw"], "In de 17e eeuw was Nederland zeer welvarend."),
      f("Wie was Anne Frank?", "Een Joods meisje dat onderdook tijdens WO II", ["Een verzetsstrijder", "Een Joods meisje dat onderdook tijdens WO II", "Een koningin", "Een schrijfster uit de Gouden Eeuw"], "Anne Frank schreef haar dagboek tijdens de onderduik in Amsterdam."),
      f("Wie was Willem van Oranje?", "Leider van de opstand tegen Spanje", ["De eerste koning", "Leider van de opstand tegen Spanje", "Een schilder", "Een ontdekkingsreiziger"], "Willem van Oranje leidde de Tachtigjarige Oorlog."),
      f("Wanneer werd de VOC opgericht?", "1602", ["1568", "1602", "1648", "1700"], "De Verenigde Oost-Indische Compagnie werd in 1602 opgericht."),
    ],
  },

  natuur: {
    1: [
      f("Hoeveel poten heeft een spin?", "8", ["4", "6", "8", "10"], "Een spin heeft 8 poten; daarom is hij een spinachtige, geen insect."),
      f("Welk dier legt de eieren waaruit kuikens komen?", "Kip", ["Kip", "Koe", "Hond", "Vis"], "Kuikens komen uit kippeneieren."),
      f("Wat eet een konijn vooral?", "Planten", ["Vlees", "Planten", "Vis", "Eieren"], "Konijnen zijn planteneters."),
      f("Hoe heet het seizoen waarin bladeren vallen?", "Herfst", ["Lente", "Zomer", "Herfst", "Winter"], "In de herfst vallen veel bladeren van bomen."),
      f("Hoeveel planeten heeft ons zonnestelsel?", "8", ["6", "7", "8", "9"], "Sinds Pluto geen planeet meer is, telt ons zonnestelsel 8 planeten."),
      f("Welk dier kan vliegen zonder vleugels?", "Geen", ["Vleermuis", "Mier", "Geen", "Kikker"], "Vliegen zonder vleugels kan niet; vleermuizen hebben wel vleugels."),
      f("Wat heeft een boom nodig om te groeien?", "Water en zonlicht", ["Alleen water", "Water en zonlicht", "Alleen aarde", "Wind"], "Bomen maken voedsel uit zonlicht en water (fotosynthese)."),
      f("Hoeveel hartkamers heeft een mens?", "4", ["1", "2", "3", "4"], "Het menselijk hart heeft vier kamers: twee boezems en twee kamers."),
    ],
  },
};

export function getFallback(vak, niveauId, aantal = 8) {
  const bank = fallbackQuestions[vak]?.[niveauId] || fallbackQuestions[vak]?.[1] || [];
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(aantal, shuffled.length));
}
