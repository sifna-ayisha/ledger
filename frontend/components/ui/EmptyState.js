export function EmptyState({ title = "No records found", action }) {
  return <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-700"><p className="font-semibold">{title}</p>{action}</div>;
}
