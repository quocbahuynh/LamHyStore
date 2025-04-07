"use client";
import apiLinks from "@/utils/api-links";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useVNDFormatter } from "@/utils/useVNDFormatter";
import useTruncatedText from "@/utils/useTruncatedText";
import { Product } from "@/models/Product";
import Link from "next/link";
import { TiPin } from "react-icons/ti";
import axios from "axios";
import useProducts from "@/utils/useProducts";
import { RiUnpinFill } from "react-icons/ri";

interface LiveStreamCart {
  id: string;
  productExternalID: string;
  liveStreamId: string;
}

interface LiveStreamDetail {
  id: string;
  title: string;
  createdDate: string; // ISO string format for Date
  productPinExternalID: string;
  slug: string;
  liveStreamCarts: LiveStreamCart[];
}

interface ProductComponent {
  type: "pin" | "normal";
  product: Product;
  position: number;
  onPin: (productId: string) => void;
}

const ProductItem = ({ product, position, onPin, type }: ProductComponent) => {
  const truncatedName = useTruncatedText(product.FullName, 30);
  const formatMoney = useVNDFormatter();
  const photoProduct = !product?.Images
    ? "https://lamhystore.b-cdn.net/z6351502534051_9cfb96caff7c3cad774ed5b78e86f904.jpg"
    : product.Images[0];

  return (
    <tr>
      {type == "normal" && <td>{position}</td>}
      <td>
        <div className="d-flex align-items-center flex-nowrap">
          <Link
            target="_blank"
            href={`/san-pham/${product.Id}`}
            title={product.FullName}
          >
            <img
              src={photoProduct}
              alt={product.FullName}
              className="lazy-image"
              width={60}
              height={80}
            />
          </Link>
          <Link
            target="_blank"
            href={`/san-pham/${product.Id}`}
            title={product.FullName}
            className="ms-6"
          >
            <p className="fw-semibold text-body-emphasis mb-0">
              {truncatedName}
            </p>
          </Link>
        </div>
      </td>
      <td>{formatMoney(product.BasePrice)}</td>
      <td className="text-center">
        <div className="d-flex flex-nowrap justify-content-center">
          <button
            onClick={() => onPin(product.Id)}
            className="btn btn-outline-primary btn-hover-bg-danger btn-hover-border-danger btn-hover-text-light py-4 px-5 fs-13px btn-xs me-4"
          >
            {type == "normal" ? <TiPin size={18} /> : <RiUnpinFill size={18} />}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default function page() {
  const router = useParams();
  const liveId = router.id;
  const [productCart, setProductCart] = useState<any[]>([]);
  const [productIdList, setProductIdList] = useState<string[]>([]);
  const { products } = useProducts(productIdList);
  const [liveDetail, setLiveDetail] = useState<LiveStreamDetail | null>(null);
  const [productPin, setProductPin] = useState<Product | null>(null);

  useEffect(() => {
    if (!liveId) return;
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiLinks.livestream.liveById}/${liveId}`,
        );
        const data = await response.json();
        setLiveDetail(data);
        setProductIdList(
          data.liveStreamCarts.map(
            (cart: LiveStreamCart) => cart.productExternalID,
          ),
        );
      } catch (error) {
        console.error("Error fetching Live Stream:", error);
      }
    };

    fetchData();
  }, [liveId]);

  useEffect(() => {
    if (products.length > 0) {
      setProductCart(products);

      products.map((p) => {
        if (p.Id == liveDetail?.productPinExternalID) {
          setProductPin(p);
        }
      });
    }
  }, [productIdList, products, liveDetail]);

  const handlePinProduct = async (productId: string) => {
    if (liveDetail) {
      const patchDoc = [
        { op: "replace", path: "/productPinExternalID", value: productId },
      ];

      await axios.patch(
        `${apiLinks.livestream.productPinId}/${liveDetail.id}`,
        patchDoc,
        {
          headers: {
            "Content-Type": "application/json-patch+json",
          },
        },
      );
    }

    productCart.map((p) => {
      if (p.Id == productId) {
        setProductPin(p);
      }
    });
  };

  if (!liveDetail) return "Đang tải...";
  return (
    <main
      id="content"
      className="bg-body-tertiary-01 d-flex flex-column main-content"
    >
      <div className="dashboard-page-content">
        <div className="row mb-9 align-items-center justify-content-between">
          <div className="col-md-6 mb-8 mb-md-0">
            <h2 className="fs-4 mb-0">{liveDetail.title}</h2>
          </div>
        </div>
        <div className="card mb-4 rounded-4 p-7">
          <div className="card-header bg-transparent px-0 pt-0 pb-7">
            <div className="row align-items-center justify-content-between">
              <div className="col-md-4 col-12 mr-auto mb-md-0 mb-6">
                <select className="form-select" disabled>
                  <option>Đang ghim</option>
                </select>
              </div>
            </div>
          </div>
          <div className="card-body px-0 pt-7 pb-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle table-nowrap mb-0">
                <tbody>
                  {productPin && (
                    <ProductItem
                      product={productPin}
                      position={0}
                      onPin={() => {}}
                      type="pin"
                    />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="card mb-4 rounded-4 p-7">
          <div className="card-header bg-transparent px-0 pt-0 pb-7">
            <div className="row align-items-center justify-content-between">
              <div className="col-md-4 col-12 mr-auto mb-md-0 mb-6">
                <select className="form-select" disabled>
                  <option>Tất cả</option>
                </select>
              </div>
            </div>
          </div>
          <div className="card-body px-0 pt-7 pb-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle table-nowrap mb-0">
                <tbody>
                  {productCart.map((l, i) => (
                    <ProductItem
                      product={l}
                      position={i}
                      onPin={handlePinProduct}
                      type="normal"
                      key={i}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
