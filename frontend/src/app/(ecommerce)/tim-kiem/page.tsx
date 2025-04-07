import Breadcrumb from "@/components/Ecommerce/Breadcrumb";
import ProductCardSearch from "@/components/Ecommerce/PageSearch/ProductCardSearch";
import ProductCard from "@/components/Ecommerce/ProductCard";
import apiLinks from "@/utils/api-links";
import React from "react";

async function getProductSearch(
  name: any,
  currentItem = 1,
  retries = 10,
): Promise<any> {
  try {
    const res = await fetch(
      `${apiLinks.homepage.searchProduct}/${name}?pageSize=10&currentItem=${currentItem}`,
    );
    return await res.json();
  } catch (error) {
    console.error(`Error fetching product group: ${error}`);
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const nameParam = (await searchParams).name;
  const pageParam = (await searchParams).page;
  const thisPage = parseInt(
    Array.isArray(pageParam) ? pageParam[0] : pageParam || "1",
    10,
  );

  const productData = await getProductSearch(nameParam, thisPage);

  const totalPages = Math.ceil(productData.total / 10);
  return (
    <>
      <Breadcrumb title={nameParam ? nameParam : "..."} />
      <section className="container-fluid px-6 px-xl-21 px-lg-15 pt-lg-1 pb-lg-21 py-3">
        <div className="pb-lg-6 text-center">
          <div className="text-center">
            <p className="fs-6 fs-lg-5 fw-semibold text-body-emphasis mb-9 font-primary px-12">
              "Bởi vì bạn xứng đáng có những phút giây cho riêng mình"
            </p>
            <h2 className="fs-30px fs-xl-80px fs-lg-60px fw-semibold text-uppercase">
              {nameParam ? nameParam : "..."}
            </h2>
          </div>
        </div>
        <div className="row mt-9 gy-8">
          {productData &&
            productData.data.map((p: any, i: number) => (
              <div key={i} className="col-6 col-sm-6 col-lg-3">
                <ProductCardSearch product={p} />
              </div>
            ))}
        </div>
      </section>
    </>
  );
}
