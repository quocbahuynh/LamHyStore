"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

interface PhotoBanner {
  id: string;
  link: string;
  thumnailUrl: string;
}

interface HeroBannerComponent {
  data: PhotoBanner[];
}

const HeroSlider = ({ data }: HeroBannerComponent) => {
  const settings = {
    arrows: false,
    autoplay: true,
    cssEase: "ease-in-out",
    dots: false, // Enable dots for mobile navigation
    fade: true,
    infinite: true,
    slidesToShow: 1,
    speed: 600,
    responsive: [
      {
        breakpoint: 1024, // Tablet
        settings: {
          dots: false,
          arrows: false,
        },
      },
      {
        breakpoint: 768, // Mobile
        settings: {
          dots: false,
          arrows: false,
        },
      },
    ],
  };

  return (
    <section>
      <Slider {...settings} className="hero hero-header-01 ">
        {data.map((slide, index) => (
          <div
            key={index}
            className="vh-100 d-flex align-items-center position-relative"
          >
            <div className="position-absolute w-100 h-100 z-index-1">
              <Link href={slide.link}>
                <Image
                  src={slide.thumnailUrl}
                  alt={`Lamhy.Store`}
                  layout="fill"
                  objectFit="contain"
                />
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default HeroSlider;
