"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    title: "Gel Tẩy Tế Bào Chết Caryophy Ngăn Ngừa Mụn 250ml Smart Peeling Gel",
    image:
      "https://product.hstatic.net/200000868185/product/1_c8828b020e1f4cd391854cb987ec13f7_large.jpg",
    oldPrice: "25.000đ",
    newPrice: "14.000đ",
    link: "shop/product-details-v1.html",
    rating: 4,
    reviews: "2947 lượt mua",
  },
  {
    id: 2,
    title: "Gel Tẩy Tế Bào Chết Caryophy Ngăn Ngừa Mụn 250ml Smart Peeling Gel",
    image:
      "https://product.hstatic.net/200000868185/product/1_c8828b020e1f4cd391854cb987ec13f7_large.jpg",
    oldPrice: "25.000đ",
    newPrice: "14.000đ",
    link: "shop/product-details-v1.html",
    rating: 4,
    reviews: "2947 lượt mua",
  },
  {
    id: 3,
    title: "Gel Tẩy Tế Bào Chết Caryophy Ngăn Ngừa Mụn 250ml Smart Peeling Gel",
    image:
      "https://product.hstatic.net/200000868185/product/1_c8828b020e1f4cd391854cb987ec13f7_large.jpg",
    oldPrice: "25.000đ",
    newPrice: "14.000đ",
    link: "shop/product-details-v1.html",
    rating: 4,
    reviews: "2947 lượt mua",
  },
  {
    id: 4,
    title: "Gel Tẩy Tế Bào Chết Caryophy Ngăn Ngừa Mụn 250ml Smart Peeling Gel",
    image:
      "https://product.hstatic.net/200000868185/product/1_c8828b020e1f4cd391854cb987ec13f7_large.jpg",
    oldPrice: "25.000đ",
    newPrice: "14.000đ",
    link: "shop/product-details-v1.html",
    rating: 4,
    reviews: "2947 lượt mua",
  },
  {
    id: 5,
    title: "Gel Tẩy Tế Bào Chết Caryophy Ngăn Ngừa Mụn 250ml Smart Peeling Gel",
    image:
      "https://product.hstatic.net/200000868185/product/1_c8828b020e1f4cd391854cb987ec13f7_large.jpg",
    oldPrice: "25.000đ",
    newPrice: "14.000đ",
    link: "shop/product-details-v1.html",
    rating: 4,
    reviews: "2947 lượt mua",
  },
];

const settings = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1560, settings: { slidesToShow: 5 } },
    { breakpoint: 1200, settings: { slidesToShow: 3 } },
    { breakpoint: 992, settings: { slidesToShow: 2 } },
    { breakpoint: 576, settings: { slidesToShow: 2 } },
  ],
};

const ProductSlider = () => {
  return (
    <section className="container container-xxl pt-14 pt-lg-17 pb-15">
      <div className="mb-13 text-center">
        <h2 className="mb-5">8-3 RỰC RỠ ĐẸP XINH</h2>
        <p className="fs-18px mb-0 mw-xl-35 mw-lg-50 mw-md-75 mx-auto px-xl-5">
          Dùng ngay mỹ phẩm, da mình lung linh!
        </p>
      </div>
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default ProductSlider;
