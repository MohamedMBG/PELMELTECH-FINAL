import { PRODUCTS } from "@/lib/constants";

export type Product = (typeof PRODUCTS)[number];

type TechnicalRow = {
  label: string;
  value: string;
};

type ProductDetail = {
  fiche: TechnicalRow[];
  highlights: string[];
  applications: string[];
};

const categoryDetails: Record<string, Omit<ProductDetail, "fiche"> & { fiche: Omit<TechnicalRow, "value">[]; values: string[] }> = {
  "Standard Printers": {
    fiche: [
      { label: "Technology" },
      { label: "Recommended volume" },
      { label: "Media support" },
      { label: "Ideal environment" },
      { label: "Support" },
    ],
    values: [
      "Business color print system",
      "Daily office and admin workloads",
      "A4, A3, envelopes, business stationery",
      "Offices, agencies, schools, and front desks",
      "Setup, consumables, and maintenance available",
    ],
    highlights: ["Sharp business output", "Fast daily operation", "Easy supply planning"],
    applications: ["Office documents", "Reports and proposals", "Client presentations"],
  },
  "Large Format Printers": {
    fiche: [
      { label: "Technology" },
      { label: "Media width" },
      { label: "Media support" },
      { label: "Production use" },
      { label: "Support" },
    ],
    values: [
      "Large-format production printer",
      "Wide-roll and oversized media workflows",
      "Vinyl, banner media, poster paper, fabric, and display rolls",
      "Campaigns, signage, retail graphics, and event production",
      "Installation, operator guidance, inks, and parts available",
    ],
    highlights: ["Wide-format output", "Outdoor-ready production", "Strong campaign versatility"],
    applications: ["Banners and posters", "Retail graphics", "Event backdrops"],
  },
  "Event Printers": {
    fiche: [
      { label: "Technology" },
      { label: "Deployment" },
      { label: "Output type" },
      { label: "Best use" },
      { label: "Support" },
    ],
    values: [
      "Portable event print system",
      "On-site and temporary activation setup",
      "Event photos, passes, badges, and branded touchpoints",
      "Launches, exhibitions, activations, and campaign booths",
      "Pre-event setup and consumables planning available",
    ],
    highlights: ["Fast on-site output", "Portable workflow", "Activation-ready setup"],
    applications: ["Photo activations", "Conference check-ins", "Brand experiences"],
  },
  "Industrial Printers": {
    fiche: [
      { label: "Technology" },
      { label: "Production volume" },
      { label: "Media support" },
      { label: "Environment" },
      { label: "Support" },
    ],
    values: [
      "Industrial production print platform",
      "High-volume professional workflows",
      "Rigid and flexible production media depending on configuration",
      "Print shops, production rooms, and industrial environments",
      "Commissioning, maintenance kits, printheads, and operator support available",
    ],
    highlights: ["Built for production", "Professional media handling", "Serviceable platform"],
    applications: ["High-volume printing", "Rigid substrate work", "Professional production"],
  },
  Plotters: {
    fiche: [
      { label: "Technology" },
      { label: "Precision use" },
      { label: "Media support" },
      { label: "Workflow" },
      { label: "Support" },
    ],
    values: [
      "Technical plotting and cutting system",
      "Plans, decals, labels, technical drawings, and contour work",
      "CAD paper, vinyl, adhesive films, and plotting media",
      "Design studios, engineering offices, signage shops, and fabrication teams",
      "Blade holders, paper rolls, calibration, and setup available",
    ],
    highlights: ["Precision output", "Technical workflow fit", "Media and blade support"],
    applications: ["CAD plans", "Vinyl decals", "Technical production"],
  },
  "Banners & Mesh": {
    fiche: [
      { label: "Material type" },
      { label: "Finish" },
      { label: "Durability" },
      { label: "Installation" },
      { label: "Best use" },
    ],
    values: [
      "Outdoor banner and mesh substrate",
      "Matte or satin print finish",
      "Weather-resistant campaign visibility",
      "Hemmed, grommeted, framed, or tension-mounted options",
      "Outdoor campaigns, fences, facades, and event visibility",
    ],
    highlights: ["Outdoor durability", "Strong visibility", "Flexible installation"],
    applications: ["Outdoor banners", "Event fencing", "Storefront campaigns"],
  },
  "Rigid Panels": {
    fiche: [
      { label: "Material type" },
      { label: "Surface" },
      { label: "Durability" },
      { label: "Mounting" },
      { label: "Best use" },
    ],
    values: [
      "Rigid display and signage panel",
      "Direct print or mounted graphic surface",
      "Indoor and selected outdoor display use",
      "Wall mount, standoff, frame, or freestanding installation",
      "Showrooms, wayfinding, retail branding, and professional signage",
    ],
    highlights: ["Rigid presentation", "Clean brand finish", "Professional mounting options"],
    applications: ["Retail panels", "Office signage", "Exhibition displays"],
  },
  "Soft Signage": {
    fiche: [
      { label: "Material type" },
      { label: "Finish" },
      { label: "Handling" },
      { label: "Installation" },
      { label: "Best use" },
    ],
    values: [
      "Printed fabric display material",
      "Soft textile print finish",
      "Foldable, reusable, and transport-friendly",
      "Frame, tension, wall, or backdrop systems",
      "Backdrops, lightboxes, exhibitions, and reusable event displays",
    ],
    highlights: ["Reusable fabric", "Premium soft finish", "Easy transport"],
    applications: ["Backdrops", "Lightboxes", "Exhibition walls"],
  },
  "Vinyl & Wraps": {
    fiche: [
      { label: "Material type" },
      { label: "Finish" },
      { label: "Adhesive" },
      { label: "Installation" },
      { label: "Best use" },
    ],
    values: [
      "Adhesive vinyl and wrap media",
      "Matte, gloss, laminated, or specialty finish",
      "Surface-dependent adhesive options",
      "Wall, window, floor, vehicle, or panel application",
      "Branding, decoration, wayfinding, and promotional graphics",
    ],
    highlights: ["Flexible placement", "Clean adhesive finish", "Lamination options"],
    applications: ["Wall graphics", "Floor decals", "Window branding"],
  },
  Exhibition: {
    fiche: [
      { label: "System type" },
      { label: "Portability" },
      { label: "Graphic media" },
      { label: "Setup" },
      { label: "Best use" },
    ],
    values: [
      "Portable exhibition display system",
      "Reusable event and showroom hardware",
      "Roll-up, pop-up, fabric, or panel graphic formats",
      "Fast setup with replacement graphics available",
      "Trade shows, activations, presentations, and corporate displays",
    ],
    highlights: ["Reusable hardware", "Fast event setup", "Replaceable graphics"],
    applications: ["Trade shows", "Product launches", "Showroom displays"],
  },
  "Ink & Toner": {
    fiche: [
      { label: "Supply type" },
      { label: "Compatibility" },
      { label: "Output profile" },
      { label: "Storage" },
      { label: "Best use" },
    ],
    values: [
      "Printer consumable supply",
      "Matched by printer model and ink or toner technology",
      "Color stability and production consistency",
      "Store sealed in a clean, dry workspace",
      "Routine production, replacement stock, and output quality control",
    ],
    highlights: ["Model-matched supply", "Consistent output", "Availability support"],
    applications: ["Ink replacement", "Toner stock", "Production replenishment"],
  },
  "Paper & Rolls": {
    fiche: [
      { label: "Media type" },
      { label: "Finish" },
      { label: "Printer fit" },
      { label: "Handling" },
      { label: "Best use" },
    ],
    values: [
      "Printable roll media",
      "Photo, matte, banner, or specialty finish",
      "Selected by roll width, core size, and printer compatibility",
      "Store clean and dry before production",
      "Posters, banners, technical output, and campaign graphics",
    ],
    highlights: ["Reliable media feed", "Multiple finishes", "Printer-fit selection"],
    applications: ["Posters", "Banners", "Proofing"],
  },
  "Printer Parts": {
    fiche: [
      { label: "Part type" },
      { label: "Compatibility" },
      { label: "Service level" },
      { label: "Handling" },
      { label: "Best use" },
    ],
    values: [
      "Replacement printer part",
      "Matched by equipment model and production workflow",
      "Operator or technician installation depending on part",
      "Handle cleanly and keep sealed until service",
      "Preventive maintenance, repairs, and production reliability",
    ],
    highlights: ["Model-fit guidance", "Service-ready supply", "Production reliability"],
    applications: ["Repairs", "Scheduled maintenance", "Production uptime"],
  },
  "Maintenance Tools": {
    fiche: [
      { label: "Tool type" },
      { label: "Maintenance area" },
      { label: "Operator use" },
      { label: "Handling" },
      { label: "Best use" },
    ],
    values: [
      "Printer maintenance accessory",
      "Cleaning, calibration, alignment, or daily care",
      "Designed for routine operator workflows",
      "Use according to printer maintenance guidance",
      "Reducing downtime and keeping output consistent",
    ],
    highlights: ["Routine care", "Cleaner output", "Reduced downtime"],
    applications: ["Daily cleaning", "Calibration", "Preventive maintenance"],
  },
};

export function slugifyProductName(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getProductPath(product: { name: string }) {
  return `/catalog/${slugifyProductName(product.name)}`;
}

export function findProductBySlug(slug: string) {
  return PRODUCTS.find((product) => slugifyProductName(product.name) === slug);
}

export function getProductDetail(product: Product): ProductDetail {
  const category = categoryDetails[product.category] ?? categoryDetails["Standard Printers"];

  return {
    fiche: [
      { label: "Product", value: product.name },
      { label: "Category", value: product.category },
      { label: "Price", value: product.price },
      ...category.fiche.map((row, index) => ({
        label: row.label,
        value: category.values[index],
      })),
    ],
    highlights: category.highlights,
    applications: category.applications,
  };
}

export function getRelatedProducts(product: Product, limit = 3) {
  return PRODUCTS.filter(
    (candidate) => candidate.category === product.category && candidate.name !== product.name
  ).slice(0, limit);
}

export function findProductByName(name: string) {
  return PRODUCTS.find((product) => product.name === name);
}
