"use client";

import { useState, useCallback, useEffect } from "react";

export function useCopyToClipboard(resetInterval = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback((text: string) => {
    if (!navigator.clipboard) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      document.body.prepend(textArea);
      textArea.select();
      
      try {
        document.execCommand("copy");
        setIsCopied(true);
      } catch (error) {
        console.error("Failed to copy text:", error);
        setIsCopied(false);
      } finally {
        textArea.remove();
      }
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setIsCopied(true);
      }).catch((error) => {
        console.error("Failed to copy text:", error);
        setIsCopied(false);
      });
    }
  }, []);

  useEffect(() => {
    let timeoutId: number | undefined;
    
    if (isCopied && resetInterval) {
      timeoutId = window.setTimeout(() => setIsCopied(false), resetInterval);
    }
    
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isCopied, resetInterval]);

  return { isCopied, copyToClipboard };
}