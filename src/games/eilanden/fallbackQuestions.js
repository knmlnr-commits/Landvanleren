// Statische vragenbank, gebruikt wanneer de LLM-call faalt of er geen API-key is.
// Shape per vraag: { q, a, options: [string, string, string, string] }.
// Antwoord "a" moet exact als string in "options" staan.

export const NIVEAUS = ["groep56", "groep78", "middelbaar"];
export const EILANDEN = ["rekenland", "toppieland", "engeland", "spelling", "historica"];

export const fallbackQuestions = {
  rekenland: {
    groep56: [
      { q: "Hoeveel is 7 x 8?", a: "56", options: ["48", "54", "56", "64"] },
      { q: "Hoeveel is 144 : 12?", a: "12", options: ["10", "11", "12", "14"] },
      { q: "Hoeveel is 25 + 38?", a: "63", options: ["53", "62", "63", "73"] },
      { q: "Hoeveel is 100 - 47?", a: "53", options: ["43", "53", "57", "63"] },
      { q: "Hoeveel is de helft van 86?", a: "43", options: ["41", "42", "43", "44"] },
      { q: "Hoeveel minuten zitten er in 2 uur?", a: "120", options: ["60", "100", "120", "180"] },
    ],
    groep78: [
      { q: "Hoeveel is 13 x 14?", a: "182", options: ["172", "178", "182", "192"] },
      { q: "Hoeveel is 0,25 als breuk?", a: "1/4", options: ["1/2", "1/3", "1/4", "1/5"] },
      { q: "Wat is de omtrek van een vierkant met zijde 7?", a: "28", options: ["14", "21", "28", "49"] },
      { q: "Hoeveel is 15% van 200?", a: "30", options: ["15", "20", "30", "45"] },
      { q: "Hoeveel is 81 : 9?", a: "9", options: ["7", "8", "9", "11"] },
      { q: "Hoeveel is 2 tot de macht 5?", a: "32", options: ["10", "16", "25", "32"] },
    ],
    middelbaar: [
      { q: "Wat is de wortel van 169?", a: "13", options: ["11", "12", "13", "14"] },
      { q: "Hoeveel is 3/4 + 1/2?", a: "5/4", options: ["1", "5/4", "4/6", "7/8"] },
      { q: "Wat is 20% van 350?", a: "70", options: ["50", "60", "70", "80"] },
      { q: "Wat is de oppervlakte van een cirkel met straal 5? (pi = 3,14)", a: "78,5", options: ["31,4", "62,8", "78,5", "100"] },
      { q: "Los op: 3x = 27. Wat is x?", a: "9", options: ["3", "6", "9", "12"] },
      { q: "Hoeveel is 12!? (12 faculteit, in miljoenen, afgerond)", a: "479", options: ["120", "479", "720", "1024"] },
    ],
  },

  toppieland: {
    groep56: [
      { q: "Wat is de hoofdstad van Nederland?", a: "Amsterdam", options: ["Den Haag", "Rotterdam", "Amsterdam", "Utrecht"] },
      { q: "In welke provincie ligt de stad Groningen?", a: "Groningen", options: ["Friesland", "Drenthe", "Groningen", "Overijssel"] },
      { q: "Welke rivier stroomt door Rotterdam?", a: "De Maas", options: ["De Rijn", "De Maas", "De IJssel", "De Waal"] },
      { q: "Hoeveel provincies heeft Nederland?", a: "12", options: ["10", "11", "12", "13"] },
      { q: "Welk land grenst aan Nederland in het oosten?", a: "Duitsland", options: ["Belgie", "Frankrijk", "Duitsland", "Denemarken"] },
      { q: "Wat is de langste rivier van Nederland?", a: "De Rijn", options: ["De Rijn", "De Maas", "De Schelde", "De IJssel"] },
    ],
    groep78: [
      { q: "Wat is de hoofdstad van Belgie?", a: "Brussel", options: ["Antwerpen", "Brussel", "Brugge", "Gent"] },
      { q: "Welk werelddeel is het grootst?", a: "Azie", options: ["Afrika", "Europa", "Azie", "Amerika"] },
      { q: "Wat is de hoofdstad van Frankrijk?", a: "Parijs", options: ["Lyon", "Marseille", "Parijs", "Nice"] },
      { q: "Welke oceaan ligt tussen Europa en Amerika?", a: "Atlantische Oceaan", options: ["Indische Oceaan", "Atlantische Oceaan", "Stille Oceaan", "Noordelijke IJszee"] },
      { q: "Wat is de hoogste berg van Nederland?", a: "Vaalserberg", options: ["Mont Blanc", "Vaalserberg", "Posbank", "Sint-Pietersberg"] },
      { q: "In welk land ligt de stad Berlijn?", a: "Duitsland", options: ["Oostenrijk", "Duitsland", "Polen", "Zwitserland"] },
    ],
    middelbaar: [
      { q: "Wat is de hoofdstad van Australie?", a: "Canberra", options: ["Sydney", "Melbourne", "Canberra", "Perth"] },
      { q: "Welke rivier is de langste ter wereld?", a: "De Nijl", options: ["De Amazone", "De Nijl", "De Yangtze", "De Mississippi"] },
      { q: "In welk land ligt de stad Reykjavik?", a: "IJsland", options: ["Noorwegen", "Finland", "IJsland", "Groenland"] },
      { q: "Wat is de hoofdstad van Canada?", a: "Ottawa", options: ["Toronto", "Vancouver", "Ottawa", "Montreal"] },
      { q: "Welke zee ligt tussen Italie en Kroatie?", a: "Adriatische Zee", options: ["Egeische Zee", "Adriatische Zee", "Tyrreense Zee", "Ionische Zee"] },
      { q: "Wat is het kleinste land ter wereld?", a: "Vaticaanstad", options: ["Monaco", "San Marino", "Vaticaanstad", "Liechtenstein"] },
    ],
  },

  engeland: {
    groep56: [
      { q: "What colour is the sky on a sunny day?", a: "Blue", options: ["Red", "Blue", "Green", "Yellow"] },
      { q: "How do you say 'hond' in English?", a: "Dog", options: ["Cat", "Dog", "Horse", "Bird"] },
      { q: "Which word means 'school' in Dutch?", a: "School", options: ["House", "Car", "School", "Tree"] },
      { q: "What is 'twee' in English?", a: "Two", options: ["One", "Two", "Three", "Four"] },
      { q: "Translate: 'I am happy.'", a: "Ik ben blij", options: ["Ik ben blij", "Ik ben moe", "Ik ben boos", "Ik ben bang"] },
      { q: "Which is a fruit?", a: "Apple", options: ["Bread", "Apple", "Cheese", "Milk"] },
    ],
    groep78: [
      { q: "What is the past tense of 'go'?", a: "Went", options: ["Goed", "Gone", "Went", "Going"] },
      { q: "Choose the correct sentence.", a: "She likes apples.", options: ["She like apples.", "She likes apples.", "She liking apples.", "She liked apples yesterday."] },
      { q: "What does 'difficult' mean?", a: "Moeilijk", options: ["Makkelijk", "Moeilijk", "Mooi", "Lelijk"] },
      { q: "How do you ask for someone's name?", a: "What is your name?", options: ["How old are you?", "Where do you live?", "What is your name?", "How are you?"] },
      { q: "Which word is a verb?", a: "Run", options: ["Happy", "Run", "Quickly", "Blue"] },
      { q: "Translate: 'Het regent vandaag.'", a: "It is raining today.", options: ["It rains tomorrow.", "It is raining today.", "The rain is here.", "Today it rained."] },
    ],
    middelbaar: [
      { q: "What is the meaning of 'reluctant'?", a: "Unwilling", options: ["Eager", "Unwilling", "Tired", "Confused"] },
      { q: "Which sentence is in the present perfect?", a: "I have eaten.", options: ["I eat.", "I ate.", "I have eaten.", "I will eat."] },
      { q: "Choose the correct word: 'She is taller ___ her brother.'", a: "than", options: ["then", "as", "than", "that"] },
      { q: "What is a synonym of 'begin'?", a: "Start", options: ["Stop", "Start", "Finish", "End"] },
      { q: "Translate: 'Ondanks de regen gingen we naar buiten.'", a: "Despite the rain, we went outside.", options: ["Because of the rain, we stayed inside.", "Despite the rain, we went outside.", "When it rained, we went outside.", "If it rained, we went outside."] },
      { q: "What is the plural of 'mouse' (the animal)?", a: "Mice", options: ["Mouses", "Mice", "Mouse", "Mices"] },
    ],
  },

  spelling: {
    groep56: [
      { q: "Welk woord is goed gespeld?", a: "fietsen", options: ["fietzen", "fietsen", "vietsen", "fitsen"] },
      { q: "Hoe schrijf je het meervoud van 'kind'?", a: "kinderen", options: ["kinden", "kinderen", "kinds", "kindjes"] },
      { q: "Welk woord is goed gespeld?", a: "huisje", options: ["huisje", "huisie", "huijsje", "huiesje"] },
      { q: "Wat is de juiste vorm: 'Hij ___ naar school.'", a: "fietst", options: ["fietst", "fiets", "fietsd", "fietste"] },
      { q: "Hoe schrijf je 'paard' in het meervoud?", a: "paarden", options: ["paards", "paarden", "paardes", "parden"] },
      { q: "Welk woord is goed gespeld?", a: "vrolijk", options: ["vrolik", "vrolijk", "vroolijk", "vrolijck"] },
    ],
    groep78: [
      { q: "Welk woord is goed gespeld?", a: "gebeurtenis", options: ["gebeurtenis", "gebeurtnis", "gebeurtenes", "gebuurtenis"] },
      { q: "Hoe schrijf je: 'Ik heb hem ___.' (zien, voltooid)", a: "gezien", options: ["gezien", "geziet", "geziend", "ziengezien"] },
      { q: "Welke vorm is correct: 'Het is ___ dan gisteren.'", a: "warmer", options: ["warmer", "warmder", "warmere", "meer warm"] },
      { q: "Welk woord is goed gespeld?", a: "tegenwoordig", options: ["tegenwoordig", "tegenwoordich", "teegenwoordig", "tegenwoordigh"] },
      { q: "Wat is correct: 'Dat heeft hij me ___.'", a: "verteld", options: ["verteld", "vertelt", "vertelde", "vertelden"] },
      { q: "Welk woord is goed gespeld?", a: "officieel", options: ["officieel", "officeel", "ofisieel", "officiel"] },
    ],
    middelbaar: [
      { q: "Welk woord is goed gespeld?", a: "consequentie", options: ["consequentie", "consekwentie", "konsequentie", "consequensie"] },
      { q: "Wat is correct: 'Hij heeft het probleem ___.'", a: "opgelost", options: ["opgelost", "opgelosd", "oplost", "oplosde"] },
      { q: "Welk woord is goed gespeld?", a: "ritme", options: ["ritme", "rythme", "rieteme", "ritmme"] },
      { q: "Wat is correct: 'Een van de ___ kwam te laat.'", a: "leerlingen", options: ["leerlingen", "leerling", "leerlings", "leerlinges"] },
      { q: "Welk woord is goed gespeld?", a: "discussie", options: ["discusie", "diskussie", "discussie", "diskusie"] },
      { q: "Wat is correct: 'Zij ___ gisteren naar de film.'", a: "ging", options: ["ging", "gingt", "gingde", "gingen"] },
    ],
  },

  historica: {
    groep56: [
      { q: "Wie was de eerste koning van Nederland?", a: "Willem I", options: ["Willem I", "Willem II", "Willem-Alexander", "Lodewijk Napoleon"] },
      { q: "In welk jaar eindigde de Tweede Wereldoorlog?", a: "1945", options: ["1918", "1939", "1945", "1950"] },
      { q: "Wie ontdekte Amerika voor de Europeanen in 1492?", a: "Columbus", options: ["Marco Polo", "Columbus", "Magellaan", "Vasco da Gama"] },
      { q: "Hoe heette het schip waarmee Willem Barentsz op Nova Zembla overwinterde?", a: "De Witte Zwaan", options: ["De Halve Maan", "De Witte Zwaan", "De Batavia", "De Liefde"] },
      { q: "Wie schilderde 'De Nachtwacht'?", a: "Rembrandt", options: ["Rembrandt", "Vermeer", "Van Gogh", "Frans Hals"] },
      { q: "In welke eeuw leefden de Romeinen in Nederland?", a: "Eerste eeuw", options: ["Eerste eeuw", "Tiende eeuw", "Vijftiende eeuw", "Achttiende eeuw"] },
    ],
    groep78: [
      { q: "Wanneer brak de Eerste Wereldoorlog uit?", a: "1914", options: ["1900", "1914", "1918", "1925"] },
      { q: "Wie was de leider van Duitsland in WO II?", a: "Adolf Hitler", options: ["Adolf Hitler", "Otto von Bismarck", "Wilhelm II", "Konrad Adenauer"] },
      { q: "Welke periode wordt de Gouden Eeuw genoemd?", a: "17e eeuw", options: ["15e eeuw", "16e eeuw", "17e eeuw", "18e eeuw"] },
      { q: "Wie was Anne Frank?", a: "Een Joods meisje dat onderdook tijdens WO II", options: ["Een verzetsstrijder", "Een Joods meisje dat onderdook tijdens WO II", "Een koningin", "Een schrijfster uit de Gouden Eeuw"] },
      { q: "In welk jaar viel de Berlijnse Muur?", a: "1989", options: ["1961", "1975", "1989", "1991"] },
      { q: "Wie was Willem van Oranje?", a: "Leider van de opstand tegen Spanje", options: ["De eerste koning", "Leider van de opstand tegen Spanje", "Een schilder", "Een ontdekkingsreiziger"] },
    ],
    middelbaar: [
      { q: "In welk jaar werd de Republiek der Zeven Verenigde Nederlanden gesticht?", a: "1588", options: ["1568", "1588", "1648", "1672"] },
      { q: "Wat was de Vrede van Munster?", a: "Einde van de Tachtigjarige Oorlog (1648)", options: ["Einde van de Eerste Wereldoorlog", "Einde van de Tachtigjarige Oorlog (1648)", "Einde van de Franse tijd", "Einde van de Republiek"] },
      { q: "Wie was de eerste president van de Verenigde Staten?", a: "George Washington", options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "Benjamin Franklin"] },
      { q: "Wanneer werd de VOC opgericht?", a: "1602", options: ["1568", "1602", "1648", "1700"] },
      { q: "Wat was het Marshallplan?", a: "Amerikaanse hulp aan Europa na WO II", options: ["Een militair plan in WO I", "Amerikaanse hulp aan Europa na WO II", "Een Nederlandse wet", "Een verdrag met de Sovjet-Unie"] },
      { q: "Welke revolutie begon in 1789?", a: "Franse Revolutie", options: ["Industriele Revolutie", "Russische Revolutie", "Franse Revolutie", "Amerikaanse Revolutie"] },
    ],
  },
};

export function getFallbackQuestions(niveau, eiland, aantal = 6) {
  const safeNiveau = NIVEAUS.includes(niveau) ? niveau : "groep56";
  const safeEiland = EILANDEN.includes(eiland) ? eiland : "rekenland";
  const bank = fallbackQuestions[safeEiland]?.[safeNiveau] ?? [];
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(aantal, shuffled.length));
}
