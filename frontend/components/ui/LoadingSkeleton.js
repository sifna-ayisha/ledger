export function LoadingSkeleton({ rows = 4 }) {
  return <div className="space-y-3">{Array.from({ length: rows }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />)}</div>;
}
