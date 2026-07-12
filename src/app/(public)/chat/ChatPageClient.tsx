"use client";

import ChatPanel from "@/components/ChatPanel";

export default function ChatPageClient() {
  return (
    <section className="pmb-stage">
      <ChatPanel variant="page" active />

      <style jsx>{`
        .pmb-stage {
          display: flex;
          height: calc(100dvh - 4rem);
          background: #ffffff;
        }
        @media (min-width: 1024px) {
          .pmb-stage {
            height: calc(100dvh - 5rem);
          }
        }
      `}</style>
    </section>
  );
}
