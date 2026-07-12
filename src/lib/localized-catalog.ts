import type { CatalogCategory, CatalogProduct } from "@/lib/catalog";
import type { Locale } from "@/i18n";

type LocalizedText = Record<Locale, string>;

const categoryNames: Record<string, LocalizedText> = {
  "cat-textile": {
    en: "Textile & Apparel",
    fr: "Textile et habillement",
    ar: "المنسوجات والملابس",
  },
  "cat-rigid-objects": {
    en: "Rigid Objects",
    fr: "Objets rigides",
    ar: "الأجسام الصلبة",
  },
  "cat-large-format": {
    en: "Large Format",
    fr: "Grand format",
    ar: "الطباعة كبيرة الحجم",
  },
  "cat-custom-objects": {
    en: "Custom Small Objects",
    fr: "Petits objets personnalises",
    ar: "أجسام صغيرة مخصصة",
  },
  "cat-vinyl-cutting": {
    en: "Vinyl Cutting & Stickers",
    fr: "Decoupe vinyle et stickers",
    ar: "قص الفينيل والملصقات",
  },
  "cat-labels": {
    en: "Labels & Crystal",
    fr: "Etiquettes et crystal",
    ar: "الملصقات والكريستال",
  },
  "cat-heat-press": {
    en: "Heat Press",
    fr: "Presse a chaud",
    ar: "المكبس الحراري",
  },
  "cat-material-cutting": {
    en: "Material Cutting",
    fr: "Decoupe de materiaux",
    ar: "قص المواد",
  },
  "cat-lamination": {
    en: "Lamination & Finishing",
    fr: "Lamination et finition",
    ar: "التغليف والتشطيب",
  },
};

const categoryDescriptions: Record<string, LocalizedText> = {
  "cat-textile": {
    en: "Machines for garment and fabric printing with DTF, DTG, and transfer workflows.",
    fr: "Machines pour l'impression textile, DTF, DTG et transferts.",
    ar: "آلات لطباعة الملابس والأقمشة بتقنيات DTF وDTG والتحويل الحراري.",
  },
  "cat-rigid-objects": {
    en: "Direct printing on wood, glass, metal, tile, PVC, and other rigid materials.",
    fr: "Impression directe sur bois, verre, metal, carrelage, PVC et supports rigides.",
    ar: "طباعة مباشرة على الخشب والزجاج والمعدن والبلاط وPVC والمواد الصلبة.",
  },
  "cat-large-format": {
    en: "Wide-format machines for posters, banners, signs, and visual campaigns.",
    fr: "Machines grand format pour affiches, bannieres, signaletique et campagnes visuelles.",
    ar: "آلات كبيرة الحجم للملصقات واللافتات والحملات البصرية.",
  },
  "cat-custom-objects": {
    en: "Personalization machines for bottles, mugs, cases, and small objects.",
    fr: "Machines de personnalisation pour bouteilles, mugs, coques et petits objets.",
    ar: "آلات تخصيص للقوارير والأكواب والأغطية والأجسام الصغيرة.",
  },
  "cat-vinyl-cutting": {
    en: "Cutting plotters for vinyl, stickers, contour cutting, and heat-transfer media.",
    fr: "Plotters de decoupe pour vinyle, stickers, contour et transfert textile.",
    ar: "بلوترات قص للفينيل والملصقات والقص المحيطي ومواد النقل الحراري.",
  },
  "cat-labels": {
    en: "Machines for transparent labels, crystal stickers, and premium packaging.",
    fr: "Machines pour etiquettes transparentes, stickers crystal et packaging premium.",
    ar: "آلات للملصقات الشفافة وملصقات الكريستال والتغليف الفاخر.",
  },
  "cat-heat-press": {
    en: "Heat and pressure equipment for fixing DTF, DTG, and sublimation transfers.",
    fr: "Equipements de chaleur et pression pour fixer les transferts DTF, DTG et sublimation.",
    ar: "معدات حرارة وضغط لتثبيت تحويلات DTF وDTG والتسامي.",
  },
  "cat-material-cutting": {
    en: "CNC and laser cutting machines for rigid and flexible materials.",
    fr: "Machines CNC et laser pour la decoupe de supports rigides et souples.",
    ar: "آلات CNC وليزر لقص المواد الصلبة والمرنة.",
  },
  "cat-lamination": {
    en: "Lamination and finishing machines for protecting printed media.",
    fr: "Machines de lamination et finition pour proteger les impressions.",
    ar: "آلات تغليف وتشطيب لحماية المواد المطبوعة.",
  },
};

const subcategoryNames: Record<string, LocalizedText> = {
  "Plotter de Découpe": {
    en: "Cutting Plotter",
    fr: "Plotter de decoupe",
    ar: "بلوتر قص",
  },
  "Découpe Laser": {
    en: "Laser Cutting",
    fr: "Decoupe laser",
    ar: "قص بالليزر",
  },
  "Découpe CNC": {
    en: "CNC Cutting",
    fr: "Decoupe CNC",
    ar: "قص CNC",
  },
  "UV Flatbed": {
    en: "UV Flatbed",
    fr: "UV flatbed",
    ar: "طباعة UV مسطحة",
  },
  "UV DTF": {
    en: "UV DTF",
    fr: "UV DTF",
    ar: "UV DTF",
  },
  DTF: {
    en: "DTF Printing",
    fr: "Impression DTF",
    ar: "طباعة DTF",
  },
  DTG: {
    en: "DTG Printing",
    fr: "Impression DTG",
    ar: "طباعة DTG",
  },
  "Eco Solvant": {
    en: "Eco-Solvent",
    fr: "Eco-solvant",
    ar: "إيكو سولفنت",
  },
  Solvant: {
    en: "Solvent Printing",
    fr: "Impression solvant",
    ar: "طباعة سولفنت",
  },
  Lamination: {
    en: "Lamination",
    fr: "Lamination",
    ar: "التغليف",
  },
  "Presse à Chaud": {
    en: "Heat Press",
    fr: "Presse a chaud",
    ar: "مكبس حراري",
  },
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function localizeSubcategory(value: string, locale: Locale) {
  const direct = subcategoryNames[value]?.[locale];
  if (direct) return direct;

  const normalized = normalize(value);
  const found = Object.entries(subcategoryNames).find(([key]) => normalize(key) === normalized);
  return found?.[1][locale] || value;
}

function productKind(product: CatalogProduct, locale: Locale) {
  const subcategory = localizeSubcategory(product.subcategory, locale);
  const category = categoryNames[product.categoryId]?.[locale] || product.categoryName;
  return { subcategory, category };
}

function productName(product: CatalogProduct, locale: Locale) {
  if (locale === "fr") return product.name;

  const { subcategory } = productKind(product, locale);
  const width =
    product.specifications?.printingWidth && !normalize(product.specifications.printingWidth).includes("verifier")
      ? ` ${product.specifications.printingWidth}`
      : "";

  if (locale === "ar") return `${subcategory}${width} - PelmelTech`;
  return `${subcategory}${width} - PelmelTech`;
}

function productSummary(product: CatalogProduct, locale: Locale) {
  const { subcategory, category } = productKind(product, locale);
  const width =
    product.specifications?.printingWidth && !normalize(product.specifications.printingWidth).includes("verifier")
      ? product.specifications.printingWidth
      : null;

  if (locale === "fr") {
    return {
      shortDescription: product.shortDescription,
      description: product.description,
    };
  }

  if (locale === "ar") {
    const sizeText = width ? ` بعرض ${width}` : "";
    return {
      shortDescription: `${subcategory}${sizeText} موجهة لورش الإنتاج التي تحتاج إلى دقة واستقرار ودعم محلي من PelmelTech.`,
      description: `هذه الآلة من فئة ${category} مصممة لمساعدة محترفي الطباعة على إنتاج أعمال متناسقة بجودة عالية. توفر PelmelTech المشورة، التركيب، الصيانة وقطع الغيار حتى تبقى عملية الإنتاج مستقرة من الاختبار الأول إلى التشغيل اليومي.`,
    };
  }

  const sizeText = width ? ` with ${width} working width` : "";
  return {
    shortDescription: `${subcategory}${sizeText} for production teams that need precise output, stable operation, and local PelmelTech support.`,
    description: `This ${category.toLowerCase()} machine is built to help print professionals produce consistent, high-quality work. PelmelTech supports selection, installation, maintenance, and spare parts so the equipment stays reliable from first setup through daily production.`,
  };
}

function localizedList(product: CatalogProduct, locale: Locale, kind: "features" | "applications") {
  if (locale === "fr") return product[kind] || [];

  if (locale === "ar") {
    return kind === "features"
      ? ["إنتاج مستقر بجودة احترافية", "دعم في التركيب والتشغيل", "اختيار مناسب لورش الطباعة", "إمكانية الصيانة وقطع الغيار"]
      : ["ورش الطباعة", "الإعلانات واللافتات", "إنتاج العلامات التجارية", "التخصيص حسب الطلب"];
  }

  return kind === "features"
    ? ["Stable professional output", "Setup and operator guidance", "Fit for print-shop production", "Maintenance and spare parts support"]
    : ["Print shops", "Signage and advertising", "Brand production", "Custom production"];
}

export function localizeCategory(category: CatalogCategory, locale: Locale): CatalogCategory {
  return {
    ...category,
    name: categoryNames[category.id]?.[locale] || category.name,
    description: categoryDescriptions[category.id]?.[locale] || category.description,
  };
}

export function localizeProduct(product: CatalogProduct, locale: Locale): CatalogProduct {
  const { shortDescription, description } = productSummary(product, locale);
  return {
    ...product,
    name: productName(product, locale),
    categoryName: categoryNames[product.categoryId]?.[locale] || product.categoryName,
    subcategory: localizeSubcategory(product.subcategory, locale),
    shortDescription,
    description,
    features: localizedList(product, locale, "features"),
    applications: localizedList(product, locale, "applications"),
  };
}

export function localizeProducts(products: CatalogProduct[], locale: Locale): CatalogProduct[] {
  return products.map((product) => localizeProduct(product, locale));
}

export function localizeCategories(categories: CatalogCategory[], locale: Locale): CatalogCategory[] {
  return categories.map((category) => localizeCategory(category, locale));
}
