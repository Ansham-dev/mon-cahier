export type Exercise = {
  q: string;
  choices: string[];
  answer: number;
  explain: string;
};

export type GrammarLesson = {
  id: string;
  title: string;
  level: string;
  explanation: string;
  examples: { fr: string; en: string }[];
  exercises: Exercise[];
};

export const GRAMMAR: GrammarLesson[] = [
  {
    id: "g-articles",
    title: "Definite & indefinite articles",
    level: "A2 → B1",
    explanation:
      "French nouns have a gender. Use LE (masculine), LA (feminine), L' before a vowel, LES for plurals — these mean 'the'. For 'a/an' use UN (masculine) or UNE (feminine). After a negative, UN/UNE/DES usually becomes DE: « J'ai un chien » → « Je n'ai pas de chien ».",
    examples: [
      { fr: "Le soleil brille sur la mer.", en: "The sun shines on the sea." },
      { fr: "J'ai une idée incroyable.", en: "I have an incredible idea." },
      { fr: "Je n'ai pas de temps aujourd'hui.", en: "I don't have any time today." },
    ],
    exercises: [
      { q: "___ clé de la maison est sur la table.", choices: ["La", "Le", "Les", "Un"], answer: 0, explain: "« clé » is feminine → la clé." },
      { q: "Je n'ai pas ___ réponse à ta question.", choices: ["de", "une", "la", "des"], answer: 0, explain: "After a negation, use DE: « pas de réponse »." },
      { q: "Elle achète ___ pommes surtout rouges.", choices: ["des", "les", "la", "un"], answer: 0, explain: "Plural, unspecified → des pommes." },
      { q: "___ ami de mon frère s'appelle Paul.", choices: ["L'", "Le", "La", "Un"], answer: 0, explain: "« ami » starts with a vowel → l'ami." },
      { q: "Nous visitons ___ musée.", choices: ["le", "la", "une", "des"], answer: 0, explain: "« musée » is masculine → le musée." },
    ],
  },
  {
    id: "g-present",
    title: "The present tense & question forms",
    level: "A2 → B1",
    explanation:
      "The present describes habits and current actions. To ask questions you can use: 1) Est-ce que + statement (« Est-ce que tu viens ? »); 2) inversion (« Viens-tu ? », formal); 3) rising intonation (informal).",
    examples: [
      { fr: "Est-ce que tu travailles ce soir ?", en: "Are you working tonight?" },
      { fr: "Où habitez-vous ?", en: "Where do you live?" },
      { fr: "Ils ne comprennent pas la question.", en: "They don't understand the question." },
    ],
    exercises: [
      { q: "___ vous souvent au café ?", choices: ["Allez", "Aller", "Vas", "Va"], answer: 0, explain: "With « vous », aller → allez." },
      { q: "Est-ce qu'il ___ le français ?", choices: ["parle", "parlent", "parles", "parler"], answer: 0, explain: "Third person singular: il parle." },
      { q: "Nous ___ une lettre en français.", choices: ["écrivons", "écriez", "écrivent", "écris"], answer: 0, explain: "With « nous », écrire → nous écrivons." },
      { q: "Which is the correct inverted question?", choices: ["Comprends-tu ?", "Tu comprends ?", "Tu te comprendre ?", "Comprendre tu ?"], answer: 0, explain: "Inversion: verb + hyphen + pronoun." },
      { q: "Ils ___ leurs clés.", choices: ["cherchent", "cherche", "cherches", "cherchez"], answer: 0, explain: "Third person plural: ils cherchent." },
    ],
  },
  {
    id: "g-pc-imparfait",
    title: "Passé composé vs imparfait",
    level: "B1 core",
    explanation:
      "The passé composé describes finished events (« hier », « soudain ») and is built with avoir/être + participle. The imparfait describes background, habits, descriptions and ongoing states (« chaque jour », « était »).",
    examples: [
      { fr: "Quand je marchais dans la rue, j'ai vu un chat.", en: "While I was walking in the street, I saw a cat." },
      { fr: "Nous allions à la plage chaque été.", en: "We used to go to the beach every summer." },
      { fr: "Il est rentré et il a préparé le dîner.", en: "He came home and prepared dinner." },
    ],
    exercises: [
      { q: "Hier, il ___ toute la journée.", choices: ["a plu", "pleuvait", "pleuvoir", "pleuvra"], answer: 0, explain: "A single finished event → passé composé." },
      { q: "Quand j'étais petit, je ___ aux cubes.", choices: ["jouais", "ai joué", "joue", "jouerai"], answer: 0, explain: "Childhood habit → imparfait." },
      { q: "Soudain, elle ___ un bruit étrange.", choices: ["a entendu", "entendait", "entend", "entendra"], answer: 0, explain: "Sudden event → passé composé." },
      { q: "Nous ___ devant le cinéma quand tu as appelé.", choices: ["attendions", "avons attendu", "attendons", "attendrons"], answer: 0, explain: "Background action in progress → imparfait." },
      { q: "Elle ___ français pendant dix ans, puis elle a déménagé.", choices: ["a appris", "apprenait", "apprend", "apprendra"], answer: 0, explain: "A completed period in the past with a finished context → passé composé." },
    ],
  },
  {
    id: "g-negation",
    title: "Negation & restriction",
    level: "A2 → B1",
    explanation:
      "Standard negation wraps the verb: NE … PAS. Other pairs: ne…jamais (never), ne…plus (no longer), ne…rien (nothing), ne…personne (nobody). « NE » becomes « N' » before a vowel.",
    examples: [
      { fr: "Je n'aime pas le café.", en: "I don't like coffee." },
      { fr: "Il ne parle jamais pendant les cours.", en: "He never speaks during class." },
      { fr: "Elle ne veut plus travailler ici.", en: "She doesn't want to work here anymore." },
    ],
    exercises: [
      { q: "Je ___ fume jamais le soir.", choices: ["ne", "n'", "pas", "ne pas"], answer: 0, explain: "« fume » starts with a consonant → ne." },
      { q: "Elle ___ voit plus ses amis.", choices: ["ne", "n'", "no", "pas"], answer: 0, explain: "« voit » starts with a consonant → ne." },
      { q: "Ils n'ont ___ dit. (nothing)", choices: ["rien", "jamais", "personne", "plus"], answer: 0, explain: "nothing → rien, placed after the auxiliary." },
      { q: "Il n'y a ___ dans la salle. (nobody)", choices: ["personne", "rien", "jamais", "plus"], answer: 0, explain: "nobody → personne." },
      { q: "Nous ___ sommes pas en retard.", choices: ["ne", "n'", "non", "pas"], answer: 0, explain: "« sommes » starts with a consonant → ne." },
    ],
  },
  {
    id: "g-pronouns",
    title: "Object pronouns (COD & COI)",
    level: "B1 core",
    explanation:
      "Direct objects → LE / LA / LES: « Je vois Marie » → « Je la vois ». Indirect objects with à → LUI (singular) / LEUR (plural): « Je parle à Paul » → « Je lui parle ». The pronoun goes right before the verb.",
    examples: [
      { fr: "Tu me prêtes ton livre ? Je le lis ce soir.", en: "Will you lend me your book? I'll read it tonight." },
      { fr: "Je leur téléphone chaque semaine.", en: "I call them every week." },
      { fr: "On l'invite à la fête ?", en: "Shall we invite him/her to the party?" },
    ],
    exercises: [
      { q: "Tu regardes le film ? — Oui, je ___ regarde.", choices: ["le", "lui", "y", "en"], answer: 0, explain: "Direct object → le." },
      { q: "Tu parles à tes voisins ? — Oui, je ___ parle souvent.", choices: ["leur", "les", "eux", "en"], answer: 0, explain: "Indirect plural → leur." },
      { q: "Elle écrit à sa mère. → Elle ___ écrit une carte.", choices: ["lui", "la", "le", "leur"], answer: 0, explain: "Indirect singular → lui." },
      { q: "Vous prenez les clés ? — Oui, je ___ prends.", choices: ["les", "leur", "lui", "y"], answer: 0, explain: "Direct plural → les." },
      { q: "Il mange le gâteau. → Il ___ mange.", choices: ["le", "lui", "la", "en"], answer: 0, explain: "le gâteau is a direct masculine object → le." },
    ],
  },
  {
    id: "g-futur",
    title: "Talking about the future",
    level: "B1",
    explanation:
      "Futur proche = ALLER + infinitive for near plans. Futur simple = infinitive + -ai, -as, -a, -ons, -ez, -ont for predictions and promises. After « Quand » and « Si », use the futur simple, not the present.",
    examples: [
      { fr: "Ce soir, je vais réviser mes verbes.", en: "Tonight, I'm going to revise my verbs." },
      { fr: "Un jour, tu parleras couramment !", en: "One day, you will speak fluently!" },
      { fr: "Quand tu arriveras, on mangera.", en: "When you arrive, we'll eat." },
    ],
    exercises: [
      { q: "Demain, nous ___ au marché. (aller)", choices: ["irons", "allons", "irions", "allions"], answer: 0, explain: "Irregular stem ir- + -ons." },
      { q: "Elle ___ un café quand tu viendras.", choices: ["prendra", "prend", "prenait", "prendra pas"], answer: 0, explain: "Futur simple after « quand »." },
      { q: "Je ___ t'appeler dès que je finis.", choices: ["vais", "va", "allons", "allez"], answer: 0, explain: "Going to → vais + infinitive." },
      { q: "Vous ___ contents de ce résultat ? (être)", choices: ["serez", "êtes", "étiez", "seriez"], answer: 0, explain: "-être → serez." },
      { q: "Ils ne ___ pas venir ce soir. (pouvoir)", choices: ["pourront", "peuvent", "pouvaient", "pourraient"], answer: 0, explain: "Irregular futur: pourront." },
    ],
  },
];
