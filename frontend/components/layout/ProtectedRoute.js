"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);
  if (loading || !isAuthenticated) return <div className="p-6"><LoadingSkeleton rows={6} /></div>;
  return children;
}
