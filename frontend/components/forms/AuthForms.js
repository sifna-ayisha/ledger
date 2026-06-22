"use client";
import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { FormField } from "./FormField";

export function LoginForm() {
  const { login, adminLogin } = useAuth();
  const [mode, setMode] = useState("shop");
  const isAdmin = mode === "admin";
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const switchMode = (next) => {
    if (next === mode) return;
    setMode(next);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(isAdmin ? adminLogin : login)} className="auth-card w-full max-w-md">
      <h1 className="text-2xl font-black">Login</h1>
      <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        {[["shop", "Shop"], ["admin", "Admin"]].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => switchMode(value)}
            className={clsx(
              "rounded-md py-2 text-sm font-semibold transition",
              mode === value ? "bg-white text-brand-600 shadow dark:bg-slate-900" : "text-slate-500"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-6 space-y-4">
        {isAdmin ? (
          <>
            <FormField label="Username" error={errors.username}><input className="input" {...register("username", { required: "Username is required" })} /></FormField>
            <FormField label="Password" error={errors.password}><input type="password" className="input" {...register("password", { required: "Password is required" })} /></FormField>
            <button className="btn-primary w-full" disabled={isSubmitting}>Login as Admin</button>
            <p className="text-xs text-slate-500">Admins can view every shop&apos;s data.</p>
          </>
        ) : (
          <>
            <FormField label="Email" error={errors.email}><input className="input" {...register("email", { required: "Email is required" })} /></FormField>
            <FormField label="Password" error={errors.password}><input type="password" className="input" {...register("password", { required: "Password is required" })} /></FormField>
            <button className="btn-primary w-full" disabled={isSubmitting}>Login</button>
            <p className="text-sm">New here? <Link className="text-brand-600" href="/register">Create account</Link></p>
          </>
        )}
      </div>
    </form>
  );
}

export function RegisterForm() {
  const { register: create } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { role: "owner" } });
  return (
    <form onSubmit={handleSubmit(create)} className="auth-card w-full max-w-md">
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
