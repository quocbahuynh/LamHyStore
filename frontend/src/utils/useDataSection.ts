"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import apiLinks from "./api-links";
import { Section } from "@/models/Section";

const useDataSection = (index: number) => {
  const [dataSection, setDataSection] = useState<Section | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger refresh

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(apiLinks.admin.sectionGetList);
      const data = response.data;

      if (data.length > 0 && data[0].sections.length > index) {
        setDataSection(data[0].sections[index]);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, [index]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]); // Depend on refreshKey to trigger refresh

  // Function to trigger data refresh
  const refreshData = () => {
    setDataSection(null);
    setRefreshKey((prev) => prev + 1);
  };

  return { dataSection, refreshData };
};

export default useDataSection;
