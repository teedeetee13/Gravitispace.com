// Contenu traduit en français (cartes, signes, animaux du zodiaque, textes d'exemple…).
// Chargé uniquement quand on choisit le français. Mêmes clés que les données vietnamiennes.
// (Chaînes entre guillemets doubles pour garder les apostrophes françaises lisibles.)

const MAJOR = [
  ["Le Fou", "commencements, liberté, confiance dans le chemin", "imprudence, peur de commencer", "Il y a un pas que tu repousses seulement par peur de paraître naïf.", "Si personne ne te regardait, qu'essaierais-tu en premier ?"],
  ["Le Magicien", "savoir-faire, initiative, transformer les idées en réalité", "dispersion, doute sur tes capacités", "Tu as entre les mains plus que tu ne le crois.", "Nomme trois choses que tu possèdes et que tu n'as pas encore utilisées."],
  ["La Grande Prêtresse", "intuition, silence, ce qui est caché", "ignorer ta voix intérieure", "Parfois, la réponse attend déjà dans le silence.", "Si tout le bruit s'arrêtait, qu'entendrais-tu désirer ?"],
  ["L'Impératrice", "soin, abondance, créativité", "trop donner, s'oublier", "Tu prends si bien soin des autres. Et de toi ?", "Quelle petite chose pourrait te nourrir aujourd'hui ?"],
  ["L'Empereur", "structure, limites, stabilité", "rigidité, contrôle excessif", "La stabilité naît de limites claires.", "À quoi as-tu besoin de dire « non » pour te protéger ?"],
  ["Le Hiérophant", "tradition, guide, croyances", "sortir des conventions, ton propre chemin", "Certaines leçons de nos aînés méritent d'être entendues.", "Quel conseil reçu autrefois comprends-tu vraiment seulement aujourd'hui ?"],
  ["Les Amoureux", "choix du cœur, lien, valeurs", "déséquilibre, choisir par peur", "Chaque choix est un moment d'honnêteté avec toi-même.", "Choisis-tu par amour, ou par peur ?"],
  ["Le Chariot", "volonté, détermination, aller de l'avant", "perdre le cap, tiré dans plusieurs sens", "Tu es tiré·e dans plusieurs directions à la fois.", "Si tu ne gardais qu'une direction ce mois-ci, laquelle serait-ce ?"],
  ["La Force", "douceur, courage, patience", "te faire des reproches, manque de confiance", "La vraie force, c'est la douceur face à ce qui est difficile.", "Quelle part de toi a besoin de réconfort plutôt que de critique ?"],
  ["L'Ermite", "réflexion, solitude, quête intérieure", "isolement, fuite", "Être seul n'est pas la solitude : c'est se retrouver.", "Quand as-tu aimé pour la dernière fois être avec toi-même ?"],
  ["La Roue de Fortune", "cycles, changement, le bon moment", "résister au changement", "Tout tourne, le difficile comme le bon.", "Qu'est-ce qui semblait éternel et qui est pourtant passé ?"],
  ["La Justice", "équité, vérité, responsabilité", "être trop dur·e avec toi", "Es-tu plus sévère envers toi qu'envers les autres ?", "Si ton meilleur ami était à ta place, que lui dirais-tu ?"],
  ["Le Pendu", "pause, lâcher-prise, un nouveau point de vue", "retard, sentiment d'être bloqué", "S'arrêter n'est pas perdre.", "Si tu regardais cela de l'autre côté, que verrais-tu ?"],
  ["L'Arcane sans nom", "des fins qui ouvrent des commencements, renouveau", "s'accrocher à l'ancien", "Quelque chose est prêt à se refermer. Ce n'est pas un mauvais présage : c'est une porte.", "Qu'es-tu prêt·e à laisser partir ?"],
  ["Tempérance", "équilibre, harmonie, la juste mesure", "excès, déséquilibre", "Ni trop, ni trop peu.", "De quoi as-tu trop, et de quoi trop peu ?"],
  ["Le Diable", "attachements, habitudes, tentation", "se libérer, voir ses chaînes", "Certaines chaînes, nous les mettons nous-mêmes.", "Quelle habitude épuise ton énergie ?"],
  ["La Tour", "bouleversement soudain, éveil", "peur de l'effondrement, éviter la vérité", "Certaines choses tombent pour ouvrir le ciel.", "Qu'as-tu appris d'un effondrement passé ?"],
  ["L'Étoile", "espoir, guérison, paix", "perte de confiance, lassitude", "Après l'orage, il y a toujours une étoile.", "Quelle petite chose te donne de l'espoir aujourd'hui ?"],
  ["La Lune", "incertitude, intuition, peurs cachées", "la clarté qui revient, voir à travers l'illusion", "Toute obscurité n'est pas réelle.", "Parmi tes inquiétudes, lesquelles sont réelles et lesquelles imaginées ?"],
  ["Le Soleil", "joie, clarté, vitalité", "une joie un instant voilée", "Tu as le droit d'être heureux·se sans raison.", "Qu'est-ce qui fait sourire l'enfant en toi ?"],
  ["Le Jugement", "éveil, un appel, pardon", "te juger, douter", "Il y a un appel que tu entends depuis longtemps.", "Qui repousses-tu le moment de devenir ?"],
  ["Le Monde", "plénitude, accomplissement, intégration", "pas encore refermé, une pièce manquante", "Tu as parcouru un long chemin.", "Cite une chose que tu as accomplie et que peu de gens connaissent."],
];

const SUITS = {
  gay: { name: "Bâtons", element: "Feu", domain: "la passion, l'action et l'inspiration" },
  coc: { name: "Coupes", element: "Eau", domain: "les sentiments, l'amour et les relations" },
  kiem: { name: "Épées", element: "Air", domain: "les pensées, les paroles et la vérité" },
  tien: { name: "Deniers", element: "Terre", domain: "le travail, l'argent et le corps" },
};

// [rang, étape, question] — {d} = premier domaine de la série
const RANKS = [
  ["As", "la graine", "Quelle graine de {d} attend que tu la sèmes ?"],
  ["Deux", "choix et équilibre", "Quelles deux choses pèses-tu en ce qui concerne {d} ?"],
  ["Trois", "croissance", "Qu'est-ce qui grandit en toi du côté de {d} ?"],
  ["Quatre", "stabilité", "Pour {d}, que dois-tu tenir, et que dois-tu desserrer ?"],
  ["Cinq", "défi", "Quel défi autour de {d} t'apprend quelque chose ?"],
  ["Six", "rétablissement et harmonie", "Qu'est-ce qui guérit doucement du côté de {d} ?"],
  ["Sept", "réflexion et bilan", "En repensant à {d}, de quoi es-tu fier·ère ?"],
  ["Huit", "mouvement", "Où vas-tu avec {d} ?"],
  ["Neuf", "presque arrivé", "De quoi as-tu encore besoin pour finir le dernier tronçon de {d} ?"],
  ["Dix", "l'achèvement d'un cycle", "Quel cycle de {d} se referme ?"],
  ["Valet", "l'élève", "Qu'aimerais-tu apprendre sur {d} ?"],
  ["Cavalier", "celui qui agit", "Comment es-tu prêt·e à agir pour {d} ?"],
  ["Reine", "celle qui nourrit", "Comment pourrais-tu nourrir {d} ?"],
  ["Roi", "celui qui maîtrise", "À quoi ressemblerait pour toi la maîtrise de {d} ?"],
];

const MINOR_KEYS = {
  gay: [
    ["inspiration, nouveau départ, potentiel", "retard, manque de motivation"],
    ["planification, vision, décisions", "peur du changement, hésitation"],
    ["expansion, regard au loin, attente de résultats", "retards, obstacles"],
    ["célébration, foyer, harmonie", "instabilité, période de transition"],
    ["compétition, petits accrochages", "éviter le conflit, tension intérieure"],
    ["victoire, reconnaissance", "doute de soi, besoin d'être vu·e"],
    ["tenir bon, défendre ses convictions", "épuisement, envie d'abandonner"],
    ["vitesse, nouvelles, tout en mouvement", "ralentir, une hâte mal placée"],
    ["résilience, un dernier effort", "lassitude, trop sur la défensive"],
    ["fardeau, porter trop", "poser une partie, demander de l'aide"],
    ["curiosité, exploration, idées neuves", "manque de direction, agitation"],
    ["enthousiasme, aventure, audace", "impulsivité, précipitation"],
    ["confiance, chaleur, détermination", "manque de confiance, comparaison"],
    ["leadership, vision, inspirer les autres", "autoritarisme, attentes trop hautes"],
  ],
  coc: [
    ["sentiments nouveaux, émotion débordante", "retenir ses sentiments"],
    ["lien, accord, partenariat", "déséquilibre dans une relation"],
    ["amitié, célébration, communauté", "distance avec les amis, excès"],
    ["apathie, contemplation, ennui", "remarquer une nouvelle occasion"],
    ["perte, regret", "acceptation, aller de l'avant"],
    ["nostalgie, enfance, innocence", "rester dans le passé"],
    ["beaucoup d'options, rêveries", "voir clair, oser choisir"],
    ["partir en quête d'un sens plus profond", "peur de partir, hésitation"],
    ["contentement, un vœu exaucé", "satisfaction superficielle"],
    ["bonheur familial, plénitude", "éloignements, attentes qui ne concordent pas"],
    ["sensibilité, créativité, un message tendre", "immaturité émotionnelle"],
    ["romantisme, suivre ses idéaux", "illusion, sautes d'humeur"],
    ["empathie, intuition, écoute", "se perdre pour les autres"],
    ["équilibre émotionnel, générosité", "refoulement, difficulté à s'ouvrir"],
  ],
  kiem: [
    ["clarté, vérité, percée", "confusion, malentendu"],
    ["impasse, un choix difficile", "trop d'informations"],
    ["chagrin, blessure", "guérison, pardon"],
    ["repos, récupération", "épuisement, besoin de s'arrêter maintenant"],
    ["conflit, gagner et perdre", "réconciliation, mettre l'ego de côté"],
    ["transition, quitter les eaux agitées", "encore empêtré·e"],
    ["stratégie, garder des secrets", "aveu, écouter sa conscience"],
    ["se limiter soi-même, se sentir piégé·e", "libération, voir l'issue"],
    ["anxiété, insomnie, ruminations", "traverser la peur"],
    ["toucher le fond, une fin douloureuse", "renaissance, on ne peut que remonter"],
    ["curiosité, observation, soif d'apprendre", "parler avant de réfléchir"],
    ["décidé, esprit vif", "précipitation, paroles blessantes"],
    ["claire, indépendante, honnête", "froideur, fermeture"],
    ["raison, équité, transparence", "autoritarisme, rigidité"],
  ],
  tien: [
    ["nouvelle occasion, un départ solide", "occasion manquée, préparation insuffisante"],
    ["jongler, équilibrer beaucoup de choses", "surcharge, désordre"],
    ["collaboration, savoir-faire, travail d'équipe", "manque de coordination"],
    ["préserver, sécurité, épargne", "s'accrocher, peur de perdre"],
    ["difficulté, manque, se sentir exclu·e", "rétablissement, trouver de l'aide"],
    ["donner et recevoir, générosité", "dépendance, don déséquilibré"],
    ["patience, attendre la récolte", "impatience, douter de ses efforts"],
    ["pratique, assiduité, souci du détail", "perfectionnisme, monotonie"],
    ["autonomie, abondance, se récompenser", "dépendance, surmenage"],
    ["famille, héritage, ce qui dure", "instabilité financière"],
    ["apprentissage, nouveaux objectifs", "manque de concentration"],
    ["régulier, fiable, persévérant", "stagnation, routine rigide"],
    ["attentionnée, pratique, chaleureuse", "trop de soucis"],
    ["prospérité, stabilité, prévenance", "courir après le matériel"],
  ],
};

const card = {};
MAJOR.forEach(([name, up, rev, msg, q], i) => (card[`major-${String(i).padStart(2, '0')}`] = { name, up, rev, msg, q }));
for (const [suitId, s] of Object.entries(SUITS)) {
  RANKS.forEach(([rank, stage, qTpl], r) => {
    const [up, rev] = MINOR_KEYS[suitId][r];
    const de = /^[AEIOUÉ]/.test(s.name) ? "d'" : 'de ';
    card[`${suitId}-${String(r + 1).padStart(2, '0')}`] = {
      name: `${rank} ${de}${s.name}`,
      up,
      rev,
      msg: `Cette carte parle de ${s.domain}, à l'étape « ${stage} ». Élément : ${s.element}.`,
      q: qTpl.replace('{d}', s.domain.split(',')[0]),
    };
  });
}

const sign = {
  'bach-duong': { name: "Bélier", keywords: "courageux, direct, passionné", light: "Tu oses commencer pendant que les autres réfléchissent encore. Ton énergie entraîne tout le groupe.", shadow: "Impatient, s'enflamme et retombe vite, a du mal à attendre.", heal: "Quand il a mal, le Bélier se jette souvent dans l'action pour oublier. Accorde-toi une pause. S'arrêter n'est pas perdre.", element: "Feu", modality: "Cardinal", ruler: "Mars" },
  'kim-nguu': { name: "Taureau", keywords: "stable, fiable, amoureux de la beauté", light: "Tu es une ancre solide. Tu savoures les choses simples : un bon repas, une couverture chaude, la musique.", shadow: "Têtu, réticent au changement, accroché à la sécurité.", heal: "Le Taureau guérit par le corps : manger lentement, dormir assez, toucher la nature. Le changement peut venir lentement, pourvu qu'il vienne.", element: "Terre", modality: "Fixe", ruler: "Vénus" },
  'song-tu': { name: "Gémeaux", keywords: "curieux, souple, grand communicant", light: "Un esprit vif qui veut tout savoir et s'entend avec tout le monde.", shadow: "Dispersé, vite lassé, pense plus qu'il ne ressent.", heal: "Les Gémeaux ont besoin d'écrire. Quand ta tête devient bruyante, verse-la sur le papier. Tu n'as pas à répondre à toutes les questions aujourd'hui.", element: "Air", modality: "Mutable", ruler: "Mercure" },
  'cu-giai': { name: "Cancer", keywords: "protecteur, sensible, dévoué", light: "Tu es une « maison » pour beaucoup de gens. Intuition forte, longue mémoire, amour profond.", shadow: "Susceptible, se replie vite dans sa carapace, attaché au passé.", heal: "Le Cancer prend d'abord soin des autres. Aujourd'hui, sois une maison pour toi : cuisine quelque chose, appelle chez toi.", element: "Eau", modality: "Cardinal", ruler: "Lune" },
  'su-tu': { name: "Lion", keywords: "rayonnant, généreux, créatif", light: "Tu brilles naturellement. Un grand cœur fidèle qui fait que les autres se sentent vus.", shadow: "Besoin de reconnaissance, fier, a du mal à montrer sa vulnérabilité.", heal: "La valeur du Lion n'est pas dans les applaudissements. Tu es précieux·se même les jours où personne ne le remarque.", element: "Feu", modality: "Fixe", ruler: "Soleil" },
  'xu-nu': { name: "Vierge", keywords: "méticuleux, attentionné, serviable", light: "Tu remarques des détails que d'autres manquent et, sans bruit, tu rends tout meilleur.", shadow: "Perfectionniste, autocritique, s'inquiète pour des détails.", heal: "Chère Vierge, « assez bien », c'est bien. Note trois choses faites aujourd'hui avant de penser à ce qui reste.", element: "Terre", modality: "Mutable", ruler: "Mercure" },
  'thien-binh': { name: "Balance", keywords: "harmonieux, gracieux, juste", light: "Tu as l'œil pour la beauté, tu écoutes les deux parties et tu rassembles les gens.", shadow: "Indécis, cherche à plaire, craint le conflit.", heal: "Balance, mets-toi aussi sur le plateau. Dire « non » une fois ne fera pas basculer le monde.", element: "Air", modality: "Cardinal", ruler: "Vénus" },
  'bo-cap': { name: "Scorpion", keywords: "profond, intense, loyal", light: "Tu vois sous la surface. Quand tu fais confiance, c'est entièrement, et tu vas jusqu'au bout.", shadow: "Méfiant, secret, lent à lâcher les vieilles blessures.", heal: "Le Scorpion est le plus fort quand il ose s'adoucir. Pardonner n'est pas oublier : c'est ne plus avoir à porter.", element: "Eau", modality: "Fixe", ruler: "Pluton · Mars" },
  'nhan-ma': { name: "Sagittaire", keywords: "libre, optimiste, aventurier", light: "Tu apportes le rire et un regard large. Tu aimes apprendre, voyager et te poser les grandes questions.", shadow: "Fuit l'engagement, trop direct, a du mal à aller au bout.", heal: "On ne laisse pas toute tristesse derrière soi en partant en voyage. Parfois, le plus long voyage est de rester immobile avec soi-même.", element: "Feu", modality: "Mutable", ruler: "Jupiter" },
  'ma-ket': { name: "Capricorne", keywords: "discipliné, responsable, persévérant", light: "Tu montes pas à pas et abandonnes rarement. On te confie les choses difficiles.", shadow: "Exigeant, en fait trop, confond repos et paresse.", heal: "Capricorne, le repos fait partie de l'ascension. Tu n'as pas à mériter le droit de te reposer.", element: "Terre", modality: "Cardinal", ruler: "Saturne" },
  'bao-binh': { name: "Verseau", keywords: "indépendant, original, humaniste", light: "Tu penses en avance sur ton temps, tu te soucies de la communauté et être différent ne te dérange pas.", shadow: "Distant émotionnellement, obstiné, difficile à approcher.", heal: "Le Verseau aime le monde entier mais oublie de s'aimer. Laisse une personne s'approcher un peu plus.", element: "Air", modality: "Fixe", ruler: "Uranus · Saturne" },
  'song-ngu': { name: "Poissons", keywords: "rêveur, empathique, imaginatif", light: "Tu ressens la peine des autres et tu transformes l'émotion en art.", shadow: "Fuite dans le rêve, limites floues, porte la tristesse des autres.", heal: "Les Poissons ont besoin de limites comme les poissons d'une eau claire. Toute la tristesse que tu ressens n'est pas la tienne.", element: "Eau", modality: "Mutable", ruler: "Neptune · Jupiter" },
};

// Zodiaque vietnamien : Sửu est le Buffle d'eau et Mão est le Chat (et non le Lapin comme en Chine).
const chi = {
  'ty-chuot': { animal: "Rat", traits: "vif, débrouillard, économe, perspicace", shadow: "s'inquiète à l'avance, calcule parfois trop", heal: "Le Rat pense dix pas à l'avance. Aujourd'hui, pense seulement au suivant : le prochain pas, en douceur." },
  'suu-trau': { animal: "Buffle", traits: "travailleur, patient, fiable, constant", shadow: "porte tout seul, admet rarement sa fatigue", heal: "Même le buffle a besoin qu'on lui retire le joug. Tu as le droit d'être fatigué·e, et de le dire." },
  'dan-ho': { animal: "Tigre", traits: "brave, fort, intègre, protège les plus faibles", shadow: "s'emporte vite, n'aime pas être contrôlé", heal: "Un tigre n'est pas le plus fort quand il rugit, mais quand il se repose pour récupérer. Accorde-toi un moment d'immobilité." },
  'mao-meo': { animal: "Chat", traits: "raffiné, doux, plein de tact, aime la paix", shadow: "évite le conflit, se blesse facilement", heal: "Les chats savent trouver une tache de soleil bien chaude. Toi aussi : trouve aujourd'hui un coin sûr." },
  'thin-rong': { animal: "Dragon", traits: "confiant, énergique, ambitieux", shadow: "exige trop de lui-même", heal: "Un dragon n'a pas à voler chaque jour. Certains jours, il suffit de se blottir sous les nuages et de respirer." },
  'ty-ran': { animal: "Serpent", traits: "profond, sage, intuitif, discret", shadow: "cache ses sentiments, lent à faire confiance", heal: "Le serpent mue pour grandir. De quelle vieille peau es-tu prêt·e à te défaire ?" },
  'ngo-ngua': { animal: "Cheval", traits: "esprit libre, enthousiaste, indépendant, plein de vie", shadow: "impatient, vite lassé", heal: "Le cheval court mieux après avoir bu et s'être reposé. N'oublie pas de t'arrêter au relais." },
  'mui-de': { animal: "Chèvre", traits: "bienveillante, artiste, compatissante", shadow: "anxieuse, dépend de l'approbation", heal: "Ta douceur est un don, pas une faiblesse. Garde-en un peu pour toi." },
  'than-khi': { animal: "Singe", traits: "malin, drôle, créatif, adaptable", shadow: "cache sa tristesse derrière le rire", heal: "Tu n'as pas toujours à être celui ou celle qui fait rire tout le monde. Tu as le droit d'être triste devant quelqu'un." },
  'dau-ga': { animal: "Coq", traits: "assidu, franc, ordonné, ponctuel", shadow: "perfectionniste, sa franchise peut blesser", heal: "Le coq chante à l'heure chaque matin. Mais aujourd'hui, tu peux dormir un peu plus." },
  'tuat-cho': { animal: "Chien", traits: "loyal, droit, dévoué, protecteur", shadow: "s'inquiète pour les autres jusqu'à s'oublier", heal: "Tu veilles toujours sur les autres. Aujourd'hui, laisse quelqu'un veiller sur toi." },
  'hoi-lon': { animal: "Cochon", traits: "doux, généreux, sincère, aime la vie", shadow: "confiant, a du mal à dire non", heal: "Ta gentillesse a besoin d'une clôture. Refuser un service ne te rend pas moins gentil·le." },
};

const napAm = {
  'Hải Trung Kim': { meaning: "Or dans la mer" }, 'Lư Trung Hỏa': { meaning: "Feu dans le fourneau" }, 'Đại Lâm Mộc': { meaning: "Bois de la grande forêt" },
  'Lộ Bàng Thổ': { meaning: "Terre du bord du chemin" }, 'Kiếm Phong Kim': { meaning: "Or du fil de l'épée" }, 'Sơn Đầu Hỏa': { meaning: "Feu au sommet de la montagne" },
  'Giản Hạ Thủy': { meaning: "Eau du ravin" }, 'Thành Đầu Thổ': { meaning: "Terre des remparts" }, 'Bạch Lạp Kim': { meaning: "Or du chandelier" },
  'Dương Liễu Mộc': { meaning: "Bois de saule" }, 'Tuyền Trung Thủy': { meaning: "Eau de source" }, 'Ốc Thượng Thổ': { meaning: "Terre du toit" },
  'Tích Lịch Hỏa': { meaning: "Feu de la foudre" }, 'Tùng Bách Mộc': { meaning: "Bois de pin et de cyprès" }, 'Trường Lưu Thủy': { meaning: "Eau au long cours" },
  'Sa Trung Kim': { meaning: "Or dans le sable" }, 'Sơn Hạ Hỏa': { meaning: "Feu au pied de la montagne" }, 'Bình Địa Mộc': { meaning: "Bois de la plaine" },
  'Bích Thượng Thổ': { meaning: "Terre sur le mur" }, 'Kim Bạch Kim': { meaning: "Or mêlé d'argent" }, 'Phú Đăng Hỏa': { meaning: "Flamme de la lampe" },
  'Thiên Hà Thủy': { meaning: "Eau du ciel" }, 'Đại Trạch Thổ': { meaning: "Terre du grand marais" }, 'Thoa Xuyến Kim': { meaning: "Or des bijoux" },
  'Tang Đố Mộc': { meaning: "Bois de mûrier" }, 'Đại Khê Thủy': { meaning: "Eau du grand ruisseau" }, 'Sa Trung Thổ': { meaning: "Terre sablonneuse" },
  'Thiên Thượng Hỏa': { meaning: "Feu dans le ciel" }, 'Thạch Lựu Mộc': { meaning: "Bois de grenadier" }, 'Đại Hải Thủy': { meaning: "Eau du grand océan" },
};

const hanh = {
  'Kim': { name: "Métal", tone: "Blanc, gris, argent", trait: "Décidé, intègre, clair" },
  'Mộc': { name: "Bois", tone: "Vert", trait: "En croissance, bienveillant, expansif" },
  'Thủy': { name: "Eau", tone: "Noir, bleu", trait: "Souple, profond, sage" },
  'Hỏa': { name: "Feu", tone: "Rouge, rose, violet", trait: "Passionné, créatif, rayonnant" },
  'Thổ': { name: "Terre", tone: "Jaune, brun terre", trait: "Ancré, tolérant, fiable" },
};

const element = {
  'Lửa': { name: "Feu", desc: "Action, passion, enthousiasme" },
  'Đất': { name: "Terre", desc: "Pratique, endurant, stable" },
  'Khí': { name: "Air", desc: "Pensée, communication, lien" },
  'Nước': { name: "Eau", desc: "Émotion, intuition, empathie" },
};

const post = {
  'hd-001': { title: "J'ai tiré L'Étoile après le pire mois de mon année", body: "Le mois dernier, j'ai perdu mon travail, je me suis séparée et je suis tombée malade. Hier soir, j'ai tiré une carte pour m'amuser et c'est L'Étoile qui est sortie.\nJe ne crois pas qu'une carte puisse changer quoi que ce soit. Mais en regardant cette femme qui verse de l'eau sous un ciel étoilé, je me suis sentie autorisée à me reposer un instant, autorisée à croire que les choses guérissent, même lentement.", author: "Quelqu'un à Hanoï" },
  'hd-002': { title: "La carte de la « Mort » n'est pas un mauvais présage", body: "Beaucoup paniquent en tirant l'arcane XIII. En réalité, cette carte parle de transformation : une chose finit pour qu'une autre puisse commencer. Comme l'automne qui laisse tomber les feuilles pour que l'arbre bourgeonne à nouveau.\nSi tu la tires, demande-toi : « Qu'est-ce qui, dans ma vie, a expiré et que je retiens encore ? »", author: "Tire les cartes depuis 6 ans" },
  'hd-003': { title: "Capricorne, j'apprends à me reposer", body: "Toute ma vie, j'ai pensé que le repos était une récompense qu'on mérite après avoir tout fini. Mais la liste des choses à faire ne s'arrête jamais.\nCette année, j'ai commencé à planifier le repos comme je planifie les réunions. Curieusement, je travaille mieux. À tout Capricorne qui lit ceci : tu n'as pas à mériter le droit de te reposer.", author: "Capricorne, 31 ans" },
  'hd-004': { title: "L'année du Buffle et ne jamais dire « je suis fatiguée »", body: "Ma mère dit que les gens nés une année du Buffle sont destinés à travailler dur. Je ne crois pas au destin, mais j'avoue que j'en prends trop sur moi.\nRécemment, j'ai essayé quelque chose : demander de l'aide pour au moins une chose par semaine. La première fois, j'étais gênée. À la troisième, je me suis sentie tellement plus légère. En fait, le « travailler dur » venait en partie de ce que je ne laissais jamais personne m'aider.", author: "Quelqu'un né une année du Buffle" },
  'hd-005': { title: "", body: "À toi qui te sens seul·e : L'Ermite du tarot gravit la montagne seul, une lanterne à la main. Il n'est pas seul. Il retrouve le chemin vers lui-même.\nSi tu es seul·e aujourd'hui, vois-le comme une montée vers les sommets.", author: "Un·e inconnu·e" },
  'hd-006': { title: "Mercure rétrograde n'est pas une excuse", body: "À chaque rétrogradation de Mercure, les réseaux lui reprochent tout : disputes, objets perdus, rendez-vous manqués.\nJ'aime un autre regard : c'est un rappel pour ralentir, relire ses messages avant de les envoyer, revoir ses projets. L'astrologie est à son meilleur quand elle nous aide à vivre posément, pas quand elle nous fait peur.", author: "Un Verseau qui aime les cartes du ciel" },
  'hd-007': { title: "Qu'est-ce que l'élément nạp âm ? Un guide pour débuter", body: "Chaque année lunaire a un Tronc céleste et une Branche terrestre, comme Bính Ngọ. Les 60 combinaisons forment 30 paires, chacune avec un élément « nạp âm », comme Eau du ciel ou Feu dans le fourneau.\nC'est la manière dont les anciens utilisaient des images de la nature pour décrire le caractère. Lu comme un poème, c'est bien plus beau que lu comme une sentence.", author: "Celui qui écrit le calendrier" },
  'hd-008': { title: "J'ai tiré le Trois d'Épées trois fois de suite : qu'est-ce que ça veut dire ?", body: "J'ai posé une question sur l'amour et, cette semaine, le Trois d'Épées (un cœur transpercé de trois épées) est sorti trois fois. Ça vous est déjà arrivé ?\nJe sais que je suis triste. Peut-être que la carte dit simplement à voix haute ce que je n'ose pas admettre.", author: "Quelqu'un de triste" },
  'hd-009': { title: "", body: "À la personne qui a tiré trois fois le Trois d'Épées : la carte ne dit pas que tu auras mal pour toujours. Elle dit que la douleur est réelle et qu'elle a besoin d'être pleurée.\nQuand tu seras prêt·e, tire une carte de plus et demande : « De quoi ai-je besoin pour guérir ? » Change la question, et la carte change aussi.", author: "Quelqu'un qui a aussi tiré le Trois d'Épées" },
  'hd-010': { title: "Un Cancer loin de chez lui", body: "Dans ma quatrième année à Saïgon, ma maison me manque encore à chaque repas. En lisant sur le Cancer, j'ai compris pourquoi : pour un signe d'Eau gouverné par la Lune, le « chez-soi » n'est pas une adresse, mais un sentiment d'appartenance.\nAlors je me fais un « chez-moi » dans ma chambre en location : une marmite de soupe aigre chaque dimanche, un pot de basilic à la fenêtre.", author: "Un Cancer à Saïgon" },
  'hd-011': { title: "L'année de son propre animal porte-t-elle vraiment malheur ?", body: "L'an prochain, c'est l'année de mon animal et toute la famille me dit de faire attention. Je suis un peu inquiète. Comment s'est passée l'année de votre animal ?", author: "Quelqu'un qui approche l'année de son animal" },
  'hd-012': { title: "", body: "L'année de mon animal, j'ai changé de travail, déménagé et rencontré mon partenaire actuel. Il y a eu de grands changements, mais les changements ne sont pas toujours mauvais.\nJe crois que quand les aînés disent « fais attention », ils veulent dire vivre plus consciemment, pas vivre dans la peur.", author: "Quelqu'un qui est passé par là" },
  'hd-013': { title: "Quatre de Coupes : quand tout semble fade", body: "Le Quatre de Coupes montre une personne assise sous un arbre, les bras croisés, regardant trois coupes, sans voir la main qui lui en tend une quatrième.\nC'est la carte des jours où tout paraît sans saveur. Elle ne te blâme pas. Elle te rappelle simplement : quand tu seras prêt·e à lever les yeux, quelque chose de nouveau t'attend.", author: "Tire les cartes depuis 6 ans" },
  'hd-014': { title: "", body: "À mes compagnons Poissons : toute la tristesse que vous ressentez n'est pas la vôtre. Vous absorbez les émotions des autres comme une éponge.\nCe soir, prends une douche chaude et imagine que l'eau emporte les sentiments qui ne t'appartiennent pas.", author: "Un autre Poissons" },
  'hd-015': { title: "Un tirage « deux chemins » quand j'hésitais à démissionner", body: "J'ai posé trois cartes : rester a donné Le Pendu, partir a donné le Sept de Deniers, et ce que sait mon cœur a donné Le Soleil.\nJe l'ai lu ainsi : rester, c'est rester en suspens ; partir demande de la patience jusqu'à la récolte ; et mon cœur veut vivre dans la joie. Les cartes n'ont pas décidé à ma place, mais elles m'ont aidée à dire ce que je savais déjà.", author: "Employée de bureau, 28 ans" },
  'hd-016': { title: "Soleil, Lune, Ascendant : quelle différence ?", body: "Ton signe solaire (celui que tu cites d'habitude) est ta nature profonde. Ton signe lunaire est ton monde émotionnel intérieur, la façon dont tu as besoin d'être aimé·e. Ton Ascendant est la première impression que les autres ont de toi.\nSi tu as l'impression de « ne pas trop ressembler à ton signe », c'est peut-être ta Lune ou ton Ascendant qui parlent.", author: "Un Verseau qui aime les cartes du ciel" },
  'hd-017': { title: "Le Vietnam a le Chat, la Chine a le Lapin", body: "Une chose que j'adore : dans le zodiaque vietnamien, Mão est le Chat, et non le Lapin.\nLes personnes nées une année du Chat sont décrites comme raffinées, éprises de paix, sachant trouver une tache de soleil bien chaude. Aujourd'hui, c'est exactement ce que j'ai fait : un coin ensoleillé et un livre.", author: "Née une année Quý Mão" },
  'hd-018': { title: "", body: "La carte de La Force ne montre pas un guerrier. Elle montre une femme qui ferme doucement la gueule d'un lion.\nSi tu luttes contre toi-même aujourd'hui, essaie la douceur. La vraie force est une douceur qui n'abandonne pas.", author: "Un·e inconnu·e à Huế" },
  'hd-019': { title: "Est-ce vraiment difficile pour un Scorpion de pardonner ?", body: "Je suis Scorpion et ça me touche douloureusement. Quand quelqu'un me blesse, je m'en souviens longtemps. Un Scorpion a-t-il appris à lâcher prise ? Partagez, s'il vous plaît.", author: "Un Scorpion de novembre" },
  'hd-020': { title: "", body: "Au Scorpion qui a posé la question : il m'a fallu trois ans pour comprendre que pardonner ne veut pas dire revenir, ni oublier.\nPardonner, c'est poser le fardeau, parce que tu mérites de marcher plus léger. Tu peux pardonner et tout de même fermer la porte.", author: "Un Scorpion qui est passé par là" },
  'hd-021': { title: "À 30 ans, j'ai tiré Le Fou", body: "Je comptais reprendre mes études à 30 ans et tout le monde disait qu'il était trop tard. Ce jour-là, j'ai tiré Le Fou : quelqu'un qui marche insouciant au bord d'une falaise, un petit chien trottinant derrière.\nJ'ai choisi de le lire comme « vas-y, c'est bien d'être un peu fou ». Aujourd'hui, je suis en deuxième année, la plus âgée de la promo, et la plus heureuse.", author: "Une étudiante de presque 30 ans" },
  'hd-022': { title: "Trios harmonieux et quatre opposés : pas faits pour diviser", body: "Les trios harmonieux (comme Singe, Rat, Dragon) et les quatre opposés (comme Rat, Cheval, Chat, Coq) sont la façon dont les anciens regroupaient les 12 animaux en ensembles accordés ou « en tension ».\nBeaucoup s'en servent pour interdire l'amour. Je préfère ce regard : « en tension » signifie deux points de vue différents qui ont besoin de plus d'écoute. Aucun couple ne naît pour échouer.", author: "Celui qui écrit le calendrier" },
  'hd-023': { title: "Quatre d'Épées : la carte qui te laisse te reposer", body: "Un chevalier est étendu, immobile, dans une chapelle, trois épées au mur et une sous lui. C'est la carte de la récupération.\nSi tu la tires, l'univers (ou toi-même) te dit : pas besoin de te battre aujourd'hui. Dors.", author: "Tire les cartes depuis 6 ans" },
  'hd-024': { title: "La Vierge et la liste du « fait »", body: "J'écris toujours des listes de choses à faire, puis je m'en veux de ne pas les finir. Une amie Poissons m'a suggéré d'écrire aussi la liste de « ce que j'ai fait aujourd'hui ».\nEn la relisant au bout d'une semaine, j'ai failli pleurer : j'avais fait tellement de choses.", author: "Une Vierge perfectionniste" },
};

const topic = { 'tarot': { label: "Tarot" }, 'chiem-tinh': { label: "Astrologie" }, 'tu-vi': { label: "Tử Vi" } };
const type = {
  'trai-bai': { label: "Tirage" }, 'giai-nghia': { label: "Signification" }, 'chia-se': { label: "Témoignage" }, 'hoi-dap': { label: "Question" }, 'loi-nhan': { label: "Mot" },
};
const spread = {
  'mot-la': { name: "Une carte pour aujourd'hui", positions: ["Un message pour toi"] },
  'ba-la': { name: "Passé · Présent · Futur", positions: ["Ce qui est passé", "Ce qui est", "Ce qui peut venir"] },
  'chua-lanh': { name: "Tirage pour guérir", positions: ["Ce qui te fait mal", "Ce que tu peux lâcher", "Ce qui te nourrit"] },
  'lua-chon': { name: "Deux chemins", positions: ["Si tu choisis A", "Si tu choisis B", "Ce que sait ton cœur"] },
  'celtic-cross': {
    name: "Croix celtique (10 cartes)",
    positions: ["Ton présent", "Ce qui te met au défi", "La base profonde", "Ce qui s'éloigne", "Ce que tu vises", "Ce qui approche", "Comment tu te vois", "Ton entourage", "Espoirs et craintes", "Là où l'énergie s'ouvre"],
  },
};
const hotline = {
  '115': { name: "Urgences médicales (Vietnam)", note: "En cas de danger de mort immédiat" },
  '096 306 1414': { name: "Ligne Ngày Mai (Vietnam)", note: "Soutien psychologique pour les personnes en crise" },
  '111': { name: "Ligne nationale de protection de l'enfance (Vietnam)", note: "Pour les moins de 18 ans" },
  'findahelpline': { name: "Find A Helpline", note: "Lignes d'écoute gratuites dans plus de 130 pays (France 3114, Belgique, Suisse, Canada…)" },
};

export default { card, suit: SUITS, sign, chi, napAm, hanh, element, post, topic, type, spread, hotline };
