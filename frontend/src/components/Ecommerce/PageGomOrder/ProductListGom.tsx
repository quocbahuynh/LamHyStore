"use client";
import { Product } from "@/models/Product";
import useProducts from "@/utils/useProducts";
import { useSalePrice } from "@/utils/useSalePrice";
import { useVNDFormatter } from "@/utils/useVNDFormatter";
import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import ProductSupport from "../PageProductDetail/ProductSupport";
import ProductSocialIcon from "../PageProductDetail/ProductSocialIcon";
import ViewEyes from "../PageProductDetail/ViewEye";
import { FiInbox } from "react-icons/fi";
import ProductPrice from "../PageProductDetail/ProductPrice";
import Link from "next/link";
import { Modal, ProgressBar } from "react-bootstrap";
import { useDispatch } from "react-redux";
import useTruncatedText from "@/utils/useTruncatedText";
import { addItem, removeItem, updateQuantity } from "@/slices/gomOrderSlice";
import { usePhotoProduct } from "@/utils/useProductPhoto";
import { useGomOrderCart } from "@/store/store";

interface ProductListLiveComponent {
  idList: string[];
  type: "display" | "cart";
}

interface ProductItemLiveComponent {
  data: Product;
  type: "display" | "cart";
}

const ProductQuickViewModal = ({
  show,
  onHide,
  product,
}: {
  show: boolean;
  onHide: () => void;
  product: Product;
}) => {
  const totalOnHand = product.Inventories.reduce(
    (total, inventory) => total + inventory.OnHand,
    0,
  );
  const photoProduct = usePhotoProduct(product);
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal-xl"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body className="modal-content border-0 pt-9">
        <div className="row">
          <div className="col-md-6 pe-lg-13">
            <img
              src={photoProduct}
              width={540}
              height={520}
              alt={product.FullName}
              className="img-fluid product-image"
            />
          </div>
          <div className="col-md-6 pt-md-0 pt-10">
            <ProductPrice
              priceBooks={product.PriceBooks}
              basePrice={product.BasePrice}
            />
            <h1 className="mb-4 pb-2 fs-4">
              <Link
                className="text-decoration-none text-hover-primary"
                href={`/san-pham/${product.Id}`}
                title={product.FullName}
              >
                {product.FullName}
              </Link>
            </h1>
            <p className="fs-15px">
              {product.Description &&
                (product?.Description.length >= 1
                  ? product?.Description
                  : "Chưa có mô tả cho sản phẩm này.")}
            </p>
            <ViewEyes />
            <p className="mb-4 pb-2 text-body-emphasis">
              <FiInbox />
              {totalOnHand > 0
                ? ` Còn ${totalOnHand} sản phẩm trong kho.`
                : ` Hết hàng.`}
            </p>
            <ProgressBar now={totalOnHand} style={{ height: 4 }} />
            <ProductSupport />
            <ul className="single-product-meta list-unstyled border-top pt-7 mt-7">
              <li className="d-flex mb-4 pb-2 align-items-center">
                <span className="text-body-emphasis fw-semibold fs-14px">
                  Barcode:
                </span>
                <span className="ps-4">{product.BarCode}</span>
              </li>
              <li className="d-flex mb-4 pb-2 align-items-center">
                <span className="text-body-emphasis fw-semibold fs-14px">
                  Danh mục:
                </span>
                <span className="ps-4">{product.CategoryName}</span>
              </li>
            </ul>
            <ProductSocialIcon />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export const ProductItemGom = ({ data, type }: ProductItemLiveComponent) => {
  const [quickViewShow, setQuickViewShow] = useState(false);
  const formatMoney = useVNDFormatter();
  const name = useTruncatedText(data.FullName, 40);
  const salePrice = useSalePrice(data.PriceBooks, "gomorder");
  const mainPrice = salePrice ?? data.BasePrice;
  const photoProduct = usePhotoProduct(data);
  const cartItems = useGomOrderCart();
  const totalOnHand = data.Inventories.reduce(
    (total, inventory) => total + inventory.OnHand,
    0,
  );
  const [quantity, setQuantity] = useState<number>(0);
  const dispatch = useDispatch();

  const handleIncrement = () => {
    if (totalOnHand && quantity <= totalOnHand) {
      // Ensure it doesn't exceed available stock
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);

      const existingItem = cartItems.find((item) => item.id === data.Id); // Check if item exists
      console.log(existingItem);
      if (existingItem) {
        dispatch(updateQuantity({ id: data.Id, quantity: newQuantity }));
      } else {
        dispatch(
          addItem({
            id: data.Id,
            quantity: newQuantity,
            basePrice: salePrice ? salePrice : mainPrice,
            name: data.FullName,
            code: data.Code,
            image: photoProduct,
          }),
        );
      }
    } else {
      alert(`Hết hàng!`);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);

      if (newQuantity > 0) {
        dispatch(updateQuantity({ id: data.Id, quantity: newQuantity }));
      } else {
        dispatch(removeItem(data.Id)); // Remove from cart if quantity is 0
      }
    }
  };

  return (
    <>
      <div className="card border-0 flex-row align-items-center">
        <figure className="flex-shrink-0 mb-0 me-7">
          <a onClick={() => setQuickViewShow(true)} className="d-block">
            <img
              width={100}
              height={100}
              src={photoProduct}
              alt={data.FullName}
            />
          </a>
        </figure>
        <div className="card-body p-0 ">
          <h5 className="card-text fw-semibold text-uppercase fs-13px mb-3 text-body">
            {data.CategoryName}
          </h5>
          <h4
            className="card-title mb-0 text-body-emphasis fs-15px lh-base "
            onClick={() => setQuickViewShow(true)}
          >
            {name}
          </h4>
          <span
            className="d-flex align-items-center price fw-bold justify-content-start mb-3 fs-6"
            onClick={() => setQuickViewShow(true)}
          >
            {totalOnHand > 0 ? (
              salePrice ? (
                <>
                  <del className="text-body fw-500 me-4 fs-13px">
                    {formatMoney(data.BasePrice)}
                  </del>
                  <ins className="text-decoration-none">
                    {formatMoney(salePrice)}
                  </ins>
                </>
              ) : (
                <ins className="text-decoration-none">
                  {formatMoney(data.BasePrice)}
                </ins>
              )
            ) : (
              <ins className="text-decoration-none">HẾT HÀNG</ins>
            )}
          </span>
          {type == "display" && (
            <div className="d-flex d-lg-none flex-nowrap justify-content-start gap-4">
              <div className="input-group" style={{ maxWidth: 130 }}>
                <button
                  className="border-0 shop-down position-absolute translate-middle-y top-50 start-0 ps-7 product-info-2-minus bg-transparent"
                  onClick={handleDecrement}
                >
                  <FaMinus />
                </button>
                <input
                  name="number"
                  type="number"
                  id="QuickViewNumber"
                  className="product-info-2-quantity form-control text-center"
                  value={quantity}
                  required
                  disabled
                />
                <button
                  className=" border-0 shop-up position-absolute translate-middle-y top-50 end-0 pe-7 product-info-2-plus bg-transparent"
                  onClick={handleIncrement}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          )}
        </div>

        {type == "display" && (
          <div className="d-none d-lg-flex flex-nowrap justify-content-start gap-4">
            <div className="input-group" style={{ width: 130 }}>
              <button
                className="border-0 shop-down position-absolute translate-middle-y top-50 start-0 ps-7 product-info-2-minus bg-transparent"
                onClick={handleDecrement}
              >
                <FaMinus />
              </button>
              <input
                name="number"
                type="number"
                id="QuickViewNumber"
                className="product-info-2-quantity form-control text-center"
                value={quantity}
                required
                disabled
              />
              <button
                className="border-0 shop-up position-absolute translate-middle-y top-50 end-0 pe-7 product-info-2-plus bg-transparent"
                onClick={handleIncrement}
              >
                <FaPlus />
              </button>
            </div>
          </div>
        )}
      </div>
      <ProductQuickViewModal
        show={quickViewShow}
        onHide={() => setQuickViewShow(false)}
        product={data}
      />
    </>
  );
};

export default function ProductListGom({
  idList,
  type,
}: ProductListLiveComponent) {
  const { products } = useProducts(idList);
  return (
    <ul className="list-unstyled mb-0 row gy-7 gx-0">
      {products &&
        products.map((p, i) => <ProductItemGom data={p} key={i} type={type} />)}
    </ul>
  );
}
