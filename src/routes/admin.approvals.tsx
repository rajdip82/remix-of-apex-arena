import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { myRegistrations } from "@/lib/mock-data";
import { StatusBadge } from "../routes/app.home";

export const Route = createFileRoute("/admin/approvals")({
  head: () => ({ meta: [{ title: "Admin · Approvals" }] }),
  component: () => (
    <AdminShell title="Approval Queue">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{myRegistrations.filter(r => r.status === "Pending").length} pending registration(s)</p>
        <button className="rounded-xl gradient-primary px-4 py-2 text-sm font-bold shadow-glow">Bulk Approve All</button>
      </div>
      <div className="mt-6 glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-black/30 text-left text-[10px] uppercase tracking-widest text-muted-foreground"><th className="p-3"><input type="checkbox" /></th><th className="p-3">ID</th><th className="p-3">Tournament</th><th className="p-3">Team</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr></thead>
          <tbody>
            {myRegistrations.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3 font-mono text-xs">{r.id}</td>
                <td className="p-3 font-semibold">{r.tournament}</td>
                <td className="p-3 text-muted-foreground">{r.team}</td>
                <td className="p-3"><StatusBadge status={r.status} /></td>
                <td className="p-3 text-right space-x-1">
                  <button className="rounded-lg border border-success/40 bg-success/10 px-3 py-1 text-xs text-success">Approve</button>
                  <button className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-1 text-xs text-danger">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  ),
});
