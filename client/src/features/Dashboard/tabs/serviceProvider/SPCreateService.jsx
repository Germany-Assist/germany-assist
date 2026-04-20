import React, { useEffect, useState } from "react";
import ServiceWizard from "../../../service/creation/ServiceWizard";
import { useLocation } from "react-router-dom";
import serviceProviderApis from "../../../../api/serviceProviderApis";

export default function SPCreateService() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const [existingServiceData, setExistingServiceData] = useState(null);
  const [isLoading, setIsLoading] = useState(!!id); // Only load if ID exists

  useEffect(() => {
    if (id) {
      (async () => {
        setIsLoading(true);
        try {
          const results = await serviceProviderApis.serviceProfilePageSP(id);
          setExistingServiceData(results);
        } catch (error) {
          console.error("Failed to fetch service data:", error);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Loading Service Data
        </p>
      </div>
    );
  }

  return (
    <div>
      {id ? (
        <ServiceWizard isEditMode={true} initialData={existingServiceData} />
      ) : (
        <ServiceWizard />
      )}
    </div>
  );
}
