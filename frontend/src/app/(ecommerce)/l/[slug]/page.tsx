import Breadcrumb from "@/components/Ecommerce/Breadcrumb";
import PinProductLive from "@/components/Ecommerce/PageLivestream/PinProductLive";
import ProductListLive from "@/components/Ecommerce/PageLivestream/ProductListLive";
import apiLinks from "@/utils/api-links";
import axios from "axios";
import { ResolvingMetadata } from "next";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { TiPin } from "react-icons/ti";

interface LiveStreamCart {
  id: string;
  productExternalID: string;
  liveStreamId: string;
}

interface LiveStream {
  id: string;
  title: string;
  createdDate: string;
  productPinExternalID: string;
  slug: string;
  liveStreamCarts: LiveStreamCart[];
}

async function getLiveDetail(slug: string): Promise<any> {
  const res = await axios.get(`${apiLinks.livestream.liveBySlug}/${slug}`);
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
  const productData = await getLiveDetail(productId);
  const canonicalUrl = `${apiLinks.domain.domain}/l/${productId}`;
  const photo = "./assets/images/cover/livestream.png";

  return {
    title: `${productData.title} - LamHy.Store`,
    description: "LamHy.Store chuyên cung cấp mỹ phẩm, nước hoa chính hãng.",
    openGraph: {
      title: productData.title,
      description: "LamHy.Store chuyên cung cấp mỹ phẩm, nước hoa chính hãng.",
      images: [
        {
          url: photo,
          alt: productData.title,
        },
      ],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const productId = (await params).slug;
  const lives = await getLiveDetail(productId);

  return (
    <>
      <Breadcrumb title={lives?.title} />
      <Container className="d-flex flex-column justify-content-center custom-container">
        <div className="text-center">
          <p className="fs-7px fs-lg-5 fw-semibold text-body-emphasis mb-9 font-primary px-6">
            "Bởi vì bạn xứng đáng có những phút giây cho riêng mình"
          </p>
          <h2 className="fs-30px fs-xl-80px fs-lg-60px fw-semibold text-uppercase">
            {lives?.title}
          </h2>
        </div>
        <div className="widget widget-post mb-6 mt-6">
          <h4 className="widget-title fs-5 mb-6">
            Đang ghim <TiPin size={16} />
          </h4>
          {lives && <PinProductLive id={lives.id} />}
          <hr />
          <h4 className="widget-title fs-5 mb-6 mt-6">Giỏ hàng</h4>
          {lives && (
            <ProductListLive
              idList={lives.liveStreamCarts.map(
                (l: any) => l.productExternalID,
              )}
            />
          )}
        </div>
      </Container>
    </>
  );
}
