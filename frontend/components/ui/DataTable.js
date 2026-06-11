import { EmptyState } from "./EmptyState";

export function DataTable({ columns, rows, actions }) {
  if (!rows?.length) return <EmptyState />;
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
        <thead className="bg-slate-100 dark:bg-slate-900">
          <tr>{columns.map((c) => <th className="px-4 py-3 text-left font-semibold" key={c.key}>{c.label}</th>)}{actions && <th className="px-4 py-3" />}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row) => <tr key={row._id}>{columns.map((c) => <td className="px-4 py-3" key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>)}{actions && <td className="px-4 py-3 text-right">{actions(row)}</td>}</tr>)}
        </tbody>
      </table>
    </div>
  );
}
