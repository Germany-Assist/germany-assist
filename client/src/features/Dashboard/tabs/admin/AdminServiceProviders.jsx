import React, { useEffect, useState } from "react";
import adminApis from "../../../../api/adminApis";
import DynamicTable from "../../DynamicTable";
import ActionMenu from "../../ActionMenu";
import { FcCheckmark } from "react-icons/fc";
import { ImCross } from "react-icons/im";
export default function AdminServiceProvider() {
  const updateRow = (id, updater) => {
    setData((prev) => {
      if (!prev) return prev;
      const newData = prev.data.map((row) =>
        row.id === id ? { ...row, ...updater(row) } : row
      );
      return { ...prev, data: newData };
    });
  };

  const openNewTab = (id) => {
    window.open(`/user/${id}`, "_blank");
  };
  const verifyUser = async (id) => {
    const res = await adminApis.verifyUser(id);
    if (res) updateRow(id, (row) => ({ ...row, isVerified: true }));
  };
  const [data, setData] = useState(null);
  useEffect(() => {
    (async () => {
      const res = await adminApis.getAllUsers();
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
                label: "View",
                onClick: () => openNewTab(row.id),
              },
              !row.isVerified
                ? {
                    label: "Verify",
                    onClick: async () => await verifyUser(row.id),
                  }
                : {},
              {
                label: "Delete",
                danger: true,
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
      <h1 className="text-3xl antialiased mb-4">Users</h1>
      {data ? (
        <DynamicTable columns={data.columns} data={data.data} />
      ) : (
        "Loading..."
      )}
    </div>
  );
}
