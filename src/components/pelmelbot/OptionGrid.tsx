"use client";

import type { PelmelBotOption } from "@/data/pelmelbot";
import { ICON_MAP } from "./icons";
import styles from "../PelmelBot.module.css";

function OptionIcon({ name }: { name?: string }) {
  if (!name) return null;
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={18} aria-hidden="true" className={styles.optionIcon} />;
}

type OptionGridProps = {
  options: PelmelBotOption[];
  disabled: boolean;
  isTyping: boolean;
  selectedLabel: string | null;
  onSelect: (option: PelmelBotOption) => void;
};

export default function OptionGrid({
  options,
  disabled,
  isTyping,
  selectedLabel,
  onSelect,
}: OptionGridProps) {
  return (
    <div className={styles.options} role="group">
      {options.map((option) => {
        const selected = disabled && selectedLabel === option.label;
        return (
          <button
            type="button"
            key={option.label}
            disabled={disabled || isTyping}
            aria-pressed={selected}
            onClick={() => onSelect(option)}
            className={`${styles.optionCard} ${selected ? styles.optionCardSelected : ""}`}
          >
            <OptionIcon name={option.icon} />
            <span className={styles.optionLabel}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
