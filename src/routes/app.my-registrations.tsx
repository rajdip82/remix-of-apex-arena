import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { myRegistrations, inr } from "@/lib/mock-data";
import { StatusBadge } from "./app.home";

export const Route = createFileRoute("/app/my-registrations")({
  head: () => ({ meta: [{ title: "My Registrations — TournamentX" }] }),
  component: () => (
    <AppShell title="My Registrations">
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-black/30 text-left text-[10px] uppercase tracking-widest text-muted-foreground"><th className="p-3">ID</th><th className="p-3">Tournament</th><th className="hidden p-3 sm:table-cell">Team</th><th className="p-3">Paid</th><th className="p-3 text-right">Status</th></tr></thead>
          <tbody>
            {myRegistrations.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="p-3 font-mono text-xs text-muted-foreground">{r.id}</td>
                <td className="p-3 font-semibold">{r.tournament}</td>
                <td className="hidden p-3 text-muted-foreground sm:table-cell">{r.team}</td>
                <td className="p-3 text-gradient-primary font-display">{inr(r.paid)}</td>
                <td className="p-3 text-right"><StatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  ),
});
