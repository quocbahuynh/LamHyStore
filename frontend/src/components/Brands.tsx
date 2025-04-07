"use client";
import React from "react";
import Slider from "react-slick";

const Brands = () => {
  const settings = {
    slidesToShow: 5,
    infinite: false,
    autoplay: false,
    dots: false,
    arrows: false,
    responsive: [
      { breakpoint: 1366, settings: { slidesToShow: 5 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 576, settings: { slidesToShow: 2 } },
    ],
  };

  const images = [
    "/assets/images/instagram/instagram-01-320x320.jpg",
    "/assets/images/instagram/instagram-02-320x320.jpg",
    "/assets/images/instagram/instagram-03-320x320.jpg",
    "/assets/images/instagram/instagram-04-320x320.jpg",
    "/assets/images/instagram/instagram-05-320x320.jpg",
    "/assets/images/instagram/instagram-06-320x320.jpg",
  ];

  return (
    <section className="pb-10" data-animated-id="8">
      <div className="container-fluid">
        <div className="px-md-6">
          <Slider {...settings} className="mx-n6">
            {images.map((src, index) => (
              <div
                key={index}
                className="px-6 animate__fadeInUp animate__animated"
              >
                <a
                  href={src.replace("-320x320", "")}
                  title={`instagram-0${index + 1}`}
                  data-gallery="instagram"
                  className="hover-zoom-in hover-shine card-img-overlay-hover d-block"
                >
                  <img
                    className="img-fluid w-100"
                    width="314"
                    height="314"
                    src={src}
                    alt={`instagram-0${index + 1}`}
                    loading="lazy"
                  />
                  <span className="card-img-overlay bg-dark bg-opacity-30"></span>
                </a>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Brands;
