import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CheckSquare, CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/approvals")({
  head: () => ({ meta: [{ title: "Approvals — TX Admin" }] }),
  component: AdminApprovals,
});

type RegistrationFull = Tables<"registrations"> & {
  tournaments: Tables<"tournaments"> | null;
  profiles: Tables<"profiles"> | null;
  teams: Tables<"teams"> | null;
};

function AdminApprovals() {
  const [regs, setRegs] = useState<RegistrationFull[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    supabase
      .from("registrations")
      .select("*, tournaments(*), profiles(*), teams(*)")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setRegs((data ?? []) as RegistrationFull[]); setLoading(false); });
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("registrations").update({ registration_status: status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Registration ${status}`); fetch(); }
  };

  const pending = regs.filter((r) => r.registration_status === "pending");
  const resolved = regs.filter((r) => r.registration_status !== "pending");

  return (
    <AdminShell title="Registration Approvals">
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {[
          { label: "Pending", value: String(pending.length), color: "text-warning" },
          { label: "Approved", value: String(regs.filter((r) => r.registration_status === "approved").length), color: "text-success" },
          { label: "Total", value: String(regs.length), color: "text-foreground" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
            <p className={`mt-1 font-display text-3xl ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <section>
              <h2 className="font-display text-xl mb-3 flex items-center gap-2"><Clock className="h-5 w-5 text-warning" /> Awaiting Approval ({pending.length})</h2>
              <div className="space-y-3">
                {pending.map((r) => (
                  <div key={r.id} className="glass-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary/20 text-primary text-xs font-bold">
                        {(r.profiles?.username ?? "?").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{r.profiles?.username ?? "Unknown Player"}</p>
                        <p className="text-xs text-muted-foreground">{r.tournaments?.title ?? "Unknown Tournament"}</p>
                        {r.teams && <p className="text-xs text-primary">Team: {r.teams.name}</p>}
                        <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${r.payment_status === "approved" ? "border-success/40 bg-success/10 text-success" : "border-warning/40 bg-warning/10 text-warning"}`}>
                        Payment: {r.payment_status}
                      </span>
                      <button onClick={() => updateStatus(r.id, "approved")} className="flex items-center gap-1 rounded-lg bg-success/10 border border-success/30 px-3 py-1.5 text-[10px] font-bold uppercase text-success hover:bg-success/20 transition">
                        <CheckCircle2 className="h-3 w-3" />Approve
                      </button>
                      <button onClick={() => updateStatus(r.id, "rejected")} className="flex items-center gap-1 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-1.5 text-[10px] font-bold uppercase text-red-400 hover:bg-red-500/20 transition">
                        <XCircle className="h-3 w-3" />Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {resolved.length > 0 && (
            <section>
              <h2 className="font-display text-xl mb-3">Resolved ({resolved.length})</h2>
              <div className="glass-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border">{["Player","Tournament","Team","Status"].map((h) => <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-border">
                    {resolved.map((r) => (
                      <tr key={r.id} className="hover:bg-white/5 transition opacity-70">
                        <td className="px-4 py-3 font-semibold">{r.profiles?.username ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{r.tournaments?.title ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{r.teams?.name ?? "Solo"}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${r.registration_status === "approved" ? "border-success/40 bg-success/10 text-success" : "border-red-500/40 bg-red-500/10 text-red-400"}`}>
                            {r.registration_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {regs.length === 0 && (
            <div className="py-16 text-center glass-card">
              <CheckSquare className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">No registrations to review.</p>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}
