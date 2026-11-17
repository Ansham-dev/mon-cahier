export type Reply = {
  prompt: string;
  hint: string; // suggested vocabulary / structure
  keywords: string[][]; // any of these groups must appear in the answer
};

export type Roleplay = {
  id: string;
  title: string;
  intro: string;
  turns: Reply[];
};

export const ROLEPLAYS: Roleplay[] = [
  {
    id: "rp-cafe",
    title: "Au café — commander",
    intro: "You sit down at a Parisian café. The waiter approaches. Order a drink, ask about a pastry, and ask for the bill. Type your replies in French — the waiter listens for key words!",
    turns: [
      {
        prompt: "Bonjour ! Vous avez choisi ?",
        hint: "Try: « Je voudrais un café, s'il vous plaît. » — use « je voudrais » to be polite.",
        keywords: [["voudrais", "aimerais", "veux", "prends", "donne"]],
      },
      {
        prompt: "Très bien, un café. Et comme pâtisserie ? Nous avons des croissants et du pain au chocolat.",
        hint: "Ask a question! Try « Qu'est-ce que vous recommandez ? » or order one: « Je vais prendre un croissant. »",
        keywords: [["croissant", "pain au chocolat", "recommande", "conseil", "prendre", "prenons", "qu'est", "quoi"]],
      },
      {
        prompt: "Excellent choix ! André : « (apporte les commandes) » — Voilà ! Ça vous plaît ?",
        hint: "Be polite: « C'est délicieux, merci ! » or « C'est très bon, merci. »",
        keywords: [["merci", "délicieux", "bon", "bien", "plaît", "parfait"]],
      },
      {
        prompt: "Je vous apporte l'addition tout de suite ? Ou vous restez encore un peu ?",
        hint: "Ask for the bill: « L'addition, s'il vous plaît. »",
        keywords: [["addition", "l'addition", "payer"]],
      },
    ],
  },
  {
    id: "rp-voisin",
    title: "Chez le voisin — petit problème",
    intro: "Your neighbour's music is too loud at midnight. Knock on the door, explain the problem politely, and find an arrangement. A B1 classic: complaints and negotiation.",
    turns: [
      {
        prompt: "(il ouvre la porte) Ah, bonsoir ! Qu'est-ce qui se passe ?",
        hint: "Explain politely: « Excusez-moi de vous déranger, mais la musique est très forte. »",
        keywords: [["déranger", "musique", "bruit", "fort", "désolé", "excusez", "pardon"]],
      },
      {
        prompt: "Ah pardon ! Je préparais une fête. C'est mon anniversaire.",
        hint: "Congratulate, then explain: « Bon anniversaire ! Mais je dois me lever tôt demain… »",
        keywords: [["anniversaire", "félicitations", "bon anniversaire", "tôt", "demain", "travail", "lever"]],
      },
      {
        prompt: "Je comprends… Qu'est-ce que vous me proposez ?",
        hint: "Make a suggestion: « Vous pourriez baisser la musique, s'il vous plaît ? »",
        keywords: [["pourriez", "pouvez", "baisser", "basse", "arrêter", "stop", "moins fort", "s'il"]],
      },
      {
        prompt: "D'accord, je baisse la musique. Encore désolé, et bonne nuit !",
        hint: "Close politely: « Pas de problème, bonne nuit ! » and maybe « merci ».",
        keywords: [["merci", "bonne nuit", "problème", "bonne soirée", "salut"]],
      },
    ],
  },
  {
    id: "rp-entretien",
    title: "Entretien d'embauche",
    intro: "A job interview at a small company in Lyon. Present yourself, talk about your qualities, and ask a question about the job. High-stakes politeness!",
    turns: [
      {
        prompt: "Bonjour, asseyez-vous. Parlez-moi un peu de vous.",
        hint: "Introduce yourself: « Je m'appelle… J'apprends le français… Je travaille dans… »",
        keywords: [["m'appelle", "je suis", "j'ai", "étudie", "travaille", "apprends"]],
      },
      {
        prompt: "Intéressant. Quelles sont vos qualités ? Et vos défauts ?",
        hint: "Try: « Je suis organisé et curieux. Mon défaut ? Je suis un peu trop perfectionniste. »",
        keywords: [["suis", "qualité", "défaut", "organisé", "curieux", "ponctuel", "travailleur", "timide"]],
      },
      {
        prompt: "D'accord. Pourquoi voulez-vous travailler avec nous ?",
        hint: "Give reasons: « Parce que votre entreprise… J'aime… Cela correspond à mon projet. »",
        keywords: [["parce que", "entreprise", "projet", "aime", "intér", "correspond", "valeur"]],
      },
      {
        prompt: "Avez-vous des questions pour moi ?",
        hint: "Ask something: « Quel est le salaire ? Quand commence le travail ? Comment se passe la formation ? »",
        keywords: [["?", "salaire", "horaires", "quand", "comment", "formation", "questions"]],
      },
    ],
  },
];

export type WritingPrompt = {
  id: string;
  title: string;
  levelnote: string;
  prompt: string;
  minWords: number;
  useful: string[];
  model: string;
};

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: "w-weekend",
    title: "Mon week-end idéal",
    levelnote: "≈140 mots",
    prompt:
      "Écrivez un texte sur votre week-end idéal : où irez-vous, avec qui, et pourquoi ? Utilisez le futur simple et le conditionnel (« j'aimerais », « je pourrais »).",
    minWords: 60,
    useful: ["j'aimerais", "d'abord", "ensuite", "enfin", "parce que", "pour"],
    model:
      "Mon week-end idéal commencerait le samedi matin. J'aimerais me promener au bord de la Seine et prendre un café en terrasse. Ensuite, je visiterais un musée parce que l'art me détend. Le soir, je dînnerais avec des amis dans un petit restaurant du quartier. Le dimanche, je pourrais rester à la maison, lire des livres et me reposer. Enfin, je préparerais mon sac pour la semaine. Ce week-end serait simple, mais parfait pour moi.",
  },
  {
    id: "w-lettre",
    title: "Lettre de réclamation",
    levelnote: "DELF B1 style — ≈160 mots",
    prompt:
      "Vous avez acheté une veste en ligne, mais elle est arrivée abîmée avec deux semaines de retard. Écrivez une lettre au service client : expliquez le problème, dites ce que vous avez déjà fait, et demandez une solution (remboursement ou échange).",
    minWords: 70,
    useful: ["Madame, Monsieur", "je vous écris", "malheureusement", "en effet", "je vous prie de", "vous remercier", "Cordialement"],
    model:
      "Madame, Monsieur,\n\nJe vous écris au sujet de la commande n° 4782 que j'ai passée le 3 mars. Malheureusement, la veste bleue que j'ai reçue est abîmée : la manche est déchirée et un bouton manque. En outre, la livraison a eu deux semaines de retard, alors que le site annonçait trois jours.\n\nJ'ai déjà contacté le service de livraison, mais personne ne m'a répondu. C'est pourquoi je vous demande de bien vouloir procéder à un échange ou, à défaut, à un remboursement.\n\nDans l'attente de votre réponse, je vous prie d'agréer mes salutations distinguées.\n\nCordialement,\nAlex",
  },
  {
    id: "w-avis",
    title: "Donner son opinion",
    levelnote: "≈120 mots",
    prompt:
      "Faut-il interdire les téléphones dans les écoles ? Donnez votre opinion avec des arguments (d'abord, ensuite, cependant, en conclusion). Utilisez le subjonctif au moins une fois (« il faut que », « je ne pense pas que »).",
    minWords: 60,
    useful: ["d'abord", "ensuite", "cependant", "en conclusion", "il faut que", "à mon avis"],
    model:
      "À mon avis, il faudrait limiter l'usage des téléphones dans les écoles, mais pas les interdire complètement. D'abord, les téléphones peuvent distraire les élèves pendant les cours. Ensuite, il est important que les jeunes apprennent à se concentrer sans écran. Cependant, les téléphones sont utiles pour vérifier des informations et pour parler avec les parents en cas d'urgence. En conclusion, une solution équilibrée serait meilleure qu'une interdiction totale : il faut que les écoles trouvent des règles claires.",
  },
];

export type ComprehensionText = {
  id: string;
  title: string;
  text: string;
  questions: { q: string; choices: string[]; answer: number }[];
};

export const READINGS: ComprehensionText[] = [
  {
    id: "c-paris",
    title: "Une promenade dans le Marais",
    text: `Dimanche dernier, Marion a décidé d'explorer à pied le quartier du Marais, à Paris. Il faisait gris, mais la pluie s'était arrêtée.
Elle a d'abord visité la place des Vosges, où un marché de livres anciens était installé. Elle a acheté un roman policier de 1970 pour trois euros. Ensuite, elle est entrée dans une petite galerie d'art où un peintre recréait des scènes de la vie parisienne.
À midi, elle s'est installée en terrasse. « Un thé au citron, s'il vous plaît », a-t-elle demandé au serveur, qui lui a souri. Elle a passé presque deux heures à observer les passants et à lire.
Le soir, dans le métro, elle a pensé qu'on n'a pas toujours besoin de partir loin pour profiter d'un beau dimanche.`,
    questions: [
      { q: "Quel temps faisait-il ?", choices: ["Il pleuvait fort", "Il faisait gris, sans pluie", "Il y avait un orage", "Il faisait très beau et chaud"], answer: 1 },
      { q: "Qu'est-ce que Marion a acheté ?", choices: ["Une peinture", "Un café", "Un vieux roman policier", "Un parapluie"], answer: 2 },
      { q: "Où a-t-elle déjeuné ?", choices: ["À la maison", "En terrasse", "Dans le métro", "À la galerie d'art"], answer: 1 },
      { q: "Quelle boisson a-t-elle commandée ?", choices: ["Un café noir", "Un chocolat chaud", "Un thé au citron", "Une limonade"], answer: 2 },
      { q: "Quelle est l'idée finale du texte ?", choices: ["Il faut voyager loin", "On peut profiter d'un dimanche près de chez soi", "Le Marais est trop touristique", "Le métro est fatigant"], answer: 1 },
    ],
  },
  {
    id: "c-travail",
    title: "Le télétravail, deux ans après",
    text: `Télétravail : vers un nouvel équilibre ?

Depuis la pandémie, beaucoup d'entreprises françaises ont adopté le télétravail. Selon une enquête récente, 45 % des salariés y passent au moins deux jours par semaine. Les avantages semblent clairs : pas de transport, plus de temps pour la famille, et des bureaux moins chers pour les employeurs.

Pourtant, certains experts restent prudents. Pour les jeunes salariés, apprendre un métier au téléphone est difficile. « On progresse en observant ses collègues », explique Marion Vasseur, responsable des ressources humaines. De plus, travailler de chez soi peut isoler : plusieurs entreprises ont même créé des journées obligatoires au bureau pour recréer du lien.

Finalement, la plupart des dirigeants ont choisi une solution intermédiaire : quelques jours à la maison, quelques jours à l'entreprise. Un équilibre fragile, mais que personne ne veut vraiment abandonner.`,
    questions: [
      { q: "Quel pourcentage de salariés travaillent au moins deux jours de chez eux ?", choices: ["10 %", "25 %", "45 %", "80 %"], answer: 2 },
      { q: "Quel avantage n'est PAS mentionné ?", choices: ["Moins de transport", "Des bureaux moins chers", "Plus de temps en famille", "Un salaire plus élevé"], answer: 3 },
      { q: "Quel est le problème pour les jeunes salariés ?", choices: ["Ils gagnent moins", "Ils apprennent difficilement à distance", "Ils n'aiment pas les bureaux", "Ils ont trop de réunions"], answer: 1 },
      { q: "Que faire des entreprises pour recréer du lien ?", choices: ["Supprimer le télétravail", "Organiser des journées obligatoires au bureau", "Augmenter les salaires", "Embaucher plus de monde"], answer: 1 },
      { q: "Quelle solution la plupart des dirigeants ont-ils choisie ?", choices: ["Le télétravail total", "Le retour au bureau complet", "Un système mixte", "Aucune décision"], answer: 2 },
    ],
  },
];

/* ---------- DELF B1 ---------- */

export type DelfTask = {
  id: string;
  section: "Production écrite" | "Production orale" | "Compréhension écrite" | "Compréhension orale";
  title: string;
  minutes: number;
  instructions: string;
  body?: string; // reading passage / transcript
  audioScript?: string; // played with speech synthesis
  questions?: { q: string; choices: string[]; answer: number }[];
  criteria: string[];
  model?: string;
};

export const DELF_TASKS: DelfTask[] = [
  {
    id: "d-ecrite-letter",
    section: "Production écrite",
    title: "Lettre à un ami (≈160 mots)",
    minutes: 25,
    instructions:
      "Votre ami français vient de s'installer dans votre ville. Écrivez-lui : 1) accueillez-le ; 2) conseillez-lui deux bons endroits ; 3) invitez-le à une activité. ≈160 mots.",
    criteria: ["Respect du sujet et des 3 points", "Vocabulaire varié (lieux, moments)", "Connecteurs : d'abord, ensuite, enfin", "Registre correct (tu / vous)"],
    model:
      "Salut Lucas !\n\nBienvenue dans ta nouvelle ville ! Tu vas voir, tu vas vite t'y plaire.\n\nD'abord, pour le matin, je te conseille la boulangerie de la place sainte-Claire : les tartes aux fraises sont incroyables. Ensuite, si tu aimes lire, la librairie Le Signet organise des rencontres avec des auteurs tous les mois.\n\nCe samedi, ma bande d'amies fait un pique-nique au bord de la rivière. Ça te dirait de venir ? On part vers midi près du pont. Dis-moi si tu es disponible !\n\nÀ très bientôt,\nThéo",
  },
  {
    id: "d-ecrite-avis",
    section: "Production écrite",
    title: "Votre avis (≈120 mots)",
    minutes: 20,
    instructions:
      "Sujet : « Les adolescents passent trop de temps sur les réseaux sociaux. » Donnez votre opinion en 120 mots environ, avec deux arguments et un contre-argument.",
    criteria: ["Opinion claire en introduction", "Connecteurs logiques", "Un contre-argument réel", "Conclusion personnelle"],
    model:
      "Je ne suis pas d'accord avec cette affirmation, du moins pas complètement. À mon avis, les réseaux sociaux font partie de la vie des jeunes, comme le téléphone faisait partie de la vie de leurs parents. D'abord, ils permettent de rester en contact avec des amis de partout, ce qui est précieux. Ensuite, beaucoup de jeunes y apprennent des choses : langues, cuisine, sports. Cependant, il est vrai qu'on peut y passer des heures sans s'en rendre compte et que cela fatigue les yeux et l'esprit. En conclusion, le problème n'est pas les réseaux eux-mêmes mais la manière dont on les utilise.",
  },
  {
    id: "d-oral-interview",
    section: "Production orale",
    title: "Entretien dirigé — votre quotidien",
    minutes: 5,
    instructions:
      "L'examinateur vous pose des questions sur votre quotidien. Préparez des réponses de 4-6 phrases sur : votre journée type, vos loisirs, vos projets. Utilisez l'enregistreur du navigateur ci-dessous pour vous entraîner, puis comparez vos idées au modèle.",
    criteria: ["Prononciation claire même si hésitante", "Phrases complètes (je… / nous…)", "Marqueurs de temps (d'habitude, le week-end)", "Interagir : « pardon ? », « vous pouvez répéter ? »"],
    model:
      "D'habitude, je me lève à sept heures et je prends un café pendant que j'écoute un podcast en français. Je travaille de neuf heures à cinq heures, avec une pause où je marche un peu. Le week-end, je fais de la natation et je voie mes amis au café. L'année prochaine, j'aimerais passer le DELF B1, alors j'étudie le français tous les jours un peu. Voilà, ma vie n'est pas spectaculaire, mais elle me plaît !",
  },
  {
    id: "d-cm-texte",
    section: "Compréhension écrite",
    title: "Comprendre un document : la musique au café-concert",
    minutes: 15,
    instructions: "Lisez le document une première fois, puis répondez aux 5 questions du QCM.",
    criteria: ["Compréhension globale du document", "Repérage d'informations précises", "Compréhension du vocabulaire en contexte"],
    body: `Le café-concert, né à Paris au XIXe siècle, est une tradition bien vivante. Dans ces petites salles, les artistes jouent à quelques mètres du public, qui applaudit, chante et parfois proteste gentiment quand la chanson ne plaît pas.

Selon Julien Barret, gérant du café Le Tambour, ce format résiste malgré la concurrence des grandes salles : « Les gens viennent pour la proximité. Vous voyez les mains du batteur, vous rigolez avec le chanteur. Un grand concert ne donne jamais ça. »

Mais la survie coûte cher. Beaucoup de cafés-concerts déclarent que sans la nouvelle aide de la ville — une subvention de 3 000 euros par trimestre pour les salles indépendantes — plusieurs établissements auraient déjà fermé. Pour Julien, l'avenir est clair : « Tant qu'il y aura des gens pour aimer la musique de près, on ouvrira nos portes. »`,
    questions: [
      { q: "Le café-concert est…", choices: ["une mode récente", "une tradition ancienne", "né au XXe siècle", "interdit à Paris"], answer: 1 },
      { q: "Pourquoi les clients viennent-ils selon Julien Barret ?", choices: ["Les prix sont bas", "La proximité avec les artistes", "Les boissons gratuites", "Les artistes célèbres"], answer: 1 },
      { q: "Quelle aide la ville propose-t-elle ?", choices: ["Un local gratuit", "3 000 € par trimestre", "500 € par mois", "Un festival"], answer: 1 },
      { q: "« Tant que » signifie ici :", choices: ["même si", "aussi longtemps que", "parce que", "si bien que"], answer: 1 },
      { q: "Quel problème menace les cafés-concerts ?", choices: ["Manque d'artistes", "Coût élevé de la survie", "Trop de tourisme", "Les grandes salles gratuites"], answer: 1 },
    ],
  },
  {
    id: "d-co-annonce",
    section: "Compréhension orale",
    title: "Écouter : annonce à la gare",
    minutes: 10,
    instructions:
      "Écoutez l'annonce (lecture automatique en français) droits jusqu'à deux fois, puis répondez. Cliquez sur ▶ pour écouter.",
    audioScript:
      "Mesdames et messieurs, votre attention, s'il vous plaît. Le train numéro 427 à destination de Lyon Part-Dieu, initialement prévu à 14 heures 15, subira un retard d'environ vingt minutes en raison d'une panne de signalisation près de Roanne. Le départ est donc repoussé à 14 heures 35, voie D. Les voyageurs à destination de Grenoble sont invités à se présenter au comptoir d'échanges. Nous vous prions de bien vouloir garder vos billets jusqu'à votre sortie de la gare. Merci de votre compréhension.",
    criteria: ["Compréhension de l'essentiel d'une annonce", "Repérage des horaires et des causes", "Compréhension des instructions"],
    questions: [
      { q: "Quel est le nouveau départ du train 427 ?", choices: ["14 h 15", "14 h 35", "14 h 20", "15 h 05"], answer: 1 },
      { q: "Quelle est la cause du retard ?", choices: ["Une grève", "Une panne de signalisation", "La pluie", "Un accident"], answer: 1 },
      { q: "Où les voyageurs pour Grenoble doivent-ils aller ?", choices: ["À la voie D", "Au comptoir d'échanges", "À la sortie", "Au restaurant"], answer: 1 },
      { q: "Que doit-on garder jusqu'à la sortie ?", choices: ["Sa valise", "Son billet", "Son téléphone", "Sa place debout"], answer: 1 },
    ],
  },
];
