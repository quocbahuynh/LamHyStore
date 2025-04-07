"use client";
import { useEffect, useState } from "react";
import apiLinks from "./api-links";
import { Section } from "@/models/Section";
import axios from "axios";

const useProducts = (productExternalIds: string[]) => {
  const [products, setProducts] = useState<any[]>([]);

  const updatePosition = async (
    id: string,
    newPos: number,
    sectionData: Section,
  ) => {
    let dataArray: string[] = [...productExternalIds.map(String)];
    const currentIndex = dataArray.indexOf(id);
    if (currentIndex !== -1) {
      dataArray.splice(currentIndex, 1);
    }
    dataArray.splice(newPos, 0, id);

    const data = {
      title: sectionData.title,
      description: sectionData.description,
      productExternalIds: dataArray,
    };
    await axios.put(apiLinks.admin.sectionUpdated + `/${sectionData.id}`, data);
    alert("Cập nhật thành công");
    location.reload();
  };

  const removeProduct = async (id: string, sectionData: Section) => {
    const updatedProducts = [...products].filter((p) => p.Id !== id);
    let extractProductsId: string[] = [];
    updatedProducts.map((p) => {
      extractProductsId.push(`${p.Id}`);
    });
    const data = {
      title: sectionData.title,
      description: sectionData.description,
      productExternalIds: extractProductsId,
    };
    await axios.put(apiLinks.admin.sectionUpdated + `/${sectionData.id}`, data);

    alert("Xóa thành công");
    setProducts(updatedProducts);
  };

  const addProduct = async (idList: string[], sectionData: any) => {
    const updatedIdList = Array.from(
      new Set([...idList, ...productExternalIds]),
    );
    const data = {
      title: sectionData.title,
      description: sectionData.description || "",
      productExternalIds: updatedIdList,
    };
    await axios.put(apiLinks.admin.sectionUpdated + `/${sectionData.id}`, data);
    alert("Cập nhật thành công");
    location.reload();
  };

  const updateProduct = async (idList: string[], sectionData: any) => {
    // const updatedIdList = Array.from(new Set([...idList, ...productExternalIds]));
    const data = {
      title: sectionData.title,
      description: sectionData.description || "",
      productExternalIds: idList,
    };
    await axios.put(apiLinks.admin.sectionUpdated + `/${sectionData.id}`, data);
    alert("Cập nhật thành công");
    location.reload();
  };

  useEffect(() => {
    if (productExternalIds.length === 0) return;

    const idsQuery = productExternalIds
      .map((id) => `ids=${encodeURIComponent(id)}`)
      .join("&");
    const eventSource = new EventSource(
      `${apiLinks.product.getListIds}${idsQuery}`,
    );

    eventSource.onmessage = (event) => {
      const product: any = JSON.parse(event.data);
      setProducts((prevProducts) => {
        // Check if the product is already in the list
        if (prevProducts.some((p) => p.Id === product.Id)) {
          return prevProducts; // If it exists, return the same list (prevent duplicates)
        }
        return [...prevProducts, product]; // Otherwise, add it to the list
      });
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close(); // Cleanup when component unmounts
    };
  }, [productExternalIds]);

  return { products, removeProduct, addProduct, updatePosition, updateProduct };
};

export default useProducts;
