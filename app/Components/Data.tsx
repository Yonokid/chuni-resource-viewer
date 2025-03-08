"use client";
import React, { useState, useEffect } from "react";

export interface BaseData {
  id: string;
  name: string;
  version: string;
}

interface Endpoint<T> {
  endpoint: string;
  render: (data: T[]) => React.ReactNode;
  skeleton?: (count: number) => React.ReactNode;
}

const DataList = <T extends BaseData>({
  endpoint,
  render,
  skeleton,
}: Endpoint<T>) => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(endpoint)
      .then((response) => response.json())
      .then((json: T[]) => {
        setData(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading JSON:", error);
        setLoading(false);
      });
  }, [endpoint]);

  if (loading) {
    if (skeleton) {
      return skeleton(5);
    }
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>Error loading data.</p>;
  }
  return <>{render(data)}</>;
};

export default DataList;
