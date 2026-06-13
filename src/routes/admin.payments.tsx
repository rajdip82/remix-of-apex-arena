import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { CheckCircle2, XCircle, Loader2, Wallet, ExternalLink, Clock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminPayments } from "@/hooks/usePayments";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ title: "Payments — TX Admin" }] }),
  component: AdminPayments,
});

const statusStyles = {
  pending:  "border-warning/40 bg-warning/10 text-warning",
  approved: "border-success/40 bg-success/10 text-success",
  rejected: "border-red-500/40 bg-red-500/10 text-red-400",
};

function AdminPayments() {
  const { profile } = useAuth();
  const { payments, loading, approve, reject } = useAdminPayments();

  const handleApprove = async (id: string) => {
    if (!profile) return;
    const err = await approve(id, profile.id);
    if (err) toast.error(err.message); else toast.success("Payment approved");
  };

  const handleReject = async (id: string) => {
    if (!profile) return;
    const err = await reject(id, profile.id);
    if (err) toast.error(err.message); else toast.error("Payment rejected");
  };

  const pending = payments.filter((p) => p.payment_status === "pending");
  const resolved = payments.filter((p) => p.payment_status !== "pending");

  return (
    <AdminShell title="Payment Verification">
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {[
          { label: "Pending Review", value: String(pending.length), color: "text-warning" },
          { label: "Approved", value: String(payments.filter((p) => p.payment_status === "approved").length), color: "text-success" },
          { label: "Total Submitted", value: String(payments.length), color: "text-foreground" },
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
              <h2 className="font-display text-xl mb-3 flex items-center gap-2"><Clock className="h-5 w-5 text-warning" /> Pending Review ({pending.length})</h2>
              <div className="glass-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border">{["Player","Tournament","UTR Number","Amount","Screenshot","Actions"].map((h) => <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-border">
                    {pending.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition">
                        <td className="px-4 py-3 font-semibold">{p.profiles?.username ?? "Unknown"}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{p.tournaments?.title ?? "—"}</td>
                        <td className="px-4 py-3"><span className="font-mono text-xs">{p.utr_number}</span></td>
                        <td className="px-4 py-3 font-bold text-success">₹{p.amount.toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3">
                          {p.screenshot_url
                            ? <a href={p.screenshot_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary text-xs hover:underline"><ExternalLink className="h-3 w-3" />View</a>
                            : <span className="text-muted-foreground/60 text-xs">No screenshot</span>
                          }
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => handleApprove(p.id)} className="flex items-center gap-1 rounded-lg bg-success/10 border border-success/30 px-2 py-1 text-[10px] font-bold uppercase text-success hover:bg-success/20 transition"><CheckCircle2 className="h-3 w-3" />Approve</button>
                            <button onClick={() => handleReject(p.id)} className="flex items-center gap-1 rounded-lg bg-red-500/10 border border-red-500/30 px-2 py-1 text-[10px] font-bold uppercase text-red-400 hover:bg-red-500/20 transition"><XCircle className="h-3 w-3" />Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {resolved.length > 0 && (
            <section>
              <h2 className="font-display text-xl mb-3">Resolved ({resolved.length})</h2>
              <div className="glass-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border">{["Player","Tournament","UTR Number","Amount","Status"].map((h) => <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-border">
                    {resolved.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition opacity-70">
                        <td className="px-4 py-3 font-semibold">{p.profiles?.username ?? "Unknown"}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{p.tournaments?.title ?? "—"}</td>
                        <td className="px-4 py-3"><span className="font-mono text-xs">{p.utr_number}</span></td>
                        <td className="px-4 py-3 font-bold">₹{p.amount.toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${statusStyles[p.payment_status as keyof typeof statusStyles]}`}>{p.payment_status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {payments.length === 0 && (
            <div className="py-16 text-center glass-card">
              <Wallet className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">No payment submissions yet.</p>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}
