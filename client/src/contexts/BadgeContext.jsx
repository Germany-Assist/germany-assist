import { createContext, useContext, useState, useCallback, useEffect } from "react";

const BadgeContext = createContext();

export const BadgeProvider = ({ children }) => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchCounts = useCallback(async () => {
    setLoading(true);
    try {
      const { dummyBadgeCounts } = await import("../features/updatedDashboard/sidebar/api/badgeApis");
      const res = await dummyBadgeCounts();
      setCounts(res);
    } catch {
      setCounts({});
    } finally {
      setLoading(false);
    }
  }, []);

  const getCount = useCallback(
    (badgeKey) => {
      return counts[badgeKey] ?? 0;
    },
    [counts]
  );

  const setCountsValue = useCallback((value) => {
    setCounts(value);
  }, []);

  const increment = useCallback((badgeKey, delta = 1) => {
    setCounts((prev) => ({
      ...prev,
      [badgeKey]: (prev[badgeKey] ?? 0) + delta,
    }));
  }, []);

  const decrement = useCallback((badgeKey, delta = 1) => {
    setCounts((prev) => ({
      ...prev,
      [badgeKey]: Math.max(0, (prev[badgeKey] ?? 0) - delta),
    }));
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchCounts();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [fetchCounts]);

  return (
    <BadgeContext.Provider
      value={{
        counts,
        loading,
        fetchCounts,
        getCount,
        setCountsValue,
        increment,
        decrement,
      }}
    >
      {children}
    </BadgeContext.Provider>
  );
};

export const useBadges = () => {
  const ctx = useContext(BadgeContext);
  if (!ctx) {
    throw new Error("useBadges must be used within BadgeProvider");
  }
  return ctx;
};