"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { FormField } from "./FormField";

export function LoginForm() {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  return (
    <form onSubmit={handleSubmit(login)} className="card w-full max-w-md bg-white text-slate-900">
      <h1 className="text-2xl font-black">Login</h1>
      <div className="mt-6 space-y-4">
        <FormField label="Email" error={errors.email}><input className="input" {...register("email", { required: "Email is required" })} /></FormField>
        <FormField label="Password" error={errors.password}><input type="password" className="input" {...register("password", { required: "Password is required" })} /></FormField>
        <button className="btn-primary w-full" disabled={isSubmitting}>Login</button>
        <p className="text-sm">New here? <Link className="text-brand-600" href="/register">Create account</Link></p>
      </div>
    </form>
  );
}

export function RegisterForm() {
  const { register: create } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { role: "owner" } });
  return (
    <form onSubmit={handleSubmit(create)} className="card w-full max-w-md bg-white text-slate-900">
      <h1 className="text-2xl font-black">Create Account</h1>
      <div className="mt-6 space-y-4">
        <FormField label="Name" error={errors.name}><input className="input" {...register("name", { required: "Name is required" })} /></FormField>
        <FormField label="Email" error={errors.email}><input className="input" {...register("email", { required: "Email is required" })} /></FormField>
        {/* Ledger name not required on account creation */}
        <FormField label="Password" error={errors.password}><input type="password" className="input" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })} /></FormField>
        <button className="btn-primary w-full" disabled={isSubmitting}>Register</button>
        <p className="text-sm">Already registered? <Link className="text-brand-600" href="/login">Login</Link></p>
      </div>
    </form>
  );
}
