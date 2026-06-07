import type { Metadata } from "next";
import SessionDeck from "./SessionDeck";

export const metadata: Metadata = {
  title: "Sessão Estratégica — Creator Elite",
  description: "Deck interno de condução da Sessão Estratégica Creator Elite.",
  robots: { index: false, follow: false, nocache: true },
};

export default function CreatorEliteSessaoPage() {
  return <SessionDeck />;
}
