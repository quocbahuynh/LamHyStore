"use client";

import { useState, useEffect } from "react";
import { TbTruckDelivery } from "react-icons/tb";

const EstimatedDelivery = () => {
  const [deliveryDate, setDeliveryDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 2); // Add 3 days
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1); // Next day

    const formatDate = (date: any) =>
      `${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;

    setDeliveryDate(`${formatDate(startDate)} - ${formatDate(endDate)}`);
  }, []);

  return (
    <p className="mb-4 pb-2">
      <span className="text-body-emphasis">
        <TbTruckDelivery /> Dự kiến nhận hàng: {deliveryDate}
      </span>
    </p>
  );
};

export default EstimatedDelivery;
