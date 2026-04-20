import React from "react";

export default function PartnerMarquee() {
  const partners = [
    "Siemens",
    "SAP",
    "BMW",
    "Zalando",
    "Delivery Hero",
    "BioNTech",
  ];

  return (
    <section
      aria-label="Partner companies marquee"
      className="py-10 bg-dark-950 overflow-hidden"
    >
      <ul className="flex whitespace-nowrap overflow-hidden">
        {[1, 2, 3].map((group) => (
          <div key={group} className="flex animate-marquee shrink-0">
            {partners.map((brand, idx) => (
              <li
                key={`${group}-${idx}`}
                className="text-2xl font-bold text-gray-600 px-12 hover:text-accent transition-colors"
                aria-label={`Partner company: ${brand}`}
                role="listitem"
              >
                {brand}
              </li>
            ))}
          </div>
        ))}
      </ul>
    </section>
  );
}