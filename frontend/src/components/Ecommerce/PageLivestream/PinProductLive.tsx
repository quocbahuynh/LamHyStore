"use client";

import apiLinks from "@/utils/api-links";
import React, { useEffect, useState } from "react";
import { ProductItemLive } from "./ProductListLive";

interface PinProductComponentProp {
  id: string;
}

export default function PinProductLive({ id }: PinProductComponentProp) {
  const [pinnedProduct, setPinnedProduct] = useState(null);
  const [reconnecting, setReconnecting] = useState(false); // Track reconnection state

  const connectSSE = () => {
    const sseUrl = `${apiLinks.livestream.productPinId}/${id}/pin-product`;
    const eventSource = new EventSource(sseUrl);

    // Handle incoming events
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setPinnedProduct(data); // Replace with the new pinned product
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    // Handle errors and reconnection logic
    eventSource.onerror = () => {
      console.error("SSE connection error. Reconnecting...");
      setReconnecting(true);
      eventSource.close();

      // Retry after a short delay
      setTimeout(() => {
        setReconnecting(false);
        connectSSE(); // Reconnect to SSE
      }, 5000); // Reconnect after 5 seconds
    };

    return eventSource;
  };

  useEffect(() => {
    const eventSource = connectSSE();

    // Cleanup on component unmount
    return () => {
      eventSource.close();
    };
  }, [id]);

  return (
    <div>
      {pinnedProduct && <ProductItemLive data={pinnedProduct} />}
      {reconnecting && <p>Đang kết nối...</p>}
    </div>
  );
}
