"use client";
import toast from "react-hot-toast";
import { Download, Upload } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const { updateProfile } = useAuth();
  const [shopName, setShopName] = useState(user?.shopName || "");
  const backup = async () => {
    const { data } = await api.get("/ledger/backup");
    const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "personal-ledger-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  };
  const restore = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const payload = JSON.parse(text);
    await api.post("/ledger/restore", payload);
    toast.success("Backup restored");
  };
  const saveProfile = async () => {
    try {
      await updateProfile({ shopName });
    } catch (e) {
      toast.error("Failed to update profile");
    }
  };
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-black">Settings</h1><p className="text-sm text-slate-500">Profile, backup, and restore tools.</p></div>
      <div className="grid gap-4 xl:grid-cols-2">
        <section className="card space-y-3">
          <h2 className="font-bold">User Profile</h2>
          <p><b>Name:</b> {user?.name}</p>
          <p><b>Email:</b> {user?.email}</p>
          <label className="text-sm font-medium">Ledger Name
            <input className="input mt-1" value={shopName} onChange={(e) => setShopName(e.target.value)} />
          </label>
          <p><b>Role:</b> {user?.role}</p>
          <div className="mt-3"><button className="btn-primary" onClick={saveProfile}>Save</button></div>
        </section>
        <section className="card space-y-4">
          <h2 className="font-bold">Data Backup and Restore</h2>
          <button className="btn-primary" onClick={backup}><Download size={18} />Download Backup</button>
          <label className="btn-secondary w-fit cursor-pointer"><Upload size={18} />Restore Backup<input className="hidden" type="file" accept="application/json" onChange={restore} /></label>
        </section>
      </div>
    </div>
  );
}
