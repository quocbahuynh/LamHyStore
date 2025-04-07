import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "../../globals.css";
import SideBar from "@/components/Dashboard/SideBar";
import Header from "@/components/Dashboard/Header";

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
    <div className="wrapper dashboard-wrapper">
      <div className="d-flex flex-wrap flex-xl-nowrap">
        <SideBar />
        <div className="page-content">
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
}
