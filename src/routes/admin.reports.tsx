import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { FileBarChart, Download } from "lucide-react";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Admin · Reports" }] }),
  component: () => (
    <AdminShell title="Reports & Audit Logs">
      <div className="grid gap-4 sm:grid-cols-3">
        {["Revenue Report", "Tournament Performance", "User Activity"].map((r) => (
          <div key={r} className="glass-card p-5">
            <FileBarChart className="h-5 w-5 text-accent" />
            <h3 className="mt-3 font-display text-lg">{r}</h3>
            <p className="text-xs text-muted-foreground">Monthly export · CSV / PDF</p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs hover:border-accent"><Download className="h-3 w-3" /> Download</button>
          </div>
        ))}
      </div>

      <h3 className="mt-8 font-display text-xl">System Audit Log</h3>
      <div className="mt-4 glass-card divide-y divide-border">
        {[
          { who: "admin@tx.gg", what: "Approved PAY-7721", when: "2 min ago" },
          { who: "admin@tx.gg", what: "Created tournament 'Midnight Rumble'", when: "1h ago" },
          { who: "system", what: "Auto-published Legends Cup results", when: "2d ago" },
          { who: "admin@tx.gg", what: "Suspended user Vortex_OP", when: "3d ago" },
        ].map((l, i) => (
          <div key={i} className="flex items-center justify-between p-4 text-sm">
            <div>
              <p className="font-semibold">{l.what}</p>
              <p className="text-xs text-muted-foreground">{l.who}</p>
            </div>
            <span className="text-xs text-muted-foreground">{l.when}</span>
          </div>
        ))}
      </div>
    </AdminShell>
  ),
});
