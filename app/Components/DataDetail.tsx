import React from "react";
import { useParams } from "next/navigation";
import DataList, { BaseData } from "./Data";

interface DataDetailProps<T extends BaseData> {
  endpoint: string;
  render: (data: T) => React.ReactNode;
}

const DataDetail = <T extends BaseData>({
  endpoint,
  render,
}: DataDetailProps<T>) => {
  const params = useParams<{ id: string }>();
  const { id } = params;

  return (
    <DataList<T>
      endpoint={endpoint}
      render={(data) => {
        const parsedId = parseInt(id, 10);
        const object = data.find((item) => parseInt(item.id, 10) === parsedId);

        if (!object) {
          return <div>Item not found.</div>;
        }

        return render(object);
      }}
    />
  );
};

export default DataDetail;
