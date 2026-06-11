"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { dateInput } from "@/lib/format";
import { useDashboard } from "@/context/DashboardContext";

export const expenseCategories = ["Rent", "Travel", "Electricity", "Purchase", "Maintenance", "Salary", "Miscellaneous", "Other"]
export const paymentMethods = ["Cash", "UPI"]
export function TransactionModal({ type = "sale", initial, onClose, onSubmit, onSuccess }) {
  const { refreshDashboard } = useDashboard();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: initial || { date: dateInput().slice(0, 10), type, category: type === "expense" ? expenseCategories[0] : null, paymentMethod: "Cash", amount: "" },
  });
  useEffect(() => {
    reset(initial
      ? {
        ...initial,
        date: dateInput(initial.date),
        category: initial.category || (initial.type === "expense" ? expenseCategories[0] : null),
        paymentMethod: initial.paymentMethod || "Cash",
      }
      : { date: dateInput().slice(0, 10), type, category: type === "expense" ? expenseCategories[0] : null, paymentMethod: "Cash", amount: "" }
    );
  }, [initial, reset, type]);
  
  const isExpense = (initial?.type || type) === "expense";

  const handleFormSubmit = async (values) => {
    const payload = { ...values, date: values.date };
    // ensure sales (credit) don't send an invalid category
    if ((payload.type === "credit" || payload.type === "sale") && payload.category) {
      payload.category = null;
    }
    // normalize amount to number
    if (payload.amount !== undefined) payload.amount = Number(payload.amount) || 0;
    // debug payload
    // eslint-disable-next-line no-console
    console.debug("Submitting transaction payload:", payload);
    await onSubmit(payload);
    // Refresh dashboard data after successful submission
    await refreshDashboard();
    // Call optional success callback
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="card w-full max-w-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{initial ? "Edit Transaction" : isExpense ? "Add Expense" : "Add Sale"}</h2>
          <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
        </div>
        <input type="hidden" value={initial?.type || type} {...register("type")} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">Date<input type="date" className="input mt-1" {...register("date", { required: true })} /></label>
          {isExpense && <label className="text-sm font-medium">Category<select className="input mt-1" {...register("category", { required: true })}>{expenseCategories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>}
          {!isExpense && <label className="text-sm font-medium">Payment Method<select className="input mt-1" {...register("paymentMethod", { required: true })}>{paymentMethods.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>}
          <label className="text-sm font-medium">Amount<input type="number" min="0" step="0.01" className="input mt-1" {...register("amount", { required: true, valueAsNumber: true })} /></label>
        </div>
        <button className="btn-primary mt-5 w-full" disabled={isSubmitting}>Save</button>
      </form>
    </div>
  );
}
