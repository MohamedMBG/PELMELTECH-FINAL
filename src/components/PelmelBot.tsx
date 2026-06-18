"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import {
  Shirt, Box, Maximize2, Gift, Scissors, Tag, Flame, Package, Layers,
  ThumbsUp, HelpCircle, RotateCcw, Phone, Mail, MessageCircle,
  Printer, Ruler, Factory, Wrench, Zap, ScanLine, Droplet, PenLine,
  CheckCircle2, Send,
  type LucideIcon,
} from "lucide-react";
import {
  PELMELBOT_CONTACT,
  PELMELBOT_PRICE_KEYWORDS,
  PELMELBOT_SAV_KEYWORDS,
  PELMELBOT_TREE,
  type PelmelBotOption,
} from "@/data/pelmelbot";
import styles from "./PelmelBot.module.css";

const ICON_MAP: Record<string, LucideIcon> = {
  shirt: Shirt,
  box: Box,
  maximize: Maximize2,
  gift: Gift,
  scissors: Scissors,
  tag: Tag,
  flame: Flame,
  package: Package,
  layers: Layers,
  thumbsUp: ThumbsUp,
  helpCircle: HelpCircle,
  rotateCcw: RotateCcw,
  phone: Phone,
  mail: Mail,
  messageCircle: MessageCircle,
  printer: Printer,
  ruler: Ruler,
  factory: Factory,
  wrench: Wrench,
  zap: Zap,
  scanLine: ScanLine,
  droplet: Droplet,
  penLine: PenLine,
  checkCircle: CheckCircle2,
  send: Send,
};

type ChatEvent =
  | {
      id: string;
      type: "message";
      sender: "bot" | "user";
      text: string;
    }
  | {
      id: string;
      type: "options";
      stepId: string;
      options: PelmelBotOption[];
      disabled: boolean;
    };

const BOT_DELAY = 520;

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function detectPriorityStep(value: string) {
  const normalized = normalizeText(value);
  const hasPrice = PELMELBOT_PRICE_KEYWORDS.some((keyword) =>
    normalized.includes(normalizeText(keyword)),
  );
  if (hasPrice) return "PRIX";

  const hasSav = PELMELBOT_SAV_KEYWORDS.some((keyword) =>
    normalized.includes(normalizeText(keyword)),
  );
  if (hasSav) return "SAV";

  return null;
}

function splitLines(text: string) {
  const lines = text.split("\n");
  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

function ContactBlock({ text }: { text: string }) {
  const lines = text.split("\n").filter(Boolean);

  return (
    <div className={styles.contactBlock}>
      {lines.map((line, i) => {
        if (line.startsWith("Téléphone :")) {
          const num = line.replace("Téléphone : ", "");
          return (
            <a
              key={`phone-${i}`}
              href={`tel:${num.replace(/\s/g, "")}`}
              className={styles.contactRow}
            >
              <Phone size={14} aria-hidden="true" className={styles.contactIcon} />
              <span>{num}</span>
            </a>
          );
        }
        if (line.startsWith("Email :")) {
          const email = line.replace("Email : ", "");
          return (
            <a
              key={`email-${i}`}
              href={`mailto:${email}`}
              className={styles.contactRow}
            >
              <Mail size={14} aria-hidden="true" className={styles.contactIcon} />
              <span>{email}</span>
            </a>
          );
        }
        if (line.startsWith("WhatsApp :")) {
          const num = line.replace("WhatsApp : ", "");
          return (
            <a
              key={`wa-${i}`}
              href={PELMELBOT_CONTACT.whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactRow}
            >
              <MessageCircle size={14} aria-hidden="true" className={styles.contactIcon} />
              <span>{num}</span>
            </a>
          );
        }
        return <span key={`line-${i}`}>{line}</span>;
      })}
    </div>
  );
}

function RecommendationContent({ text }: { text: string }) {
  const lines = text.split("\n").filter(Boolean);
  const nameMatch = lines[0]?.match(/recommande (?:la |le |l')(.+)\./);
  const machineName = nameMatch?.[1] ?? lines[0];
  const descriptionLines = lines.slice(1);

  return (
    <div className={styles.recCard}>
      <div className={styles.recHeader}>
        <CheckCircle2 size={14} aria-hidden="true" />
        <span>Recommandation</span>
      </div>
      <p className={styles.recTitle}>{machineName}</p>
      <div className={styles.recDesc}>
        {descriptionLines.map((line, i) => (
          <span key={`rec-${i}`}>
            {line}
            {i < descriptionLines.length - 1 ? <br /> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

function MessageContent({ text }: { text: string }) {
  const isRecommendation = text.startsWith("Je vous recommande");
  const hasContact = text.includes("Téléphone :");

  if (isRecommendation) {
    return <RecommendationContent text={text} />;
  }

  if (hasContact) {
    const parts = text.split("\n\n");
    const mainText = parts[0];
    const contactText = parts.slice(1).join("\n\n");
    return (
      <>
        <div className={styles.messageText}>{splitLines(mainText)}</div>
        <ContactBlock text={contactText} />
      </>
    );
  }

  return <>{splitLines(text)}</>;
}

function getMessageClass(text: string) {
  if (text.startsWith("Je vous recommande")) return styles.bubbleRec;
  if (text.includes("Téléphone :")) return styles.bubbleContact;
  return "";
}

function OptionIcon({ name }: { name?: string }) {
  if (!name) return null;
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={15} aria-hidden="true" className={styles.optionIcon} />;
}

export default function PelmelBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [events, setEvents] = useState<ChatEvent[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activeStep, setActiveStep] = useState("WELCOME");

  const messageIndexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackCountRef = useRef(0);
  const windowRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const canUseContactLinks = useMemo(
    () => activeStep === "CONTACT_MANAGER" || activeStep === "PRIX" || activeStep === "SAV" || activeStep === "FALLBACK_2",
    [activeStep],
  );

  const createId = (prefix: string) => {
    messageIndexRef.current += 1;
    return `pelmelbot-${prefix}-${messageIndexRef.current}`;
  };

  const disableOpenOptions = () => {
    setEvents((items) =>
      items.map((item) =>
        item.type === "options" && !item.disabled ? { ...item, disabled: true } : item,
      ),
    );
  };

  const clearPendingBotResponse = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const renderStep = (stepId: string, reset = false) => {
    const step = PELMELBOT_TREE[stepId];
    if (!step) return;

    clearPendingBotResponse();
    setActiveStep(stepId);
    setInputEnabled(false);
    setIsTyping(true);

    if (reset) {
      fallbackCountRef.current = 0;
      setInputValue("");
      setEvents([]);
    }

    timeoutRef.current = setTimeout(() => {
      setEvents((items) => [
        ...items,
        {
          id: createId("bot"),
          type: "message",
          sender: "bot",
          text: step.message,
        },
        ...(step.options.length
          ? [
              {
                id: createId("options"),
                type: "options" as const,
                stepId,
                options: step.options,
                disabled: false,
              },
            ]
          : []),
      ]);
      setInputEnabled(Boolean(step.enableInput));
      setIsTyping(false);
    }, BOT_DELAY);
  };

  const openChat = () => {
    setIsOpen(true);
    setShowBadge(false);
    if (events.length === 0 && !isTyping) {
      renderStep("WELCOME", true);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    launcherRef.current?.focus();
  };

  const handleOption = (option: PelmelBotOption) => {
    disableOpenOptions();
    setInputEnabled(false);
    setInputValue("");
    setEvents((items) => [
      ...items,
      {
        id: createId("user"),
        type: "message",
        sender: "user",
        text: option.label,
      },
    ]);

    if (option.next === "WELCOME") {
      renderStep("WELCOME", true);
      return;
    }

    renderStep(option.next);
  };

  const handleInputSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = inputValue.trim();
    if (!value || !inputEnabled) return;

    setEvents((items) => [
      ...items,
      {
        id: createId("user"),
        type: "message",
        sender: "user",
        text: value,
      },
    ]);
    setInputValue("");
    setInputEnabled(false);

    const priorityStep = detectPriorityStep(value);
    if (priorityStep) {
      renderStep(priorityStep);
      return;
    }

    fallbackCountRef.current += 1;
    renderStep(fallbackCountRef.current >= 2 ? "CONTACT_MANAGER" : "FALLBACK_2");
  };

  useEffect(() => {
    if (isOpen) return;

    const badgeTimer = setTimeout(() => setShowBadge(true), 5000);
    return () => clearTimeout(badgeTimer);
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [events, isTyping]);

  useEffect(() => {
    if (!inputEnabled) return;
    inputRef.current?.focus();
  }, [inputEnabled]);

  useEffect(() => {
    if (!isOpen) return;

    const keyHandler = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        closeChat();
        return;
      }

      if (event.key !== "Tab" || !windowRef.current) return;

      const focusable = Array.from(
        windowRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", keyHandler);
    windowRef.current?.querySelector<HTMLElement>("button, input, a")?.focus();

    return () => document.removeEventListener("keydown", keyHandler);
  }, [isOpen]);

  useEffect(() => {
    return () => clearPendingBotResponse();
  }, []);

  return (
    <div className={styles.widget} dir="ltr">
      <div
        ref={windowRef}
        className={`${styles.window} ${isOpen ? styles.windowOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Assistant PelmelTech"
      >
        <header className={styles.header}>
          <div className={styles.headerIdentity}>
            <Image
              src="/images/pelmeltech/logo_pelmeltech.png"
              alt="PelmelTech"
              width={42}
              height={42}
              className={styles.headerLogo}
            />
            <div className={styles.headerText}>
              <p className={styles.headerName}>PelmelBot</p>
              <p className={styles.headerStatus}>
                <span aria-hidden="true" className={styles.statusDot} />
                En ligne - Assistant PelmelTech
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={closeChat}
            aria-label="Fermer le chat PelmelBot"
          >
            ×
          </button>
        </header>

        <div
          className={styles.messages}
          role="log"
          aria-live="polite"
          aria-label="Messages du chat"
        >
          {events.map((item) => {
            if (item.type === "options") {
              return (
                <div className={styles.options} key={item.id}>
                  {item.options.map((option) => (
                    <button
                      type="button"
                      key={`${item.id}-${option.label}`}
                      disabled={item.disabled || isTyping}
                      onClick={() => handleOption(option)}
                      className={styles.optionButton}
                    >
                      <OptionIcon name={option.icon} />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className={`${styles.messageRow} ${
                  item.sender === "user" ? styles.userRow : styles.botRow
                }`}
              >
                {item.sender === "bot" ? (
                  <Image
                    src="/images/pelmeltech/activated_bot.png"
                    alt=""
                    width={28}
                    height={28}
                    aria-hidden="true"
                    className={styles.avatar}
                  />
                ) : null}
                <div
                  className={`${styles.bubble} ${
                    item.sender === "bot" ? getMessageClass(item.text) : ""
                  }`}
                >
                  {item.sender === "bot" ? (
                    <MessageContent text={item.text} />
                  ) : (
                    splitLines(item.text)
                  )}
                </div>
              </div>
            );
          })}

          {isTyping ? (
            <div className={`${styles.messageRow} ${styles.botRow}`} aria-label="PelmelBot écrit">
              <Image
                src="/images/pelmeltech/activated_bot.png"
                alt=""
                width={28}
                height={28}
                aria-hidden="true"
                className={styles.avatar}
              />
              <div className={`${styles.bubble} ${styles.typingBubble}`}>
                <span />
                <span />
                <span />
              </div>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <form className={styles.inputArea} onSubmit={handleInputSubmit}>
          {canUseContactLinks ? (
            <div className={styles.contactLinks} aria-label="Coordonnées PelmelTech">
              <a href={PELMELBOT_CONTACT.whatsAppUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={13} aria-hidden="true" />
                WhatsApp
              </a>
              <a href={`tel:${PELMELBOT_CONTACT.phonePrimary.replace(/\s/g, "")}`}>
                <Phone size={13} aria-hidden="true" />
                Appeler
              </a>
              <a href={`mailto:${PELMELBOT_CONTACT.email}`}>
                <Mail size={13} aria-hidden="true" />
                Email
              </a>
            </div>
          ) : null}
          <div className={styles.inputLine}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              disabled={!inputEnabled}
              placeholder={
                inputEnabled
                  ? "Décrivez votre besoin..."
                  : "Saisie disponible uniquement pour « Autre »"
              }
              aria-label="Décrire votre besoin"
              className={styles.input}
            />
            <button
              type="submit"
              disabled={!inputEnabled || inputValue.trim().length === 0}
              aria-label="Envoyer votre message"
              className={styles.sendButton}
            >
              <Send size={15} aria-hidden="true" />
              <span className={styles.sendLabel}>Envoyer</span>
            </button>
          </div>
        </form>
      </div>

      <button
        ref={launcherRef}
        type="button"
        className={styles.launcher}
        onClick={isOpen ? closeChat : openChat}
        aria-label={isOpen ? "Fermer l'assistant PelmelTech" : "Ouvrir l'assistant PelmelTech"}
        aria-expanded={isOpen}
      >
        <Image
          src={isOpen ? "/images/pelmeltech/activated_bot.png" : "/images/pelmeltech/not_activated_bot.png"}
          alt=""
          width={66}
          height={66}
          aria-hidden="true"
          className={styles.launcherImage}
        />
        <span className={`${styles.badge} ${showBadge && !isOpen ? styles.badgeVisible : ""}`}>
          1
        </span>
      </button>
    </div>
  );
}
