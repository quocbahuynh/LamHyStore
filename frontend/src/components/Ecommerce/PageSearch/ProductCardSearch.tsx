"use client";
import { addItem } from "@/slices/cartSlice";
import { usePhotoProduct } from "@/utils/useProductPhoto";
import { useSalePrice } from "@/utils/useSalePrice";
import { useVNDFormatter } from "@/utils/useVNDFormatter";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "react-bootstrap";
import { useDispatch } from "react-redux";

export default function ProductCardSearch({ product }: any) {
  const formatMoney = useVNDFormatter();
  const salePrice = useSalePrice(product.priceBooks);
  const dispatch = useDispatch();
  const photoProduct = usePhotoProduct(product);
  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addItem({
          id: product.id,
          code: product.Code,
          quantity: 1,
          basePrice: salePrice ? salePrice : product.basePrice,
          image: photoProduct,
          name: product.fullName,
        }),
      );
    }
  };

  return (
    <div className="card card-product grid-1 bg-white border-0 mb-6">
      <figure className="card-img-top position-relative mb-7 overflow-hidden">
        <Link
          href={`/san-pham/${product.id}`}
          className="hover-zoom-in d-block"
        >
          <img
            src={photoProduct}
            className="img-fluid w-100"
            alt={product.fullName}
          />
        </Link>
        <div className="position-absolute d-flex z-index-2 product-actions horizontal align-items-center">
          <Link className="cursor-pointer" href={`/san-pham/${product.id}`}>
            <Badge
              className="py-4 px-4 product-action"
              style={{ fontSize: "13px" }}
            >
              Xem thêm
            </Badge>
          </Link>
        </div>
      </figure>
      <div className="card-body p-0">
        <span className="d-flex align-items-center price fw-bold justify-content-start mb-3 fs-6">
          {salePrice ? (
            <>
              <del className="text-body fw-500 me-4 fs-13px">
                {formatMoney(product.basePrice)}
              </del>
              <ins className="text-decoration-none">
                {formatMoney(salePrice)}
              </ins>
            </>
          ) : (
            <ins className="text-decoration-none">
              {formatMoney(product.basePrice)}
            </ins>
          )}
        </span>
        <h4 className="product-title card-title fs-15px fw-500 mb-3 text-left">
          <Link
            className="text-decoration-none"
            href={`/san-pham/${product.id}`}
          >
            {product.fullName.length > 20
              ? product.fullName.slice(0, 53) + "..."
              : product.fullName}
          </Link>
        </h4>
        <div className="d-flex align-items-center fs-12px justify-content-start">
          <div className="rating">⭐️⭐️⭐️⭐️⭐️</div>
        </div>
      </div>
    </div>
  );
}
