import React, { useState } from "react";
import MaintenancePage from "../../../../pages/MaintenancePage";
import { useProfile } from "../../../../contexts/ProfileContext";
import MultiUseTable from "../../../../components/ui/dashboard/MultiUseTable";
import TransactionCell from "../../../../components/ui/dashboard/TransactionCell";
import { Box, History } from "lucide-react";
import StatusModal from "../../../../components/ui/StatusModal";
import DashboardHeader from "../../../../components/ui/dashboard/DashboardHeader";
import ActionGroup from "../../../../components/ui/dashboard/ActionGroup";
import { useNavigate } from "react-router-dom";
//TODO
// favorite is coming from the profile for now i will make separate route later on
function ClientFavorite() {
  const { profile, toggleFavorite } = useProfile();
  const [tableLoading, setTableLoading] = useState(null);
  const [statusModalCon, setStatusModalCon] = useState(null);
  const navigate = useNavigate(null);

  async function handleRemoveFromFavorite(service) {
    await toggleFavorite(service);
  }

  const columns = [
    {
      header: "Service",
      render: (row) => (
        <TransactionCell
          title={row.service.title}
          icon={Box}
          variant={"default"}
        />
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <ActionGroup
          actions={[
            {
              label: "Remove From Favorite",
              show: true,
              onClick: () => toggleFavorite(row.service),
              variant: "danger",
            },
            {
              label: "Go to service",
              show: true,
              onClick: () => navigate(`/service/${row.service.id}`),
              variant: "primary",
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <StatusModal {...statusModalCon} />
      <div className="max-w-6xl mx-auto space-y-8">
        <DashboardHeader
          title={"USER FAVORITE"}
          subtitle={"FAVORITE Control center"}
        />
      </div>
      <div className="overflow-x-auto">
        <MultiUseTable
          columns={columns}
          data={profile.favorites}
          loading={tableLoading}
        />
      </div>
    </div>
  );
}

export default ClientFavorite;
