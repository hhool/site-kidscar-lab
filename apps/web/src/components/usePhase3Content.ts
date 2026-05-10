"use client";

import { useEffect, useState } from "react";
import { defaultPhase3ContentSnapshot, type Phase3ContentSnapshot } from "@/lib/phase3-content-defaults";

export function usePhase3Content() {
  const [content, setContent] = useState<Phase3ContentSnapshot>(defaultPhase3ContentSnapshot);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch("/api/content/phase3", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { ok?: boolean; snapshot?: Phase3ContentSnapshot | null };
        if (!cancelled && data.ok && data.snapshot) {
          setContent(data.snapshot);
        }
      } catch {
        // Keep the baked-in fallback snapshot when the content service is unavailable.
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return content;
}
