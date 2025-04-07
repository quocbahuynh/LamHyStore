"use client";
import { useState, useEffect } from "react";

type SaleType = "product" | "gomorder" | "livestream";

export function useSalePrice(
  priceBooks: any[] = [],
  type: SaleType = "product",
) {
  const [salePrice, setSalePrice] = useState<number | null>(null);

  useEffect(() => {
    if (!Array.isArray(priceBooks)) {
      setSalePrice(null);
      return;
    }

    const normalizedPriceBooks = priceBooks.map((book) =>
      Object.keys(book).reduce(
        (acc, key) => {
          acc[key.toLowerCase()] = book[key];
          return acc;
        },
        {} as Record<string, any>,
      ),
    );

    const now = new Date();

    // Define keyword match logic based on type
    const isMatchingPriceBook = (pricebookname: string = "") => {
      const name = pricebookname.toLowerCase();

      if (type === "product") return name.includes("website");
      if (type === "gomorder") return name.includes("gomorder");
      if (type === "livestream")
        return name.includes("livestream") || name.includes("date");

      return false;
    };

    const validPrices = normalizedPriceBooks.filter(
      ({ isactive, startdate, enddate, pricebookname }) => {
        const start = new Date(startdate);
        const end = new Date(enddate);

        return (
          isactive &&
          start <= now &&
          now <= end &&
          isMatchingPriceBook(pricebookname)
        );
      },
    );

    if (validPrices.length > 0) {
      setSalePrice(Math.min(...validPrices.map(({ price }) => price)));
    } else {
      setSalePrice(null);
    }
  }, [priceBooks, type]);

  return salePrice;
}
