"use client";
import { useMemo } from "react";

const useTruncatedText = (text: string, maxLength = 20) => {
  return useMemo(() => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }, [text, maxLength]);
};

export default useTruncatedText;
