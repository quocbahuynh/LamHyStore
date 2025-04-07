"use client";
import React, { useEffect, useState } from "react";
import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css"; // only needed for code highlighting
import { NotionRenderer } from "react-notion";
import axios from "axios";
import Breadcrumb from "@/components/Ecommerce/Breadcrumb";

interface FullChinhSachPage {
  title: string;
  id: string;
}

export default function FullChinhSachPage({ id, title }: FullChinhSachPage) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        "https://notion-api.splitbee.io/v1/page/" + id,
      );
      setData(res.data);
    };

    fetchData();
  }, []);

  return (
    <main id="content" className="wrapper layout-page">
      <Breadcrumb title={title} />
      <section className="pt-10 pb-16 pb-lg-18 px-6">
        <div className="container">
          <div className="row justify-content-center">
            <h2 className="text-body-emphasis fw-bold text-center border-0 fw-500 mb-4 fs-3 text-uppercase">
              {title}
            </h2>
            <div className="col-12">
              {data && <NotionRenderer blockMap={data} />}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
