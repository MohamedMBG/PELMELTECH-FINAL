"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  MessageCircle,
  Phone,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { getProductPath, type Product } from "@/lib/products";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

type Choice = {
  label: string;
  next: NodeId;
};

type Cta = {
  label: string;
  href: string;
  external?: boolean;
  icon?: "message" | "mail" | "phone";
};

type ChatNode = {
  id: NodeId;
  response?: string;
  choices?: Choice[];
  ctas?: Cta[];
};

type Snapshot = {
  currentNodeId: NodeId;
  messages: Message[];
  selectedOption: string | null;
};

type NodeId =
  | "root"
  | "machines"
  | "machine-standard"
  | "machine-large-format"
  | "machine-event"
  | "machine-industrial"
  | "machine-plotters"
  | "materials"
  | "material-banners"
  | "material-panels"
  | "material-posters"
  | "material-vinyl"
  | "material-rollups"
  | "consumables"
  | "consumable-ink"
  | "consumable-toner"
  | "consumable-paper"
  | "consumable-parts"
  | "consumable-maintenance"
  | "quote"
  | "quote-result"
  | "contact";

const whatsappMessage = encodeURIComponent(
  "Hi PelmelTech, I would like help choosing a printing solution."
);

const contactCtas: Cta[] = [
  {
    label: "WhatsApp",
    href: `https://wa.me/15550123456?text=${whatsappMessage}`,
    external: true,
    icon: "message",
  },
  { label: "Contact page", href: "/contact" },
  { label: "Email", href: "mailto:projects@pelmeltech.com", icon: "mail" },
  { label: "Phone", href: "tel:+15550123456", icon: "phone" },
];

const recommendationCtas = (productName: string): Cta[] => [
  { label: "View product", href: getProductPath({ name: productName as Product["name"] }) },
  { label: "Request a quote", href: "/contact" },
  {
    label: "Contact sales",
    href: `https://wa.me/15550123456?text=${whatsappMessage}`,
    external: true,
    icon: "message",
  },
];

const compactRecommendationCtas = (productName: string): Cta[] => [
  { label: "View product", href: getProductPath({ name: productName as Product["name"] }) },
  { label: "Request a quote", href: "/contact" },
];

const consumableRecommendationCtas = (productName: string): Cta[] => [
  { label: "View product", href: getProductPath({ name: productName as Product["name"] }) },
  { label: "Request availability", href: "/contact" },
  {
    label: "Contact PelmelTech",
    href: `https://wa.me/15550123456?text=${whatsappMessage}`,
    external: true,
    icon: "message",
  },
];

const rootChoices: Choice[] = [
  { label: "Find a printing machine", next: "machines" },
  { label: "Printing materials", next: "materials" },
  { label: "Consumables & accessories", next: "consumables" },
  { label: "Request a quote", next: "quote" },
  { label: "Contact PelmelTech", next: "contact" },
];

const machineChoices: Choice[] = [
  { label: "Standard printers", next: "machine-standard" },
  { label: "Large-format printers", next: "machine-large-format" },
  { label: "Event printers", next: "machine-event" },
  { label: "Industrial printers", next: "machine-industrial" },
  { label: "Plotters", next: "machine-plotters" },
];

const materialChoices: Choice[] = [
  { label: "Banners", next: "material-banners" },
  { label: "Panels", next: "material-panels" },
  { label: "Posters", next: "material-posters" },
  { label: "Stickers / vinyl", next: "material-vinyl" },
  { label: "Roll-up displays", next: "material-rollups" },
];

const consumableChoices: Choice[] = [
  { label: "Ink", next: "consumable-ink" },
  { label: "Toner", next: "consumable-toner" },
  { label: "Paper rolls", next: "consumable-paper" },
  { label: "Printer parts", next: "consumable-parts" },
  { label: "Maintenance kits", next: "consumable-maintenance" },
];

const quoteChoices: Choice[] = [
  { label: "Machine quote", next: "quote-result" },
  { label: "Material quote", next: "quote-result" },
  { label: "Service quote", next: "quote-result" },
  { label: "Maintenance quote", next: "quote-result" },
];

const chatNodes: Record<NodeId, ChatNode> = {
  root: {
    id: "root",
    choices: rootChoices,
  },
  machines: {
    id: "machines",
    response: "What type of printing machine are you looking for?",
    choices: machineChoices,
  },
  "machine-standard": {
    id: "machine-standard",
    response:
      "I recommend ApexJet Office Pro 420. Best for everyday office and business printing needs.",
    ctas: recommendationCtas("ApexJet Office Pro 420"),
  },
  "machine-large-format": {
    id: "machine-large-format",
    response:
      "I recommend WidePro LX 1600. Best for banners, posters, signage, and large visual production.",
    ctas: recommendationCtas("WidePro LX 1600"),
  },
  "machine-event": {
    id: "machine-event",
    response:
      "I recommend EventSnap Photo Printer. Best for events, stands, activations, and campaign printing.",
    ctas: recommendationCtas("EventSnap Photo Printer"),
  },
  "machine-industrial": {
    id: "machine-industrial",
    response:
      "I recommend ProductionLine X9. Best for high-volume and professional production environments.",
    ctas: recommendationCtas("ProductionLine X9"),
  },
  "machine-plotters": {
    id: "machine-plotters",
    response:
      "I recommend PlanMaster CAD Plotter. Best for technical drawings, plans, and precision large-format work.",
    ctas: recommendationCtas("PlanMaster CAD Plotter"),
  },
  materials: {
    id: "materials",
    response: "Which printing material do you need?",
    choices: materialChoices,
  },
  "material-banners": {
    id: "material-banners",
    response: "I recommend Titan Industrial Mesh. Durable indoor and outdoor visibility solutions.",
    ctas: compactRecommendationCtas("Titan Industrial Mesh"),
  },
  "material-panels": {
    id: "material-panels",
    response:
      "I recommend AluCore Rigid Panels. Rigid signage and display solutions for professional branding.",
    ctas: compactRecommendationCtas("AluCore Rigid Panels"),
  },
  "material-posters": {
    id: "material-posters",
    response:
      "I recommend Premium Photo Paper Roll. High-quality visual communication for campaigns and events.",
    ctas: compactRecommendationCtas("Premium Photo Paper Roll"),
  },
  "material-vinyl": {
    id: "material-vinyl",
    response: "I recommend Precision Wall Vinyl. Flexible branding and decoration materials.",
    ctas: compactRecommendationCtas("Precision Wall Vinyl"),
  },
  "material-rollups": {
    id: "material-rollups",
    response: "I recommend Apex Retractable Stand. Portable display solutions for events and presentations.",
    ctas: compactRecommendationCtas("Apex Retractable Stand"),
  },
  consumables: {
    id: "consumables",
    response: "Which consumable or accessory are you trying to source?",
    choices: consumableChoices,
  },
  "consumable-ink": {
    id: "consumable-ink",
    response:
      "I recommend CMYK Eco-Solvent Ink Set. PelmelTech can help you match ink to your equipment and production needs.",
    ctas: consumableRecommendationCtas("CMYK Eco-Solvent Ink Set"),
  },
  "consumable-toner": {
    id: "consumable-toner",
    response:
      "I recommend Office Toner Twin Pack. PelmelTech can help you confirm compatibility before ordering.",
    ctas: consumableRecommendationCtas("Office Toner Twin Pack"),
  },
  "consumable-paper": {
    id: "consumable-paper",
    response:
      "I recommend Premium Photo Paper Roll. PelmelTech can help you choose the right roll width and finish.",
    ctas: consumableRecommendationCtas("Premium Photo Paper Roll"),
  },
  "consumable-parts": {
    id: "consumable-parts",
    response:
      "I recommend Precision Printhead Module. PelmelTech can help you verify the correct part for your printer.",
    ctas: consumableRecommendationCtas("Precision Printhead Module"),
  },
  "consumable-maintenance": {
    id: "consumable-maintenance",
    response:
      "I recommend Printer Maintenance Kit. PelmelTech can help you keep printer output stable and reduce downtime.",
    ctas: consumableRecommendationCtas("Printer Maintenance Kit"),
  },
  quote: {
    id: "quote",
    response: "What type of quote do you need?",
    choices: quoteChoices,
  },
  "quote-result": {
    id: "quote-result",
    response: "Tell us what you need and our team will help you choose the right solution.",
    ctas: contactCtas,
  },
  contact: {
    id: "contact",
    response:
      "You can contact PelmelTech for products, services, support, or partnership requests.",
    ctas: contactCtas,
  },
};

const welcomeMessage: Message = {
  id: "welcome",
  sender: "bot",
  text: "Hi, I'm PelmelBot 👋 I can help you find a printer, printing material, service, or request a quote.",
};

function CtaIcon({ icon }: { icon?: Cta["icon"] }) {
  if (icon === "message") return <MessageCircle size={14} strokeWidth={2.2} />;
  if (icon === "mail") return <Mail size={14} strokeWidth={2.2} />;
  if (icon === "phone") return <Phone size={14} strokeWidth={2.2} />;
  return <ArrowRight size={14} strokeWidth={2.2} />;
}

const HELLOS = [
  "Hello", "Bonjour", "Hola", "Hallo", "Ciao",
  "Olá", "Merhaba", "Salam", "Ahlan", "Namaste",
  "Konnichiwa", "Annyeong", "Ni hao", "Sawadee",
  "Jambo", "Zdravstvuyte", "Cześć", "Xin chào",
  "Saluton", "Kamusta", "Szia", "Shalom", "Selamat",
];

export default function PelmelBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState<NodeId>("root");
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const messageCounter = useRef(0);
  const [helloIndex, setHelloIndex] = useState(0);

  useEffect(() => {
    if (isOpen) return;
    const interval = setInterval(() => {
      setHelloIndex((i) => (i + 1) % HELLOS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const currentNode = chatNodes[currentNodeId];
  const canGoBack = history.length > 0;

  const createMessageId = () => {
    messageCounter.current += 1;
    return `pelmelbot-${messageCounter.current}`;
  };

  const handleChoice = (choice: Choice) => {
    const nextNode = chatNodes[choice.next];
    const nextMessages: Message[] = [
      {
        id: createMessageId(),
        sender: "user",
        text: choice.label,
      },
    ];

    if (nextNode.response) {
      nextMessages.push({
        id: createMessageId(),
        sender: "bot",
        text: nextNode.response,
      });
    }

    setHistory((items) => [
      ...items,
      {
        currentNodeId,
        messages,
        selectedOption,
      },
    ]);

    setSelectedOption(choice.label);
    setCurrentNodeId(choice.next);
    setMessages((items) => [...items, ...nextMessages]);
  };

  const handleBack = () => {
    const previous = history[history.length - 1];
    if (!previous) return;

    setCurrentNodeId(previous.currentNodeId);
    setMessages(previous.messages);
    setSelectedOption(previous.selectedOption);
    setHistory((items) => items.slice(0, -1));
  };

  const handleReset = () => {
    setCurrentNodeId("root");
    setMessages([welcomeMessage]);
    setHistory([]);
    setSelectedOption(null);
  };

  return (
    <div className="fixed bottom-5 right-4 z-[60] sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            aria-label="PelmelBot chat panel"
            className="fixed inset-x-3 bottom-24 flex h-[min(680px,calc(100dvh-7rem))] flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-2xl shadow-black/[0.12] sm:left-auto sm:right-6 sm:w-[390px]"
          >
            <header className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-magenta text-white shadow-lg shadow-magenta/15">
                  <MessageCircle size={18} strokeWidth={2.3} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-extrabold tracking-tight text-on-surface">
                    PelmelBot
                  </h2>
                  <p className="truncate text-xs text-on-surface-variant">
                    Product guidance and quote help
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={!canGoBack}
                  aria-label="Go back"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ArrowLeft size={16} strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Start over"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                >
                  <RotateCcw size={15} strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close PelmelBot"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                >
                  <X size={17} strokeWidth={2.2} />
                </button>
              </div>
            </header>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-surface-container-low/35 px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.sender === "user"
                        ? "rounded-br-md bg-on-surface text-white"
                        : "rounded-bl-md border border-black/[0.06] bg-white text-on-surface shadow-sm shadow-black/[0.03]"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t border-black/[0.06] bg-white p-4">
              {selectedOption && currentNodeId !== "root" && (
                <p className="mb-3 text-[11px] font-semibold text-on-surface-variant">
                  Selected: <span className="text-on-surface">{selectedOption}</span>
                </p>
              )}

              {currentNode.choices && (
                <div className="grid gap-2">
                  {currentNode.choices.map((choice) => (
                    <button
                      key={choice.label}
                      type="button"
                      onClick={() => handleChoice(choice)}
                      aria-label={`Choose ${choice.label}`}
                      className="group flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-left text-sm font-semibold text-on-surface transition-all hover:border-magenta/30 hover:bg-magenta/5 active:scale-[0.99]"
                    >
                      <span>{choice.label}</span>
                      <ArrowRight
                        size={15}
                        strokeWidth={2.2}
                        className="shrink-0 text-on-surface-variant transition-colors group-hover:text-magenta"
                      />
                    </button>
                  ))}
                </div>
              )}

              {currentNode.ctas && (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {currentNode.ctas.map((cta, index) => {
                    const className =
                      index === 0
                        ? "flex min-h-11 items-center justify-center gap-2 rounded-xl bg-magenta px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-magenta/15 transition-all hover:bg-magenta-dark active:scale-[0.99]"
                        : "flex min-h-11 items-center justify-center gap-2 rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm font-bold text-on-surface transition-all hover:border-cyan/40 hover:bg-cyan/5 active:scale-[0.99]";

                    if (cta.external || cta.href.startsWith("mailto:") || cta.href.startsWith("tel:")) {
                      return (
                        <a
                          key={cta.label}
                          href={cta.href}
                          target={cta.external ? "_blank" : undefined}
                          rel={cta.external ? "noopener noreferrer" : undefined}
                          aria-label={cta.label}
                          className={className}
                        >
                          <CtaIcon icon={cta.icon} />
                          <span>{cta.label}</span>
                        </a>
                      );
                    }

                    return (
                      <Link
                        key={cta.label}
                        href={cta.href}
                        aria-label={cta.label}
                        className={className}
                      >
                        <CtaIcon icon={cta.icon} />
                        <span>{cta.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </footer>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            className="mb-3 flex justify-end"
          >
            <div className="rounded-full border border-black/[0.06] bg-white px-5 py-2.5 shadow-lg shadow-black/[0.06] overflow-hidden min-w-[120px] text-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={helloIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="block text-sm font-bold tracking-tight text-on-surface"
                >
                  {HELLOS[helloIndex]} 👋
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-label={isOpen ? "Close PelmelBot" : "Open PelmelBot"}
        aria-expanded={isOpen}
        className="group flex h-14 items-center gap-3 rounded-full border border-black/[0.06] bg-on-surface px-4 text-white shadow-xl shadow-black/15 transition-all hover:-translate-y-0.5 hover:bg-magenta active:scale-[0.98]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12">
          {isOpen ? (
            <X size={18} strokeWidth={2.3} />
          ) : (
            <Sparkles size={18} strokeWidth={2.3} />
          )}
        </span>
        <span className="hidden text-sm font-extrabold tracking-tight sm:block">
          PelmelBot
        </span>
      </button>
    </div>
  );
}
