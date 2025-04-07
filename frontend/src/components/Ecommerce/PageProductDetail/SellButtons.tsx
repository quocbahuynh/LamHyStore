"use client";
import React, { useState } from "react";
import Branches from "./Branches";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addItem } from "@/slices/cartSlice";
import { useCart } from "@/store/store";
import { useSalePrice } from "@/utils/useSalePrice";
import { usePhotoProduct } from "@/utils/useProductPhoto";

interface SellButtonsComponent {
  totalOnHand: number;
  productData: any;
}

export default function SellButtons({
  totalOnHand,
  productData,
}: SellButtonsComponent) {
  const [quantity, setQuantity] = useState<number>(1);
  const salePrice = useSalePrice(productData.priceBooks);
  const router = useRouter();
  const photoProduct = usePhotoProduct(productData);
  const cart = useCart();

  const dispatch = useDispatch();

  const handleIncrement = () => {
    if (quantity < totalOnHand) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    } else {
      alert(`Chỉ còn ${quantity} trong kho!`);
    }
  };

  // Handle decrement quantity
  const handleDecrement = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleAddToCart = () => {
    if (!productData) return;

    const item = cart.find((i) => i.id === productData.id);

    if (item) {
      const cartAndStorage = item.quantity + quantity;

      if (cartAndStorage >= totalOnHand) {
        alert("Vượt quá số lượng sản phẩm!");
        return;
      }
    }

    dispatch(
      addItem({
        id: productData.id,
        code: productData.Code,
        quantity,
        basePrice: salePrice ? salePrice : productData.basePrice,
        image: photoProduct,
        name: productData.fullName,
      }),
    );
  };

  const handleBuyNow = () => {
    if (!productData) return;

    handleAddToCart();

    router.push("/thanh-toan");
  };
  return (
    <>
      <div className="mb-9 pb-2 mt-7">
        <div className="row align-items-end">
          <div className="form-group col-5">
            <label
              className="text-body-emphasis fw-semibold fs-15px pb-6"
              htmlFor="number"
            ></label>
            <div className="input-group position-relative w-100 input-group-lg">
              <button
                className="bg-transparent border-0 shop-down position-absolute translate-middle-y top-50 start-0 ps-7 product-info-2-minus "
                onClick={handleDecrement}
              >
                <FaMinus />
              </button>
              <input
                disabled
                name="number"
                type="number"
                id="number"
                className="product-info-2-quantity form-control w-100 px-6 text-center"
                value={quantity}
                required
              />
              <button
                className=" bg-transparent border-0 shop-up position-absolute translate-middle-y top-50 end-0 pe-7 product-info-2-plus"
                onClick={handleIncrement}
              >
                <FaPlus />
              </button>
            </div>
          </div>
          <div className="col-7 pt-9 mt-2 mt-sm-0 pt-sm-0">
            <button
              type="submit"
              className="btn-hover-bg-primary btn-hover-border-primary btn btn-lg btn-outline-primary w-100"
              disabled={totalOnHand < 1}
              onClick={handleAddToCart}
            >
              <span className="d-inline d-lg-none">Thêm vào giỏ</span>
              <span className="d-none d-lg-inline">Thêm vào giỏ hàng</span>
            </button>
          </div>
        </div>
      </div>
      <div className="mb-9 pb-2">
        <div className="d-flex flex-column flex-sm-row gap-3 align-items-stretch">
          <div className="col-12 col-sm-6">
            {totalOnHand >= 1 ? (
              <button
                type="button"
                className="btn btn-lg btn-primary w-100"
                onClick={handleBuyNow}
              >
                Mua ngay
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-lg btn-dark w-100"
                disabled
              >
                Hết hàng
              </button>
            )}
          </div>
          <div className="col-12 col-sm-6">
            <Branches inventories={productData.inventories} />
          </div>
        </div>
      </div>
    </>
  );
}
