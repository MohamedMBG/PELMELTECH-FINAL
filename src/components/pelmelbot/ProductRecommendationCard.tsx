"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Printer } from "lucide-react";
import type { PelmelBotUi } from "@/data/pelmelbot";
import styles from "../PelmelBot.module.css";

type ProductRecommendationCardProps = {
  text: string;
  ui: PelmelBotUi;
  productSlug?: string;
};

function parseRecommendation(text: string, ui: PelmelBotUi) {
  const lines = text.split("\n").filter(Boolean);
  const machineName =
    lines[0]
      ?.replace(ui.recommendationPrefix, "")
      .replace(/^[\s:：'’`-]+/, "")
      .replace(/[.。]$/, "")
      .trim() || lines[0];
  return { machineName, descriptionLines: lines.slice(1) };
}

export default function ProductRecommendationCard({
  text,
  ui,
  productSlug,
}: ProductRecommendationCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const { machineName, descriptionLines } = parseRecommendation(text, ui);
  const imageSrc = productSlug ? `/images/products/main/${productSlug}.webp` : null;
  const showImage = Boolean(imageSrc) && !imageFailed;

  return (
    <div className={styles.recCard}>
      <div className={styles.recMedia}>
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc as string}
            alt={machineName}
            loading="lazy"
            className={styles.recImage}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className={styles.recImageFallback} role="img" aria-label={ui.imageUnavailableLabel}>
            <Printer size={24} aria-hidden="true" />
          </div>
        )}
      </div>

      <div className={styles.recBody}>
        <div className={styles.recHeader}>
          <CheckCircle2 size={13} aria-hidden="true" />
          <span>{ui.recommendationLabel}</span>
        </div>
        <p className={styles.recTitle}>{machineName}</p>
        {descriptionLines.length ? (
          <ul className={styles.recSpecs}>
            {descriptionLines.map((line, i) => (
              <li key={i} className={styles.recSpec}>
                {line}
              </li>
            ))}
          </ul>
        ) : null}
        {productSlug ? (
          <Link href={`/catalog/${productSlug}`} className={styles.recLink}>
            <span>{ui.viewProductLabel}</span>
            <ArrowRight size={15} aria-hidden="true" className="rtl:flip" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
