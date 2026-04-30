"use client";

import { usePathname } from "next/navigation";
import { Tracker } from "@futurah/tracker-sdk/react";

const SITE_ID = "fidevidraceiro";

export function TrackerBoundary() {
  const pathname = usePathname();
  const endpoint = process.env.NEXT_PUBLIC_TRACKER_ENDPOINT || "";
  if (!endpoint) return null;
  return <Tracker siteId={SITE_ID} endpoint={endpoint} pathname={pathname} />;
}
