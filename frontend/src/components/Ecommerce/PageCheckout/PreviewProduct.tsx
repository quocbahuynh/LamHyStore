"use client";
import {
  CartItem,
  selectCartTotal,
  updateProductInfo,
} from "@/slices/cartSlice";
import { useCart } from "@/store/store";
import apiLinks from "@/utils/api-links";
import { usePhotoProduct } from "@/utils/useProductPhoto";
import { useSalePrice } from "@/utils/useSalePrice";
import useTruncatedText from "@/utils/useTruncatedText";
import { useVNDFormatter } from "@/utils/useVNDFormatter";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

interface ProductComponent {
  item: any;
}

const Product = ({ item }: any) => {
  const truncatedName = useTruncatedText(item.product.Name, 40);
  const formatMoney = useVNDFormatter();
  const dispatch = useDispatch();
  const salePrice = useSalePrice(item.product.PriceBooks);
  const photoProduct = usePhotoProduct(item.product);

  useEffect(() => {
    const updatedInfo: any = {
      id: item.product.Id, // Existing product ID
      basePrice: salePrice ? salePrice : item.product.BasePrice, // New base price
      image: photoProduct,
      name: item.product.Name, // New name
    };

    dispatch(updateProductInfo(updatedInfo));
  }, [salePrice, photoProduct, item.product]);
  return (
    <div className="d-flex w-100 mb-7">
      <div className="me-6">
        <img
          src={photoProduct}
          className="lazy-image"
          width={60}
          height={80}
          alt={item.product.Name}
        />
      </div>
      <div className="d-flex flex-grow-1">
        <div className="pe-6">
          <Link href={`/san-pham/${item.Id}`} className="">
            {truncatedName}
          </Link>
          <p className="fs-14px text-body-emphasis mb-0 mt-1">
            Số lượng:
            <span className="text-body ms-3">x{item.quantity}</span>
          </p>
        </div>
        <div className="ms-auto">
          <p className="fs-14px text-body-emphasis mb-0 fw-bold">
            {formatMoney(item.product.BasePrice)}
          </p>
        </div>
      </div>
    </div>
  );
};

interface PreviewProductComponent {
  deliveryFee: number;
}

interface ProductUpdate {
  product: any;
  quantity: number;
}

export default function PreviewProduct({
  deliveryFee,
}: PreviewProductComponent) {
  const [products, setProducts] = useState<ProductUpdate[]>([]);
  const totalPrice = useSelector(selectCartTotal);
  const formatMoney = useVNDFormatter();
  const total = totalPrice + deliveryFee;
  const cart = useCart();
  const [isModalVisible, setModalVisible] = useState(false);

  const [updatePriceProgress, setUpdateProgress] = useState(0);

  useEffect(() => {
    if (cart.length > 0) {
      setProducts([]);
      setUpdateProgress(0);
      setModalVisible(true);
      const url = `${apiLinks.product.getListIds}${cart
        .map((c) => `ids=${c.id}`)
        .join("&")}`;
      const eventSource = new EventSource(url);
      let processedItems = 0;

      eventSource.onmessage = (event) => {
        const product: any = JSON.parse(event.data);
        const productCart: any = cart.find((c) => c.id == product.Id);
        const data = {
          product: product,
          quantity: productCart.quantity,
        };

        setProducts((prevProducts) => [...prevProducts, data]);

        // Update progress
        processedItems += 1;
        setUpdateProgress(Math.round((processedItems / cart.length) * 100));
      };

      eventSource.onerror = () => {
        console.error("Error fetching products");
        setModalVisible(false);
        eventSource.close();
      };

      return () => eventSource.close();
    }
  }, []);

  return (
    <div className="card border-0 rounded-0 ">
      <div className="card-header px-0 mx-10 bg-transparent py-8 pt-6">
        {products.map((c, i) => (
          <Product key={i} item={c} />
        ))}
      </div>
      <div className="card-body px-10 py-8">
        <div className="d-flex align-items-center mb-2">
          <span>Tạm tính:</span>
          <span className="d-block ms-auto text-body-emphasis fw-bold">
            {formatMoney(totalPrice)}
          </span>
        </div>
        <div className="d-flex align-items-center">
          <span>Phí vận chuyển:</span>
          <span className="d-block ms-auto text-body-emphasis fw-bold">
            {formatMoney(deliveryFee)}
          </span>
        </div>
      </div>
      <div className="card-footer bg-transparent py-5 px-0 mx-10">
        <div className="d-flex align-items-center fw-bold mb-6">
          <span className="text-body-emphasis p-0">Tổng tiền:</span>
          <span className="d-block ms-auto text-body-emphasis fs-4 fw-bold">
            {formatMoney(total)}
          </span>
        </div>
      </div>

      <Modal
        show={isModalVisible}
        onHide={() => setModalVisible(false)}
        centered
      >
        <Modal.Body className="text-center pt-3">
          <p>Hệ thống đang cập nhật lại giá sản phẩm</p>
          <Spinner
            animation="border"
            role="status"
            className="mb-3 mt-3"
          ></Spinner>
          <div className="mb-3">
            <strong>Đang cập nhật: {updatePriceProgress}%</strong>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
