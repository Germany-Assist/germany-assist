import React, { useState, useEffect, useCallback } from "react";
import ServicesPageHUD from "../features/service/ServicesPageHUD";
import ServiceGrid from "../features/service/ServiceGrid";
import ServicesPagePagination from "../features/service/ServicesPagePagination";
import { useMeta } from "../contexts/MetadataContext";
import NavigationBar from "../components/ui/NavigationBar";
import { fetchServicesApi } from "../api/publicApis";
import { useSearchParams } from "react-router-dom";

const ServicesPage = () => {
  const { meta } = useMeta();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    maxRating: "",
    sort: "price",
    order: "asc",
  });
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setFilters((p) => ({ ...p, category: cat }));
  }, []);
  const fetchServices = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      setIsSearching(true);
      try {
        const query = new URLSearchParams({
          page: page.toString(),
          limit: "9",
          title: search,
          ...Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== ""),
          ),
        });
        const result = await fetchServicesApi(query);
        setServices(result.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    },
    [page, search, filters],
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => fetchServices(true), 450);
    return () => clearTimeout(timer);
  }, [search, fetchServices]);

  // Immediate update on filter/page change
  useEffect(() => {
    fetchServices(false);
  }, [page, filters.sort, filters.order, filters.category, fetchServices]);

  const handleUpdate = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-light-950 dark:bg-dark-950 transition-colors duration-700 ease-elegant">
      {/* Navigation shared across all pages */}
      <NavigationBar />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* HUD: The floating search/filter bar */}
        <ServicesPageHUD
          search={search}
          setSearch={setSearch}
          filters={filters}
          onUpdate={handleUpdate}
          onApply={() => fetchServices(false)}
          isSearching={isSearching}
          categories={meta?.categories}
        />

        <main className="mt-12 transition-all duration-500">
          {loading ? (
            /* Refactored Skeletons: No more "bright white" glare */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-[480px] w-full bg-light-900/50 dark:bg-dark-800/50 animate-pulse rounded-[2.5rem] border border-light-700 dark:border-white/5"
                >
                  <div className="h-48 w-full bg-light-800 dark:bg-dark-700 rounded-t-[2.5rem] opacity-50" />
                  <div className="p-8 space-y-4">
                    <div className="h-6 w-2/3 bg-light-800 dark:bg-dark-700 rounded-lg" />
                    <div className="h-4 w-full bg-light-800 dark:bg-dark-700 rounded-lg" />
                    <div className="h-4 w-5/6 bg-light-800 dark:bg-dark-700 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Grid handles the display logic */
            <div
              className={`transition-opacity duration-500 ${
                isSearching ? "opacity-40 grayscale-[0.5]" : "opacity-100"
              }`}
            >
              <ServiceGrid services={services} isSearching={isSearching} />
            </div>
          )}

          {/* Empty State */}
          {!loading && services.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500 dark:text-slate-400 text-lg font-light italic">
                No services found matching your criteria.
              </p>
            </div>
          )}

          {/* Pagination */}
          {!loading && services.length > 0 && (
            <div className="mt-16 flex justify-center">
              <ServicesPagePagination
                page={page}
                setPage={setPage}
                hasMore={services.length === 9}
              />
            </div>
          )}
        </main>
      </div>

      {/* Global CSS for the HUD loading line */}
      <style>{`
        @keyframes loading-bar { 
          0% { width: 0%; left: 0%; } 
          50% { width: 100%; left: 0%; } 
          100% { width: 0%; left: 100%; } 
        }
      `}</style>
    </div>
  );
};

export default ServicesPage;
