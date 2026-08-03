import type { PelmelBotUi } from "@/data/pelmelbot";
import { getPhaseLabel, getStepProgress } from "./progress";
import styles from "../PelmelBot.module.css";

type ChatProgressProps = {
  stepId: string;
  ui: PelmelBotUi;
};

export default function ChatProgress({ stepId, ui }: ChatProgressProps) {
  const progress = getStepProgress(stepId);
  if (!progress) return null;

  const { current, total, phase } = progress;
  const label = getPhaseLabel(phase, ui);
  const valueText = `${current} ${ui.progressStepWord} ${total} · ${label}`;

  return (
    <div
      className={styles.progress}
      role="progressbar"
      aria-label={ui.progressLabel}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-valuetext={valueText}
    >
      <span className={styles.progressDots} aria-hidden="true">
        {Array.from({ length: total }, (_, i) => {
          const index = i + 1;
          const state =
            index < current ? styles.dotDone : index === current ? styles.dotActive : "";
          return <span key={index} className={`${styles.dot} ${state}`} />;
        })}
      </span>
      <span className={styles.progressText} aria-hidden="true">
        <span className={styles.progressStep}>{current}</span>
        <span className={styles.progressStepMuted}>
          {" "}
          {ui.progressStepWord} {total}
        </span>
        <span className={styles.progressDivider} aria-hidden="true">
          ·
        </span>
        <span className={styles.progressPhase}>{label}</span>
      </span>
    </div>
  );
}
