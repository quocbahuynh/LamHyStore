"use client";
import React from "react";

export default function Features() {
  return (
    <section>
      <div className="container container-xxl">
        <div className="row gy-30px">
          <div className="col-lg-6">
            <div className="card border-0 rounded-0 banner-01 hover-zoom-in hover-shine">
              <img
                className="object-fit-cover card-img"
                src="/assets/images/banner/banner-21.jpg"
                width={690}
                height={420}
                alt="Mountain Pine Bath Oil"
              />

              <div className="card-img-overlay d-inline-flex flex-column p-md-12 m-md-2 p-8">
                <h6 className="card-subtitle ls-1 fs-15px mb-5 fw-semibold text-body-emphasis">
                  LIVESTREAM
                </h6>
                <h3 className="card-title lh-45px pe-xl-25 pe-lg-0 pe-md-25 fs-3 pe-5">
                  Livestream Siêu Deal <br />
                  Đẹp Xinh Ngay Tức Khắc!
                </h3>
                <div className="mt-7">
                  <a href="#" className="btn btn btn-white">
                    Xem Live
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card border-0 rounded-0 banner-01 hover-zoom-in hover-shine">
              <img
                className=" object-fit-cover card-img "
                src="/assets/images/banner/banner-21.jpg"
                width={690}
                height={420}
                alt="Mountain Pine Bath Oil"
              />
              <div className="card-img-overlay d-inline-flex flex-column p-md-12 m-md-2 p-8">
                <h6 className="card-subtitle ls-1 fs-15px mb-5 fw-semibold text-body-emphasis">
                  GOM ORDER
                </h6>
                <h3 className="card-title lh-45px pe-xl-25 pe-lg-0 pe-md-25 fs-3 pe-5">
                  Gom Order Mỹ Phẩm <br />
                  Hàng Chuẩn Giá Yêu!
                </h3>
                <div className="mt-7">
                  <a href="#" className="btn btn btn-white">
                    Mua ngay
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
