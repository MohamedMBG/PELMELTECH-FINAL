"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ChatPanel from "./ChatPanel";
import styles from "./PelmelBot.module.css";

export default function PelmelBot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  const windowRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const openChat = () => {
    setIsOpen(true);
    setShowBadge(false);
  };

  const closeChat = () => {
    setIsOpen(false);
    launcherRef.current?.focus();
  };

  useEffect(() => {
    if (isOpen) return;

    const badgeTimer = setTimeout(() => setShowBadge(true), 5000);
    return () => clearTimeout(badgeTimer);
  }, [isOpen]);

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

  // Dedicated chat page already renders the full conversation — hide the widget there.
  if (pathname === "/chat") return null;

  return (
    <div className={styles.widget} dir="ltr">
      <div
        ref={windowRef}
        className={`${styles.window} ${isOpen ? styles.windowOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Assistant PelmelTech"
      >
        <ChatPanel variant="floating" active={isOpen} onClose={closeChat} />
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
