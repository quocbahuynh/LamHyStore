"use client";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export default function page() {
  const router = useRouter();
  const { accessToken, adminProfile } = useSelector(
    (state: RootState) => state.adminauth,
  );
  const isAuthenticated = !!(accessToken && adminProfile);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard/menu");
    } else {
      router.push("/admin-signin");
    }
  }, [isAuthenticated]);
  return <div>Đang xác thực...</div>;
}
