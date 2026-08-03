import Image from "next/image";
import { X } from "lucide-react";
import type { PelmelBotUi } from "@/data/pelmelbot";
import styles from "../PelmelBot.module.css";

type PelmelBotHeaderProps = {
  ui: PelmelBotUi;
  onClose?: () => void;
};

export default function PelmelBotHeader({ ui, onClose }: PelmelBotHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerIdentity}>
        <span className={styles.headerLogoTile}>
          <Image
            src="/images/pelmeltech/logo_pelmeltech.png"
            alt="PelmelTech"
            width={40}
            height={40}
            className={styles.headerLogo}
          />
        </span>
        <div className={styles.headerText}>
          <p className={styles.headerName}>PelmelBot</p>
          <p className={styles.headerStatus}>
            <span aria-hidden="true" className={styles.statusDot} />
            {ui.assistantLabel}
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
          <X size={20} aria-hidden="true" strokeWidth={2.4} />
        </button>
      ) : null}
    </header>
  );
}
