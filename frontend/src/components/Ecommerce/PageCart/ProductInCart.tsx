"use client";
import { CartItem, removeItem, updateQuantity } from "@/slices/cartSlice";
import useTruncatedText from "@/utils/useTruncatedText";
import { useVNDFormatter } from "@/utils/useVNDFormatter";
import React, { useState } from "react";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";

interface ProductInCartComponent {
  item: CartItem;
}

export default function ProductInCart({ item }: ProductInCartComponent) {
  const [quantity, setQuantity] = useState<number>(1);
  const truncatedName = useTruncatedText(item.name, 20);
  const formatMoney = useVNDFormatter();
  const dispatch = useDispatch();

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleAddToCart = (updatedQuantity: number) => {
    if (item) {
      dispatch(
        updateQuantity({
          id: item.id,
          quantity: updatedQuantity, // Use the updated quantity
        }),
      );
    }
  };
  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    handleAddToCart(newQuantity);
  };

  const handleDecrement = () => {
    const newQuantity = quantity > 1 ? quantity - 1 : 1;
    setQuantity(newQuantity);
    handleAddToCart(newQuantity);
  };

  return (
    <tr className="position-relative">
      <td className="align-middle text-center">
        <a
          onClick={() => handleRemoveItem(item.id)}
          className="d-block clear-product"
        >
          <FaTimes />
        </a>
      </td>
      <td className="shop-product">
        <div className="d-flex align-items-center">
          <div className="me-6">
            <img src={item.image} width={60} height={80} alt={item.name} />
          </div>
          <div>
            <p className="card-text mb-1">
              <span className="fs-15px fw-bold text-body-emphasis">
                {formatMoney(item.basePrice)}
              </span>
            </p>
            <p className="fw-500 text-body-emphasis">{truncatedName}</p>
          </div>
        </div>
      </td>
      <td className="align-middle p-0">
        <div className="input-group position-relative shop-quantity">
          <a
            onClick={handleDecrement}
            className="shop-down position-absolute z-index-2"
          >
            <FaMinus />
          </a>
          <input
            type="number"
            className="form-control form-control-sm px-6 py-4 fs-6 text-center border-0"
            value={item.quantity}
            required
            disabled
          />
          <a
            onClick={handleIncrement}
            className="shop-up position-absolute z-index-2"
          >
            <FaPlus />
          </a>
        </div>
      </td>
    </tr>
  );
}
