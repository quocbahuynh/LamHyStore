"use client";

import React, { useState } from "react";
import { Badge } from "react-bootstrap";
import { FaMinus, FaPlus, FaRegEye } from "react-icons/fa";
import { BsCartPlus } from "react-icons/bs";
import Modal from "react-bootstrap/Modal";
import { Product } from "@/models/Product";
import ViewEyes from "./PageProductDetail/ViewEye";
import ProgressBar from "react-bootstrap/ProgressBar";
import { FiInbox } from "react-icons/fi";
import EstimatedDelivery from "./PageProductDetail/EstimatedDelivery";
import ProductPrice from "./PageProductDetail/ProductPrice";
import { useVNDFormatter } from "@/utils/useVNDFormatter";
import { useSalePrice } from "@/utils/useSalePrice";
import ProductSupport from "./PageProductDetail/ProductSupport";
import ProductSocialIcon from "./PageProductDetail/ProductSocialIcon";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addItem } from "@/slices/cartSlice";
import { useRouter } from "next/navigation";
import { usePhotoProduct } from "@/utils/useProductPhoto";
import { useCart } from "@/store/store";

interface ProductCardComponent {
  product: Product;
  productGroupSlug: string;
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
  const [quantity, setQuantity] = useState<number>(1);
  const salePrice = useSalePrice(product.PriceBooks);
  const router = useRouter();
  const cart = useCart();
  const dispatch = useDispatch();
  const photoProduct = usePhotoProduct(product);

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
    if (!product) return;

    const item = cart.find((i) => i.id === product.Id);

    if (item) {
      const cartAndStorage = item.quantity + quantity;

      if (cartAndStorage >= totalOnHand) {
        alert("Vượt quá số lượng sản phẩm!");
        return;
      }
    }

    dispatch(
      addItem({
        id: product.Id,
        code: product.Code,
        quantity,
        basePrice: salePrice ? salePrice : product.BasePrice,
        image: product.Images ? product.Images[0] : "",
        name: product.FullName,
      }),
    );
  };

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
            <form className="mb-9 pb-2 mt-7">
              <div className="row align-items-end">
                <div className="form-group col-sm-4">
                  <div className="input-group position-relative w-100 input-group-lg">
                    <button
                      className="border-0 shop-down position-absolute translate-middle-y top-50 start-0 ps-7 product-info-2-minus"
                      onClick={handleDecrement}
                    >
                      <FaMinus />
                    </button>
                    <input
                      name="number"
                      type="number"
                      id="QuickViewNumber"
                      className="product-info-2-quantity form-control w-100 px-6 text-center"
                      value={quantity}
                      required
                      disabled
                    />
                    <button
                      className=" border-0 shop-up position-absolute translate-middle-y top-50 end-0 pe-7 product-info-2-plus"
                      onClick={handleIncrement}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <div className="col-sm-8 pt-9 mt-2 mt-sm-0 pt-sm-0">
                  <button
                    type="submit"
                    className="btn-hover-bg-primary btn-hover-border-primary btn btn-lg btn-primary w-100"
                    onClick={handleAddToCart}
                    disabled={totalOnHand < 1}
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </form>
            <EstimatedDelivery />
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

export function ProductFlashCard({
  product,
  productGroupSlug,
}: ProductCardComponent) {
  const formatMoney = useVNDFormatter();
  const salePrice = useSalePrice(product.PriceBooks);
  const dispatch = useDispatch();
  const [quickViewShow, setQuickViewShow] = useState(false);
  const photoProduct = usePhotoProduct(product);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addItem({
          id: product.Id,
          code: product.Code,
          quantity: 1,
          basePrice: salePrice ? salePrice : product.BasePrice,
          image: photoProduct,
          name: product.FullName,
        }),
      );
    }
  };

  return (
    <div className="card card-product grid-1 bg-white border-0 mb-6">
      <figure className="card-img-top position-relative mb-3 overflow-hidden">
        <Link
          href={`/san-pham/${product.Id}?group=${productGroupSlug}`}
          className="hover-zoom-in d-block"
        >
          <img
            src={photoProduct}
            className="img-fluid w-100"
            alt={product.FullName}
          />
        </Link>
        <div className="position-absolute d-flex z-index-2 product-actions horizontal align-items-center">
          <a
            className="text-body-emphasis text-light-hover rounded-circle square product-action shadow-sm cursor-pointer"
            onClick={handleAddToCart}
          >
            <BsCartPlus color="#fff" />
          </a>
          <Link
            className="cursor-pointer"
            href={`/san-pham/${product.Id}?group=${productGroupSlug}`}
          >
            <Badge
              className="py-4 px-4 product-action"
              style={{ fontSize: "13px" }}
            >
              Xem thêm
            </Badge>
          </Link>
          <a
            className="text-body-emphasis text-light-hover rounded-circle square product-action shadow-sm quick-view cursor-pointer"
            onClick={() => setQuickViewShow(true)}
          >
            <FaRegEye color="#fff" />
          </a>
        </div>
      </figure>
      <div className="card-body px-4" style={{ minHeight: 135 }}>
        <span className="d-flex align-items-center price fw-bold justify-content-start mb-3 fs-6">
          {salePrice ? (
            <>
              <del className="text-body fw-500 me-4 fs-13px">
                {formatMoney(product.BasePrice)}
              </del>
              <ins className="text-decoration-none">
                {formatMoney(salePrice)}
              </ins>
            </>
          ) : (
            <ins className="text-decoration-none">
              {formatMoney(product.BasePrice)}
            </ins>
          )}
        </span>
        <h4 className="product-title card-title fs-15px fw-500 mb-3 text-left">
          <Link
            className="text-decoration-none"
            href={`/san-pham/${product.Id}?group=${productGroupSlug}`}
          >
            {product.FullName.length > 20
              ? product.FullName.slice(0, 53) + "..."
              : product.FullName}
          </Link>
        </h4>
        <div className="d-flex align-items-center fs-12px justify-content-start">
          <div className="rating">⭐️⭐️⭐️⭐️⭐️</div>
        </div>
      </div>
      <ProductQuickViewModal
        show={quickViewShow}
        onHide={() => setQuickViewShow(false)}
        product={product}
      />
    </div>
  );
}

export default function ProductCard({
  product,
  productGroupSlug,
}: ProductCardComponent) {
  const formatMoney = useVNDFormatter();
  const salePrice = useSalePrice(product.PriceBooks);
  const dispatch = useDispatch();
  const [quickViewShow, setQuickViewShow] = useState(false);
  const photoProduct = usePhotoProduct(product);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addItem({
          id: product.Id,
          code: product.Code,
          quantity: 1,
          basePrice: salePrice ? salePrice : product.BasePrice,
          image: photoProduct,
          name: product.FullName,
        }),
      );
    }
  };

  return (
    <div className="card card-product grid-1 bg-white border-0 mb-6">
      <figure className="card-img-top position-relative mb-7 overflow-hidden">
        <Link
          href={`/san-pham/${product.Id}?group=${productGroupSlug}`}
          className="hover-zoom-in d-block"
        >
          <img
            src={photoProduct}
            className="img-fluid w-100"
            alt={product.FullName}
          />
        </Link>
        <div className="position-absolute d-flex z-index-2 product-actions horizontal align-items-center">
          <a
            className="text-body-emphasis text-light-hover rounded-circle square product-action shadow-sm cursor-pointer"
            onClick={handleAddToCart}
          >
            <BsCartPlus color="#fff" />
          </a>
          <Link
            className="cursor-pointer"
            href={`/san-pham/${product.Id}?group=${productGroupSlug}`}
          >
            <Badge
              className="py-4 px-4 product-action"
              style={{ fontSize: "13px" }}
            >
              Xem thêm
            </Badge>
          </Link>
          <a
            className="text-body-emphasis text-light-hover rounded-circle square product-action shadow-sm quick-view cursor-pointer"
            onClick={() => setQuickViewShow(true)}
          >
            <FaRegEye color="#fff" />
          </a>
        </div>
      </figure>
      <div className="card-body p-0">
        <span className="d-flex align-items-center price fw-bold justify-content-start mb-3 fs-6">
          {salePrice ? (
            <>
              <del className="text-body fw-500 me-4 fs-13px">
                {formatMoney(product.BasePrice)}
              </del>
              <ins className="text-decoration-none">
                {formatMoney(salePrice)}
              </ins>
            </>
          ) : (
            <ins className="text-decoration-none">
              {formatMoney(product.BasePrice)}
            </ins>
          )}
        </span>
        <h4 className="product-title card-title fs-15px fw-500 mb-3 text-left">
          <Link
            className="text-decoration-none"
            href={`/san-pham/${product.Id}?group=${productGroupSlug}`}
          >
            {product.FullName.length > 20
              ? product.FullName.slice(0, 53) + "..."
              : product.FullName}
          </Link>
        </h4>
        <div className="d-flex align-items-center fs-12px justify-content-start">
          <div className="rating">⭐️⭐️⭐️⭐️⭐️</div>
        </div>
      </div>
      <ProductQuickViewModal
        show={quickViewShow}
        onHide={() => setQuickViewShow(false)}
        product={product}
      />
    </div>
  );
}
