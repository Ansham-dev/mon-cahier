export const PRONOUNS = ["je", "tu", "il/elle", "nous", "vous", "ils/elles"] as const;

export type Verb = {
  inf: string;
  fr: string;
  en: string;
  participle: string;
  aux: "avoir" | "être";
  futurStem: string;
  present: string[];
  imparfait: string[];
  futur: string[];
  conditionnel: string[];
  subjonctif?: string[];
};

export const VERBS: Verb[] = [
  {
    inf: "être",
    fr: "être",
    en: "to be",
    participle: "été",
    aux: "avoir",
    futurStem: "ser",
    present: ["suis", "es", "est", "sommes", "êtes", "sont"],
    imparfait: ["étais", "étais", "était", "étions", "étiez", "étaient"],
    futur: ["serai", "seras", "sera", "serons", "serez", "seront"],
    conditionnel: ["serais", "serais", "serait", "serions", "seriez", "seraient"],
    subjonctif: ["sois", "sois", "soit", "soyons", "soyez", "soient"],
  },
  {
    inf: "avoir",
    fr: "avoir",
    en: "to have",
    participle: "eu",
    aux: "avoir",
    futurStem: "aur",
    present: ["ai", "as", "a", "avons", "avez", "ont"],
    imparfait: ["avais", "avais", "avait", "avions", "aviez", "avaient"],
    futur: ["aurai", "auras", "aura", "aurons", "aurez", "auront"],
    conditionnel: ["aurais", "aurais", "aurait", "aurions", "auriez", "auraient"],
    subjonctif: ["aie", "aies", "ait", "ayons", "ayez", "aient"],
  },
  {
    inf: "aller",
    fr: "aller",
    en: "to go",
    participle: "allé",
    aux: "être",
    futurStem: "ir",
    present: ["vais", "vas", "va", "allons", "allez", "vont"],
    imparfait: ["allais", "allais", "allait", "allions", "alliez", "allaient"],
    futur: ["irai", "iras", "ira", "irons", "irez", "iront"],
    conditionnel: ["irais", "irais", "irait", "irions", "iriez", "iraient"],
    subjonctif: ["aille", "ailles", "aille", "allions", "alliez", "aillent"],
  },
  {
    inf: "faire",
    fr: "faire",
    en: "to do, to make",
    participle: "fait",
    aux: "avoir",
    futurStem: "fer",
    present: ["fais", "fais", "fait", "faisons", "faites", "font"],
    imparfait: ["faisais", "faisais", "faisait", "faisions", "faisiez", "faisaient"],
    futur: ["ferai", "feras", "fera", "ferons", "ferez", "feront"],
    conditionnel: ["ferais", "ferais", "ferait", "ferions", "feriez", "feraient"],
    subjonctif: ["fasse", "fasses", "fasse", "fassions", "fassiez", "fassent"],
  },
  {
    inf: "parler",
    fr: "parler",
    en: "to speak",
    participle: "parlé",
    aux: "avoir",
    futurStem: "parler",
    present: ["parle", "parles", "parle", "parlons", "parlez", "parlent"],
    imparfait: ["parlais", "parlais", "parlait", "parlions", "parliez", "parlaient"],
    futur: ["parlerai", "parleras", "parlera", "parlerons", "parlerez", "parleront"],
    conditionnel: ["parlerais", "parlerais", "parlerait", "parlerions", "parleriez", "parleraient"],
    subjonctif: ["parle", "parles", "parle", "parlions", "parliez", "parlent"],
  },
  {
    inf: "finir",
    fr: "finir",
    en: "to finish",
    participle: "fini",
    aux: "avoir",
    futurStem: "finir",
    present: ["finis", "finis", "finit", "finissons", "finissez", "finissent"],
    imparfait: ["finissais", "finissais", "finissait", "finissions", "finissiez", "finissaient"],
    futur: ["finirai", "finiras", "finira", "finirons", "finirez", "finiront"],
    conditionnel: ["finirais", "finirais", "finirait", "finirions", "finiriez", "finiraient"],
    subjonctif: ["finisse", "finisses", "finisse", "finissions", "finissiez", "finissent"],
  },
  {
    inf: "prendre",
    fr: "prendre",
    en: "to take",
    participle: "pris",
    aux: "avoir",
    futurStem: "prendr",
    present: ["prends", "prends", "prend", "prenons", "prenez", "prennent"],
    imparfait: ["prenais", "prenais", "prenait", "prenions", "preniez", "prenaient"],
    futur: ["prendrai", "prendras", "prendra", "prendrons", "prendrez", "prendront"],
    conditionnel: ["prendrais", "prendrais", "prendrait", "prendrions", "prendriez", "prendraient"],
    subjonctif: ["prenne", "prennes", "prenne", "prenions", "preniez", "prennent"],
  },
  {
    inf: "pouvoir",
    fr: "pouvoir",
    en: "can, to be able to",
    participle: "pu",
    aux: "avoir",
    futurStem: "pourr",
    present: ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"],
    imparfait: ["pouvais", "pouvais", "pouvait", "pouvions", "pouviez", "pouvaient"],
    futur: ["pourrai", "pourras", "pourra", "pourrons", "pourrez", "pourront"],
    conditionnel: ["pourrais", "pourrais", "pourrait", "pourrions", "pourriez", "pourraient"],
    subjonctif: ["puisse", "puisses", "puisse", "puissions", "puissiez", "puissent"],
  },
  {
    inf: "vouloir",
    fr: "vouloir",
    en: "to want",
    participle: "voulu",
    aux: "avoir",
    futurStem: "voudr",
    present: ["veux", "veux", "veut", "voulons", "voulez", "veulent"],
    imparfait: ["voulais", "voulais", "voulait", "voulions", "vouliez", "voulaient"],
    futur: ["voudrai", "voudras", "voudra", "voudrons", "voudrez", "voudront"],
    conditionnel: ["voudrais", "voudrais", "voudrait", "voudrions", "voudriez", "voudraient"],
    subjonctif: ["veuille", "veuilles", "veuille", "voulions", "vouliez", "veuillent"],
  },
  {
    inf: "venir",
    fr: "venir",
    en: "to come",
    participle: "venu",
    aux: "être",
    futurStem: "viendr",
    present: ["viens", "viens", "vient", "venons", "venez", "viennent"],
    imparfait: ["venais", "venais", "venait", "venions", "veniez", "venaient"],
    futur: ["viendrai", "viendras", "viendra", "viendrons", "viendrez", "viendront"],
    conditionnel: ["viendrais", "viendrais", "viendrait", "viendrions", "viendriez", "viendraient"],
    subjonctif: ["vienne", "viennes", "vienne", "venions", "veniez", "viennent"],
  },
];

export const TENSES = [
  { id: "present", label: "Présent", desc: "Current actions and habits." },
  { id: "imparfait", label: "Imparfait", desc: "Background, habits, descriptions." },
  { id: "futur", label: "Futur simple", desc: "Predictions, promises, plans." },
  { id: "conditionnel", label: "Conditionnel", desc: "Politeness, hypotheses." },
] as const;

export type TenseId = (typeof TENSES)[number]["id"];
