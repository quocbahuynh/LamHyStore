"use client";
import apiLinks from "@/utils/api-links";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="pt-6 pt-lg-15 pt-lg-9 pb-6 footer text-white bg-primary">
      <div className="container container-xxl pt-4">
        <div className="row p-10 pt-lg-3 pb-lg-10">
          <div className="col-lg-5 col-12 mb-11 mb-lg-0">
            <h1 className="fs-6 mb-6 text-white">THÔNG TIN LIÊN HỆ</h1>
            <ul className="ps-0">
              <li className="mt-3 fs-14px">
                Chi nhánh 1: 60 Phú Lợi, Phường Phú Hoà, TP. Thủ Dầu Một, Bình
                Dương.
              </li>
              <li className="fs-14px">
                Chi nhánh 2: 110 đường 30/4, Phường Phú Hoà, TP. Thủ Dầu Một,
                Bình Dương.
              </li>
              <li className="fs-14px">
                Chi nhánh 3: 80 đường CMT8, KP. Đông Tư, Lái Thiêu, Thuận An,
                Bình Dương.
              </li>
            </ul>
            <ul className="fs-14px ps-0">
              <li>Hotline: 0789.126.368 (Chi nhánh 1 - 2)</li>
              <li>Hotline: 0338.029.779 (Chi nhánh 3)</li>
            </ul>
          </div>
          <div className="col-lg col-md-4 col-12 mb-11 mb-lg-0 fs-14px">
            <h1 className="fs-6 mb-3 text-white text-uppercase">Giờ mở cửa</h1>
            <p className="lh-2">
              Từ 9:00 - 22:00 tất cả các ngày trong tuần (bao gồm cả các ngày
              lễ, ngày Tết)
            </p>
            <h1 className="fs-6 mb-3 text-white text-uppercase">
              Góp ý & khiếu nại
            </h1>
            <p className="fs-14px lh-2">
              0789.126.368 (Chi nhánh 1 - 2) <br />
              0338.029.779 (Chi nhánh 3)
            </p>
            <h1 className="fs-6 mb-3 text-white text-uppercase">
              Hỗ trợ kỹ thuật
            </h1>
            <p className="fs-14px lh-2">0357.280.618</p>
          </div>
          <div className="col-lg col-md-5 col-12 mb-11 mb-lg-0">
            <h1 className="fs-6 mb-6 text-white text-uppercase">
              Chăm sóc khách hàng
            </h1>
            <ul className="list-unstyled mb-0 fw-medium text-white">
              <li className="pt-3 mb-3">
                <Link
                  href="/chinh-sach/doi-tra"
                  title="Chính sách đổi trả"
                  className="text-white"
                >
                  Chính sách đổi trả
                </Link>
              </li>
              <li className="pt-3 mb-3">
                <Link
                  href="/chinh-sach/bao-mat"
                  title="Chính sách bảo mật"
                  className="text-white"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li className="pt-3 mb-3">
                <Link
                  href="/chinh-sach/thanh-toan"
                  title="Chính sách thanh toán"
                  className="text-white"
                >
                  Chính sách thanh toán
                </Link>
              </li>
              <li className="pt-3 mb-3">
                <Link
                  href="/chinh-sach/dieu-khoan-dich-vu"
                  title="Điều khoản dịch vụ"
                  className="text-white"
                >
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li className="pt-3 mb-3">
                <Link
                  href="/chinh-sach/huong-dan-mua-hang"
                  title="Hướng dẫn mua hàng"
                  className="text-white"
                >
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li className="pt-3 mb-3">
                <Link
                  href="/chinh-sach/thanh-toan-vnpay"
                  title="Hướng dẫn thanh toán VNPAY"
                  className="text-white"
                >
                  Hướng dẫn thanh toán VNPAY
                </Link>
              </li>
              <li className="pt-3 mb-3">
                <Link
                  href="/chinh-sach/van-chuyen"
                  title="Vận chuyển"
                  className="text-white"
                >
                  Vận chuyển
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-lg col-md-3 col-12 mb-11 mb-lg-0">
            <h1 className="fs-6 mb-6 text-white text-uppercase">Mạng xã hội</h1>
            <ul className="list-unstyled mb-0 fw-medium">
              <li className="pt-3 mb-4">
                <Link href="#" title="LamHy.Store" className="text-white">
                  Giới thiệu
                </Link>
              </li>
              <li className="pt-3 mb-4">
                <Link
                  href={apiLinks.social.facebook}
                  title="LamHy.Store"
                  className="text-white"
                >
                  Facebook
                </Link>
              </li>
              <li className="pt-3 mb-4">
                <Link
                  href={apiLinks.social.instagam}
                  title="LamHy.Store"
                  className="text-white"
                >
                  Instagram
                </Link>
              </li>
              <li className="pt-3 mb-4">
                <Link href="#" title="LamHy.Store" className="text-white">
                  Shopee
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="row align-items-center mt-0 mt-lg-3 pt-6 pt-lg-6 border-top border-white">
          <div className="col-12">
            <p className="mb-0 text-center">
              © Lamhy.Store {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
