"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  useEffect(() => {
    api.get("/analytics").then((res) => setAnalytics(res.data.data));
  }, []);
  if (!analytics) return <LoadingSkeleton rows={6} />;
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-black">Analytics</h1><p className="text-sm text-slate-500">Sales and spending overview.</p></div>
    </div>
  );
}
