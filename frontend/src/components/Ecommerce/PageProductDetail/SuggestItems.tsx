"use client";
import apiLinks from "@/utils/api-links";
import { usePhotoProduct } from "@/utils/useProductPhoto";
// @ts-ignore
import stringSimilarity from "@elsikora/string-similarity";
import { useSalePrice } from "@/utils/useSalePrice";
import axios from "axios";
import Link from "next/link";

import React, { useEffect, useState } from "react";
import { useVNDFormatter } from "@/utils/useVNDFormatter";

interface SuggestItemsComponent {
  slug: string;
  mainProductName: string;
}

interface ProductSuggestCardComponent {
  data: any;
  productGroupSlug: string;
}

const ProductSuggestCard = ({
  data,
  productGroupSlug,
}: ProductSuggestCardComponent) => {
  const photoProduct = usePhotoProduct(data);
  const salePrice = useSalePrice(data.PriceBooks);
  const formatMoney = useVNDFormatter();
  return (
    <li className="mb-7">
      <div className="d-flex align-items-center border rounded p-6">
        <Link
          href={`/san-pham/${data.Id}?group=${productGroupSlug}`}
          className="d-block pe-6"
        >
          <img src={photoProduct} width={84} height={102} alt={data.FullName} />
        </Link>
        <div className="d-flex justify-content-between w-100">
          <div>
            <Link
              className="text-decoration-none d-blockmb-3 pb-1"
              href={`/san-pham/${data.Id}?group=${productGroupSlug}`}
            >
              {data.FullName}
            </Link>
            <div className="d-flex align-items-center flex-wrap me-0 fs-12px mb-5 mt-3">
              <div className="rating">⭐️⭐️⭐️⭐️⭐️</div>
            </div>
          </div>
          <span className="text-body-emphasis fw-bold ms-4">
            {salePrice ? formatMoney(salePrice) : formatMoney(data.BasePrice)}
          </span>
        </div>
      </div>
    </li>
  );
};

export default function SuggestItems({
  slug,
  mainProductName,
}: SuggestItemsComponent) {
  const [productExternalIds, setProductExternalIds] = useState([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${apiLinks.homepage.productGroup}/${slug}`,
        );
        setProductExternalIds(res.data.productExternalIds || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [slug]); // Dependency on `slug`

  useEffect(() => {
    if (productExternalIds.length === 0) return;

    const idsQuery = productExternalIds
      .map((id) => `ids=${encodeURIComponent(id)}`)
      .join("&");
    const eventSource = new EventSource(
      `${apiLinks.product.getListIds}${idsQuery}`,
    );

    eventSource.onmessage = (event) => {
      const product: any = JSON.parse(event.data);
      const compare = stringSimilarity.compareTwoStrings(
        mainProductName,
        product.FullName,
      );

      if (compare >= 0.7 && compare != 1) {
        setProducts([...products, product]);
      }
    };

    eventSource.onerror = (error) => {
      eventSource.close();
    };

    return () => {
      // Clean up the event source when the component is unmounted
      eventSource.close();
    };
  }, [productExternalIds]);

  return (
    <>
      <ul className="list-unstyled product-info mb-0 mt-10">
        {products.length > 0 && <p className="fs-15px">Các mã khác:</p>}
        {products.map((p, i) => (
          <ProductSuggestCard data={p} key={i} productGroupSlug={slug} />
        ))}
      </ul>
    </>
  );
}
