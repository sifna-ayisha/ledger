"use client";
import { useEffect, useState } from "react";
import { currency } from "@/lib/format";

export default function MonthlyProfitPage() {
  const [items, setItems] = useState([]);
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("reportsAdjustments");
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const persist = (next) => {
    setItems(next);
    localStorage.setItem("reportsAdjustments", JSON.stringify(next));
  };

  const save = () => {
    const payload = { id: editingId || Date.now().toString(), month: month || "", amount: Number(amount) || 0 };
    if (editingId) {
      const next = items.map((it) => (it.id === editingId ? payload : it));
      persist(next);
    } else {
      const next = [payload, ...items];
      persist(next);
    }
    setMonth(""); setAmount(""); setEditingId(null);
  };

  const remove = (id) => {
    const next = items.filter((it) => it.id !== id);
    persist(next);
  };

  const edit = (it) => {
    setEditingId(it.id); setMonth(it.month); setAmount(String(it.amount));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black">Monthly Profit Adjustments</h1>
        <p className="text-sm text-slate-500">Add or edit manual adjustments that reduce final balance.</p>
      </div>

      <div className="card max-w-md">
        <label className="text-sm font-medium">Month
          <input type="month" className="input mt-1" value={month} onChange={(e) => setMonth(e.target.value)} />
        </label>
        <label className="text-sm font-medium mt-3">Amount
          <input type="number" min="0" step="0.01" className="input mt-1" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <div className="mt-4 flex gap-2">
          <button className="btn-primary" onClick={save}>{editingId ? "Update" : "Save"}</button>
          <button className="btn-secondary" onClick={() => { setMonth(""); setAmount(""); setEditingId(null); }}>Clear</button>
        </div>
      </div>

      <div className="card">
        <h2 className="font-bold">Saved Adjustments</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left"><th>Month</th><th>Amount</th><th></th></tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t">
                <td className="py-2">{it.month}</td>
                <td className="py-2">{currency(it.amount)}</td>
                <td className="py-2 text-right"><button className="btn-secondary mr-2" onClick={() => edit(it)}>Edit</button><button className="btn-danger" onClick={() => remove(it.id)}>Delete</button></td>
              </tr>
            ))}
            {!items.length && <tr><td className="py-2" colSpan={3}>No adjustments yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
