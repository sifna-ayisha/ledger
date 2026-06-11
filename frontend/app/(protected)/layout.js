"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";

export default function ProtectedLayout({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar open={open} setOpen={setOpen} />
        <div className="min-w-0 flex-1">
          <Navbar setOpen={setOpen} />
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
