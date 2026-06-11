import { currency } from "@/lib/format";

export function StatCard({ label, value, icon: Icon, money = true }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        {Icon && <Icon className="text-brand-600" size={20} />}
      </div>
      <p className="mt-3 text-2xl font-black">{money ? currency(value) : value}</p>
    </div>
  );
}
