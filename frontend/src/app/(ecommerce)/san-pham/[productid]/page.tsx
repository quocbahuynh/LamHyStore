import Breadcrumb from "@/components/Ecommerce/Breadcrumb";
import EstimatedDelivery from "@/components/Ecommerce/PageProductDetail/EstimatedDelivery";
import ProductPrice from "@/components/Ecommerce/PageProductDetail/ProductPrice";
import ProductSocialIcon from "@/components/Ecommerce/PageProductDetail/ProductSocialIcon";
import ProductSupport from "@/components/Ecommerce/PageProductDetail/ProductSupport";
import SellButtons from "@/components/Ecommerce/PageProductDetail/SellButtons";
import SuggestItems from "@/components/Ecommerce/PageProductDetail/SuggestItems";
import ViewEyes from "@/components/Ecommerce/PageProductDetail/ViewEye";
import apiLinks from "@/utils/api-links";
import { usePhotoProduct } from "@/utils/useProductPhoto";
import { ResolvingMetadata } from "next";
import React from "react";
import { ProgressBar } from "react-bootstrap";
import { FiInbox } from "react-icons/fi";

async function getProductDetail(id: string): Promise<any> {
  const res = await fetch(`${apiLinks.homepage.product}/${id}`);
  return await res.json();
}

// async function getProductGroup(slug: string): Promise<any> {
//     try {
//         const res = await fetch(`${apiLinks.homepage.productGroup}/${slug}`);
//         return await res.json();
//     } catch (error) {
//         console.error(`Error fetching product group: ${error}`);
//     }
// }

export async function generateMetadata({
  params,
  parent,
}: {
  parent: ResolvingMetadata;
  params: Promise<{ productid: string }>;
}) {
  const productId = (await params).productid;
  const productData = await getProductDetail(productId);
  const canonicalUrl = `${apiLinks.domain.domain}/san-pham/${productId}`;
  const photoProduct = usePhotoProduct(productData);

  return {
    title: `${productData.fullName} - LamHy.Store`,
    description: "LamHy.Store chuyên cung cấp mỹ phẩm, nước hoa chính hãng.",
    openGraph: {
      title: productData.fullName,
      description: "LamHy.Store chuyên cung cấp mỹ phẩm, nước hoa chính hãng.",
      images: [
        {
          url: photoProduct,
          alt: productData.fullName,
        },
      ],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: { productid: string };
  searchParams?: { group?: string };
}) {
  const productId = (await params).productid;
  const groupSlug = (await searchParams)?.group;
  const productData = await getProductDetail(productId);
  const totalOnHand = productData.inventories.reduce(
    (total: any, inventory: any) => total + inventory.onHand,
    0,
  );
  const photoProduct = usePhotoProduct(productData);
  return (
    <>
      <Breadcrumb title={productData.fullName} />
      <section className="container pt-6 pb-14 pb-lg-20">
        <div className="row">
          <div className="col-md-6 pe-lg-13">
            <img src={photoProduct} className="img-fluid product-image" />
          </div>
          <div className="col-md-6 pt-md-0 pt-10">
            <ProductPrice
              priceBooks={productData.priceBooks}
              basePrice={productData.basePrice}
            />
            <h1 className="mb-4 pb-2 fs-4">{productData.fullName}</h1>
            <p className="fs-15px">
              {productData.description &&
                (productData?.description.length >= 1
                  ? productData?.description
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
            {groupSlug && (
              <SuggestItems
                slug={groupSlug}
                mainProductName={productData.fullName}
              />
            )}
            <SellButtons totalOnHand={totalOnHand} productData={productData} />
            <EstimatedDelivery />
            <ProductSupport />
            <ul className="single-product-meta list-unstyled border-top pt-7 mt-7">
              <li className="d-flex mb-4 pb-2 align-items-center">
                <span className="text-body-emphasis fw-semibold fs-14px">
                  Barcode:
                </span>
                <span className="ps-4">{productData.barCode}</span>
              </li>
              <li className="d-flex mb-4 pb-2 align-items-center">
                <span className="text-body-emphasis fw-semibold fs-14px">
                  Danh mục:
                </span>
                <span className="ps-4">{productData.categoryName}</span>
              </li>
            </ul>
            <ProductSocialIcon />
          </div>
        </div>
      </section>
      <div className="border-top w-100 h-1px"></div>
    </>
  );
}
