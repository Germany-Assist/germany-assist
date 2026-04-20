import React from "react";
import ServiceCard from "./ServiceCard";
import { useProfile } from "../../contexts/ProfileContext";

const ServiceGrid = ({ services, isSearching }) => {
  const { isInFavorite, toggleFavorite } = useProfile();

  if (services.length === 0) {
    return (
      <div className="text-center py-40 bg-white/5 rounded-[3rem] border border-white/5">
        <p className="text-2xl text-slate-500 font-light">No results found.</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 transition-all duration-500 ${
        isSearching ? "opacity-50 grayscale-[0.5]" : "opacity-100"
      }`}
    >
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          data={service}
          favorite={isInFavorite(service.id)}
          onFavoriteClick={() =>
            toggleFavorite({
              id: service.id,
              title: service.title,
              description: service.description,
            })
          }
        />
      ))}
    </div>
  );
};

export default ServiceGrid;
