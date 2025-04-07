"use client";
import { useState, useEffect } from "react";
import { RiEyeLine } from "react-icons/ri";

const ViewEyes = () => {
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    // Function to generate a random number between a range
    const getRandomNumber = () => Math.floor(Math.random() * 10) + 1;

    // Set initial random number
    setViewers(getRandomNumber());

    // Update every 5 seconds
    const interval = setInterval(() => {
      setViewers(getRandomNumber());
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <p className="mb-4 pb-2">
      <span className="text-body-emphasis">
        <RiEyeLine /> {viewers} người đang xem sản phẩm.
      </span>
    </p>
  );
};

export default ViewEyes;
