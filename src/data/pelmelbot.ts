export type PelmelBotLocale = "en" | "fr" | "ar";

export type PelmelBotOption = {
  label: string;
  icon?: string;
  next: string;
};

export type PelmelBotStep = {
  message: string;
  options: PelmelBotOption[];
  enableInput?: boolean;
  productSlug?: string;
};

export type PelmelBotUi = {
  onlineStatus: string;
  closeLabel: string;
  messagesLabel: string;
  typingLabel: string;
  contactLinksLabel: string;
  contactDetails: string;
  contactPhoneLabel: string;
  contactEmailLabel: string;
  contactWhatsAppLabel: string;
  callLabel: string;
  recommendationLabel: string;
  recommendationPrefix: string;
  viewProductLabel: string;
  inputPlaceholderEnabled: string;
  inputPlaceholderDisabled: string;
  inputLabel: string;
  sendLabel: string;
  sendAriaLabel: string;
  whatsAppMessage: string;
};

export type PelmelBotContent = {
  tree: Record<string, PelmelBotStep>;
  priceKeywords: string[];
  savKeywords: string[];
  ui: PelmelBotUi;
};

export const PELMELBOT_CONTACT = {
  phonePrimary: "0660400881",
  email: "pelmeltechpurchasing@gmail.com",
  whatsApp: "0660400881",
};

const whatsAppBaseUrl = "https://wa.me/212660400881?text=";

export function getPelmelBotWhatsAppUrl(message: string) {
  return `${whatsAppBaseUrl}${encodeURIComponent(message)}`;
}

function opt(label: string, icon: string, next: string): PelmelBotOption {
  return { label, icon, next };
}

function buildContent(
  ui: PelmelBotUi,
  t: {
    contactManager: string;
    restart: string;
    yesInterested: string;
    question: string;
    differentNeed: string;
    backToMachines: string;
    anotherQuestion: string;
    messages: Record<string, string>;
    options: Record<string, PelmelBotOption[]>;
    priceKeywords: string[];
    savKeywords: string[];
  },
): PelmelBotContent {
  const contactOptions = [
    opt(t.contactManager, "phone", "CONTACT_MANAGER"),
    opt(t.restart, "rotateCcw", "WELCOME"),
  ];

  const recommendationOptions = [
    opt(t.yesInterested, "thumbsUp", "CONTACT_MANAGER"),
    opt(t.question, "helpCircle", "FALLBACK_1"),
    opt(t.differentNeed, "rotateCcw", "FALLBACK_1"),
  ];

  const rec = (message: string, productSlug?: string): PelmelBotStep => ({
    message,
    options: recommendationOptions,
    productSlug,
  });

  return {
    ui,
    priceKeywords: t.priceKeywords,
    savKeywords: t.savKeywords,
    tree: {
      WELCOME: { message: t.messages.WELCOME, options: t.options.WELCOME },
      A_Q2: { message: t.messages.A_Q2, options: t.options.A_Q2 },
      REC_DTG_4050: rec(t.messages.REC_DTG_4050, "machine-d-impression-dtg-direct-to-garment-4050-2-tetes-epson-i3200"),
      REC_DTF_30: rec(t.messages.REC_DTF_30, "machine-d-impression-dtf-30cm-2-tetes-epson-i3200-xp600"),
      REC_DTF_60: rec(t.messages.REC_DTF_60, "machine-d-impression-dtf-60cm-2-tetes-epson-i3200-xp600"),
      B_DEF: { message: t.messages.B_DEF, options: t.options.B_DEF },
      REC_UV_6090: rec(t.messages.REC_UV_6090, "machine-d-impression-uv-flatbed-de-table-6090-3-tetes-epson-i3200-xp600"),
      REC_UV_1290: rec(t.messages.REC_UV_1290, "machine-d-impression-uv-flatbed-1290-3-tetes-epson-i3200"),
      REC_UV_2513: rec(t.messages.REC_UV_2513, "machine-d-impression-uv-flatbed-2513-tetes-ricoh-gen5-gen6"),
      C_Q2: { message: t.messages.C_Q2, options: t.options.C_Q2 },
      REC_UV_DTF_A3: rec(t.messages.REC_UV_DTF_A3, "machine-d-impression-uv-dtf-30cm-tetes-epson-i3200-xp600"),
      REC_UV_DTF_700: rec(t.messages.REC_UV_DTF_700, "machine-d-impression-uv-dtf-roll-to-roll-700mm-3-tetes-epson-i3200-u1"),
      REC_FC7090U: rec(t.messages.REC_FC7090U, "table-de-decoupe-a-plat-flatbed-fc7090u"),
      C2_Q2: { message: t.messages.C2_Q2, options: t.options.C2_Q2 },
      D_Q2: { message: t.messages.D_Q2, options: t.options.D_Q2 },
      D_Q3_1800: { message: t.messages.D_Q3_1800, options: t.options.D_Q3_1800 },
      D_Q3_3200: { message: t.messages.D_Q3_3200, options: t.options.D_Q3_3200 },
      REC_ECO_1800: rec(t.messages.REC_ECO_1800, "machine-d-impression-eco-solvant-1800mm-1-ou-2-tetes-epson-i3200"),
      REC_UV_RTR_1800: rec(t.messages.REC_UV_RTR_1800, "machine-d-impression-easyjet-uv-roll-to-roll-1800mm-2-tetes-epson-i3200"),
      REC_ECO_3200: rec(t.messages.REC_ECO_3200, "machine-d-impression-eco-solvant-3200mm-2-ou-4-tetes-epson-i3200"),
      REC_ECO_XLINE: rec(t.messages.REC_ECO_XLINE, "machine-d-impression-eco-solvant-xline-3200mm-4-tetes-epson-i3200"),
      REC_DELUXEJET3200U: rec(t.messages.REC_DELUXEJET3200U),
      E_Q2: { message: t.messages.E_Q2, options: t.options.E_Q2 },
      REC_EH_720TS: rec(t.messages.REC_EH_720TS),
      REC_EH_1350TS: rec(t.messages.REC_EH_1350TS),
      REC_EH_1750TS: rec(t.messages.REC_EH_1750TS),
      REC_EN49CCD: rec(t.messages.REC_EN49CCD, "machine-de-decoupe-1200mm-avec-camera-ccd"),
      REC_L6: rec(t.messages.REC_L6),
      F_Q2: { message: t.messages.F_Q2, options: t.options.F_Q2 },
      F_Q3_CNC: { message: t.messages.F_Q3_CNC, options: t.options.F_Q3_CNC },
      REC_LASER: rec(t.messages.REC_LASER, "machine-decoupe-laser-co2-1390-avec-camera-ccd-une-tete-130w-150w"),
      REC_CNC_1625: rec(t.messages.REC_CNC_1625, "machine-decoupe-cnc-1600x2500mm-fraiseuse"),
      REC_CNC_1825: rec(t.messages.REC_CNC_1825),
      REC_FC5070E: rec(t.messages.REC_FC5070E, "table-de-decoupe-a-plat-flatbed-fc5070e"),
      REC_FC7090E: rec(t.messages.REC_FC7090E),
      G_Q2: { message: t.messages.G_Q2, options: t.options.G_Q2 },
      REC_L2_1700: rec(t.messages.REC_L2_1700, "lamineuse-electrique-industrielle-1630mm"),
      H_DEF: { message: t.messages.H_DEF, options: t.options.H_DEF },
      REC_PRESSE_CHAUD: rec(t.messages.REC_PRESSE_CHAUD, "presse-a-chaud-pneumatique-60x40cm"),
      PRIX: {
        message: `${t.messages.PRIX}\n\n${ui.contactDetails}`,
        options: [opt(t.backToMachines, "rotateCcw", "WELCOME")],
      },
      SAV: {
        message: `${t.messages.SAV}\n\n${ui.contactDetails}`,
        options: [opt(t.backToMachines, "rotateCcw", "WELCOME")],
      },
      CONTACT_MANAGER: {
        message: `${t.messages.CONTACT_MANAGER}\n\n${ui.contactDetails}`,
        options: [opt(t.anotherQuestion, "rotateCcw", "WELCOME")],
      },
      FALLBACK_1: { message: t.messages.FALLBACK_1, options: t.options.FALLBACK_1 },
      FALLBACK_INPUT: {
        message: t.messages.FALLBACK_INPUT,
        options: [],
        enableInput: true,
      },
      FALLBACK_2: {
        message: `${t.messages.FALLBACK_2}\n\n${ui.contactDetails}`,
        options: contactOptions,
      },
    },
  };
}

const enUi: PelmelBotUi = {
  onlineStatus: "Online - PelmelTech Assistant",
  closeLabel: "Close PelmelBot chat",
  messagesLabel: "Chat messages",
  typingLabel: "PelmelBot is typing",
  contactLinksLabel: "PelmelTech contact details",
  contactDetails:
    "Phone: 0660400881\nEmail: pelmeltechpurchasing@gmail.com\nWhatsApp: 0660400881",
  contactPhoneLabel: "Phone:",
  contactEmailLabel: "Email:",
  contactWhatsAppLabel: "WhatsApp:",
  callLabel: "Call",
  recommendationLabel: "Recommendation",
  recommendationPrefix: "I recommend",
  viewProductLabel: "View this machine",
  inputPlaceholderEnabled: "Describe your need...",
  inputPlaceholderDisabled: 'Input is available only for "Other"',
  inputLabel: "Describe your need",
  sendLabel: "Send",
  sendAriaLabel: "Send your message",
  whatsAppMessage:
    "Hello PelmelTech, I would like advice for choosing a printing machine.",
};

const frUi: PelmelBotUi = {
  onlineStatus: "En ligne - Assistant PelmelTech",
  closeLabel: "Fermer le chat PelmelBot",
  messagesLabel: "Messages du chat",
  typingLabel: "PelmelBot écrit",
  contactLinksLabel: "Coordonnées PelmelTech",
  contactDetails:
    "Téléphone : 0660400881\nEmail : pelmeltechpurchasing@gmail.com\nWhatsApp : 0660400881",
  contactPhoneLabel: "Téléphone :",
  contactEmailLabel: "Email :",
  contactWhatsAppLabel: "WhatsApp :",
  callLabel: "Appeler",
  recommendationLabel: "Recommandation",
  recommendationPrefix: "Je vous recommande",
  viewProductLabel: "Voir cette machine",
  inputPlaceholderEnabled: "Décrivez votre besoin...",
  inputPlaceholderDisabled: "Saisie disponible uniquement pour « Autre »",
  inputLabel: "Décrire votre besoin",
  sendLabel: "Envoyer",
  sendAriaLabel: "Envoyer votre message",
  whatsAppMessage:
    "Bonjour PelmelTech, je souhaite un conseil pour une machine d'impression.",
};

const arUi: PelmelBotUi = {
  onlineStatus: "متصل - مساعد PelmelTech",
  closeLabel: "إغلاق محادثة PelmelBot",
  messagesLabel: "رسائل المحادثة",
  typingLabel: "PelmelBot يكتب",
  contactLinksLabel: "بيانات التواصل مع PelmelTech",
  contactDetails:
    "الهاتف: 0660400881\nالبريد الإلكتروني: pelmeltechpurchasing@gmail.com\nواتساب: 0660400881",
  contactPhoneLabel: "الهاتف:",
  contactEmailLabel: "البريد الإلكتروني:",
  contactWhatsAppLabel: "واتساب:",
  callLabel: "اتصال",
  recommendationLabel: "التوصية",
  recommendationPrefix: "أنصحك بـ",
  viewProductLabel: "عرض هذه الآلة",
  inputPlaceholderEnabled: "صف حاجتك...",
  inputPlaceholderDisabled: "الإدخال متاح فقط عند اختيار «أخرى»",
  inputLabel: "صف حاجتك",
  sendLabel: "إرسال",
  sendAriaLabel: "إرسال رسالتك",
  whatsAppMessage:
    "مرحبًا PelmelTech، أريد نصيحة لاختيار آلة طباعة.",
};

const en = buildContent(enUi, {
  contactManager: "Contact the sales manager",
  restart: "Start over",
  yesInterested: "Yes, I am interested",
  question: "I have a question",
  differentNeed: "My need is different",
  backToMachines: "Back to machines",
  anotherQuestion: "Ask another question",
  priceKeywords: ["price", "pricing", "quote", "cost", "budget", "expensive", "cheap"],
  savKeywords: ["support", "maintenance", "repair", "warranty", "technician", "problem", "issue", "service"],
  messages: {
    WELCOME:
      "Hello! I am PelmelBot, your PelmelTech assistant.\nI am here to help you find the right printing machine for your needs.\n\nWhat would you like to print?",
    A_Q2: "What type of textile production do you want to do?",
    REC_DTG_4050:
      "I recommend the DTG 4050 / LC-4050.\nIt is suitable for direct textile printing with precise results on garments.\nTo confirm the exact model, contact our sales manager.",
    REC_DTF_30:
      "I recommend the DTF 30cm TD-A3.\nIt is suitable for small-width textile transfers and flexible production.\nWould you like advice on the configuration?",
    REC_DTF_60:
      "I recommend the DTF 60cm Deluxejet6502.\nIt is better suited for workshops that want to produce DTF transfers in volume.\nWould you like to speak with a sales manager?",
    B_DEF: "What size rigid objects do you want to print?",
    REC_UV_6090:
      "I recommend the UV Flatbed 6090.\nIt is suitable for rigid objects such as wood, glass, metal, acrylic, and personalized gifts.\nWould you like to confirm your application?",
    REC_UV_1290:
      "I recommend the UV Flatbed 1290.\nIt offers a more comfortable work area for rigid objects and small professional runs.\nA manager can check compatibility with your materials.",
    REC_UV_2513:
      "I recommend the UV Flatbed 2513 / MT-UV2513 / MT-UV2513S.\nIt is suitable for panels, rigid media, and large-format production.\nWould you like a call back?",
    C_Q2: "What type of small personalized objects do you want to produce?",
    REC_UV_DTF_A3:
      "I recommend the UV DTF LC-303 A3.\nIt is suitable for stickers, logos, and small decorative transfers.\nFor consumables, our manager can guide you.",
    REC_UV_DTF_700:
      "I recommend the UV DTF 700mm LC-703U.\nIt suits workshops producing UV DTF stickers at a larger width.\nWould you like sales guidance?",
    REC_FC7090U:
      "I recommend the FC7090U.\nIt is suitable for compact UV applications and personalized objects.\nA manager can confirm the best choice for your materials.",
    C2_Q2: "What volume of labels or Crystal Label do you want to produce?",
    D_Q2: "What large-format width are you looking for?",
    D_Q3_1800: "Which technology do you prefer for this width?",
    D_Q3_3200: "What production level are you targeting at 3200 mm?",
    REC_ECO_1800:
      "I recommend the Eco-Solvent 1800 mm.\nIt is suitable for posters, vinyl, banners, and large-format signage.\nWould you like commercial support?",
    REC_UV_RTR_1800:
      "I recommend the UV Roll-to-Roll 1800 mm.\nIt is suitable for varied flexible media with immediate UV curing.\nA manager can validate compatible materials.",
    REC_ECO_3200:
      "I recommend the Eco-Solvent 3200 mm.\nIt is suitable for large visuals, tarpaulins, and flexible panels.\nWould you like help choosing the right model?",
    REC_ECO_XLINE:
      "I recommend the Eco-Solvent Xline.\nIt targets sustained large-format production with good stability.\nOur manager can specify the configuration.",
    REC_DELUXEJET3200U:
      "I recommend the Deluxejet3200U.\nIt is suitable for UV large-format production at 3200 mm width.\nWould you like to speak with a sales manager?",
    E_Q2: "What vinyl cutting width are you looking for?",
    REC_EH_720TS:
      "I recommend the EH-720TS.\nIt is suitable for stickers, lettering, and small vinyl production.\nWould you like to confirm your usage?",
    REC_EH_1350TS:
      "I recommend the EH-1350TS.\nIt offers a more comfortable width for signage, vinyl, and stickers.\nA manager can guide you.",
    REC_EH_1750TS:
      "I recommend the EH-1750TS.\nIt suits wide-format vinyl cutting needs.\nWould you like to be contacted?",
    REC_EN49CCD:
      "I recommend the EN49CCD.\nIts camera helps detect cutting marks for printed stickers and labels.\nWould you like to validate this choice?",
    REC_L6:
      "I recommend the L6.\nIt is a compact solution for vinyl cutting and common signage work.\nA manager can check your need.",
    F_Q2: "What material do you want to cut?",
    F_Q3_CNC: "What CNC working area are you looking for?",
    REC_LASER:
      "I recommend the Laser SH-G1390.\nIt is suitable for cutting and engraving wood, acrylic, leather, fabric, and similar materials.\nWould you like advice?",
    REC_CNC_1625:
      "I recommend the CNC 1625PAS.\nIt is suitable for automatic cutting of cardboard, foam, PVC, and packaging media.\nA manager can validate your materials.",
    REC_CNC_1825:
      "I recommend the CNC 1825PAS.\nIt offers a larger area for automatic cutting of flexible and semi-rigid materials.\nWould you like sales advice?",
    REC_FC5070E:
      "I recommend the FC5070E.\nIt is suitable for small-format automatic cutting and prototypes.\nWould you like to check compatibility?",
    REC_FC7090E:
      "I recommend the FC7090E.\nIt is suitable for compact cutting with a more comfortable working area.\nA manager can confirm the model.",
    G_Q2: "What finishing need do you have?",
    REC_L2_1700:
      "I recommend the L2-1700 laminator.\nIt protects prints and adds a professional gloss or matte finish.\nWould you like commercial support?",
    H_DEF: "What will you use the heat press for?",
    REC_PRESSE_CHAUD:
      "I recommend the 60x40 pneumatic heat press.\nIt applies heat and pressure for DTF, DTG, sublimation, and flock transfers.\nWould you like guidance?",
    PRIX:
      "For an accurate quote request, our sales manager will answer you directly.\nI cannot display prices in the chat.",
    SAV:
      "For after-sales service, maintenance, or repair, contact our team with your machine model.\nAlso describe the issue and warranty status if possible.",
    CONTACT_MANAGER:
      "Perfect. Our sales manager can advise you and validate the right configuration.\nHere are PelmelTech's contact details:",
    FALLBACK_1: "No problem. Which case is closest to your need?",
    FALLBACK_INPUT:
      "Describe your project in a few words.\nIf your request concerns a quote or after-sales service, I will direct you immediately.",
    FALLBACK_2:
      "Your project deserves personalized advice.\nOur sales manager will answer with the right direction.",
  },
  options: {
    WELCOME: [
      opt("Clothing (T-shirts, hoodies...)", "shirt", "A_Q2"),
      opt("Rigid objects (wood, glass, metal...)", "box", "B_DEF"),
      opt("Large-format posters", "maximize", "D_Q2"),
      opt("Small personalized objects", "gift", "C_Q2"),
      opt("Vinyl cutting / stickers", "scissors", "E_Q2"),
      opt("Labels / Crystal label", "tag", "C2_Q2"),
      opt("Heat press / heat transfer", "flame", "H_DEF"),
      opt("Material cutting (cardboard, foam...)", "package", "F_Q2"),
      opt("Lamination / finishing", "layers", "G_Q2"),
    ],
    A_Q2: [
      opt("Cotton T-shirts with direct printing", "shirt", "REC_DTG_4050"),
      opt("Small-width DTF transfers", "printer", "REC_DTF_30"),
      opt("Regular 60 cm DTF production", "printer", "REC_DTF_60"),
      opt("I am not sure yet", "helpCircle", "FALLBACK_INPUT"),
    ],
    B_DEF: [
      opt("Small and medium objects", "box", "REC_UV_6090"),
      opt("Larger objects or varied runs", "maximize", "REC_UV_1290"),
      opt("Panels or high production", "factory", "REC_UV_2513"),
      opt("I am not sure yet", "helpCircle", "FALLBACK_INPUT"),
    ],
    C_Q2: [
      opt("UV DTF stickers and small transfers", "tag", "REC_UV_DTF_A3"),
      opt("Roll UV DTF production", "printer", "REC_UV_DTF_700"),
      opt("Flat objects to print", "box", "REC_FC7090U"),
      opt("Other need", "penLine", "FALLBACK_INPUT"),
    ],
    C2_Q2: [
      opt("Small runs and compact formats", "tag", "REC_UV_DTF_A3"),
      opt("700 mm width production", "ruler", "REC_UV_DTF_700"),
      opt("I want personalized advice", "phone", "CONTACT_MANAGER"),
    ],
    D_Q2: [
      opt("Around 1800 mm", "ruler", "D_Q3_1800"),
      opt("Around 3200 mm", "ruler", "D_Q3_3200"),
      opt("I am not sure yet", "helpCircle", "FALLBACK_INPUT"),
    ],
    D_Q3_1800: [
      opt("Eco-solvent for posters and vinyl", "droplet", "REC_ECO_1800"),
      opt("UV roll-to-roll for varied media", "zap", "REC_UV_RTR_1800"),
    ],
    D_Q3_3200: [
      opt("Standard eco-solvent production", "droplet", "REC_ECO_3200"),
      opt("Intensive eco-solvent production", "factory", "REC_ECO_XLINE"),
      opt("Large-format UV production", "zap", "REC_DELUXEJET3200U"),
    ],
    E_Q2: [
      opt("720 mm", "ruler", "REC_EH_720TS"),
      opt("1350 mm", "ruler", "REC_EH_1350TS"),
      opt("1750 mm", "ruler", "REC_EH_1750TS"),
      opt("Cutting with CCD camera", "scanLine", "REC_EN49CCD"),
      opt("Compact multipurpose plotter", "printer", "REC_L6"),
    ],
    F_Q2: [
      opt("Leather, acrylic, wood, or fabric", "zap", "REC_LASER"),
      opt("Cardboard, foam, PVC, or EVA", "scissors", "F_Q3_CNC"),
    ],
    F_Q3_CNC: [
      opt("1600 x 2500 mm", "ruler", "REC_CNC_1625"),
      opt("1800 x 2500 mm", "ruler", "REC_CNC_1825"),
      opt("Compact 500 x 700 mm", "ruler", "REC_FC5070E"),
      opt("Compact 700 x 900 mm", "ruler", "REC_FC7090E"),
    ],
    G_Q2: [
      opt("Protect posters and prints", "layers", "REC_L2_1700"),
      opt("Large-format lamination", "layers", "REC_L2_1700"),
      opt("I want personalized advice", "phone", "CONTACT_MANAGER"),
    ],
    H_DEF: [
      opt("Fix DTF transfers", "flame", "REC_PRESSE_CHAUD"),
      opt("Fix DTG prints", "flame", "REC_PRESSE_CHAUD"),
      opt("Textile or object sublimation", "flame", "REC_PRESSE_CHAUD"),
      opt("Badges, patches, or flocking", "flame", "REC_PRESSE_CHAUD"),
    ],
    FALLBACK_1: [
      opt("I want to print on textile", "shirt", "A_Q2"),
      opt("I want to print on a rigid object", "box", "B_DEF"),
      opt("I need large-format printing", "maximize", "D_Q2"),
      opt("Other - I will describe my need", "penLine", "FALLBACK_INPUT"),
    ],
  },
});

const fr = buildContent(frUi, {
  contactManager: "Contacter le responsable commercial",
  restart: "Recommencer",
  yesInterested: "Oui, je suis intéressé(e)",
  question: "J'ai une question",
  differentNeed: "Mon besoin est différent",
  backToMachines: "Retour aux machines",
  anotherQuestion: "Poser une autre question",
  priceKeywords: ["prix", "tarif", "devis", "combien", "budget", "coût", "cout", "cher"],
  savKeywords: ["panne", "sav", "maintenance", "réparation", "reparation", "garantie", "technicien", "problème", "probleme"],
  messages: {
    WELCOME:
      "Bonjour ! Je suis PelmelBot, votre assistant PelmelTech.\nJe suis là pour vous aider à trouver la machine d'impression idéale selon vos besoins !\n\nQue souhaitez-vous imprimer ?",
    A_Q2: "Quel type de production textile souhaitez-vous faire ?",
    REC_DTG_4050:
      "Je vous recommande la DTG 4050 / LC-4050.\nElle convient aux impressions textiles directes avec un rendu précis sur vêtements.\nPour valider le modèle exact, contactez notre responsable commercial.",
    REC_DTF_30:
      "Je vous recommande la DTF 30cm TD-A3.\nElle est adaptée aux transferts textile en petite largeur, avec une production souple.\nSouhaitez-vous être conseillé(e) sur la configuration ?",
    REC_DTF_60:
      "Je vous recommande la DTF 60cm Deluxejet6502.\nElle convient mieux aux ateliers qui veulent produire des transferts DTF en volume.\nSouhaitez-vous parler à un responsable commercial ?",
    B_DEF: "Quelle taille d'objets rigides souhaitez-vous imprimer ?",
    REC_UV_6090:
      "Je vous recommande l'UV Flatbed 6090.\nElle est adaptée aux objets rigides comme bois, verre, métal, acrylique et cadeaux personnalisés.\nSouhaitez-vous confirmer votre application ?",
    REC_UV_1290:
      "Je vous recommande l'UV Flatbed 1290.\nElle offre une zone plus confortable pour objets rigides et petites séries professionnelles.\nUn responsable peut vérifier la compatibilité de vos supports.",
    REC_UV_2513:
      "Je vous recommande l'UV Flatbed 2513 / MT-UV2513 / MT-UV2513S.\nElle convient aux panneaux, supports rigides et production grand format.\nSouhaitez-vous être rappelé(e) ?",
    C_Q2: "Quel type de petits objets personnalisés souhaitez-vous produire ?",
    REC_UV_DTF_A3:
      "Je vous recommande l'UV DTF LC-303 A3.\nElle est adaptée aux stickers, logos et petits transferts décoratifs.\nPour les consommables, notre responsable peut vous guider.",
    REC_UV_DTF_700:
      "Je vous recommande l'UV DTF 700mm LC-703U.\nElle convient aux ateliers qui produisent des stickers UV DTF en largeur plus importante.\nSouhaitez-vous une orientation commerciale ?",
    REC_FC7090U:
      "Je vous recommande la FC7090U.\nElle est adaptée aux applications UV compactes et aux objets personnalisés.\nUn responsable peut confirmer le meilleur choix selon vos supports.",
    C2_Q2: "Quel volume d'étiquettes ou Crystal Label souhaitez-vous produire ?",
    D_Q2: "Quelle largeur grand format recherchez-vous ?",
    D_Q3_1800: "Quel type de technologie préférez-vous pour cette largeur ?",
    D_Q3_3200: "Quel niveau de production visez-vous en 3200 mm ?",
    REC_ECO_1800:
      "Je vous recommande l'Éco-Solvant 1800 mm.\nElle convient aux affiches, vinyles, bannières et signalétique grand format.\nSouhaitez-vous un accompagnement commercial ?",
    REC_UV_RTR_1800:
      "Je vous recommande l'UV Roll-to-Roll 1800 mm.\nElle est adaptée aux supports souples variés avec séchage UV immédiat.\nUn responsable peut valider les supports compatibles.",
    REC_ECO_3200:
      "Je vous recommande l'Éco-Solvant 3200 mm.\nElle convient aux grands visuels, bâches et panneaux souples.\nSouhaitez-vous être orienté(e) vers le bon modèle ?",
    REC_ECO_XLINE:
      "Je vous recommande l'Éco-Solvant Xline.\nElle vise une production grand format plus soutenue avec une bonne stabilité.\nNotre responsable peut préciser la configuration.",
    REC_DELUXEJET3200U:
      "Je vous recommande la Deluxejet3200U.\nElle convient à la production UV grand format en largeur 3200 mm.\nSouhaitez-vous parler à un responsable commercial ?",
    E_Q2: "Quelle largeur de découpe vinyle recherchez-vous ?",
    REC_EH_720TS:
      "Je vous recommande l'EH-720TS.\nElle convient aux autocollants, lettrages et petites productions vinyle.\nSouhaitez-vous confirmer votre usage ?",
    REC_EH_1350TS:
      "Je vous recommande l'EH-1350TS.\nElle offre une largeur plus confortable pour signalétique, vinyle et autocollants.\nUn responsable peut vous guider.",
    REC_EH_1750TS:
      "Je vous recommande l'EH-1750TS.\nElle convient aux besoins de découpe vinyle en grande largeur.\nSouhaitez-vous être contacté(e) ?",
    REC_EN49CCD:
      "Je vous recommande l'EN49CCD.\nSa caméra aide à repérer les repères de coupe pour stickers et étiquettes imprimés.\nSouhaitez-vous valider ce choix ?",
    REC_L6:
      "Je vous recommande le L6.\nC'est une solution compacte pour découpe vinyle et travaux de signalétique courants.\nUn responsable peut vérifier votre besoin.",
    F_Q2: "Quel matériau souhaitez-vous découper ?",
    F_Q3_CNC: "Quelle zone de travail CNC recherchez-vous ?",
    REC_LASER:
      "Je vous recommande la Laser SH-G1390.\nElle convient à la découpe et gravure du bois, acrylique, cuir, tissu et matériaux similaires.\nSouhaitez-vous être conseillé(e) ?",
    REC_CNC_1625:
      "Je vous recommande la CNC 1625PAS.\nElle convient à la découpe automatique de carton, mousse, PVC et supports d'emballage.\nUn responsable peut valider vos matériaux.",
    REC_CNC_1825:
      "Je vous recommande la CNC 1825PAS.\nElle offre une zone plus grande pour découpe automatique de matériaux souples et semi-rigides.\nSouhaitez-vous un conseil commercial ?",
    REC_FC5070E:
      "Je vous recommande la FC5070E.\nElle convient aux petits formats de découpe automatique et aux prototypes.\nSouhaitez-vous vérifier la compatibilité ?",
    REC_FC7090E:
      "Je vous recommande la FC7090E.\nElle convient aux découpes compactes avec une zone de travail plus confortable.\nUn responsable peut confirmer le modèle.",
    G_Q2: "Quel besoin de finition avez-vous ?",
    REC_L2_1700:
      "Je vous recommande la plastifieuse L2-1700.\nElle protège les impressions et apporte une finition brillante ou mate professionnelle.\nSouhaitez-vous un accompagnement commercial ?",
    H_DEF: "Pour quel usage souhaitez-vous une presse à chaud ?",
    REC_PRESSE_CHAUD:
      "Je vous recommande la Presse à chaud pneumatique 60x40.\nElle applique chaleur et pression pour transferts DTF, DTG, sublimation et flocage.\nSouhaitez-vous être orienté(e) ?",
    PRIX:
      "Pour une demande de devis précise, notre responsable commercial vous répondra directement.\nJe ne peux pas afficher de prix dans le chat.",
    SAV:
      "Pour le SAV, la maintenance ou une réparation, contactez notre équipe avec le modèle de votre machine.\nPrécisez aussi la nature du problème et la garantie si possible.",
    CONTACT_MANAGER:
      "Parfait. Notre responsable commercial peut vous conseiller et valider la bonne configuration.\nVoici les coordonnées PelmelTech :",
    FALLBACK_1: "Pas de souci. Quel cas ressemble le plus à votre besoin ?",
    FALLBACK_INPUT:
      "Décrivez votre projet en quelques mots.\nSi votre demande concerne un devis ou le SAV, je vous orienterai directement.",
    FALLBACK_2:
      "Votre projet mérite un conseil personnalisé.\nNotre responsable commercial vous répondra avec la bonne orientation.",
  },
  options: {
    WELCOME: [
      opt("Vêtements (T-shirts, hoodies...)", "shirt", "A_Q2"),
      opt("Objets rigides (bois, verre, métal...)", "box", "B_DEF"),
      opt("Affiches grand format", "maximize", "D_Q2"),
      opt("Petits objets personnalisés", "gift", "C_Q2"),
      opt("Découpe vinyle / autocollants", "scissors", "E_Q2"),
      opt("Étiquettes / Crystal label", "tag", "C2_Q2"),
      opt("Presse à chaud / thermocollage", "flame", "H_DEF"),
      opt("Découpe matériaux (carton, mousse...)", "package", "F_Q2"),
      opt("Plastification / finition", "layers", "G_Q2"),
    ],
    A_Q2: [
      opt("T-shirts coton avec rendu direct", "shirt", "REC_DTG_4050"),
      opt("Transferts DTF en petite largeur", "printer", "REC_DTF_30"),
      opt("Production DTF régulière en 60 cm", "printer", "REC_DTF_60"),
      opt("Je ne sais pas encore", "helpCircle", "FALLBACK_INPUT"),
    ],
    B_DEF: [
      opt("Petits et moyens objets", "box", "REC_UV_6090"),
      opt("Objets plus grands ou séries variées", "maximize", "REC_UV_1290"),
      opt("Panneaux ou grande production", "factory", "REC_UV_2513"),
      opt("Je ne sais pas encore", "helpCircle", "FALLBACK_INPUT"),
    ],
    C_Q2: [
      opt("Stickers UV DTF et petits transferts", "tag", "REC_UV_DTF_A3"),
      opt("Production UV DTF en rouleau", "printer", "REC_UV_DTF_700"),
      opt("Objets à imprimer à plat", "box", "REC_FC7090U"),
      opt("Autre besoin", "penLine", "FALLBACK_INPUT"),
    ],
    C2_Q2: [
      opt("Petites séries et formats compacts", "tag", "REC_UV_DTF_A3"),
      opt("Production en largeur 700 mm", "ruler", "REC_UV_DTF_700"),
      opt("Je veux un conseil personnalisé", "phone", "CONTACT_MANAGER"),
    ],
    D_Q2: [
      opt("Environ 1800 mm", "ruler", "D_Q3_1800"),
      opt("Environ 3200 mm", "ruler", "D_Q3_3200"),
      opt("Je ne sais pas encore", "helpCircle", "FALLBACK_INPUT"),
    ],
    D_Q3_1800: [
      opt("Éco-solvant pour affiches et vinyle", "droplet", "REC_ECO_1800"),
      opt("UV roll-to-roll pour supports variés", "zap", "REC_UV_RTR_1800"),
    ],
    D_Q3_3200: [
      opt("Production éco-solvant standard", "droplet", "REC_ECO_3200"),
      opt("Production éco-solvant intensive", "factory", "REC_ECO_XLINE"),
      opt("Production UV grand format", "zap", "REC_DELUXEJET3200U"),
    ],
    E_Q2: [
      opt("720 mm", "ruler", "REC_EH_720TS"),
      opt("1350 mm", "ruler", "REC_EH_1350TS"),
      opt("1750 mm", "ruler", "REC_EH_1750TS"),
      opt("Découpe avec caméra CCD", "scanLine", "REC_EN49CCD"),
      opt("Traceur compact polyvalent", "printer", "REC_L6"),
    ],
    F_Q2: [
      opt("Cuir, acrylique, bois ou tissu", "zap", "REC_LASER"),
      opt("Carton, mousse, PVC ou EVA", "scissors", "F_Q3_CNC"),
    ],
    F_Q3_CNC: [
      opt("1600 x 2500 mm", "ruler", "REC_CNC_1625"),
      opt("1800 x 2500 mm", "ruler", "REC_CNC_1825"),
      opt("Format compact 500 x 700 mm", "ruler", "REC_FC5070E"),
      opt("Format compact 700 x 900 mm", "ruler", "REC_FC7090E"),
    ],
    G_Q2: [
      opt("Protéger affiches et impressions", "layers", "REC_L2_1700"),
      opt("Lamination grand format", "layers", "REC_L2_1700"),
      opt("Je veux un conseil personnalisé", "phone", "CONTACT_MANAGER"),
    ],
    H_DEF: [
      opt("Fixer des transferts DTF", "flame", "REC_PRESSE_CHAUD"),
      opt("Fixer des impressions DTG", "flame", "REC_PRESSE_CHAUD"),
      opt("Sublimation textile ou objets", "flame", "REC_PRESSE_CHAUD"),
      opt("Badges, patches ou flocage", "flame", "REC_PRESSE_CHAUD"),
    ],
    FALLBACK_1: [
      opt("Je veux imprimer sur textile", "shirt", "A_Q2"),
      opt("Je veux imprimer sur objet rigide", "box", "B_DEF"),
      opt("Je veux de l'impression grand format", "maximize", "D_Q2"),
      opt("Autre - je décris mon besoin", "penLine", "FALLBACK_INPUT"),
    ],
  },
});

const ar = buildContent(arUi, {
  contactManager: "التواصل مع مسؤول المبيعات",
  restart: "البدء من جديد",
  yesInterested: "نعم، أنا مهتم",
  question: "لدي سؤال",
  differentNeed: "احتياجي مختلف",
  backToMachines: "العودة إلى الآلات",
  anotherQuestion: "طرح سؤال آخر",
  priceKeywords: ["سعر", "الثمن", "تسعير", "عرض", "عرض سعر", "ميزانية", "تكلفة", "غالي", "رخيص"],
  savKeywords: ["صيانة", "دعم", "إصلاح", "ضمان", "تقني", "مشكلة", "عطل", "خدمة"],
  messages: {
    WELCOME:
      "مرحبًا! أنا PelmelBot، مساعدك من PelmelTech.\nأنا هنا لمساعدتك في العثور على آلة الطباعة المناسبة حسب احتياجك.\n\nماذا تريد أن تطبع؟",
    A_Q2: "ما نوع الإنتاج النسيجي الذي تريد القيام به؟",
    REC_DTG_4050:
      "أنصحك بـ DTG 4050 / LC-4050.\nهذه الآلة مناسبة للطباعة المباشرة على الملابس بنتيجة دقيقة.\nلتأكيد الموديل المناسب، تواصل مع مسؤول المبيعات.",
    REC_DTF_30:
      "أنصحك بـ DTF 30cm TD-A3.\nمناسبة لتحويلات النسيج بعرض صغير وإنتاج مرن.\nهل تريد نصيحة حول الإعداد المناسب؟",
    REC_DTF_60:
      "أنصحك بـ DTF 60cm Deluxejet6502.\nمناسبة أكثر للورش التي تريد إنتاج تحويلات DTF بكميات أكبر.\nهل تريد التحدث مع مسؤول المبيعات؟",
    B_DEF: "ما حجم الأجسام الصلبة التي تريد الطباعة عليها؟",
    REC_UV_6090:
      "أنصحك بـ UV Flatbed 6090.\nمناسبة للأجسام الصلبة مثل الخشب والزجاج والمعدن والأكريليك والهدايا المخصصة.\nهل تريد تأكيد التطبيق المناسب؟",
    REC_UV_1290:
      "أنصحك بـ UV Flatbed 1290.\nتوفر مساحة عمل أكبر للأجسام الصلبة والسلاسل المهنية الصغيرة.\nيمكن لمسؤول المبيعات التحقق من توافق موادك.",
    REC_UV_2513:
      "أنصحك بـ UV Flatbed 2513 / MT-UV2513 / MT-UV2513S.\nمناسبة للوحات والمواد الصلبة والإنتاج كبير الحجم.\nهل تريد أن يتصل بك الفريق؟",
    C_Q2: "ما نوع الأجسام الصغيرة المخصصة التي تريد إنتاجها؟",
    REC_UV_DTF_A3:
      "أنصحك بـ UV DTF LC-303 A3.\nمناسبة للملصقات والشعارات والتحويلات الزخرفية الصغيرة.\nبالنسبة للمستهلكات، يمكن لمسؤولنا إرشادك.",
    REC_UV_DTF_700:
      "أنصحك بـ UV DTF 700mm LC-703U.\nمناسبة للورش التي تنتج ملصقات UV DTF بعرض أكبر.\nهل تريد توجيهًا تجاريًا؟",
    REC_FC7090U:
      "أنصحك بـ FC7090U.\nمناسبة لتطبيقات UV المدمجة والأجسام المخصصة.\nيمكن لمسؤول المبيعات تأكيد الخيار الأفضل حسب موادك.",
    C2_Q2: "ما حجم إنتاج الملصقات أو Crystal Label الذي تريده؟",
    D_Q2: "ما عرض الطباعة الكبيرة الذي تبحث عنه؟",
    D_Q3_1800: "ما التقنية التي تفضلها لهذا العرض؟",
    D_Q3_3200: "ما مستوى الإنتاج الذي تستهدفه بعرض 3200 مم؟",
    REC_ECO_1800:
      "أنصحك بـ Eco-Solvent 1800 mm.\nمناسبة للملصقات والفينيل والبنرات واللافتات كبيرة الحجم.\nهل تريد مرافقة تجارية؟",
    REC_UV_RTR_1800:
      "أنصحك بـ UV Roll-to-Roll 1800 mm.\nمناسبة للمواد المرنة المختلفة مع تجفيف UV فوري.\nيمكن لمسؤول المبيعات تأكيد المواد المتوافقة.",
    REC_ECO_3200:
      "أنصحك بـ Eco-Solvent 3200 mm.\nمناسبة للمرئيات الكبيرة والأقمشة واللوحات المرنة.\nهل تريد توجيهًا نحو الموديل الصحيح؟",
    REC_ECO_XLINE:
      "أنصحك بـ Eco-Solvent Xline.\nموجهة لإنتاج كبير الحجم بوتيرة أعلى مع استقرار جيد.\nيمكن لمسؤولنا تحديد الإعداد المناسب.",
    REC_DELUXEJET3200U:
      "أنصحك بـ Deluxejet3200U.\nمناسبة لإنتاج UV كبير الحجم بعرض 3200 مم.\nهل تريد التحدث مع مسؤول المبيعات؟",
    E_Q2: "ما عرض قص الفينيل الذي تبحث عنه؟",
    REC_EH_720TS:
      "أنصحك بـ EH-720TS.\nمناسبة للملصقات والحروف والإنتاج الصغير من الفينيل.\nهل تريد تأكيد طريقة الاستخدام؟",
    REC_EH_1350TS:
      "أنصحك بـ EH-1350TS.\nتوفر عرضًا أريح للافتات والفينيل والملصقات.\nيمكن لمسؤول المبيعات إرشادك.",
    REC_EH_1750TS:
      "أنصحك بـ EH-1750TS.\nمناسبة لاحتياجات قص الفينيل بعرض كبير.\nهل تريد أن يتم التواصل معك؟",
    REC_EN49CCD:
      "أنصحك بـ EN49CCD.\nالكاميرا تساعد على تحديد علامات القص للملصقات والليبلات المطبوعة.\nهل تريد تأكيد هذا الاختيار؟",
    REC_L6:
      "أنصحك بـ L6.\nحل مدمج لقص الفينيل وأعمال اللافتات اليومية.\nيمكن لمسؤول المبيعات التحقق من احتياجك.",
    F_Q2: "ما المادة التي تريد قصها؟",
    F_Q3_CNC: "ما مساحة عمل CNC التي تبحث عنها؟",
    REC_LASER:
      "أنصحك بـ Laser SH-G1390.\nمناسبة لقص ونقش الخشب والأكريليك والجلد والقماش والمواد المشابهة.\nهل تريد نصيحة؟",
    REC_CNC_1625:
      "أنصحك بـ CNC 1625PAS.\nمناسبة للقص الآلي للكرتون والفوم وPVC ومواد التغليف.\nيمكن لمسؤول المبيعات تأكيد توافق موادك.",
    REC_CNC_1825:
      "أنصحك بـ CNC 1825PAS.\nتوفر مساحة أكبر للقص الآلي للمواد المرنة وشبه الصلبة.\nهل تريد نصيحة تجارية؟",
    REC_FC5070E:
      "أنصحك بـ FC5070E.\nمناسبة للقص الآلي بالأحجام الصغيرة والنماذج الأولية.\nهل تريد التحقق من التوافق؟",
    REC_FC7090E:
      "أنصحك بـ FC7090E.\nمناسبة للقص المدمج مع مساحة عمل أريح.\nيمكن لمسؤول المبيعات تأكيد الموديل.",
    G_Q2: "ما نوع التشطيب الذي تحتاجه؟",
    REC_L2_1700:
      "أنصحك بـ L2-1700 للتغليف الحراري.\nتحمي المطبوعات وتمنحها تشطيبًا احترافيًا لامعًا أو مطفيًا.\nهل تريد مرافقة تجارية؟",
    H_DEF: "لأي استخدام تريد مكبسًا حراريًا؟",
    REC_PRESSE_CHAUD:
      "أنصحك بـ المكبس الحراري الهوائي 60x40.\nيطبق الحرارة والضغط لتحويلات DTF وDTG والسوبليميشن والفلوكاچ.\nهل تريد توجيهًا؟",
    PRIX:
      "لطلب عرض سعر دقيق، سيجيبك مسؤول المبيعات مباشرة.\nلا يمكنني عرض الأسعار داخل المحادثة.",
    SAV:
      "لخدمة ما بعد البيع أو الصيانة أو الإصلاح، تواصل مع فريقنا مع ذكر موديل الآلة.\nيرجى أيضًا توضيح طبيعة المشكلة وحالة الضمان إن أمكن.",
    CONTACT_MANAGER:
      "ممتاز. يمكن لمسؤول المبيعات أن ينصحك ويؤكد الإعداد المناسب.\nهذه بيانات التواصل مع PelmelTech:",
    FALLBACK_1: "لا مشكلة. أي حالة تشبه احتياجك أكثر؟",
    FALLBACK_INPUT:
      "صف مشروعك ببضع كلمات.\nإذا كان طلبك يخص عرض سعر أو خدمة ما بعد البيع، سأوجهك مباشرة.",
    FALLBACK_2:
      "مشروعك يحتاج إلى نصيحة مخصصة.\nسيرد عليك مسؤول المبيعات بالتوجيه المناسب.",
  },
  options: {
    WELCOME: [
      opt("ملابس (تيشيرتات، هوديز...)", "shirt", "A_Q2"),
      opt("أجسام صلبة (خشب، زجاج، معدن...)", "box", "B_DEF"),
      opt("ملصقات كبيرة الحجم", "maximize", "D_Q2"),
      opt("أجسام صغيرة مخصصة", "gift", "C_Q2"),
      opt("قص فينيل / ملصقات", "scissors", "E_Q2"),
      opt("ليبلات / Crystal label", "tag", "C2_Q2"),
      opt("مكبس حراري / ترموكولاج", "flame", "H_DEF"),
      opt("قص مواد (كرتون، فوم...)", "package", "F_Q2"),
      opt("تغليف حراري / تشطيب", "layers", "G_Q2"),
    ],
    A_Q2: [
      opt("تيشيرتات قطن بطباعة مباشرة", "shirt", "REC_DTG_4050"),
      opt("تحويلات DTF بعرض صغير", "printer", "REC_DTF_30"),
      opt("إنتاج DTF منتظم بعرض 60 سم", "printer", "REC_DTF_60"),
      opt("لست متأكدًا بعد", "helpCircle", "FALLBACK_INPUT"),
    ],
    B_DEF: [
      opt("أجسام صغيرة ومتوسطة", "box", "REC_UV_6090"),
      opt("أجسام أكبر أو سلاسل متنوعة", "maximize", "REC_UV_1290"),
      opt("لوحات أو إنتاج كبير", "factory", "REC_UV_2513"),
      opt("لست متأكدًا بعد", "helpCircle", "FALLBACK_INPUT"),
    ],
    C_Q2: [
      opt("ملصقات UV DTF وتحويلات صغيرة", "tag", "REC_UV_DTF_A3"),
      opt("إنتاج UV DTF بالرول", "printer", "REC_UV_DTF_700"),
      opt("أجسام تطبع بشكل مسطح", "box", "REC_FC7090U"),
      opt("احتياج آخر", "penLine", "FALLBACK_INPUT"),
    ],
    C2_Q2: [
      opt("سلاسل صغيرة وأحجام مدمجة", "tag", "REC_UV_DTF_A3"),
      opt("إنتاج بعرض 700 مم", "ruler", "REC_UV_DTF_700"),
      opt("أريد نصيحة مخصصة", "phone", "CONTACT_MANAGER"),
    ],
    D_Q2: [
      opt("حوالي 1800 مم", "ruler", "D_Q3_1800"),
      opt("حوالي 3200 مم", "ruler", "D_Q3_3200"),
      opt("لست متأكدًا بعد", "helpCircle", "FALLBACK_INPUT"),
    ],
    D_Q3_1800: [
      opt("إيكو سولفنت للملصقات والفينيل", "droplet", "REC_ECO_1800"),
      opt("UV رول تو رول لمواد متنوعة", "zap", "REC_UV_RTR_1800"),
    ],
    D_Q3_3200: [
      opt("إنتاج إيكو سولفنت عادي", "droplet", "REC_ECO_3200"),
      opt("إنتاج إيكو سولفنت مكثف", "factory", "REC_ECO_XLINE"),
      opt("إنتاج UV كبير الحجم", "zap", "REC_DELUXEJET3200U"),
    ],
    E_Q2: [
      opt("720 مم", "ruler", "REC_EH_720TS"),
      opt("1350 مم", "ruler", "REC_EH_1350TS"),
      opt("1750 مم", "ruler", "REC_EH_1750TS"),
      opt("قص بكاميرا CCD", "scanLine", "REC_EN49CCD"),
      opt("بلوتر مدمج متعدد الاستخدام", "printer", "REC_L6"),
    ],
    F_Q2: [
      opt("جلد، أكريليك، خشب أو قماش", "zap", "REC_LASER"),
      opt("كرتون، فوم، PVC أو EVA", "scissors", "F_Q3_CNC"),
    ],
    F_Q3_CNC: [
      opt("1600 x 2500 مم", "ruler", "REC_CNC_1625"),
      opt("1800 x 2500 مم", "ruler", "REC_CNC_1825"),
      opt("حجم مدمج 500 x 700 مم", "ruler", "REC_FC5070E"),
      opt("حجم مدمج 700 x 900 مم", "ruler", "REC_FC7090E"),
    ],
    G_Q2: [
      opt("حماية الملصقات والمطبوعات", "layers", "REC_L2_1700"),
      opt("تغليف حراري كبير الحجم", "layers", "REC_L2_1700"),
      opt("أريد نصيحة مخصصة", "phone", "CONTACT_MANAGER"),
    ],
    H_DEF: [
      opt("تثبيت تحويلات DTF", "flame", "REC_PRESSE_CHAUD"),
      opt("تثبيت طباعات DTG", "flame", "REC_PRESSE_CHAUD"),
      opt("سوبليميشن نسيج أو أجسام", "flame", "REC_PRESSE_CHAUD"),
      opt("بادجات، باتشات أو فلوكاچ", "flame", "REC_PRESSE_CHAUD"),
    ],
    FALLBACK_1: [
      opt("أريد الطباعة على النسيج", "shirt", "A_Q2"),
      opt("أريد الطباعة على جسم صلب", "box", "B_DEF"),
      opt("أريد طباعة كبيرة الحجم", "maximize", "D_Q2"),
      opt("أخرى - سأصف احتياجي", "penLine", "FALLBACK_INPUT"),
    ],
  },
});

export const PELMELBOT_CONTENT: Record<PelmelBotLocale, PelmelBotContent> = {
  en,
  fr,
  ar,
};
