import React from "react";
import { getBestSeller, getSections } from "../page";
import FlashSaleSection from "@/components/FlashSale";
import SectionSaleSection from "@/components/SectionSale";
import BestSeller from "@/components/BestSeller";

export default async function page() {
  const bestSellerData = getBestSeller();
  const sectionsData = getSections();

  const [bestSellers, sections] = await Promise.all([
    bestSellerData,
    sectionsData,
  ]);
  return (
    <>
      {sections[0]?.sections.map((data: any, i: number) => {
        return i === 0 ? (
          <FlashSaleSection data={data} key={i} />
        ) : (
          <SectionSaleSection data={data} key={i} />
        );
      })}

      <BestSeller
        data={bestSellers[0]?.sections}
        title={bestSellers[0]?.title}
      />
    </>
  );
}
