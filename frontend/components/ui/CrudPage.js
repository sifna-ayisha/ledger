"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { DataTable } from "./DataTable";
import { CrudModal } from "@/components/forms/CrudModal";

export function CrudPage({ title, endpoint, columns, fields, newLabel, mapPayload = (x) => x }) {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const load = () => api.get(endpoint, { params: { search } }).then((res) => setRows(res.data.data.items || []));
  useEffect(() => { load(); }, []);

  const submit = async (values) => {
    const payload = mapPayload(values);
    if (editing) await api.put(`${endpoint}/${editing._id}`, payload);
    else await api.post(endpoint, payload);
    toast.success("Saved");
    setOpen(false);
    setEditing(null);
    load();
  };

  const remove = async (row) => {
    await api.delete(`${endpoint}/${row._id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-black">{title}</h1>
        <button className="btn-primary" onClick={() => { setEditing(null); setOpen(true); }}><Plus size={18} />{newLabel}</button>
      </div>
      <div className="card flex gap-2">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 text-slate-400" size={18} /><input className="input pl-10" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" /></div>
        <button className="btn-secondary" onClick={load}>Filter</button>
      </div>
      <DataTable columns={columns} rows={rows} actions={(row) => <div className="flex justify-end gap-2"><button className="btn-secondary" onClick={() => { setEditing(row); setOpen(true); }}><Pencil size={16} /></button><button className="btn-secondary text-red-600" onClick={() => remove(row)}><Trash2 size={16} /></button></div>} />
      {open && <CrudModal title={editing ? `Edit ${title}` : newLabel} fields={fields} initial={editing} onClose={() => setOpen(false)} onSubmit={submit} />}
    </div>
  );
}
