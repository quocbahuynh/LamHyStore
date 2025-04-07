"use client";
import useProducts from "@/utils/useProducts";
import React from "react";
import ProductCard from "../ProductCard";

interface ProductListComponent {
  idList: string[];
  productGroupSlug: string;
}

export default function ProductGroupList({
  idList,
  productGroupSlug,
}: ProductListComponent) {
  const { products } = useProducts(idList);
  return (
    <>
      {products &&
        products.map((p, i) => (
          <div key={i} className="col-6 col-sm-6 col-lg-3">
            <ProductCard product={p} productGroupSlug={productGroupSlug} />
          </div>
        ))}
    </>
  );
}
