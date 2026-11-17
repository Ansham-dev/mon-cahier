export type Word = {
  id: string;
  fr: string;
  en: string;
  gender: string;
  article: string;
  example: string;
  exampleEn: string;
  category: string;
};

export const VOCAB_CATEGORIES = ["everyday life", "environment", "education", "work"] as const;

export const VOCAB: Word[] = [
  // everyday life
  { id: "v-pain", fr: "pain", en: "bread", gender: "le", article: "le pain", example: "J'achète du pain à la boulangerie.", exampleEn: "I buy bread at the bakery.", category: "everyday life" },
  { id: "v-cuisine", fr: "cuisine", en: "kitchen / cooking", gender: "la", article: "la cuisine", example: "La cuisine de ma grand-mère est délicieuse.", exampleEn: "My grandmother's cooking is delicious.", category: "everyday life" },
  { id: "v-voisin", fr: "voisin", en: "neighbour (m.)", gender: "le", article: "le voisin", example: "Mon voisin joue du piano le soir.", exampleEn: "My neighbour plays piano in the evening.", category: "everyday life" },
  { id: "v-voisine", fr: "voisine", en: "neighbour (f.)", gender: "la", article: "la voisine", example: "La voisine a un chat noir.", exampleEn: "The neighbour has a black cat.", category: "everyday life" },
  { id: "v-retraite", fr: "retraite", en: "retirement", gender: "la", article: "la retraite", example: "Il prend sa retraite l'année prochaine.", exampleEn: "He is retiring next year.", category: "everyday life" },
  { id: "v-appartement", fr: "appartement", en: "flat, apartment", gender: "un", article: "un appartement", example: "Son appartement donne sur la cour.", exampleEn: "His flat overlooks the courtyard.", category: "everyday life" },
  { id: "v-poubelle", fr: "poubelle", en: "bin, trash can", gender: "la", article: "la poubelle", example: "Sortez la poubelle, s'il vous plaît.", exampleEn: "Take out the bin, please.", category: "everyday life" },
  { id: "v-marche", fr: "marché", en: "market", gender: "le", article: "le marché", example: "Le marché est ouvert le dimanche matin.", exampleEn: "The market is open on Sunday morning.", category: "everyday life" },
  { id: "v-urgent", fr: "urgent(e)", en: "urgent", gender: "l'", article: "c'est urgent", example: "Je dois partir, c'est urgent !", exampleEn: "I have to leave, it's urgent!", category: "everyday life" },
  { id: "v-ennui", fr: "ennui", en: "boredom", gender: "l'", article: "l'ennui", example: "L'ennui disparaît quand on a un projet.", exampleEn: "Boredom disappears when you have a project.", category: "everyday life" },
  // environment
  { id: "v-environnement", fr: "environnement", en: "environment", gender: "l'", article: "l'environnement", example: "Protéger l'environnement est essentiel.", exampleEn: "Protecting the environment is essential.", category: "environment" },
  { id: "v-pollution", fr: "pollution", en: "pollution", gender: "la", article: "la pollution", example: "La pollution de l'air augmente en ville.", exampleEn: "Air pollution is increasing in cities.", category: "environment" },
  { id: "v-dechets", fr: "déchets", en: "waste, rubbish", gender: "les", article: "les déchets", example: "Il faut trier les déchets.", exampleEn: "You must sort the waste.", category: "environment" },
  { id: "v-foret", fr: "forêt", en: "forest", gender: "la", article: "la forêt", example: "Nous marchons dans la forêt.", exampleEn: "We walk in the forest.", category: "environment" },
  { id: "v-riviere", fr: "rivière", en: "river", gender: "la", article: "la rivière", example: "La rivière coule près du village.", exampleEn: "The river flows near the village.", category: "environment" },
  { id: "v-climat", fr: "climat", en: "climate", gender: "le", article: "le climat", example: "Le climat change rapidement.", exampleEn: "The climate is changing quickly.", category: "environment" },
  { id: "v-vélo", fr: "vélo", en: "bicycle, bike", gender: "le", article: "le vélo", example: "Je vais au travail à vélo.", exampleEn: "I go to work by bike.", category: "environment" },
  { id: "v-recyclage", fr: "recyclage", en: "recycling", gender: "le", article: "le recyclage", example: "Le recyclage permet d'économiser des ressources.", exampleEn: "Recycling saves resources.", category: "environment" },
  { id: "v-espace-vert", fr: "espace vert", en: "green space", gender: "un", article: "un espace vert", example: "La ville crée de nouveaux espaces verts.", exampleEn: "The city is creating new green spaces.", category: "environment" },
  { id: "v-orage", fr: "orage", en: "storm, thunderstorm", gender: "l'", article: "l'orage", example: "L'orage a duré toute la nuit.", exampleEn: "The storm lasted all night.", category: "environment" },
  // education
  { id: "v-cahier", fr: "cahier", en: "notebook", gender: "le", article: "le cahier", example: "J'écris les nouveaux mots dans mon cahier.", exampleEn: "I write the new words in my notebook.", category: "education" },
  { id: "v-maitrise", fr: "maîtrise", en: "mastery", gender: "la", article: "la maîtrise", example: "La maîtrise d'une langue demande du temps.", exampleEn: "Mastery of a language takes time.", category: "education" },
  { id: "v-lecon", fr: "leçon", en: "lesson", gender: "la", article: "la leçon", example: "La leçon d'aujourd'hui porte sur les pronoms.", exampleEn: "Today's lesson is about pronouns.", category: "education" },
  { id: "v-examen", fr: "examen", en: "exam", gender: "un", article: "un examen", example: "J'ai un examen de français vendredi.", exampleEn: "I have a French exam on Friday.", category: "education" },
  { id: "v-moyen", fr: "moyen", en: "means, way", gender: "le", article: "le moyen", example: "Il n'y a qu'un moyen de réussir : pratiquer.", exampleEn: "There is only one way to succeed: practice.", category: "education" },
  { id: "v-erreur", fr: "erreur", en: "mistake", gender: "une", article: "une erreur", example: "Faire des erreurs aide à apprendre.", exampleEn: "Making mistakes helps you learn.", category: "education" },
  { id: "v-niveau", fr: "niveau", en: "level", gender: "le", article: "le niveau", example: "Mon niveau de français s'améliore.", exampleEn: "My French level is improving.", category: "education" },
  { id: "v-reussite", fr: "réussite", en: "success", gender: "la", article: "la réussite", example: "Sa réussite est le fruit de son travail.", exampleEn: "Their success is the fruit of their work.", category: "education" },
  { id: "v-effort", fr: "effort", en: "effort", gender: "un", article: "un effort", example: "Il faut faire plus d'efforts à l'oral.", exampleEn: "You need to make more effort when speaking.", category: "education" },
  { id: "v-habitude", fr: "habitude", en: "habit", gender: "une", article: "une habitude", example: "Réviser chaque jour est une bonne habitude.", exampleEn: "Revising every day is a good habit.", category: "education" },
  // work
  { id: "v-entretien", fr: "entretien", en: "interview; maintenance", gender: "un", article: "un entretien", example: "J'ai un entretien d'embauche demain.", exampleEn: "I have a job interview tomorrow.", category: "work" },
  { id: "v-employeur", fr: "employeur", en: "employer", gender: "l'", article: "l'employeur", example: "L'employeur cherche quelqu'un de sérieux.", exampleEn: "The employer is looking for someone reliable.", category: "work" },
  { id: "v-salaire", fr: "salaire", en: "salary", gender: "le", article: "le salaire", example: "Le salaire est discuté à la fin de l'entretien.", exampleEn: "The salary is discussed at the end of the interview.", category: "work" },
  { id: "v-competence", fr: "compétence", en: "skill", gender: "la", article: "la compétence", example: "Cette mission demande de vraies compétences.", exampleEn: "This assignment requires real skills.", category: "work" },
  { id: "v-reunion", fr: "réunion", en: "meeting", gender: "la", article: "la réunion", example: "La réunion commence à neuf heures.", exampleEn: "The meeting starts at nine o'clock.", category: "work" },
  { id: "v-collegue", fr: "collègue", en: "colleague", gender: "un", article: "un collègue", example: "Ma collègue m'aide avec le dossier.", exampleEn: "My colleague helps me with the file.", category: "work" },
  { id: "v-stage", fr: "stage", en: "internship", gender: "un", article: "un stage", example: "Il a fait un stage dans une entreprise parisienne.", exampleEn: "He did an internship in a Parisian company.", category: "work" },
  { id: "v-charge", fr: "charge de travail", en: "workload", gender: "la", article: "la charge", example: "Ma charge de travail est lourde ce mois-ci.", exampleEn: "My workload is heavy this month.", category: "work" },
  { id: "v-teletravail", fr: "télétravail", en: "remote work", gender: "le", article: "le télétravail", example: "Le télétravail me fait gagner du temps.", exampleEn: "Remote work saves me time.", category: "work" },
  { id: "v-carriere", fr: "carrière", en: "career", gender: "une", article: "une carrière", example: "Elle a commencé sa carrière à Lyon.", exampleEn: "She started her career in Lyon.", category: "work" },
];

export const DAILY_ROTATION_PREFIX = "mcf-word-of-day";
