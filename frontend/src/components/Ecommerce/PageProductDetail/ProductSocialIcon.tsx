"use client";
import Link from "next/link";
import React from "react";
import { SocialIcon } from "react-social-icons";

export default function ProductSocialIcon() {
  return (
    <ul className="list-inline d-flex justify-content-start mb-0 fs-6 gap-6">
      <li className="list-inline-item">
        <Link
          className="text-body text-decoration-none product-info-share product-info-share fs-14px"
          href="https://www.facebook.com/lamhy.store"
          target="_blank"
        >
          <SocialIcon
            url="https://www.facebook.com/lamhy.store"
            style={{ height: 25, width: 25, marginRight: 6 }}
          />
          Facebook
        </Link>
      </li>
      <li className="list-inline-item">
        <Link
          className="text-body text-decoration-none product-info-share product-info-share"
          href="https://www.instagram.com/lamhy.store fs-14px"
          target="_blank"
        >
          <SocialIcon
            url="https://www.instagram.com/lamhy.store"
            style={{ height: 25, width: 25, marginRight: 6 }}
          />
          Instagram
        </Link>
      </li>
    </ul>
  );
}
