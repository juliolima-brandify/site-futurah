import type { Metadata, Viewport } from "next";
import "./prototipos.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function PrototiposLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
