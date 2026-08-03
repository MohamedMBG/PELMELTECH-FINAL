"use client";

import type { FormEvent, RefObject } from "react";
import { Phone, Mail, MessageCircle, Send } from "lucide-react";
import {
  PELMELBOT_CONTACT,
  getPelmelBotWhatsAppUrl,
  type PelmelBotUi,
} from "@/data/pelmelbot";
import styles from "../PelmelBot.module.css";

type ChatActionBarProps = {
  ui: PelmelBotUi;
  whatsAppLabel: string;
  emailLabel: string;
  inputEnabled: boolean;
  inputValue: string;
  showContactLinks: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function ChatActionBar({
  ui,
  whatsAppLabel,
  emailLabel,
  inputEnabled,
  inputValue,
  showContactLinks,
  inputRef,
  onInputChange,
  onSubmit,
}: ChatActionBarProps) {
  const canSend = inputEnabled && inputValue.trim().length > 0;

  return (
    <form className={styles.actionBar} onSubmit={onSubmit}>
      {showContactLinks ? (
        <div className={styles.contactLinks} aria-label={ui.contactLinksLabel}>
          <a href={getPelmelBotWhatsAppUrl(ui.whatsAppMessage)} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={14} aria-hidden="true" />
            {whatsAppLabel}
          </a>
          <a href={`tel:${PELMELBOT_CONTACT.phonePrimary.replace(/\s/g, "")}`}>
            <Phone size={14} aria-hidden="true" />
            {ui.callLabel}
          </a>
          <a href={`mailto:${PELMELBOT_CONTACT.email}`}>
            <Mail size={14} aria-hidden="true" />
            {emailLabel}
          </a>
        </div>
      ) : null}

      <div className={styles.actionLine}>
        {inputEnabled ? (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder={ui.inputPlaceholderEnabled}
            aria-label={ui.inputLabel}
            className={styles.input}
          />
        ) : (
          <span className={styles.actionStatus} aria-live="polite">
            {ui.chooseOptionStatus}
          </span>
        )}
        <button
          type="submit"
          disabled={!canSend}
          aria-disabled={!canSend}
          aria-label={ui.sendAriaLabel}
          className={styles.sendButton}
        >
          <Send size={16} aria-hidden="true" className="rtl:flip" />
          <span className={styles.sendLabel}>{ui.sendLabel}</span>
        </button>
      </div>
    </form>
  );
}
