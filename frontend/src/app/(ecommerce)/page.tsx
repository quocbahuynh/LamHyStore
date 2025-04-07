import BestSeller from "@/components/BestSeller";
import FlashSale from "@/components/FlashSale";
import HeroBanner from "@/components/HeroBanner";
import apiLinks from "@/utils/api-links";
import SectionSale from "@/components/SectionSale";
import { Metadata } from "next";
import Feature from "@/components/Ecommerce/Feature";

export const metadata: Metadata = {
  title: "Lamhy.Store",
  description:
    "LAMHY chuyên cung cấp mỹ phẩm, nước hoa chính hãng US. LAMHY luôn cam kết phân phối hàng chính hãng.",
  verification: {
    google: "N2NM5qln4jJ1-VCU2R4s4tLrYXpHfAyBUp44Gk87zKU",
  },
  openGraph: {
    title: "LamHy.Store | Mỹ phẩm chính hãng",
    description: "LamHy.Store chuyên cung cấp mỹ phẩm, nước hoa chính hãng US!",
    url: "https://www.lamhy.store/",
    locale: "vi_VN",
    siteName: "LamHy.Store",
  },
  alternates: {
    canonical: "https://www.lamhy.store/",
  },
};

async function getBanners() {
  const res = await fetch(apiLinks.homepage.banners, { cache: "no-store" });
  return res.json();
}

export async function getBestSeller() {
  const res = await fetch(apiLinks.homepage.bestseller, { cache: "no-store" });
  return res.json();
}

export async function getSections() {
  const res = await fetch(apiLinks.homepage.sections, { cache: "no-store" });
  return res.json();
}

export default async function HomePage() {
  const bestSellerData = getBestSeller();
  const sectionsData = getSections();
  const bannersData = getBanners();

  const [bestSellers, sections, banners] = await Promise.all([
    bestSellerData,
    sectionsData,
    bannersData,
  ]);
  return (
    <>
      <HeroBanner data={banners[0]?.sections} />

      {sections[0]?.sections.map((data: any, i: number) => {
        return i === 0 ? (
          <FlashSale data={data} key={i} />
        ) : (
          <SectionSale data={data} key={i} />
        );
      })}

      <BestSeller
        data={bestSellers[0]?.sections}
        title={bestSellers[0]?.title}
      />
      <Feature />
    </>
  );
}
