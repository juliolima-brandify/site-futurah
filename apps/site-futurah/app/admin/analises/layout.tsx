// Layout dedicado da revisão de análises. Importa `analises.css` aqui pra
// escopar os estilos `.anr-*` ao subtree `/admin/analises/*`. O layout root
// do site (`app/layout.tsx`) continua minimalista.

export default function AnalisesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
