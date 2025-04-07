"use client";
import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Dropdown from "react-bootstrap/Dropdown";
import ProductList from "./Ecommerce/ProductList";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

interface Section {
  id: string;
  title: string;
  slug: string;
  thumnailUrl: string;
  productExternalIds: string[];
}

interface BestSellerComponent {
  data: Section[];
  title: string;
}

export default function BestSeller({ data, title }: BestSellerComponent) {
  const [tabIndex, setTabIndex] = useState(0);
  const tabNames = data?.map((d) => d.title) || [];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesPerRow: 2, // Two rows
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1560,
        settings: {
          arrows: true,
          dots: false,
          slidesToShow: 3,
          slidesPerRow: 2,
        },
      },
      {
        breakpoint: 1200,
        settings: { arrows: false, dots: true, slidesToShow: 3 },
      },
      {
        breakpoint: 992,
        settings: {
          arrows: false,
          dots: false,
          slidesToShow: 2,
          slidesPerRow: 2,
        },
      },
    ],
  };

  return (
    <section className="container container-xxl pt-14 pt-lg-17 pb-6">
      <div className="text-center">
        <h2
          className="mb-3 text-uppercase text-primary fs-7 fs-md-4 fs-lg-3"
          style={{ fontWeight: "700" }}
        >
          {title}
        </h2>
      </div>
      <Tabs
        id="product_tabs"
        selectedIndex={tabIndex}
        onSelect={(index) => setTabIndex(index)}
      >
        <div className="container container-xxl pt-lg-6 pb-15 pb-lg-20 mb-4">
          {/* Desktop Tabs */}
          <TabList
            className="nav nav-tabs border-0 d-lg-flex justify-content-center mb-12 d-none bg-primary py-4 px-4"
            style={{
              maxWidth: "fit-content",
              margin: "0 auto",
              borderRadius: 50,
            }}
          >
            {tabNames.map((name, index) => (
              <Tab
                key={index}
                className={`nav-item ${tabIndex === index ? "active" : ""}`}
              >
                <h6 className="mb-0 mx-1">
                  <button
                    className={`nav-link py-0 border-0 ${tabIndex === index ? "active" : ""} text-uppercase`}
                  >
                    {name}
                  </button>
                </h6>
              </Tab>
            ))}
          </TabList>

          {/* Mobile Dropdown */}
          <TabList className="nav nav-tabs border-0 justify-content-center mb-12 d-flex d-lg-none py-2">
            <Dropdown>
              <Dropdown.Toggle
                className="text-uppercase"
                style={{ fontSize: 13 }}
              >
                {tabNames[tabIndex]}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {tabNames.map((name, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => setTabIndex(index)}
                    className="dropdown-item m-0 text-uppercase"
                    style={{ fontSize: 13 }}
                  >
                    {name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </TabList>

          {data?.map((t, index) => (
            <TabPanel key={index}>
              <div className="row">
                {/* This image will be hidden on mobile */}
                <div className="col-lg-4 mb-10 mb-lg-0 d-none d-sm-block">
                  <div className="card border-0 rounded-0 hover-zoom-in hover-shine">
                    <img
                      className="w-100 img-fluid card-img object-fit-contain banner-02"
                      src={t.thumnailUrl}
                      width={570}
                      height={800}
                      alt={t.title}
                    />
                  </div>
                </div>

                {/* Product Grid */}
                <div className="col-lg-8 col-sm-12">
                  <ProductList
                    productExternalIds={t.productExternalIds}
                    settings={settings}
                    type="BESTSELLER"
                    productGroupSlug={t.slug}
                  />
                  <div className="d-grid gap-2">
                    <Link
                      href={`/danh-muc/${t.slug}`}
                      className="btn btn-outline-primary rounded-pill d-flex align-items-center gap-3 d-flex w-50 mx-auto mt-10 justify-content-center"
                      style={{ height: "43px" }}
                    >
                      <span className="d-block" style={{ fontWeight: "600" }}>
                        Xem thêm
                      </span>
                      <FaArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </TabPanel>
          ))}
        </div>
      </Tabs>
    </section>
  );
}
