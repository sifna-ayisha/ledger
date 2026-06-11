"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormField } from "./FormField";

export function CrudModal({ title, fields, initial, onClose, onSubmit }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: initial || {} });
  useEffect(() => { reset(initial || {}); }, [initial, reset]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="card w-full max-w-xl">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">{title}</h2><button type="button" className="btn-secondary" onClick={onClose}>Close</button></div>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => <FormField key={field.name} label={field.label} error={errors[field.name]}>{field.type === "select" ? <select className="input" {...register(field.name, { required: field.required && `${field.label} is required`, valueAsNumber: field.number })}>{field.options.map((o) => <option key={o} value={o}>{o}</option>)}</select> : <input type={field.type || "text"} className="input" {...register(field.name, { required: field.required && `${field.label} is required`, valueAsNumber: field.number })} />}</FormField>)}
        </div>
        <button className="btn-primary mt-5 w-full" disabled={isSubmitting}>Save</button>
      </form>
    </div>
  );
}
