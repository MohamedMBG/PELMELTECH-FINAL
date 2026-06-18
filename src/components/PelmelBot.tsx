"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  MessageCircle,
  Phone,
  RotateCcw,
  X,
} from "lucide-react";
import { getProductPath, type Product } from "@/lib/products";
import { useLanguage, type Translations } from "@/i18n";

type Message = { id: string; sender: "bot" | "user"; text: string };
type Choice = { label: string; next: NodeId };
type Cta = { label: string; href: string; external?: boolean; icon?: "message" | "mail" | "phone" };

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
  | "root" | "machines" | "machine-standard" | "machine-large-format" | "machine-event"
  | "machine-industrial" | "machine-plotters" | "materials" | "material-banners"
  | "material-panels" | "material-posters" | "material-vinyl" | "material-rollups"
  | "consumables" | "consumable-ink" | "consumable-toner" | "consumable-paper"
  | "consumable-parts" | "consumable-maintenance" | "quote" | "quote-result" | "contact";

function buildChatNodes(t: Translations): Record<NodeId, ChatNode> {
  const bot = t.pelmelBot;
  const whatsappMessage = encodeURIComponent(bot.whatsAppMessage);

  const contactCtas: Cta[] = [
    { label: bot.ctas.whatsApp, href: `https://wa.me/15550123456?text=${whatsappMessage}`, external: true, icon: "message" },
    { label: bot.ctas.contactPage, href: "/contact" },
    { label: bot.ctas.email, href: "mailto:projects@pelmeltech.com", icon: "mail" },
    { label: bot.ctas.phone, href: "tel:+15550123456", icon: "phone" },
  ];

  const recCtas = (name: string): Cta[] => [
    { label: bot.ctas.viewProduct, href: getProductPath({ name: name as Product["name"] }) },
    { label: bot.ctas.requestQuote, href: "/contact" },
    { label: bot.ctas.contactSales, href: `https://wa.me/15550123456?text=${whatsappMessage}`, external: true, icon: "message" },
  ];

  const compactCtas = (name: string): Cta[] => [
    { label: bot.ctas.viewProduct, href: getProductPath({ name: name as Product["name"] }) },
    { label: bot.ctas.requestQuote, href: "/contact" },
  ];

  const consumableCtas = (name: string): Cta[] => [
    { label: bot.ctas.viewProduct, href: getProductPath({ name: name as Product["name"] }) },
    { label: bot.ctas.requestAvailability, href: "/contact" },
    { label: bot.ctas.contactPelmelTech, href: `https://wa.me/15550123456?text=${whatsappMessage}`, external: true, icon: "message" },
  ];

  const machineIds: NodeId[] = ["machine-standard", "machine-large-format", "machine-event", "machine-industrial", "machine-plotters"];
  const materialIds: NodeId[] = ["material-banners", "material-panels", "material-posters", "material-vinyl", "material-rollups"];
  const consumableIds: NodeId[] = ["consumable-ink", "consumable-toner", "consumable-paper", "consumable-parts", "consumable-maintenance"];
  const quoteIds: NodeId[] = ["quote-result", "quote-result", "quote-result", "quote-result"];

  const recKeys: (keyof typeof bot.recommendations)[] = ["standardPrinter", "largeFormat", "event", "industrial", "plotter"];
  const matRecKeys: (keyof typeof bot.recommendations)[] = ["banner", "panel", "poster", "vinyl", "rollup"];
  const conRecKeys: (keyof typeof bot.recommendations)[] = ["ink", "toner", "paper", "parts", "maintenance"];
  const recProducts = ["ApexJet Office Pro 420", "WidePro LX 1600", "EventSnap Photo Printer", "ProductionLine X9", "PlanMaster CAD Plotter"];
  const matProducts = ["Titan Industrial Mesh", "AluCore Rigid Panels", "Premium Photo Paper Roll", "Precision Wall Vinyl", "Apex Retractable Stand"];
  const conProducts = ["CMYK Eco-Solvent Ink Set", "Office Toner Twin Pack", "Premium Photo Paper Roll", "Precision Printhead Module", "Printer Maintenance Kit"];

  const nodes: Record<NodeId, ChatNode> = {
    root: { id: "root", choices: bot.rootChoices.map((label, i) => ({ label, next: (["machines", "materials", "consumables", "quote", "contact"] as NodeId[])[i] })) },
    machines: { id: "machines", response: bot.machineQuestion, choices: bot.machineChoices.map((label, i) => ({ label, next: machineIds[i] })) },
    materials: { id: "materials", response: bot.materialQuestion, choices: bot.materialChoices.map((label, i) => ({ label, next: materialIds[i] })) },
    consumables: { id: "consumables", response: bot.consumableQuestion, choices: bot.consumableChoices.map((label, i) => ({ label, next: consumableIds[i] })) },
    quote: { id: "quote", response: bot.quoteQuestion, choices: bot.quoteChoices.map((label, i) => ({ label, next: quoteIds[i] })) },
    "quote-result": { id: "quote-result", response: bot.quoteResult, ctas: contactCtas },
    contact: { id: "contact", response: bot.contactResponse, ctas: contactCtas },
    "machine-standard": { id: "machine-standard", response: bot.recommendations.standardPrinter, ctas: recCtas(recProducts[0]) },
    "machine-large-format": { id: "machine-large-format", response: bot.recommendations.largeFormat, ctas: recCtas(recProducts[1]) },
    "machine-event": { id: "machine-event", response: bot.recommendations.event, ctas: recCtas(recProducts[2]) },
    "machine-industrial": { id: "machine-industrial", response: bot.recommendations.industrial, ctas: recCtas(recProducts[3]) },
    "machine-plotters": { id: "machine-plotters", response: bot.recommendations.plotter, ctas: recCtas(recProducts[4]) },
    "material-banners": { id: "material-banners", response: bot.recommendations.banner, ctas: compactCtas(matProducts[0]) },
    "material-panels": { id: "material-panels", response: bot.recommendations.panel, ctas: compactCtas(matProducts[1]) },
    "material-posters": { id: "material-posters", response: bot.recommendations.poster, ctas: compactCtas(matProducts[2]) },
    "material-vinyl": { id: "material-vinyl", response: bot.recommendations.vinyl, ctas: compactCtas(matProducts[3]) },
    "material-rollups": { id: "material-rollups", response: bot.recommendations.rollup, ctas: compactCtas(matProducts[4]) },
    "consumable-ink": { id: "consumable-ink", response: bot.recommendations.ink, ctas: consumableCtas(conProducts[0]) },
    "consumable-toner": { id: "consumable-toner", response: bot.recommendations.toner, ctas: consumableCtas(conProducts[1]) },
    "consumable-paper": { id: "consumable-paper", response: bot.recommendations.paper, ctas: consumableCtas(conProducts[2]) },
    "consumable-parts": { id: "consumable-parts", response: bot.recommendations.parts, ctas: consumableCtas(conProducts[3]) },
    "consumable-maintenance": { id: "consumable-maintenance", response: bot.recommendations.maintenance, ctas: consumableCtas(conProducts[4]) },
  };

  return nodes;
}

const HELLOS = [
  "Hello", "Bonjour", "Hola", "Hallo", "Ciao",
  "Olá", "Merhaba", "Salam", "أهلا", "Namaste",
  "Konnichiwa", "Annyeong", "Ni hao", "Sawadee",
  "Jambo", "Zdravstvuyte", "Cześć", "Xin chào",
  "Saluton", "Kamusta", "Szia", "Shalom", "Selamat",
];

function CtaIcon({ icon }: { icon?: Cta["icon"] }) {
  if (icon === "message") return <MessageCircle size={14} strokeWidth={2.2} />;
  if (icon === "mail") return <Mail size={14} strokeWidth={2.2} />;
  if (icon === "phone") return <Phone size={14} strokeWidth={2.2} />;
  return <ArrowRight size={14} strokeWidth={2.2} className="rtl:rotate-180" />;
}

export default function PelmelBot() {
  const { t, dir } = useLanguage();
  const chatNodes = buildChatNodes(t);

  const welcomeMessage: Message = { id: "welcome", sender: "bot", text: t.pelmelBot.welcome };

  const [isOpen, setIsOpen] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState<NodeId>("root");
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const messageCounter = useRef(0);
  const [helloIndex, setHelloIndex] = useState(0);
  const prevLocaleRef = useRef(t.pelmelBot.welcome);

  useEffect(() => {
    if (prevLocaleRef.current !== t.pelmelBot.welcome) {
      prevLocaleRef.current = t.pelmelBot.welcome;
      handleReset();
    }
  }, [t.pelmelBot.welcome]);

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
    const nextMessages: Message[] = [{ id: createMessageId(), sender: "user", text: choice.label }];
    if (nextNode.response) {
      nextMessages.push({ id: createMessageId(), sender: "bot", text: nextNode.response });
    }
    setHistory((items) => [...items, { currentNodeId, messages, selectedOption }]);
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
    setMessages([{ id: "welcome", sender: "bot", text: t.pelmelBot.welcome }]);
    setHistory([]);
    setSelectedOption(null);
  };

  return (
    <div className="fixed bottom-5 z-[60] sm:bottom-6" style={{ right: dir === "rtl" ? "auto" : "1rem", left: dir === "rtl" ? "1rem" : "auto", insetInlineEnd: dir === "rtl" ? "auto" : undefined }}>
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            aria-label="PelmelBot chat panel"
            className="fixed inset-x-3 bottom-[6.5rem] flex h-[min(680px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-2xl shadow-black/[0.12] sm:w-[390px]"
            style={{ left: dir === "rtl" ? "1.5rem" : "auto", right: dir === "rtl" ? "auto" : "1.5rem" }}
          >
            <header className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 rounded-xl overflow-hidden shadow-lg shadow-magenta/15">
                  <Image src="/images/pelmeltech/activated_bot.png" alt="PelmelBot" fill className="object-cover" sizes="40px" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-extrabold tracking-tight text-on-surface">PelmelBot</h2>
                  <p className="truncate text-xs text-on-surface-variant">{t.pelmelBot.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={handleBack} disabled={!canGoBack} aria-label="Go back" className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-35">
                  <ArrowLeft size={16} strokeWidth={2.2} />
                </button>
                <button type="button" onClick={handleReset} aria-label="Start over" className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface">
                  <RotateCcw size={15} strokeWidth={2.2} />
                </button>
                <button type="button" onClick={() => setIsOpen(false)} aria-label="Close PelmelBot" className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface">
                  <X size={17} strokeWidth={2.2} />
                </button>
              </div>
            </header>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-surface-container-low/35 px-4 py-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.sender === "user"
                      ? "rounded-br-md rtl:rounded-br-2xl rtl:rounded-bl-md bg-on-surface text-white"
                      : "rounded-bl-md rtl:rounded-bl-2xl rtl:rounded-br-md border border-black/[0.06] bg-white text-on-surface shadow-sm shadow-black/[0.03]"
                  }`}>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t border-black/[0.06] bg-white p-4">
              {selectedOption && currentNodeId !== "root" && (
                <p className="mb-3 text-[11px] font-semibold text-on-surface-variant">
                  {t.pelmelBot.selected} <span className="text-on-surface">{selectedOption}</span>
                </p>
              )}

              {currentNode.choices && (
                <div className="grid gap-2">
                  {currentNode.choices.map((choice) => (
                    <button
                      key={choice.label}
                      type="button"
                      onClick={() => handleChoice(choice)}
                      className="group flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-start text-sm font-semibold text-on-surface transition-all hover:border-magenta/30 hover:bg-magenta/5 active:scale-[0.99]"
                    >
                      <span>{choice.label}</span>
                      <ArrowRight size={15} strokeWidth={2.2} className="shrink-0 text-on-surface-variant transition-colors group-hover:text-magenta rtl:rotate-180" />
                    </button>
                  ))}
                </div>
              )}

              {currentNode.ctas && (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {currentNode.ctas.map((cta, index) => {
                    const className = index === 0
                      ? "flex min-h-11 items-center justify-center gap-2 rounded-xl bg-magenta px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-magenta/15 transition-all hover:bg-magenta-dark active:scale-[0.99]"
                      : "flex min-h-11 items-center justify-center gap-2 rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm font-bold text-on-surface transition-all hover:border-cyan/40 hover:bg-cyan/5 active:scale-[0.99]";

                    if (cta.external || cta.href.startsWith("mailto:") || cta.href.startsWith("tel:")) {
                      return (
                        <a key={cta.label} href={cta.href} target={cta.external ? "_blank" : undefined} rel={cta.external ? "noopener noreferrer" : undefined} className={className}>
                          <CtaIcon icon={cta.icon} />
                          <span>{cta.label}</span>
                        </a>
                      );
                    }

                    return (
                      <Link key={cta.label} href={cta.href} className={className}>
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

      <div className="relative">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-full mb-3 flex justify-end"
              style={{ right: dir === "rtl" ? "auto" : 0, left: dir === "rtl" ? 0 : "auto" }}
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

        <motion.button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          aria-label={isOpen ? "Close PelmelBot" : "Open PelmelBot"}
          aria-expanded={isOpen}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="relative h-16 w-16 rounded-full shadow-xl shadow-black/15 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? "active" : "idle"}
              initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={isOpen ? "/images/pelmeltech/activated_bot.png" : "/images/pelmeltech/not_activated_bot.png"}
                alt="PelmelBot"
                fill
                className="object-cover"
                sizes="64px"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
