"use client";

import ChatPanel from "@/components/ChatPanel";
import { useLanguage } from "@/i18n";

const copy = {
  en: {
    title: "Chat with",
    description:
      "Your PelmelTech assistant helps you find the right printing machine.",
  },
  fr: {
    title: "Discutez avec",
    description:
      "Votre assistant PelmelTech vous aide à trouver la machine d'impression idéale.",
  },
  ar: {
    title: "تحدث مع",
    description:
      "يساعدك مساعد PelmelTech في العثور على آلة الطباعة المناسبة.",
  },
};

export default function ChatPageClient() {
  const { locale } = useLanguage();
  const text = copy[locale];

  return (
    <section className="min-h-[calc(100dvh-4rem)] lg:min-h-[calc(100dvh-5rem)] bg-gradient-to-b from-surface-container-low to-white px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
      <div className="text-center max-w-2xl mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface">
          {text.title} <span className="text-magenta">PelmelBot</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-on-surface-variant">
          {text.description}
        </p>
      </div>

      <div className="w-full max-w-[760px] h-[min(720px,calc(100dvh-16rem))] rounded-3xl border border-black/10 bg-white shadow-2xl overflow-hidden flex">
        <ChatPanel variant="page" active />
      </div>
    </section>
  );
}
