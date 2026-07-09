"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Shirt, Box, Maximize2, Gift, Scissors, Tag, Flame, Package, Layers,
  ThumbsUp, HelpCircle, RotateCcw, Phone, Mail, MessageCircle,
  Printer, Ruler, Factory, Wrench, Zap, ScanLine, Droplet, PenLine,
  CheckCircle2, Send, ArrowRight,
  type LucideIcon,
} from "lucide-react";
import {
  PELMELBOT_CONTACT,
  PELMELBOT_CONTENT,
  getPelmelBotWhatsAppUrl,
  type PelmelBotContent,
  type PelmelBotOption,
  type PelmelBotUi,
} from "@/data/pelmelbot";
import { useLanguage } from "@/i18n";
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
      productSlug?: string;
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
    .replace(/[\u0300-\u036f]/g, "");
}

function detectPriorityStep(value: string, botContent: PelmelBotContent) {
  const normalized = normalizeText(value);
  const hasPrice = botContent.priceKeywords.some((keyword) =>
    normalized.includes(normalizeText(keyword)),
  );
  if (hasPrice) return "PRIX";

  const hasSav = botContent.savKeywords.some((keyword) =>
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

function ContactBlock({ text, ui }: { text: string; ui: PelmelBotUi }) {
  const lines = text.split("\n").filter(Boolean);

  return (
    <div className={styles.contactBlock}>
      {lines.map((line, i) => {
        if (line.startsWith(ui.contactPhoneLabel)) {
          const num = line.replace(ui.contactPhoneLabel, "").trim();
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
        if (line.startsWith(ui.contactEmailLabel)) {
          const email = line.replace(ui.contactEmailLabel, "").trim();
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
        if (line.startsWith(ui.contactWhatsAppLabel)) {
          const num = line.replace(ui.contactWhatsAppLabel, "").trim();
          return (
            <a
              key={`wa-${i}`}
              href={getPelmelBotWhatsAppUrl(ui.whatsAppMessage)}
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

function RecommendationContent({
  text,
  ui,
  productSlug,
}: {
  text: string;
  ui: PelmelBotUi;
  productSlug?: string;
}) {
  const lines = text.split("\n").filter(Boolean);
  const machineName =
    lines[0]
      ?.replace(ui.recommendationPrefix, "")
      .replace(/^[\s:：'’`-]+/, "")
      .replace(/[.。]$/, "")
      .trim() || lines[0];
  const descriptionLines = lines.slice(1);

  return (
    <div className={styles.recCard}>
      <div className={styles.recHeader}>
        <CheckCircle2 size={14} aria-hidden="true" />
        <span>{ui.recommendationLabel}</span>
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
      {productSlug ? (
        <Link href={`/catalog/${productSlug}`} className={styles.recLink}>
          <span>{ui.viewProductLabel}</span>
          <ArrowRight size={15} aria-hidden="true" className="rtl:flip" />
        </Link>
      ) : null}
    </div>
  );
}

function MessageContent({ text, ui, productSlug }: { text: string; ui: PelmelBotUi; productSlug?: string }) {
  const isRecommendation = text.startsWith(ui.recommendationPrefix);
  const hasContact = text.includes(ui.contactEmailLabel);

  if (isRecommendation) {
    return <RecommendationContent text={text} ui={ui} productSlug={productSlug} />;
  }

  if (hasContact) {
    const parts = text.split("\n\n");
    const mainText = parts[0];
    const contactText = parts.slice(1).join("\n\n");
    return (
      <>
        <div className={styles.messageText}>{splitLines(mainText)}</div>
        <ContactBlock text={contactText} ui={ui} />
      </>
    );
  }

  return <>{splitLines(text)}</>;
}

function getMessageClass(text: string, ui: PelmelBotUi) {
  if (text.startsWith(ui.recommendationPrefix)) return styles.bubbleRec;
  if (text.includes(ui.contactEmailLabel)) return styles.bubbleContact;
  return "";
}

function OptionIcon({ name }: { name?: string }) {
  if (!name) return null;
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={15} aria-hidden="true" className={styles.optionIcon} />;
}

type ChatPanelProps = {
  variant?: "floating" | "page";
  active?: boolean;
  onClose?: () => void;
};

export default function ChatPanel({ variant = "floating", active = true, onClose }: ChatPanelProps) {
  const { locale } = useLanguage();
  const botContent = PELMELBOT_CONTENT[locale];
  const { tree, ui } = botContent;
  const [events, setEvents] = useState<ChatEvent[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activeStep, setActiveStep] = useState("WELCOME");

  const messageIndexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackCountRef = useRef(0);
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
    const step = tree[stepId];
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
          productSlug: step.productSlug,
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

    const priorityStep = detectPriorityStep(value, botContent);
    if (priorityStep) {
      renderStep(priorityStep);
      return;
    }

    fallbackCountRef.current += 1;
    renderStep(fallbackCountRef.current >= 2 ? "CONTACT_MANAGER" : "FALLBACK_2");
  };

  useEffect(() => {
    if (!active || events.length > 0) return;
    const startId = setTimeout(() => renderStep("WELCOME", true), 0);
    return () => {
      clearTimeout(startId);
      clearPendingBotResponse();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, events.length]);

  useEffect(() => {
    if (!active) return;
    const localeResetId = setTimeout(() => renderStep(activeStep, true), 0);
    return () => {
      clearTimeout(localeResetId);
      clearPendingBotResponse();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [events, isTyping]);

  useEffect(() => {
    if (!inputEnabled) return;
    inputRef.current?.focus();
  }, [inputEnabled]);

  return (
    <div className={`${styles.panel} ${variant === "page" ? styles.panelPage : ""}`}>
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
              {ui.onlineStatus}
            </p>
          </div>
        </div>
        {onClose ? (
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label={ui.closeLabel}
          >
            ×
          </button>
        ) : null}
      </header>

      <div
        className={styles.messages}
        role="log"
        aria-live="polite"
        aria-label={ui.messagesLabel}
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
                  item.sender === "bot" ? getMessageClass(item.text, ui) : ""
                }`}
              >
                {item.sender === "bot" ? (
                  <MessageContent text={item.text} ui={ui} productSlug={item.productSlug} />
                ) : (
                  splitLines(item.text)
                )}
              </div>
            </div>
          );
        })}

        {isTyping ? (
          <div className={`${styles.messageRow} ${styles.botRow}`} aria-label={ui.typingLabel}>
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
          <div className={styles.contactLinks} aria-label={ui.contactLinksLabel}>
            <a href={getPelmelBotWhatsAppUrl(ui.whatsAppMessage)} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={13} aria-hidden="true" />
              WhatsApp
            </a>
            <a href={`tel:${PELMELBOT_CONTACT.phonePrimary.replace(/\s/g, "")}`}>
              <Phone size={13} aria-hidden="true" />
              {ui.callLabel}
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
                ? ui.inputPlaceholderEnabled
                : ui.inputPlaceholderDisabled
            }
            aria-label={ui.inputLabel}
            className={styles.input}
          />
          <button
            type="submit"
            disabled={!inputEnabled || inputValue.trim().length === 0}
            aria-label={ui.sendAriaLabel}
            className={styles.sendButton}
          >
            <Send size={15} aria-hidden="true" />
            <span className={styles.sendLabel}>{ui.sendLabel}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
