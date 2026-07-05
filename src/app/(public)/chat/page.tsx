import type { Metadata } from "next";
import ChatPageClient from "./ChatPageClient";

export const metadata: Metadata = {
  title: "PelmelBot - PelmelTech Assistant",
  description:
    "Chat with PelmelBot, the PelmelTech assistant, to find the right printing machine for your needs.",
};

export default function ChatPage() {
  return <ChatPageClient />;
}
