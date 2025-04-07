"use client";
import Link from "next/link";
import React from "react";

interface BreadcrumbComponent {
  title: any;
}

export default function Breadcrumb({ title }: BreadcrumbComponent) {
  return (
    <section className="z-index-2 position-relative pb-2 mb-12">
      <div className="bg-body-secondary mb-3">
        <div className="container">
          <nav className="py-4 lh-30px" aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center py-1 mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item text-primary  text-uppercase">
                {title}
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
