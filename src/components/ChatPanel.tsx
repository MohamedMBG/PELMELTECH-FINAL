"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import {
  PELMELBOT_CONTENT,
  type PelmelBotContent,
  type PelmelBotOption,
} from "@/data/pelmelbot";
import { useLanguage } from "@/i18n";
import PelmelBotHeader from "./pelmelbot/PelmelBotHeader";
import ChatProgress from "./pelmelbot/ChatProgress";
import ChatMessage from "./pelmelbot/ChatMessage";
import OptionGrid from "./pelmelbot/OptionGrid";
import ChatActionBar from "./pelmelbot/ChatActionBar";
import styles from "./PelmelBot.module.css";

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
      selectedLabel?: string;
    };

const BOT_DELAY = 520;

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "");
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

type ChatPanelProps = {
  variant?: "floating" | "page";
  active?: boolean;
  onClose?: () => void;
};

export default function ChatPanel({ variant = "floating", active = true, onClose }: ChatPanelProps) {
  const { locale, t } = useLanguage();
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
  const messagesRef = useRef<HTMLDivElement>(null);
  const hasInteractedRef = useRef(false);
  const wasActiveRef = useRef(false);

  const canUseContactLinks = useMemo(
    () => activeStep === "CONTACT_MANAGER" || activeStep === "PRIX" || activeStep === "SAV" || activeStep === "FALLBACK_2",
    [activeStep],
  );

  const createId = (prefix: string) => {
    messageIndexRef.current += 1;
    return `pelmelbot-${prefix}-${messageIndexRef.current}`;
  };

  const disableOpenOptions = (selectedLabel?: string) => {
    setEvents((items) =>
      items.map((item) =>
        item.type === "options" && !item.disabled
          ? { ...item, disabled: true, selectedLabel }
          : item,
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
    hasInteractedRef.current = true;
    disableOpenOptions(option.label);
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

    hasInteractedRef.current = true;
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

  // Auto-scroll to the newest message only after the user has interacted —
  // never on the initial open, so the introduction card stays at the top.
  useEffect(() => {
    if (!hasInteractedRef.current) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [events, isTyping]);

  // On each false→true open, reset the visual scroll to the top (intro visible)
  // without touching conversation state. rAF waits for layout before scrolling.
  useEffect(() => {
    if (active && !wasActiveRef.current) {
      hasInteractedRef.current = false;
      requestAnimationFrame(() => {
        if (messagesRef.current) messagesRef.current.scrollTop = 0;
      });
    }
    wasActiveRef.current = active;
  }, [active]);

  useEffect(() => {
    if (!inputEnabled) return;
    inputRef.current?.focus();
  }, [inputEnabled]);

  return (
    <div className={`${styles.panel} ${variant === "page" ? styles.panelPage : ""}`}>
      <PelmelBotHeader ui={ui} onClose={onClose} />
      <ChatProgress stepId={activeStep} ui={ui} />

      <div
        ref={messagesRef}
        className={styles.messages}
        role="log"
        aria-live="polite"
        aria-label={ui.messagesLabel}
      >
        {events.map((item) => {
          if (item.type === "options") {
            return (
              <OptionGrid
                key={item.id}
                options={item.options}
                disabled={item.disabled}
                isTyping={isTyping}
                selectedLabel={item.selectedLabel ?? null}
                onSelect={handleOption}
              />
            );
          }

          return (
            <ChatMessage
              key={item.id}
              sender={item.sender}
              text={item.text}
              productSlug={item.productSlug}
              ui={ui}
            />
          );
        })}

        {isTyping ? (
          <div className={`${styles.messageRow} ${styles.botRow}`} aria-label={ui.typingLabel}>
            <Image
              src="/images/pelmeltech/activated_bot.png"
              alt=""
              width={30}
              height={30}
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

      <ChatActionBar
        ui={ui}
        whatsAppLabel={t.common.whatsApp}
        emailLabel={t.common.email}
        inputEnabled={inputEnabled}
        inputValue={inputValue}
        showContactLinks={canUseContactLinks}
        inputRef={inputRef}
        onInputChange={setInputValue}
        onSubmit={handleInputSubmit}
      />
    </div>
  );
}
