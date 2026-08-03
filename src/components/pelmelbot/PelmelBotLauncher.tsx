"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "../PelmelBot.module.css";

const GREETINGS = ["Bonjour", "Hello", "مرحبا"];

/** Restrained typewriter that cycles greetings; disabled under reduced motion. */
function useGreeting(enabled: boolean) {
  const [text, setText] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      const staticId = setTimeout(() => setText(GREETINGS[0]), 0);
      return () => clearTimeout(staticId);
    }

    let phrase = 0;
    let char = 0;
    let deleting = false;

    const tick = () => {
      const current = GREETINGS[phrase];
      char = deleting ? char - 1 : char + 1;
      setText(current.slice(0, char));

      let delay = deleting ? 55 : 110;
      if (!deleting && char === current.length) {
        delay = 1600;
        deleting = true;
      } else if (deleting && char === 0) {
        deleting = false;
        phrase = (phrase + 1) % GREETINGS.length;
        delay = 320;
      }
      timer.current = setTimeout(tick, delay);
    };

    timer.current = setTimeout(tick, 600);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [enabled]);

  return text;
}

type PelmelBotLauncherProps = {
  isOpen: boolean;
  showGreeting: boolean;
  showBadge: boolean;
  label: string;
  onClick: () => void;
};

const PelmelBotLauncher = forwardRef<HTMLButtonElement, PelmelBotLauncherProps>(
  function PelmelBotLauncher({ isOpen, showGreeting, showBadge, label, onClick }, ref) {
    const greeting = useGreeting(showGreeting);

    return (
      <div className={styles.launcherWrap}>
        <span
          className={`${styles.greeting} ${showGreeting && greeting ? styles.greetingVisible : ""}`}
          aria-hidden="true"
        >
          {greeting}
          <span className={styles.greetingCaret} />
        </span>
        <button
          ref={ref}
          type="button"
          className={styles.launcher}
          onClick={onClick}
          aria-label={label}
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
  },
);

export default PelmelBotLauncher;
