import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { redeemCodes } from "@/lib/mock-data";
import { Plus, Ticket } from "lucide-react";

export const Route = createFileRoute("/admin/redeem-codes")({
  head: () => ({ meta: [{ title: "Admin · Redeem Codes" }] }),
  component: () => (
    <AdminShell title="Redeem Codes">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Manage discount, free entry, and VIP codes.</p>
        <button className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-sm font-bold shadow-glow"><Plus className="h-4 w-4" />New Code</button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {redeemCodes.map((c) => (
          <div key={c.code} className="glass-card p-5">
            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-accent" />
              <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-accent">{c.type}</span>
            </div>
            <p className="mt-3 font-mono text-2xl font-bold text-gradient-primary">{c.code}</p>
            <div className="mt-4 space-y-2 text-sm">
              <Row k="Discount" v={`${c.discount}%`} />
              <Row k="Usage" v={`${c.uses} / ${c.limit}`} />
              <Row k="Expires" v={c.expires} />
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-lg border border-border py-1.5 text-xs hover:border-accent">Edit</button>
              <button className="flex-1 rounded-lg border border-danger/40 bg-danger/10 py-1.5 text-xs text-danger">Disable</button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  ),
});

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-semibold">{v}</span></div>;
}
