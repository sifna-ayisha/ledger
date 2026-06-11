"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Search, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { currency } from "@/lib/format";
import { TransactionModal } from "@/components/forms/TransactionModal";

const ranges = [
  ["today", "Today"],
  ["yesterday", "Yesterday"],
  ["week", "This Week"],
  ["month", "This Month"],
  ["year", "This Year"],
  ["custom", "Custom Date Range"],
];

const dateTitle = (value) => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));

export default function LedgerPage() {
  const [groups, setGroups] = useState([]);
  const [filters, setFilters] = useState({ range: "month", search: "", startDate: "", endDate: "" });
  const [modal, setModal] = useState(null);

  const params = { search: filters.search, range: filters.range };
  if (filters.range === "custom") {
    params.startDate = filters.startDate;
    params.endDate = filters.endDate;
  }
  const load = () => api.get("/ledger/grouped", { params }).then((res) => setGroups(res.data.data.groups || []));
  useEffect(() => { load(); }, []);

  const save = async (values) => {
    await api.put(`/ledger/${modal.initial._id}`, values);
    toast.success("Transaction updated");
    setModal(null);
    load();
  };
  const remove = async (row) => {
    await api.delete(`/ledger/${row._id}`);
    toast.success("Transaction deleted");
    load();
  };
  const rowActions = (row) => (
    <div className="flex gap-2">
      <button className="btn-secondary px-2 py-1" onClick={() => setModal({ initial: row })}><Pencil size={14} /></button>
      <button className="btn-secondary px-2 py-1 text-red-600" onClick={() => remove(row)}><Trash2 size={14} /></button>
    </div>
  );

  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-black">Date-wise Ledger</h1><p className="text-sm text-slate-500">Sales, expenses, and daily balance grouped by date.</p></div>
      <div className="card grid gap-3 lg:grid-cols-5">
        <div className="relative lg:col-span-2"><Search className="absolute left-3 top-2.5 text-slate-400" size={18} /><input className="input pl-10" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Search transactions" /></div>
        <select className="input" value={filters.range} onChange={(e) => setFilters({ ...filters, range: e.target.value })}>{ranges.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        {filters.range === "custom" && <input className="input" type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />}
        {filters.range === "custom" && <input className="input" type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />}
        <button className="btn-primary" onClick={load}>Apply</button>
      </div>

      <div className="space-y-4">
        {groups.map((group) => (
          <section key={group.date} className="card">
            <h2 className="text-lg font-black">{dateTitle(group.date)}</h2>
            <div className="mt-4 grid gap-5 lg:grid-cols-2">
              <div>
                <p className="mb-2 font-semibold text-green-600">Sales</p>
                <div className="space-y-2">{group.credits.map((item) => <div key={item._id} className="flex items-center justify-between rounded-lg bg-green-50 p-3 text-sm dark:bg-green-950/20"><span>{item.description} <b>{currency(item.amount)}</b></span>{rowActions(item)}</div>)}</div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-red-600">Expenses</p>
                <div className="space-y-2">{group.expenses.map((item) => <div key={item._id} className="flex items-center justify-between rounded-lg bg-red-50 p-3 text-sm dark:bg-red-950/20"><span>{item.category}: {item.description} <b>{currency(item.amount)}</b></span>{rowActions(item)}</div>)}</div>
              </div>
            </div>
            <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 text-sm dark:border-slate-800 sm:grid-cols-3">
              <b>Sale {currency(group.totalCredit)}</b>
              <b>Expense {currency(group.totalExpense)}</b>
              <b className={group.balance < 0 ? "text-red-600" : "text-green-600"}>Balance {currency(group.balance)}</b>
            </div>
          </section>
        ))}
      </div>
      {modal && <TransactionModal initial={modal.initial} onClose={() => setModal(null)} onSubmit={save} />}
    </div>
  );
}
