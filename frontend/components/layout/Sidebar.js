"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpenText, CircleMinus, CirclePlus, LayoutDashboard, Settings, WalletCards } from "lucide-react";
import clsx from "clsx";
import { useEffect, useState } from "react";

const items = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/add-sale", "Add Sale", CirclePlus],
  ["/add-expense", "Add Expense", CircleMinus],
  ["/ledger", "Ledger", BookOpenText],
  ["/analytics", "Analytics", BarChart3],
  ["/monthly-profit", "Monthly Profit", BarChart3],
  ["/reports", "Reports", BarChart3],
  ["/settings", "Settings", Settings],
];

export function Sidebar({ open, setOpen }) {
  const path = usePathname();
  const [adj, setAdj] = useState({ month: "", amount: "" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("reportsAdjustment");
      if (raw) setAdj(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const saveAdj = () => {
    try {
      const payload = { month: adj.month || "", amount: Number(adj.amount) || 0 };
      localStorage.setItem("reportsAdjustment", JSON.stringify(payload));
      setAdj(payload);
      // keep sidebar open so user sees saved state
    } catch (e) {
      // ignore
    }
  };

  const clearAdj = () => {
    localStorage.removeItem("reportsAdjustment");
    setAdj({ month: "", amount: "" });
  };
  return (
    <aside className={clsx("fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white p-4 transition dark:border-slate-800 dark:bg-slate-950 lg:static lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
      <div className="mb-6 flex items-center gap-2 text-lg font-black"><WalletCards className="text-brand-600" /> Personal Ledger</div>
      <nav className="space-y-1">
        {items.map(([href, label, Icon]) => (
          <Link onClick={() => setOpen(false)} key={href} href={href} className={clsx("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium", path === href ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900")}>
            <Icon size={18} />{label}
          </Link>
        ))}
      </nav>
     
    </aside>
  );
}
