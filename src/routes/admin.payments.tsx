import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { pendingPayments, inr } from "@/lib/mock-data";
import { Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ title: "Admin · Payments" }] }),
  component: () => (
    <AdminShell title="Payment Verification">
      <div className="grid gap-4 lg:grid-cols-2">
        {pendingPayments.map((p) => (
          <div key={p.id} className="glass-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.id} · {p.time}</p>
                <h3 className="font-display text-xl">{p.tournament}</h3>
              </div>
              <p className="font-display text-2xl text-gradient-primary">{inr(p.fee)}</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-black/30 p-3 text-sm">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Team / Captain</p>
                <p className="mt-1 font-semibold">{p.team}</p>
                <p className="text-xs text-muted-foreground">{p.captain}</p>
              </div>
              <div className="rounded-xl border border-border bg-black/30 p-3 text-sm">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">UTR</p>
                <p className="mt-1 font-mono">{p.utr}</p>
              </div>
            </div>
            <div className="mt-3 grid h-32 place-items-center rounded-xl border border-dashed border-border bg-black/20 text-muted-foreground">
              <div className="text-center text-xs"><ImageIcon className="mx-auto mb-1 h-5 w-5" />Payment screenshot</div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-xl border border-success/40 bg-success/10 py-2 text-sm font-bold text-success">Approve</button>
              <button className="flex-1 rounded-xl border border-warning/40 bg-warning/10 py-2 text-sm font-bold text-warning">Reupload</button>
              <button className="flex-1 rounded-xl border border-danger/40 bg-danger/10 py-2 text-sm font-bold text-danger">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  ),
});
