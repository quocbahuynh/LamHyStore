"use client";

import { useSalePrice } from "@/utils/useSalePrice";
import { useVNDFormatter } from "@/utils/useVNDFormatter";
import React from "react";

interface ProductPriceComponent {
  priceBooks: any[];
  basePrice: any;
}

export default function ProductPrice({
  priceBooks,
  basePrice,
}: ProductPriceComponent) {
  const salePrice = useSalePrice(priceBooks);
  const formatMoney = useVNDFormatter();
  return (
    <p className="d-flex align-items-center mb-6">
      {salePrice ? (
        <>
          <span className="text-decoration-line-through">
            {formatMoney(basePrice)}
          </span>
          <span className="fs-20px text-body-emphasis ps-6 fw-bold text-primary ">
            {formatMoney(salePrice)}
          </span>
          {basePrice > salePrice && (
            <span className="badge  fs-6 fw-semibold ms-7 px-6 py-3 bg-primary">
              {Math.round((1 - salePrice / basePrice) * 100)}%
            </span>
          )}
        </>
      ) : (
        <span className="fs-20px fw-bold text-primary">
          {formatMoney(basePrice)}
        </span>
      )}
    </p>
  );
}
