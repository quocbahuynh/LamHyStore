"use client";
import apiLinks from "@/utils/api-links";
import Link from "next/link";
import React from "react";

export default function ProductSupport() {
  return (
    <div className="card border-0 bg-body-tertiary rounded text-center mt-7">
      <div className="d-lg-flex gap-4 pt-8 px-5 d-grid gap-2">
        <Link
          href={apiLinks.social.facebook}
          target="_blank"
          className="btn facebook-gradient border-0 w-100 fs-6"
        >
          Nhắn tin Facebook
        </Link>

        <Link
          href={apiLinks.social.zalo}
          target="_blank"
          className="btn border-0 messenger-gradient w-100 fs-6"
        >
          Nhắn Tin Zalo
        </Link>
      </div>
      <div className="card-body pt-6 pb-7">
        <p className="fs-14px fw-normal mb-0">Tư vấn và hỗ trợ 24/24</p>
      </div>
    </div>
  );
}
