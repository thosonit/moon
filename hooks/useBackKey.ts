"use client";

import { useEffect } from "react";

const BACK_KEYS = new Set(["Escape", "Backspace", "GoBack", "BrowserBack"]);
// 10009 = Samsung Tizen remote "Back", 461 = LG webOS remote "Back".
const BACK_KEY_CODES = new Set([10009, 461]);

/**
 * Listens for TV-remote / keyboard "Back" presses (Escape, Backspace, and the
 * vendor-specific key codes Tizen and webOS remotes send) and calls `onBack`.
 */
export function useBackKey(onBack: () => void) {
  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (BACK_KEYS.has(event.key) || BACK_KEY_CODES.has(event.keyCode)) {
        event.preventDefault();
        onBack();
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onBack]);
}
