import React from "react";

const ServicesPagePagination = ({ page, setPage, hasMore }) => {
  return (
    <footer className="mt-32 pb-20 flex justify-center items-center gap-8">
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
        className="group flex items-center gap-2 text-slate-500 hover:text-white disabled:opacity-10 transition-all uppercase text-[10px] font-bold tracking-[0.2em]"
      >
        <svg
          className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Prev
      </button>
      <span className="h-12 w-12 flex items-center justify-center rounded-2xl bg-cyan-500 text-black font-black text-lg shadow-[0_0_20px_rgba(34,211,238,0.3)]">
        {page}
      </span>
      <button
        disabled={!hasMore}
        onClick={() => setPage((p) => p + 1)}
        className="group flex items-center gap-2 text-slate-500 hover:text-white disabled:opacity-10 transition-all uppercase text-[10px] font-bold tracking-[0.2em]"
      >
        Next
        <svg
          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </footer>
  );
};

export default ServicesPagePagination;
