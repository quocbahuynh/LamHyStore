"use client";
import { useCallback } from "react";

export function useVNDFormatter() {
  return useCallback((amount: number | undefined | null) => {
    if (typeof amount !== "number" || isNaN(amount)) {
      return "0 VND"; // Fallback in case amount is undefined or not a number
    }
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }, []);
}
