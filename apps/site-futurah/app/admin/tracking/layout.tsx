import "./dashboard.css";

// Layout dedicado pro dashboard. Importa o dashboard.css uma única vez aqui,
// escopando os estilos `.trk-*` ao subtree `/admin/tracking/*`. O layout root
// do site (`app/layout.tsx`) continua minimalista — esse CSS não vaza pro
// admin do Payload nem pro site público.

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
