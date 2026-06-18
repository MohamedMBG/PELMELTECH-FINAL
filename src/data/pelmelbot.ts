export type PelmelBotOption = {
  label: string;
  icon?: string;
  next: string;
};

export type PelmelBotStep = {
  message: string;
  options: PelmelBotOption[];
  enableInput?: boolean;
};

export const PELMELBOT_CONTACT = {
  phonePrimary: "+212 6 60 40 08 81",
  phoneSecondary: "+212 5 20 73 71 32",
  email: "pelmeltechpurchasing@gmail.com",
  whatsApp: "+212 6 60 40 08 81",
  whatsAppUrl:
    "https://wa.me/212660400881?text=Bonjour%20PelmelTech%2C%20je%20souhaite%20un%20conseil%20pour%20une%20machine%20d%27impression.",
};

const contactDetails =
  "Téléphone : +212 6 60 40 08 81\nTéléphone : +212 5 20 73 71 32\nEmail : pelmeltechpurchasing@gmail.com\nWhatsApp : +212 6 60 40 08 81";

const contactOptions: PelmelBotOption[] = [
  { label: "Contacter le responsable commercial", icon: "phone", next: "CONTACT_MANAGER" },
  { label: "Recommencer", icon: "rotateCcw", next: "WELCOME" },
];

const recommendationOptions: PelmelBotOption[] = [
  { label: "Oui, je suis intéressé(e)", icon: "thumbsUp", next: "CONTACT_MANAGER" },
  { label: "J'ai une question", icon: "helpCircle", next: "FALLBACK_1" },
  { label: "Mon besoin est différent", icon: "rotateCcw", next: "FALLBACK_1" },
];

export const PELMELBOT_TREE: Record<string, PelmelBotStep> = {
  WELCOME: {
    message:
      "Bonjour ! Je suis PelmelBot, votre assistant PelmelTech.\nJe suis là pour vous aider à trouver la machine d'impression idéale selon vos besoins !\n\nQue souhaitez-vous imprimer ?",
    options: [
      { label: "Vêtements (T-shirts, hoodies...)", icon: "shirt", next: "A_Q2" },
      { label: "Objets rigides (bois, verre, métal...)", icon: "box", next: "B_DEF" },
      { label: "Affiches grand format", icon: "maximize", next: "D_Q2" },
      { label: "Petits objets personnalisés", icon: "gift", next: "C_Q2" },
      { label: "Découpe vinyle / autocollants", icon: "scissors", next: "E_Q2" },
      { label: "Étiquettes / Crystal label", icon: "tag", next: "C2_Q2" },
      { label: "Presse à chaud / thermocollage", icon: "flame", next: "H_DEF" },
      { label: "Découpe matériaux (carton, mousse...)", icon: "package", next: "F_Q2" },
      { label: "Plastification / finition", icon: "layers", next: "G_Q2" },
    ],
  },

  A_Q2: {
    message: "Quel type de production textile souhaitez-vous faire ?",
    options: [
      { label: "T-shirts coton avec rendu direct", icon: "shirt", next: "REC_DTG_4050" },
      { label: "Transferts DTF en petite largeur", icon: "printer", next: "REC_DTF_30" },
      { label: "Production DTF régulière en 60 cm", icon: "printer", next: "REC_DTF_60" },
      { label: "Je ne sais pas encore", icon: "helpCircle", next: "FALLBACK_INPUT" },
    ],
  },
  REC_DTG_4050: {
    message:
      "Je vous recommande la DTG 4050 / LC-4050.\nElle convient aux impressions textiles directes avec un rendu précis sur vêtements.\nPour valider le modèle exact, contactez notre responsable commercial.",
    options: recommendationOptions,
  },
  REC_DTF_30: {
    message:
      "Je vous recommande la DTF 30cm TD-A3.\nElle est adaptée aux transferts textile en petite largeur, avec une production souple.\nSouhaitez-vous être conseillé(e) sur la configuration ?",
    options: recommendationOptions,
  },
  REC_DTF_60: {
    message:
      "Je vous recommande la DTF 60cm Deluxejet6502.\nElle convient mieux aux ateliers qui veulent produire des transferts DTF en volume.\nSouhaitez-vous parler à un responsable commercial ?",
    options: recommendationOptions,
  },

  B_DEF: {
    message: "Quelle taille d'objets rigides souhaitez-vous imprimer ?",
    options: [
      { label: "Petits et moyens objets", icon: "box", next: "REC_UV_6090" },
      { label: "Objets plus grands ou séries variées", icon: "maximize", next: "REC_UV_1290" },
      { label: "Panneaux ou grande production", icon: "factory", next: "REC_UV_2513" },
      { label: "Je ne sais pas encore", icon: "helpCircle", next: "FALLBACK_INPUT" },
    ],
  },
  REC_UV_6090: {
    message:
      "Je vous recommande l'UV Flatbed 6090.\nElle est adaptée aux objets rigides comme bois, verre, métal, acrylique et cadeaux personnalisés.\nSouhaitez-vous confirmer votre application ?",
    options: recommendationOptions,
  },
  REC_UV_1290: {
    message:
      "Je vous recommande l'UV Flatbed 1290.\nElle offre une zone plus confortable pour objets rigides et petites séries professionnelles.\nUn responsable peut vérifier la compatibilité de vos supports.",
    options: recommendationOptions,
  },
  REC_UV_2513: {
    message:
      "Je vous recommande l'UV Flatbed 2513 / MT-UV2513 / MT-UV2513S.\nElle convient aux panneaux, supports rigides et production grand format.\nSouhaitez-vous être rappelé(e) ?",
    options: recommendationOptions,
  },

  C_Q2: {
    message: "Quel type de petits objets personnalisés souhaitez-vous produire ?",
    options: [
      { label: "Stickers UV DTF et petits transferts", icon: "tag", next: "REC_UV_DTF_A3" },
      { label: "Production UV DTF en rouleau", icon: "printer", next: "REC_UV_DTF_700" },
      { label: "Objets à imprimer à plat", icon: "box", next: "REC_FC7090U" },
      { label: "Autre besoin", icon: "penLine", next: "FALLBACK_INPUT" },
    ],
  },
  REC_UV_DTF_A3: {
    message:
      "Je vous recommande l'UV DTF LC-303 A3.\nElle est adaptée aux stickers, logos et petits transferts décoratifs.\nPour les consommables, notre responsable peut vous guider.",
    options: recommendationOptions,
  },
  REC_UV_DTF_700: {
    message:
      "Je vous recommande l'UV DTF 700mm LC-703U.\nElle convient aux ateliers qui produisent des stickers UV DTF en largeur plus importante.\nSouhaitez-vous une orientation commerciale ?",
    options: recommendationOptions,
  },
  REC_FC7090U: {
    message:
      "Je vous recommande la FC7090U.\nElle est adaptée aux applications UV compactes et aux objets personnalisés.\nUn responsable peut confirmer le meilleur choix selon vos supports.",
    options: recommendationOptions,
  },

  C2_Q2: {
    message: "Quel volume d'étiquettes ou Crystal Label souhaitez-vous produire ?",
    options: [
      { label: "Petites séries et formats compacts", icon: "tag", next: "REC_UV_DTF_A3" },
      { label: "Production en largeur 700 mm", icon: "ruler", next: "REC_UV_DTF_700" },
      { label: "Je veux un conseil personnalisé", icon: "phone", next: "CONTACT_MANAGER" },
    ],
  },

  D_Q2: {
    message: "Quelle largeur grand format recherchez-vous ?",
    options: [
      { label: "Environ 1800 mm", icon: "ruler", next: "D_Q3_1800" },
      { label: "Environ 3200 mm", icon: "ruler", next: "D_Q3_3200" },
      { label: "Je ne sais pas encore", icon: "helpCircle", next: "FALLBACK_INPUT" },
    ],
  },
  D_Q3_1800: {
    message: "Quel type de technologie préférez-vous pour cette largeur ?",
    options: [
      { label: "Éco-solvant pour affiches et vinyle", icon: "droplet", next: "REC_ECO_1800" },
      { label: "UV roll-to-roll pour supports variés", icon: "zap", next: "REC_UV_RTR_1800" },
    ],
  },
  D_Q3_3200: {
    message: "Quel niveau de production visez-vous en 3200 mm ?",
    options: [
      { label: "Production éco-solvant standard", icon: "droplet", next: "REC_ECO_3200" },
      { label: "Production éco-solvant intensive", icon: "factory", next: "REC_ECO_XLINE" },
      { label: "Production UV grand format", icon: "zap", next: "REC_DELUXEJET3200U" },
    ],
  },
  REC_ECO_1800: {
    message:
      "Je vous recommande l'Éco-Solvant 1800 mm.\nElle convient aux affiches, vinyles, bannières et signalétique grand format.\nSouhaitez-vous un accompagnement commercial ?",
    options: recommendationOptions,
  },
  REC_UV_RTR_1800: {
    message:
      "Je vous recommande l'UV Roll-to-Roll 1800 mm.\nElle est adaptée aux supports souples variés avec séchage UV immédiat.\nUn responsable peut valider les supports compatibles.",
    options: recommendationOptions,
  },
  REC_ECO_3200: {
    message:
      "Je vous recommande l'Éco-Solvant 3200 mm.\nElle convient aux grands visuels, bâches et panneaux souples.\nSouhaitez-vous être orienté(e) vers le bon modèle ?",
    options: recommendationOptions,
  },
  REC_ECO_XLINE: {
    message:
      "Je vous recommande l'Éco-Solvant Xline.\nElle vise une production grand format plus soutenue avec une bonne stabilité.\nNotre responsable peut préciser la configuration.",
    options: recommendationOptions,
  },
  REC_DELUXEJET3200U: {
    message:
      "Je vous recommande la Deluxejet3200U.\nElle convient à la production UV grand format en largeur 3200 mm.\nSouhaitez-vous parler à un responsable commercial ?",
    options: recommendationOptions,
  },

  E_Q2: {
    message: "Quelle largeur de découpe vinyle recherchez-vous ?",
    options: [
      { label: "720 mm", icon: "ruler", next: "REC_EH_720TS" },
      { label: "1350 mm", icon: "ruler", next: "REC_EH_1350TS" },
      { label: "1750 mm", icon: "ruler", next: "REC_EH_1750TS" },
      { label: "Découpe avec caméra CCD", icon: "scanLine", next: "REC_EN49CCD" },
      { label: "Traceur compact polyvalent", icon: "printer", next: "REC_L6" },
    ],
  },
  REC_EH_720TS: {
    message:
      "Je vous recommande l'EH-720TS.\nElle convient aux autocollants, lettrages et petites productions vinyle.\nSouhaitez-vous confirmer votre usage ?",
    options: recommendationOptions,
  },
  REC_EH_1350TS: {
    message:
      "Je vous recommande l'EH-1350TS.\nElle offre une largeur plus confortable pour signalétique, vinyle et autocollants.\nUn responsable peut vous guider.",
    options: recommendationOptions,
  },
  REC_EH_1750TS: {
    message:
      "Je vous recommande l'EH-1750TS.\nElle convient aux besoins de découpe vinyle en grande largeur.\nSouhaitez-vous être contacté(e) ?",
    options: recommendationOptions,
  },
  REC_EN49CCD: {
    message:
      "Je vous recommande l'EN49CCD.\nSa caméra aide à repérer les repères de coupe pour stickers et étiquettes imprimés.\nSouhaitez-vous valider ce choix ?",
    options: recommendationOptions,
  },
  REC_L6: {
    message:
      "Je vous recommande le L6.\nC'est une solution compacte pour découpe vinyle et travaux de signalétique courants.\nUn responsable peut vérifier votre besoin.",
    options: recommendationOptions,
  },

  F_Q2: {
    message: "Quel matériau souhaitez-vous découper ?",
    options: [
      { label: "Cuir, acrylique, bois ou tissu", icon: "zap", next: "REC_LASER" },
      { label: "Carton, mousse, PVC ou EVA", icon: "scissors", next: "F_Q3_CNC" },
    ],
  },
  F_Q3_CNC: {
    message: "Quelle zone de travail CNC recherchez-vous ?",
    options: [
      { label: "1600 x 2500 mm", icon: "ruler", next: "REC_CNC_1625" },
      { label: "1800 x 2500 mm", icon: "ruler", next: "REC_CNC_1825" },
      { label: "Format compact 500 x 700 mm", icon: "ruler", next: "REC_FC5070E" },
      { label: "Format compact 700 x 900 mm", icon: "ruler", next: "REC_FC7090E" },
    ],
  },
  REC_LASER: {
    message:
      "Je vous recommande la Laser SH-G1390.\nElle convient à la découpe et gravure du bois, acrylique, cuir, tissu et matériaux similaires.\nSouhaitez-vous être conseillé(e) ?",
    options: recommendationOptions,
  },
  REC_CNC_1625: {
    message:
      "Je vous recommande la CNC 1625PAS.\nElle convient à la découpe automatique de carton, mousse, PVC et supports d'emballage.\nUn responsable peut valider vos matériaux.",
    options: recommendationOptions,
  },
  REC_CNC_1825: {
    message:
      "Je vous recommande la CNC 1825PAS.\nElle offre une zone plus grande pour découpe automatique de matériaux souples et semi-rigides.\nSouhaitez-vous un conseil commercial ?",
    options: recommendationOptions,
  },
  REC_FC5070E: {
    message:
      "Je vous recommande la FC5070E.\nElle convient aux petits formats de découpe automatique et aux prototypes.\nSouhaitez-vous vérifier la compatibilité ?",
    options: recommendationOptions,
  },
  REC_FC7090E: {
    message:
      "Je vous recommande la FC7090E.\nElle convient aux découpes compactes avec une zone de travail plus confortable.\nUn responsable peut confirmer le modèle.",
    options: recommendationOptions,
  },

  G_Q2: {
    message: "Quel besoin de finition avez-vous ?",
    options: [
      { label: "Protéger affiches et impressions", icon: "layers", next: "REC_L2_1700" },
      { label: "Lamination grand format", icon: "layers", next: "REC_L2_1700" },
      { label: "Je veux un conseil personnalisé", icon: "phone", next: "CONTACT_MANAGER" },
    ],
  },
  REC_L2_1700: {
    message:
      "Je vous recommande la plastifieuse L2-1700.\nElle protège les impressions et apporte une finition brillante ou mate professionnelle.\nSouhaitez-vous un accompagnement commercial ?",
    options: recommendationOptions,
  },

  H_DEF: {
    message: "Pour quel usage souhaitez-vous une presse à chaud ?",
    options: [
      { label: "Fixer des transferts DTF", icon: "flame", next: "REC_PRESSE_CHAUD" },
      { label: "Fixer des impressions DTG", icon: "flame", next: "REC_PRESSE_CHAUD" },
      { label: "Sublimation textile ou objets", icon: "flame", next: "REC_PRESSE_CHAUD" },
      { label: "Badges, patches ou flocage", icon: "flame", next: "REC_PRESSE_CHAUD" },
    ],
  },
  REC_PRESSE_CHAUD: {
    message:
      "Je vous recommande la Presse à chaud pneumatique 60x40.\nElle applique chaleur et pression pour transferts DTF, DTG, sublimation et flocage.\nSouhaitez-vous être orienté(e) ?",
    options: recommendationOptions,
  },

  PRIX: {
    message:
      "Pour une demande de devis précise, notre responsable commercial vous répondra directement.\nJe ne peux pas afficher de prix dans le chat.\n\n" +
      contactDetails,
    options: [{ label: "Retour aux machines", icon: "rotateCcw", next: "WELCOME" }],
  },
  SAV: {
    message:
      "Pour le SAV, la maintenance ou une réparation, contactez notre équipe avec le modèle de votre machine.\nPrécisez aussi la nature du problème et la garantie si possible.\n\n" +
      contactDetails,
    options: [{ label: "Retour aux machines", icon: "rotateCcw", next: "WELCOME" }],
  },
  CONTACT_MANAGER: {
    message:
      "Parfait. Notre responsable commercial peut vous conseiller et valider la bonne configuration.\nVoici les coordonnées PelmelTech :\n\n" +
      contactDetails,
    options: [{ label: "Poser une autre question", icon: "rotateCcw", next: "WELCOME" }],
  },
  FALLBACK_1: {
    message: "Pas de souci. Quel cas ressemble le plus à votre besoin ?",
    options: [
      { label: "Je veux imprimer sur textile", icon: "shirt", next: "A_Q2" },
      { label: "Je veux imprimer sur objet rigide", icon: "box", next: "B_DEF" },
      { label: "Je veux de l'impression grand format", icon: "maximize", next: "D_Q2" },
      { label: "Autre - je décris mon besoin", icon: "penLine", next: "FALLBACK_INPUT" },
    ],
  },
  FALLBACK_INPUT: {
    message: "Décrivez votre projet en quelques mots.\nSi votre demande concerne un devis ou le SAV, je vous orienterai directement.",
    options: [],
    enableInput: true,
  },
  FALLBACK_2: {
    message:
      "Votre projet mérite un conseil personnalisé.\nNotre responsable commercial vous répondra avec la bonne orientation.\n\n" +
      contactDetails,
    options: contactOptions,
  },
};

export const PELMELBOT_PRICE_KEYWORDS = [
  "prix",
  "tarif",
  "devis",
  "combien",
  "budget",
  "coût",
  "cout",
  "cher",
];

export const PELMELBOT_SAV_KEYWORDS = [
  "panne",
  "sav",
  "maintenance",
  "réparation",
  "reparation",
  "garantie",
  "technicien",
  "problème",
  "probleme",
];
