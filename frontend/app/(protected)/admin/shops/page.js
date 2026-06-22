"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Building2, CircleMinus, CirclePlus, IndianRupee, Mail, Receipt, Store, User, Users } from "lucide-react";
import { api } from "@/lib/api";
import { currency, dateInput } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

export default function AdminShopsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === "admin";

  const [shops, setShops] = useState([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [selectedShopId, setSelectedShopId] = useState("");
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (!authLoading && user && !isAdmin) router.replace("/dashboard");
  }, [authLoading, user, isAdmin, router]);

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    (async () => {
      try {
        const { data } = await api.get("/shops/admin/all");
        if (active) setShops(data.data.items || []);
      } catch (err) {
        toast.error(err?.message || "Failed to load shops");
      } finally {
        if (active) setLoadingShops(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isAdmin]);

  useEffect(() => {
    if (!selectedShopId) {
      setDetails(null);
      return;
    }
    let active = true;
    setLoadingDetails(true);
    (async () => {
      try {
        const { data } = await api.get(`/shops/admin/${selectedShopId}`);
        if (active) setDetails(data.data);
      } catch (err) {
        toast.error(err?.message || "Failed to load shop details");
        if (active) setDetails(null);
      } finally {
        if (active) setLoadingDetails(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [selectedShopId]);

  const options = useMemo(
    () =>
      shops.map((shop) => ({
        value: shop.id,
        label: shop.name,
        subLabel: shop.owner ? `${shop.owner.name} · ${shop.owner.email}` : "No owner",
      })),
    [shops]
  );

  const columns = [
    { key: "date", label: "Date", render: (r) => dateInput(r.date) },
    {
      key: "type",
      label: "Type",
      render: (r) => (
        <span className={r.type === "credit" ? "badge badge-credit" : "badge badge-expense"}>
          {r.type === "credit" ? "Sale" : "Expense"}
        </span>
      ),
    },
    { key: "category", label: "Category", render: (r) => r.category || "-" },
    { key: "paymentMethod", label: "Payment", render: (r) => r.paymentMethod || (r.type === "credit" ? "Cash" : "-") },
    { key: "description", label: "Description", render: (r) => r.description || "-" },
    { key: "amount", label: "Amount", render: (r) => currency(r.amount) },
  ];

  if (authLoading || !isAdmin) return <LoadingSkeleton rows={6} />;

  const shop = details?.shop;
  const stats = details?.stats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">All Shops</h1>
        <p className="text-sm text-slate-500">Admin view — search and inspect every shop created on ProfitFlow.</p>
      </div>

      <div className="card space-y-3">
        <div className="flex items-center gap-2">
          <Store size={18} className="text-brand-600" />
          <h2 className="font-bold">Select a shop</h2>
          <span className="ml-auto text-xs text-slate-500">{shops.length} shop{shops.length === 1 ? "" : "s"} total</span>
        </div>
        {loadingShops ? (
          <LoadingSkeleton rows={1} />
        ) : (
          <SearchableSelect
            options={options}
            value={selectedShopId}
            onChange={setSelectedShopId}
            placeholder="Search and select a shop by name..."
            emptyLabel="No shops match your search"
          />
        )}
      </div>

      {!selectedShopId && !loadingDetails && (
        <EmptyState title="Select a shop from the dropdown to view its complete details." />
      )}

      {loadingDetails && <LoadingSkeleton rows={6} />}

      {!loadingDetails && shop && stats && (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="card space-y-3">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-brand-600" />
                <h2 className="font-bold">Shop Information</h2>
              </div>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between gap-4"><span className="text-slate-500">Shop Name</span><span className="font-semibold">{shop.name}</span></p>
                <p className="flex justify-between gap-4"><span className="text-slate-500">Members</span><span className="font-semibold">{shop.memberCount}</span></p>
                <p className="flex justify-between gap-4"><span className="text-slate-500">Created</span><span className="font-semibold">{dateInput(shop.createdAt)}</span></p>
                <p className="flex justify-between gap-4"><span className="text-slate-500">Last Updated</span><span className="font-semibold">{dateInput(shop.updatedAt)}</span></p>
              </div>
            </section>

            <section className="card space-y-3">
              <div className="flex items-center gap-2">
                <User size={18} className="text-brand-600" />
                <h2 className="font-bold">Owner</h2>
              </div>
              {shop.owner ? (
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 font-semibold"><User size={15} className="text-slate-400" />{shop.owner.name}</p>
                  <p className="flex items-center gap-2 text-slate-500"><Mail size={15} className="text-slate-400" />{shop.owner.email}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-400">No owner on record.</p>
              )}
            </section>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Current Balance" value={stats.currentBalance} icon={IndianRupee} />
            <StatCard label="Total Sales" value={stats.totalCredit} icon={CirclePlus} />
            <StatCard label="Total Expenses" value={stats.totalExpenses} icon={CircleMinus} />
            <StatCard label="Total Entries" value={stats.totalEntries} icon={Receipt} money={false} />
          </div>

          <section className="card space-y-3">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-brand-600" />
              <h2 className="font-bold">Members ({shop.members.length})</h2>
            </div>
            {shop.members.length === 0 ? (
              <p className="text-sm text-slate-400">No additional members for this shop.</p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {shop.members.map((member) => (
                  <li key={member.id} className="flex items-center justify-between gap-4 py-2 text-sm">
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{member.name}</span>
                      <span className="block truncate text-slate-500">{member.email}</span>
                    </span>
                    <span className="badge badge-credit capitalize">{member.role}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card space-y-3">
            <h2 className="font-bold">Recent Transactions</h2>
            <DataTable columns={columns} rows={stats.recentTransactions || []} />
          </section>
        </div>
      )}
    </div>
  );
}
