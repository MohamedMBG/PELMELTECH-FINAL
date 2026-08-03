import Image from "next/image";
import { Phone, Mail, MessageCircle } from "lucide-react";
import {
  getPelmelBotWhatsAppUrl,
  type PelmelBotUi,
} from "@/data/pelmelbot";
import ProductRecommendationCard from "./ProductRecommendationCard";
import styles from "../PelmelBot.module.css";

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
            <a key={`phone-${i}`} href={`tel:${num.replace(/\s/g, "")}`} className={styles.contactRow}>
              <Phone size={14} aria-hidden="true" className={styles.contactIcon} />
              <span>{num}</span>
            </a>
          );
        }
        if (line.startsWith(ui.contactEmailLabel)) {
          const email = line.replace(ui.contactEmailLabel, "").trim();
          return (
            <a key={`email-${i}`} href={`mailto:${email}`} className={styles.contactRow}>
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

function BotContent({ text, ui, productSlug }: { text: string; ui: PelmelBotUi; productSlug?: string }) {
  const isRecommendation = text.startsWith(ui.recommendationPrefix);
  const hasContact = text.includes(ui.contactEmailLabel);

  if (isRecommendation) {
    return <ProductRecommendationCard text={text} ui={ui} productSlug={productSlug} />;
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

function bubbleModifier(text: string, ui: PelmelBotUi) {
  if (text.startsWith(ui.recommendationPrefix)) return styles.bubbleRec;
  if (text.includes(ui.contactEmailLabel)) return styles.bubbleContact;
  return "";
}

type ChatMessageProps = {
  sender: "bot" | "user";
  text: string;
  productSlug?: string;
  ui: PelmelBotUi;
};

export default function ChatMessage({ sender, text, productSlug, ui }: ChatMessageProps) {
  const isBot = sender === "bot";
  return (
    <div className={`${styles.messageRow} ${isBot ? styles.botRow : styles.userRow}`}>
      {isBot ? (
        <Image
          src="/images/pelmeltech/activated_bot.png"
          alt=""
          width={30}
          height={30}
          aria-hidden="true"
          className={styles.avatar}
        />
      ) : null}
      <div className={`${styles.bubble} ${isBot ? bubbleModifier(text, ui) : styles.userBubble}`}>
        {isBot ? <BotContent text={text} ui={ui} productSlug={productSlug} /> : splitLines(text)}
      </div>
    </div>
  );
}
