"use client";
import apiLinks from "@/utils/api-links";
import React, { useEffect, useState } from "react";
import ProductCard, { ProductFlashCard } from "./ProductCard";
import Slider from "react-slick";

interface ProductListComponent {
  productExternalIds: string[];
  productGroupSlug: string;
  settings: any;
  type: "SECTION" | "FLASHSALE" | "BESTSELLER";
}

export default function ProductList({
  productExternalIds,
  settings,
  type,
  productGroupSlug,
}: ProductListComponent) {
  const updatedSettings =
    productExternalIds.length > 10
      ? { ...settings, slidesPerRow: 2 }
      : settings;

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const idsQuery = productExternalIds
      .map((id) => `ids=${encodeURIComponent(id)}`)
      .join("&");
    const eventSource = new EventSource(
      `${apiLinks.product.getListIds}${idsQuery}`,
    );

    eventSource.onmessage = (event) => {
      const product: any = JSON.parse(event.data);
      setProducts((prevProducts) => {
        const updatedProducts = [...prevProducts, product];
        return updatedProducts.slice(0, 15); // Limit to max 8 products
      });
    };

    eventSource.onerror = (error) => {
      eventSource.close();
    };

    return () => {
      // Clean up the event source when the component is unmounted
      eventSource.close();
    };
  }, []);

  if (type == "SECTION") {
    return (
      <Slider {...updatedSettings}>
        {products &&
          products.map((product) => (
            <ProductCard
              key={product.Id}
              product={product}
              productGroupSlug={productGroupSlug}
            />
          ))}
      </Slider>
    );
  } else if (type == "FLASHSALE") {
    return (
      <Slider {...updatedSettings}>
        {products &&
          products.map((product) => (
            <ProductFlashCard
              key={product.Id}
              product={product}
              productGroupSlug={productGroupSlug}
            />
          ))}
      </Slider>
    );
  } else {
    return (
      <div className="row">
        {products &&
          products.slice(0, 6).map((product) => (
            <div className="col-6 col-lg-4">
              <ProductCard
                key={product.Id}
                product={product}
                productGroupSlug={productGroupSlug}
              />
            </div>
          ))}
      </div>
    );
  }
}
