"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { api } from "@/lib/api";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshDashboard = useCallback(async () => {
    try {
      const [summaryRes, analyticsRes] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/analytics"),
      ]);
      // apply any manual adjustments stored in localStorage
      const rawAdj = (() => {
        try {
          const a = localStorage.getItem("reportsAdjustments");
          if (a) return JSON.parse(a);
          const single = localStorage.getItem("reportsAdjustment");
          if (single) return [JSON.parse(single)];
        } catch (e) {
          return null;
        }
        return null;
      })();

      const summaryData = summaryRes.data.data || {};
      const totalAdj = (rawAdj && Array.isArray(rawAdj)) ? rawAdj.reduce((s, it) => s + (Number(it.amount) || 0), 0) : 0;
      const adjustedSummary = { ...summaryData, currentBalance: (Number(summaryData.currentBalance || 0) - totalAdj) };
      setSummary(adjustedSummary);
      setAnalytics(analyticsRes.data.data);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to refresh dashboard:", error);
    }
  }, []);

  const value = {
    summary,
    setSummary,
    analytics,
    setAnalytics,
    refreshDashboard,
    refreshKey,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
};
