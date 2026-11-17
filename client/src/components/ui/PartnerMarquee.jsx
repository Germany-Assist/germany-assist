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
      aria-label="Partner companies"
      className="py-10 bg-slate-50 border-y border-slate-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">
          Talent hired by Germany&apos;s leading companies
        </p>
        <ul className="flex flex-wrap justify-center gap-x-12 gap-y-3" aria-hidden="false">
          {partners.map((brand) => (
            <li
              key={brand}
              className="text-xl font-bold text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={`Partner company: ${brand}`}
              role="listitem"
            >
              {brand}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
