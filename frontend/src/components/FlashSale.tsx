"use client";

import React from "react";
import Slider from "react-slick";
import ProductList from "./Ecommerce/ProductList";
import { Section } from "@/models/Section";
import { FaArrowRight } from "react-icons/fa";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Link from "next/link";

interface FlashSaleComponent {
  data: Section;
}

export const PrevArrow = ({ onClick }: any) => {
  return (
    <div className="custom-arrow prev-arrow" onClick={onClick}>
      <AiOutlineLeft />
    </div>
  );
};

// Custom Next Arrow
export const NextArrow = ({ onClick }: any) => {
  return (
    <div className="custom-arrow next-arrow" onClick={onClick}>
      <AiOutlineRight />
    </div>
  );
};

const FlashSaleSection = ({ data }: FlashSaleComponent) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />, // Custom left arrow
    nextArrow: <NextArrow />, // Custom right arrow
    responsive: [
      {
        breakpoint: 1560,
        settings: { arrows: true, dots: false, slidesToShow: 6 },
      },
      {
        breakpoint: 1200,
        settings: { arrows: true, dots: false, slidesToShow: 3 },
      },
      {
        breakpoint: 992,
        settings: { arrows: true, dots: false, slidesToShow: 2 },
      },
    ],
  };

  return (
    <div className="px-3">
      <section
        className="container-xxl bg-primary px-4 px-lg-6 py-6 py-lg-9"
        style={{ marginTop: 53, borderRadius: 9 }}
      >
        <div className="mb-3 mb-lg-9 d-flex justify-content-center align-items-start">
          <h2
            className="d-flex align-items-center mb-5 text-white text-uppercase fs-7 fs-md-4 fs-lg-3"
            style={{ fontWeight: "700" }}
          >
            giảm
            <img
              src="/assets/images/flash.png"
              alt="Flash Sale"
              height={40}
              className="mx-2"
            />
            giá thần tốc
          </h2>
        </div>
        <ProductList
          productExternalIds={data.productExternalIds}
          settings={settings}
          type="FLASHSALE"
          productGroupSlug={data.slug}
        />
        <div className="d-flex justify-content-center">
          <Link
            href={`/danh-muc/${data.slug}`}
            className="btn btn-outline-white rounded-pill d-flex align-items-center gap-3 d-flex justify-content-center w-50"
            style={{ height: "43px" }}
          >
            <span className="d-block" style={{ fontWeight: "600" }}>
              Xem thêm
            </span>
            <FaArrowRight size={13} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FlashSaleSection;
