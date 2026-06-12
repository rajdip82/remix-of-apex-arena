import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { tournaments, inr } from "@/lib/mock-data";
import { Plus, Edit, Trash2, Pause } from "lucide-react";
import { StatusBadge } from "../routes/app.home";

export const Route = createFileRoute("/admin/tournaments")({
  head: () => ({ meta: [{ title: "Admin · Tournaments" }] }),
  component: () => (
    <AdminShell title="Tournaments">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{tournaments.length} tournaments total</p>
        <button className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-sm font-bold shadow-glow"><Plus className="h-4 w-4" /> New Tournament</button>
      </div>
      <div className="mt-6 glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-black/30 text-left text-[10px] uppercase tracking-widest text-muted-foreground"><th className="p-3">Name</th><th className="p-3">Game</th><th className="p-3">Slots</th><th className="p-3">Prize</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr></thead>
          <tbody>
            {tournaments.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0">
                <td className="p-3 font-semibold">{t.name}</td>
                <td className="p-3 text-muted-foreground">{t.game}</td>
                <td className="p-3 text-muted-foreground">{t.filled}/{t.slots}</td>
                <td className="p-3 text-gradient-primary font-display">{inr(t.prizePool)}</td>
                <td className="p-3"><StatusBadge status={t.status} /></td>
                <td className="p-3 text-right space-x-1">
                  <button className="rounded-lg border border-border p-1.5 hover:border-accent"><Edit className="h-3.5 w-3.5" /></button>
                  <button className="rounded-lg border border-border p-1.5 hover:border-warning"><Pause className="h-3.5 w-3.5" /></button>
                  <button className="rounded-lg border border-border p-1.5 hover:border-danger"><Trash2 className="h-3.5 w-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  ),
});
