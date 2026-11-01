import { useCallback, useRef, useState } from "react";

type ClipboardStatus = "idle" | "copied" | "error";

/**
 * Copies text to the clipboard and exposes a short-lived status for toast/
 * inline feedback UI. Falls back to the `document.execCommand` path for
 * non-secure contexts or older WebViews, same as the original vanilla-JS
 * gallery — kept because this artifact may get embedded in contexts without
 * a secure origin (e.g. an Electron shell or an http-only staging preview).
 */
export function useClipboard(resetAfterMs = 2500) {
  const [status, setStatus] = useState<ClipboardStatus>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string) => {
      const succeed = () => {
        setStatus("copied");
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setStatus("idle"), resetAfterMs);
      };

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          succeed();
          return;
        }
        throw new Error("insecure-context");
      } catch {
        try {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.left = "-9999px";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand("copy");
          textarea.remove();
          succeed();
        } catch {
          setStatus("error");
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => setStatus("idle"), resetAfterMs);
        }
      }
    },
    [resetAfterMs],
  );

  return { status, copy };
}
