"use client";
import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function Navbar({ setOpen }) {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <button className="btn-secondary lg:hidden" onClick={() => setOpen(true)}><Menu size={18} /></button>
      <div><p className="text-sm text-slate-500">{user?.shopName || "Personal Ledger"}</p><h1 className="font-bold">{user?.name}</h1></div>
      <div className="flex gap-2">
        <button className="btn-secondary" onClick={() => setDark(!dark)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        <button className="btn-secondary" onClick={logout}><LogOut size={18} /></button>
      </div>
    </header>
  );
}
