"use client";

import React from "react";
import ProductList from "./Ecommerce/ProductList";
import { Section } from "@/models/Section";
import { FaArrowRight } from "react-icons/fa";
import { NextArrow, PrevArrow } from "./FlashSale";
import Link from "next/link";

interface SectionSaleComponent {
  data: Section;
}

const SectionSaleSection = ({ data }: SectionSaleComponent) => {
  const settings = {
    dots: true,
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
        settings: { arrows: false, dots: false, slidesToShow: 2 },
      },
    ],
  };

  return (
    <section className="container container-xxl pt-14 pt-lg-17 pb-15">
      <div className="d-flex d-lg-none  justify-content-center">
        <div>
          <h2
            className="mb-5 text-uppercase text-primary fs-7 fs-md-4 fs-lg-3"
            style={{ fontWeight: "700" }}
          >
            {data.title}
          </h2>
        </div>
      </div>
      <div className="mb-9 d-none d-lg-flex justify-content-between align-items-start">
        {/* Title */}
        <div>
          <h2
            className="mb-5 text-uppercase text-primary fs-7 fs-md-4 fs-lg-3"
            style={{ fontWeight: "700" }}
          >
            {data.title}
          </h2>
        </div>

        {/* Button (Hidden on small devices) */}
        <Link
          href={`/danh-muc/${data.slug}`}
          className="btn btn-outline-primary rounded-pill d-flex align-items-center gap-3 "
          style={{ height: "50px" }}
        >
          <span className="d-block" style={{ fontWeight: "600" }}>
            Xem thêm
          </span>
          <FaArrowRight size={13} />
        </Link>
      </div>
      <ProductList
        productExternalIds={data.productExternalIds}
        settings={settings}
        type="SECTION"
        productGroupSlug={data.slug}
      />
      <div className="d-grid gap-2">
        <Link
          href={`/danh-muc/${data.slug}`}
          className="btn btn-outline-primary rounded-pill d-flex align-items-center gap-3 d-flex d-lg-none justify-content-center"
          style={{ height: "43px" }}
        >
          <span className="d-block" style={{ fontWeight: "600" }}>
            Xem thêm
          </span>
          <FaArrowRight size={13} />
        </Link>
      </div>
    </section>
  );
};

export default SectionSaleSection;
