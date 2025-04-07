import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "../globals.css";
import SideBar from "@/components/Dashboard/SideBar";
import Header from "@/components/Dashboard/Header";
import StoreProvider from "@/components/Redux/StoreProvider";

const nuitoSans = Nunito_Sans({
  variable: "--bs-font-sans-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hệ thống quản trị - Lamhy.Store",
  description: "Hệ thống quản trị - Lamhy.Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nuitoSans.variable}`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
