import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "../globals.css";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import StoreProvider from "@/components/Redux/StoreProvider";
import CallAction from "@/components/Ecommerce/CallAction";
import type { Viewport } from "next";

const nuitoSans = Nunito_Sans({
  variable: "--bs-font-sans-serif",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#800020",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico?=0.0.1", // /public path
  },
  verification: {
    google: "N2NM5qln4jJ1-VCU2R4s4tLrYXpHfAyBUp44Gk87zKU",
  },
  generator: "Lamhy.Store",
  applicationName: "Lamhy.Store",
  title: "Lamhy.Store - Mỹ Phẩm, Nước Hoa Chính Hãng tại Binh Duong",
  description:
    "Lamhy.Store chuyên cung cấp mỹ phẩm, nước hoa chính hãng từ Mỹ tại Binh Duong. Cam kết phân phối hàng chính hãng và chất lượng cao.",
  keywords: [
    "Lamhy.Store",
    "LAMHY",
    "Lamhy Store",
    "mỹ phẩm chính hãng",
    "nước hoa chính hãng",
    "mỹ phẩm Binh Duong",
    "nước hoa Binh Duong",
    "mỹ phẩm cao cấp",
    "nước hoa cao cấp",
    "nước hoa nam Binh Duong",
    "nước hoa nữ Binh Duong",
    "mỹ phẩm xách tay Binh Duong",
    "mua mỹ phẩm Binh Duong",
    "mua nước hoa Binh Duong",
    "cửa hàng mỹ phẩm Binh Duong",
    "mỹ phẩm Mỹ chính hãng",
    "nước hoa chính hãng Binh Duong",
    "lamhy.store mỹ phẩm",
    "lamhy.store nước hoa",
    "mỹ phẩm Binh Duong chính hãng",
    "nước hoa Binh Duong chính hãng",
    "mỹ phẩm Binh Duong online",
    "mua mỹ phẩm online Binh Duong",
    "nước hoa Binh Duong xách tay",
    "buy perfumes Binh Duong",
    "buy cosmetics Binh Duong",
    "authentic beauty products Binh Duong",
  ],
  authors: [{ name: "Ngô Mai Ngân Hà" }],
  creator: "Quoc Huynh Website",
  publisher: "Quoc Huynh Website",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="N2NM5qln4jJ1-VCU2R4s4tLrYXpHfAyBUp44Gk87zKU"
        />
      </head>
      <body className={`${nuitoSans.variable}`}>
        <StoreProvider>
          <Menu />
          <main id="content">{children}</main>
          <Footer />
          <CallAction />
        </StoreProvider>
      </body>
    </html>
  );
}
