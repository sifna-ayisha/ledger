"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CircleMinus, CirclePlus, IndianRupee, Pencil, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { currency, dateInput } from "@/lib/format";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { TransactionModal } from "@/components/forms/TransactionModal";
import { useDashboard } from "@/context/DashboardContext";
import { useAuth } from "@/context/AuthContext";
import { AdminShopsView } from "@/components/admin/AdminShopsView";

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { summary, analytics, refreshDashboard, setSummary } = useDashboard();
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (!isAdmin) refreshDashboard();
  }, [refreshDashboard, isAdmin]);

  if (isAdmin) return <AdminShopsView />;

  const save = async (values) => {
    const formatApiError = (err) => {
      if (!err) return "Request failed";
      if (Array.isArray(err.errors)) return err.errors.join(", ");
      if (typeof err === "string") return err;
      if (err.errors && typeof err.errors === "string") return err.errors;
      if (err.message) return err.message;
      return JSON.stringify(err);
    };
    try {
      if (modal?.initial) {
        const { data } = await api.put(`/ledger/${modal.initial._id}`, values);
        const updated = data.data.item;
        toast.success("Transaction updated");
        // update local summary
        setSummary((prev) => {
          if (!prev) return prev;
          const recent = (prev.recentTransactions || []).map((r) => (r._id === updated._id ? updated : r));
          return { ...prev, recentTransactions: recent };
        });
      } else {
        const { data } = await api.post("/ledger", values);
        const created = data.data.item;
        toast.success("Transaction saved");
        // update local summary: prepend
        setSummary((prev) => {
          if (!prev) return prev;
          const recent = [created, ...(prev.recentTransactions || [])];
          // adjust totals
          const monthCredit = prev.monthCredit + (created.type === "credit" ? created.amount : 0);
          const monthExpenses = prev.monthExpenses + (created.type === "expense" ? created.amount : 0);
          const currentBalance = prev.currentBalance + (created.type === "credit" ? created.amount : -created.amount);
          return { ...prev, recentTransactions: recent, monthCredit, monthExpenses, currentBalance };
        });
      }
      setModal(null);
      // also trigger a background refresh to keep analytics in sync
      refreshDashboard().catch(() => {});
    } catch (err) {
      toast.error(formatApiError(err));
      return;
    }
  };
  const remove = async (row) => {
    await api.delete(`/ledger/${row._id}`);
    toast.success("Transaction deleted");
    await refreshDashboard();
  };

  if (!summary) return <LoadingSkeleton rows={7} />;
  const monthProfit = summary.monthCredit - summary.monthExpenses;
  const cards = [
    ["Current Balance", summary.currentBalance, IndianRupee],
    ["Today's Sales", summary.todayCredit, CirclePlus],
    ["Today's Expenses", summary.todayExpenses, CircleMinus],
    ["This Month's Sales", summary.monthCredit, CirclePlus],
    ["This Month's Expenses", summary.monthExpenses, CircleMinus],
    ["This Month's Profit", monthProfit, monthProfit >= 0 ? CirclePlus : CircleMinus],
  ];
  const columns = [
    { key: "date", label: "Date", render: (r) => dateInput(r.date) },
    { key: "type", label: "Type", render: (r) => <span className={r.type === "credit" ? "text-green-600" : "text-red-600"}>{r.type === "credit" ? "Sale" : "Expense"}</span> },
    { key: "category", label: "Category", render: (r) => r.category || "-" },
    { key: "paymentMethod", label: "Payment Method", render: (r) => r.paymentMethod || (r.type === "credit" ? "Cash" : "-") },
    { key: "amount", label: "Amount", render: (r) => currency(r.amount) },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-black">Dashboard</h1><p className="text-sm text-slate-500">Personal sales, expenses, and balance health.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{cards.map(([label, value, icon]) => <StatCard key={label} label={label} value={value} icon={icon} />)}</div>
      <div className="card">
        <h2 className="mb-4 font-bold">Recent Transactions</h2>
        <DataTable columns={columns} rows={summary.recentTransactions || []} actions={(row) => <div className="flex justify-end gap-2"><button className="btn-secondary" onClick={() => setModal({ initial: row })}><Pencil size={16} /></button><button className="btn-secondary text-red-600" onClick={() => remove(row)}><Trash2 size={16} /></button></div>} />
      </div>
      <div className="fab-group">
        <button className="btn-primary rounded-full shadow-lg" onClick={() => setModal({ type: "credit" })}><CirclePlus size={18} />Add Sale</button>
        <button className="btn-secondary rounded-full shadow-lg" onClick={() => setModal({ type: "expense" })}><CircleMinus size={18} />Add Expense</button>
      </div>
      {modal && <TransactionModal type={modal.type} initial={modal.initial} onClose={() => setModal(null)} onSubmit={save} />}
    </div>
  );
}
