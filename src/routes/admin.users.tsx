import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Users, Search, Loader2, Shield, User, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — TX Admin" }] }),
  component: AdminUsers,
});

function AdminUsers() {
  const [users, setUsers] = useState<Tables<"profiles">[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetch = () => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setUsers((data ?? []) as Tables<"profiles">[]); setLoading(false); });
  };

  useEffect(() => { fetch(); }, []);

  const toggleAdmin = async (u: Tables<"profiles">) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", u.id);
    if (error) toast.error(error.message);
    else { toast.success(`${u.username ?? "User"} is now ${newRole}`); fetch(); }
  };

  const toggleVerified = async (u: Tables<"profiles">) => {
    const { error } = await supabase.from("profiles").update({ verified: !u.verified }).eq("id", u.id);
    if (error) toast.error(error.message);
    else { toast.success(`${u.username ?? "User"} ${!u.verified ? "verified" : "unverified"}`); fetch(); }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (u.username ?? "").toLowerCase().includes(q) || (u.full_name ?? "").toLowerCase().includes(q);
  });

  return (
    <AdminShell title="Users">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted-foreground w-full sm:w-72">
          <Search className="h-4 w-4 shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent outline-none" placeholder="Search by username..." />
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} users</p>
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="mt-5 glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["User", "Game UIDs", "State", "Role", "Verified", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {u.avatar_url
                        ? <img src={u.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                        : <div className="grid h-8 w-8 place-items-center rounded-full gradient-primary text-xs font-bold">{(u.username ?? "?").slice(0, 2).toUpperCase()}</div>
                      }
                      <div>
                        <p className="font-semibold">{u.username ?? <span className="text-muted-foreground italic">no username</span>}</p>
                        <p className="text-xs text-muted-foreground">{u.full_name ?? ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {u.free_fire_uid && <p>FF: {u.free_fire_uid}</p>}
                    {u.bgmi_uid && <p>BGMI: {u.bgmi_uid}</p>}
                    {!u.free_fire_uid && !u.bgmi_uid && "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{u.state ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${u.role === "admin" ? "border-accent/40 bg-accent/10 text-accent" : "border-border text-muted-foreground"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.verified
                      ? <CheckCircle2 className="h-4 w-4 text-success" />
                      : <XCircle className="h-4 w-4 text-muted-foreground/40" />
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => toggleAdmin(u)} className="rounded-lg border border-border px-2 py-1 text-[10px] font-bold uppercase hover:border-accent hover:text-accent transition">
                        {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                      </button>
                      <button onClick={() => toggleVerified(u)} className="rounded-lg border border-border px-2 py-1 text-[10px] font-bold uppercase hover:border-success hover:text-success transition">
                        {u.verified ? "Unverify" : "Verify"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Users className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground">No users found</p>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}
