"use client";

import ChatPanel from "@/components/ChatPanel";
import { useLanguage } from "@/i18n";
import { Zap, Clock, MessageSquareText } from "lucide-react";

const copy = {
  en: {
    eyebrow: "PelmelTech Assistant",
    titleLead: "Chat with",
    botName: "PelmelBot",
    description:
      "Answer a few quick questions and find the exact printing machine for your workshop.",
    chips: [
      { icon: Zap, label: "Instant match" },
      { icon: Clock, label: "Always on" },
      { icon: MessageSquareText, label: "Real experts" },
    ],
  },
  fr: {
    eyebrow: "Assistant PelmelTech",
    titleLead: "Discutez avec",
    botName: "PelmelBot",
    description:
      "Répondez à quelques questions et trouvez la machine d'impression idéale pour votre atelier.",
    chips: [
      { icon: Zap, label: "Réponse immédiate" },
      { icon: Clock, label: "Toujours dispo" },
      { icon: MessageSquareText, label: "Vrais experts" },
    ],
  },
  ar: {
    eyebrow: "مساعد PelmelTech",
    titleLead: "تحدث مع",
    botName: "PelmelBot",
    description:
      "أجب عن بعض الأسئلة السريعة واعثر على آلة الطباعة المناسبة لورشتك.",
    chips: [
      { icon: Zap, label: "توصية فورية" },
      { icon: Clock, label: "متاح دائمًا" },
      { icon: MessageSquareText, label: "خبراء حقيقيون" },
    ],
  },
};

export default function ChatPageClient() {
  const { locale } = useLanguage();
  const text = copy[locale];

  return (
    <section className="pmb-stage">
      <div className="pmb-dots" aria-hidden="true" />

      <div className="pmb-inner">
        <header className="pmb-head">
          <span className="pmb-eyebrow">{text.eyebrow}</span>
          <h1 className="pmb-title">
            {text.titleLead} <span className="pmb-title-name">{text.botName}</span>
          </h1>
          <p className="pmb-desc">{text.description}</p>

          <ul className="pmb-chips">
            {text.chips.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.label} className="pmb-chip">
                  <Icon size={14} aria-hidden="true" />
                  {c.label}
                </li>
              );
            })}
          </ul>
        </header>

        <div className="pmb-frame">
          <ChatPanel variant="page" active />
        </div>
      </div>

      <style jsx>{`
        .pmb-stage {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: calc(100dvh - 4rem);
          overflow: hidden;
          padding: 3rem 1.25rem 4rem;
          background:
            radial-gradient(60% 45% at 50% 0%, rgba(226, 0, 116, 0.05), transparent 70%),
            linear-gradient(180deg, #faf8ff 0%, #f2f0f7 100%);
          isolation: isolate;
        }
        @media (min-width: 1024px) {
          .pmb-stage {
            min-height: calc(100dvh - 5rem);
            padding: 4.5rem 2rem 5rem;
          }
        }

        .pmb-dots {
          position: absolute;
          inset: 0;
          z-index: -1;
          background-image: radial-gradient(rgba(26, 26, 43, 0.05) 1px, transparent 1px);
          background-size: 22px 22px;
          mask-image: radial-gradient(80% 60% at 50% 20%, #000, transparent 80%);
          -webkit-mask-image: radial-gradient(80% 60% at 50% 20%, #000, transparent 80%);
        }

        .pmb-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 820px;
        }

        /* Header */
        .pmb-head {
          text-align: center;
          margin-bottom: 2.5rem;
          animation: pmbRise 500ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .pmb-eyebrow {
          display: inline-block;
          color: #857376;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .pmb-title {
          margin: 0.75rem 0 0;
          color: #1a1a2b;
          font-size: clamp(1.75rem, 4.5vw, 2.5rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .pmb-title-name {
          color: #e20074;
        }
        .pmb-desc {
          margin: 1rem auto 0;
          max-width: 32rem;
          color: #534346;
          font-size: 1rem;
          line-height: 1.55;
        }

        .pmb-chips {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.6rem;
          margin: 1.5rem 0 0;
          padding: 0;
          list-style: none;
        }
        .pmb-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.8rem;
          border-radius: 999px;
          border: 1px solid rgba(26, 26, 43, 0.09);
          background: #ffffff;
          color: #534346;
          font-size: 0.8rem;
          font-weight: 650;
        }
        .pmb-chip :global(svg) {
          color: #e20074;
        }

        /* Chat frame — clean, modern, soft */
        .pmb-frame {
          width: 100%;
          height: min(860px, calc(100dvh - 16rem));
          min-height: 560px;
          display: flex;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid rgba(26, 26, 43, 0.08);
          background: #ffffff;
          box-shadow: 0 1px 2px rgba(26, 26, 43, 0.04),
            0 24px 60px -20px rgba(26, 26, 43, 0.18);
          animation: pmbRise 600ms cubic-bezier(0.22, 1, 0.36, 1) 120ms both;
        }

        @keyframes pmbRise {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pmb-head,
          .pmb-frame {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
