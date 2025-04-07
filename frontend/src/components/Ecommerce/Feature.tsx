"use client";
import apiLinks from "@/utils/api-links";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Feature() {
  const [gomOrderUrl, setGomOrderUrl] = useState(null);
  const [liveStreamUrl, setLiveStreamUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gomOrderRes, liveStreamRes] = await Promise.all([
          axios.get(apiLinks.order.gomOrderGetAll),
          axios.get(apiLinks.livestream.livestreamList),
        ]);

        const firstGomOrder = gomOrderRes.data[0]?.slug || null;
        const firstLiveStream = liveStreamRes.data[0]?.slug || null;

        setGomOrderUrl(firstGomOrder);
        setLiveStreamUrl(firstLiveStream);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="container container-xxl pt-lg-6 pb-15 pb-lg-20 mb-4">
      <div className="row gy-30px">
        <div className="col-lg-6">
          <Link href={gomOrderUrl ? `/g/${gomOrderUrl}` : "/"}>
            <div className="card border-0 rounded-0 banner-01 hover-zoom-in hover-shine">
              <img
                className="dark-mode-img object-fit-contain card-img loaded"
                src="/assets/images/gomorder-cover.svg"
                alt="Gom Order - LamHy.Store"
              />
            </div>
          </Link>
        </div>
        <div className="col-lg-6">
          <Link href={liveStreamUrl ? `/l/${liveStreamUrl}` : "/"}>
            <div className="card border-0 rounded-0 banner-01 hover-zoom-in hover-shine">
              <img
                className="dark-mode-img object-fit-contain card-img loaded"
                src="/assets/images/livestream-cover.svg"
                alt="Live Stream - LamHy.Store"
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
