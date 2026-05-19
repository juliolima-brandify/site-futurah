"use client";

import { usePathname } from "next/navigation";
import { Tracker } from "@futurah/tracker-sdk/react";

const SITE_ID = "augustofelipe";

export function TrackerBoundary() {
  const pathname = usePathname();
  const endpoint = process.env.NEXT_PUBLIC_TRACKER_ENDPOINT || "";
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || undefined;
  if (!endpoint) return null;
  return (
    <Tracker
      siteId={SITE_ID}
      endpoint={endpoint}
      pathname={pathname}
      metaPixelId={metaPixelId}
    />
  );
}
