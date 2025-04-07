import Breadcrumb from "@/components/Ecommerce/Breadcrumb";
import ProductGroupList from "@/components/Ecommerce/PageProductGroup/ProductGroupList";
import apiLinks from "@/utils/api-links";
import { ResolvingMetadata } from "next";
import React from "react";

async function getProductGroup(slug: string): Promise<any> {
  try {
    const res = await fetch(`${apiLinks.homepage.productGroup}/${slug}`);
    return await res.json();
  } catch (error) {
    console.error(`Error fetching product group: ${error}`);
  }
}

export async function generateMetadata({
  params,
  parent,
}: {
  parent: ResolvingMetadata;
  params: Promise<{ groupid: string }>;
}) {
  const groupId = (await params).groupid;
  const groupData = await getProductGroup(groupId);
  const canonicalUrl = `${apiLinks.domain.domain}/danh-muc/${groupId}`;

  return {
    title: `${groupData.title} - LamHy.Store`,
    description: "LamHy.Store chuyên cung cấp mỹ phẩm, nước hoa chính hãng US!",
    openGraph: {
      title: groupData.title,
      description:
        "LamHy.Store chuyên cung cấp mỹ phẩm, nước hoa chính hãng US!",
      // images: [
      //     {
      //         url: productData.images && productData.images.length > 0 ? productData.images[0] : "/assets/images/product.png", // Fallback image
      //         alt: productData.fullName,
      //     },
      // ],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ProductGroupPage({
  params,
}: {
  params: Promise<{ groupid: string }>;
}) {
  const groupId = (await params).groupid;
  const groupData = await getProductGroup(groupId);
  return (
    <>
      <Breadcrumb title={groupData.title} />
      <section className="container-fluid px-6 px-xl-21 px-lg-15 pt-lg-1 pb-lg-21 py-3">
        <div className="pb-lg-6 text-center">
          <div className="text-center">
            <p className="fs-6 fs-lg-5 fw-semibold text-body-emphasis mb-9 font-primary px-12">
              "Bởi vì bạn xứng đáng có những phút giây cho riêng mình"
            </p>
            <h2 className="fs-30px fs-xl-80px fs-lg-60px fw-semibold text-uppercase">
              {groupData.title}
            </h2>
          </div>
        </div>
        <div className="row mt-9 gy-8">
          <ProductGroupList
            idList={groupData.productExternalIds}
            productGroupSlug={groupId}
          />
        </div>
      </section>
    </>
  );
}
