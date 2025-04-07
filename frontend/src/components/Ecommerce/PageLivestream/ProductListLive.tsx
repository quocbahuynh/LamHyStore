"use client";
import { Product } from "@/models/Product";
import useProducts from "@/utils/useProducts";
import { useSalePrice } from "@/utils/useSalePrice";
import { useVNDFormatter } from "@/utils/useVNDFormatter";
import React, { useState } from "react";
import { FaCartPlus, FaMinus, FaPlus } from "react-icons/fa";
import EstimatedDelivery from "../PageProductDetail/EstimatedDelivery";
import ProductSupport from "../PageProductDetail/ProductSupport";
import ProductSocialIcon from "../PageProductDetail/ProductSocialIcon";
import ViewEyes from "../PageProductDetail/ViewEye";
import { FiInbox } from "react-icons/fi";
import ProductPrice from "../PageProductDetail/ProductPrice";
import Link from "next/link";
import { Modal, ProgressBar } from "react-bootstrap";
import { addItem } from "@/slices/cartSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Breadcrumb from "../Breadcrumb";
import { useCart } from "@/store/store";
import { usePhotoProduct } from "@/utils/useProductPhoto";

interface ProductListLiveComponent {
  idList: string[];
}

interface ProductItemLiveComponent {
  data: Product;
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
  const photoProduct = usePhotoProduct(product);
  const salePrice = useSalePrice(product.PriceBooks, "livestream");
  const router = useRouter();
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
        image: photoProduct,
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
              src={
                !product?.Images
                  ? "https://product.hstatic.net/200000868185/product/mat_na_bun_tra_xanh_3d7d367026694ac8b6bb604abf64ae61_large.jpg"
                  : product.Images[0]
              }
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
                      className="border-0 shop-down position-absolute translate-middle-y top-50 start-0 ps-7 product-info-2-minus bg-transparent"
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
                      className=" border-0 shop-up position-absolute translate-middle-y top-50 end-0 pe-7 product-info-2-plus bg-transparent"
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

export const ProductItemLive = ({ data }: ProductItemLiveComponent) => {
  const [quickViewShow, setQuickViewShow] = useState(false);
  const formatMoney = useVNDFormatter();
  const salePrice = useSalePrice(data.PriceBooks, "livestream");
  const photoProduct = !data?.Images
    ? "https://lamhystore.b-cdn.net/z6351502534051_9cfb96caff7c3cad774ed5b78e86f904.jpg"
    : data.Images[0];
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
        <div className="card-body p-0">
          <h5 className="card-text fw-semibold text-uppercase fs-13px mb-3 text-body text-primary-hover">
            {data.CategoryName}
          </h5>
          <h4
            className="card-title mb-0 text-body-emphasis fs-15px lh-base text-primary-hover"
            onClick={() => setQuickViewShow(true)}
          >
            {data.FullName}
          </h4>
          <span
            className="d-flex align-items-center price fw-bold justify-content-start mb-3 fs-6"
            onClick={() => setQuickViewShow(true)}
          >
            {salePrice ? (
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
            )}
          </span>
        </div>
        <div className="d-flex flex-nowrap justify-content-center">
          <button
            onClick={() => setQuickViewShow(true)}
            className="btn btn-outline-primary btn-hover-bg-danger btn-hover-border-danger btn-hover-text-light py-4 px-5  btn-xs me-4"
          >
            <FaCartPlus size={16} />
          </button>
        </div>
      </div>
      <ProductQuickViewModal
        show={quickViewShow}
        onHide={() => setQuickViewShow(false)}
        product={data}
      />
    </>
  );
};

export default function ProductListLive({ idList }: ProductListLiveComponent) {
  const { products } = useProducts(idList);
  return (
    <ul className="list-unstyled mb-0 row gy-7 gx-0">
      {products && products.map((p, i) => <ProductItemLive data={p} key={i} />)}
    </ul>
  );
}
