import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app/AppShell";
import { ClipboardList, Loader2, Trophy, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyRegistrations } from "@/hooks/useTournaments";

export const Route = createFileRoute("/app/my-registrations")({
  head: () => ({ meta: [{ title: "My Registrations — TournamentX" }] }),
  component: MyRegistrations,
});

const statusStyles: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:   { label: "Pending",   color: "border-warning/40 bg-warning/10 text-warning",   icon: Clock },
  approved:  { label: "Approved",  color: "border-success/40 bg-success/10 text-success",   icon: CheckCircle2 },
  rejected:  { label: "Rejected",  color: "border-red-500/40 bg-red-500/10 text-red-400",   icon: XCircle },
  cancelled: { label: "Cancelled", color: "border-border bg-black/20 text-muted-foreground", icon: AlertCircle },
};

const paymentStyles: Record<string, string> = {
  pending:  "border-warning/40 bg-warning/10 text-warning",
  approved: "border-success/40 bg-success/10 text-success",
  rejected: "border-red-500/40 bg-red-500/10 text-red-400",
};

function inr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function MyRegistrations() {
  const { user, loading: authLoading } = useAuth();
  const { registrations, loading } = useMyRegistrations();
  const nav = useNavigate();

  useEffect(() => { if (!authLoading && !user) nav({ to: "/login" }); }, [user, authLoading]);

  return (
    <AppShell title="Registrations">
      <p className="text-sm text-muted-foreground mb-5">Track all your tournament entries.</p>

      {loading ? (
        <div className="mt-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : registrations.length === 0 ? (
        <div className="mt-10 py-20 text-center glass-card">
          <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 font-display text-2xl">No Registrations</h3>
          <p className="mt-2 text-sm text-muted-foreground">You haven't registered for any tournament yet.</p>
          <Link to="/app/tournaments" className="mt-4 inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-sm font-bold shadow-glow">
            Browse Tournaments
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {registrations.map((r) => {
            const t = r.tournaments;
            if (!t) return null;
            const status = statusStyles[r.registration_status] ?? statusStyles.pending;
            const StatusIcon = status.icon;
            const startDate = new Date(t.start_time).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
            const startTime = new Date(t.start_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
            return (
              <div key={r.id} className="glass-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-primary shadow-glow">
                    <Trophy className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg leading-tight">{t.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.game} · {t.mode} · {t.map}</p>
                    <p className="text-xs text-muted-foreground">{startDate} at {startTime}</p>
                    {r.teams && <p className="text-xs text-primary mt-0.5">Team: {r.teams.name}</p>}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-success">{inr(t.prize_pool)}</span>
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${paymentStyles[r.payment_status]}`}>
                    {r.payment_status === "pending" ? "Payment Pending" : r.payment_status === "approved" ? "Paid" : "Payment Rejected"}
                  </span>
                  <span className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${status.color}`}>
                    <StatusIcon className="h-3 w-3" />{status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
