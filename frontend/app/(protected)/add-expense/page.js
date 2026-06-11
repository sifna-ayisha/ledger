"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { TransactionModal } from "@/components/forms/TransactionModal";

export default function AddExpensePage() {
  const router = useRouter();
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
      await api.post("/ledger", values);
      toast.success("Expense added");
    } catch (err) {
      toast.error(formatApiError(err));
      return;
    }
  };
  return <TransactionModal type="expense" onClose={() => router.push("/dashboard")} onSubmit={save} onSuccess={() => { router.push("/dashboard"); router.refresh(); }} />;
}
