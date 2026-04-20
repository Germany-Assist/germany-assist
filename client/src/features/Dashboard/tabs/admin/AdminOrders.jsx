import React, { useEffect, useState } from "react";
import adminApis from "../../../../api/adminApis";
import DynamicTable from "../../DynamicTable";
import ActionMenu from "../../ActionMenu";
import { FcCheckmark } from "react-icons/fc";
import { ImCross } from "react-icons/im";
export default function AdminOrders() {
  const openNewTab = (url) => {
    window.open(url, "_blank");
  };
  const [data, setData] = useState(null);
  useEffect(() => {
    (async () => {
      const res = await adminApis.getAllOrders();
      if (!res.length) return;
      const columns = Object.keys(res[0])
        .filter((key) => key !== "dob")
        .map((key) => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          render: (row) =>
            typeof row[key] == "boolean" ? (
              row[key] == true ? (
                <div className="flex items-center justify-center">
                  <FcCheckmark size={"24px"} />
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <ImCross />
                </div>
              )
            ) : (
              row[key]
            ),
          sortable: true,
        }));
      columns.push({
        key: "actions",
        label: "",
        render: (row) => (
          <ActionMenu
            actions={[
              {
                label: "View User",
                onClick: () => openNewTab(`user/${row.id}`),
              },
              {
                label: "View Service",
                onClick: () => openNewTab(`service/${row.id}`),
              },
              {
                label: "View Timeline",
                onClick: () => openNewTab(`timeline/${row.id}`),
              },
            ]}
          />
        ),
      });
      setData({ columns, data: res });
    })();
  }, []);

  return (
    <div>
      <h1 className="text-3xl antialiased mb-4">Orders</h1>
      {data ? (
        <DynamicTable columns={data.columns} data={data.data} />
      ) : (
        "Loading..."
      )}
    </div>
  );
}
