import GomOrderMain from "@/components/Ecommerce/PageGomOrder/GomOrderPage";
import apiLinks from "@/utils/api-links";
import axios from "axios";
import { ResolvingMetadata } from "next";
import React from "react";

async function getGomOrderDetail(slug: string): Promise<any> {
  const res = await axios.get(`${apiLinks.order.gomOrderBySlug}/${slug}`);
  return await res.data;
}

export async function generateMetadata({
  params,
  parent,
}: {
  parent: ResolvingMetadata;
  params: Promise<{ slug: string }>;
}) {
  const productId = (await params).slug;
  const productData = await getGomOrderDetail(productId);
  const canonicalUrl = `${apiLinks.domain.domain}/g/${productId}`;
  const photo = "./assets/images/cover/gom-order.png";

  return {
    title: `${productData.name} - LamHy.Store`,
    description: "LamHy.Store chuyên cung cấp mỹ phẩm, nước hoa chính hãng.",
    openGraph: {
      title: productData.name,
      description: "LamHy.Store chuyên cung cấp mỹ phẩm, nước hoa chính hãng.",
      images: [
        {
          url: photo,
          alt: productData.name,
        },
      ],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function GomOrderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const productId = (await params).slug;
  const productData = await getGomOrderDetail(productId);
  return (
    <>
      <GomOrderMain gomOrderData={productData} />
    </>
  );
}
