"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import clsx from "clsx";

export function SearchableSelect({ options = [], value = "", onChange, placeholder = "Search...", emptyLabel = "No matches found" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = useMemo(() => options.find((option) => option.value === value), [options, value]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return options;
    return options.filter((option) => option.label.toLowerCase().includes(term));
  }, [options, query]);

  const handleSelect = (option) => {
    onChange?.(option.value);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        className="input flex items-center justify-between text-left"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={clsx("truncate", !selected && "text-slate-400")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={18} className="ml-2 shrink-0 text-slate-400" />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 dark:border-slate-800">
            <Search size={16} className="text-slate-400" />
            <input
              autoFocus
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Type to search shops..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-slate-400">{emptyLabel}</li>
            )}
            {filtered.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  className={clsx(
                    "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800",
                    option.value === value && "font-semibold text-brand-600"
                  )}
                  onClick={() => handleSelect(option)}
                >
                  <span className="min-w-0">
                    <span className="block truncate">{option.label}</span>
                    {option.subLabel && (
                      <span className="block truncate text-xs text-slate-400">{option.subLabel}</span>
                    )}
                  </span>
                  {option.value === value && <Check size={16} className="shrink-0 text-brand-600" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
