"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { currency } from "@/lib/format";
import { exportExcel, exportPdf } from "@/lib/export";
import { DataTable } from "@/components/ui/DataTable";

const endpoints = {
  daily: "/reports/daily",
  monthly: "/reports/monthly",
  yearly: "/reports/yearly",
};

export default function ReportsPage() {
  const [period, setPeriod] = useState("daily");
  const [rows, setRows] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [range, setRange] = useState({ startDate: "", endDate: "" });
  const load = async () => {
    const { data } = await api.get(endpoints[period], { params: range });
    setRows(data.data.rows || []);
  };
  // load adjustments array from localStorage (backwards-compatible)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("reportsAdjustments");
      if (raw) setAdjustments(JSON.parse(raw));
      else {
        const single = localStorage.getItem("reportsAdjustment");
        if (single) setAdjustments([JSON.parse(single)]);
      }
    } catch (e) {
      // ignore
    }
  }, []);
  const columns = [
    { key: "period", label: "Period" },
    { key: "credit", label: "Sale", render: (r) => currency(r.credit) },
    { key: "expense", label: "Expense", render: (r) => currency(r.expense) },
    { key: "balance", label: "Balance", render: (r) => {
        const adj = (period === "monthly") ? adjustments.filter(a => a.month === r.period).reduce((s, x) => s + (Number(x.amount) || 0), 0) : 0;
        const value = (typeof r.balance !== 'undefined' ? Number(r.balance) : (Number(r.credit || 0) - Number(r.expense || 0))) - adj;
        return <span className={value < 0 ? "text-red-600" : "text-green-600"}>{currency(value)}</span>
      }
    },
    { key: "transactions", label: "Transactions" },
  ];
  // derive display rows with ids
  const displayRows = rows.map((r, i) => ({ _id: `${r.period}-${i}`, ...r }));

  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-black">Reports</h1><p className="text-sm text-slate-500">Generate daily, monthly, and yearly ledger reports.</p></div>
      <div className="card grid gap-3 sm:grid-cols-5">
        <select className="input" value={period} onChange={(e) => setPeriod(e.target.value)}><option value="daily">Daily Report</option><option value="monthly">Monthly Report</option><option value="yearly">Yearly Report</option></select>
        <input className="input" type="date" value={range.startDate} onChange={(e) => setRange({ ...range, startDate: e.target.value })} />
        <input className="input" type="date" value={range.endDate} onChange={(e) => setRange({ ...range, endDate: e.target.value })} />
        <button className="btn-primary" onClick={load}>Generate</button>
        <div className="flex gap-2"><button className="btn-secondary" onClick={() => exportExcel(rows, `${period}-ledger-report`)}>Excel</button><button className="btn-secondary" onClick={() => exportPdf(rows, `${period}-ledger-report`)}>PDF</button></div>
      </div>
      <DataTable columns={columns} rows={displayRows} />
    </div>
  );
}
