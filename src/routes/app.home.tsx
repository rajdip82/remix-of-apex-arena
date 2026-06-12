import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/app/AppShell";
import { TournamentCard } from "@/components/site/TournamentCard";
import { tournaments, notifications, myRegistrations, inr } from "@/lib/mock-data";
import { Bell, Calendar, Trophy, Zap, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/app/home")({
  head: () => ({ meta: [{ title: "Dashboard — TournamentX" }] }),
  component: AppHome,
});

function AppHome() {
  const upcoming = tournaments.filter((t) => t.status !== "Completed").slice(0, 3);
  return (
    <AppShell title="Dashboard">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-border-strong bg-gradient-to-r from-primary/30 via-background to-accent/30 p-6 sm:p-8"
      >
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary">Welcome Back</p>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl">ShadowBlade</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">3 tournaments running. 1 result pending. Your next match starts in 6 hours.</p>
          </div>
          <Link to="/app/tournaments" className="inline-flex items-center gap-2 self-start rounded-xl gradient-primary px-5 py-3 text-sm font-bold uppercase tracking-widest shadow-glow">
            Find Match <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      {/* Quick stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: Trophy, label: "Wins", value: "14" },
          { icon: Zap, label: "Kills", value: "248" },
          { icon: Calendar, label: "Matches", value: "62" },
          { icon: Bell, label: "Earnings", value: inr(12450) },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4">
            <s.icon className="h-5 w-5 text-primary" />
            <p className="mt-3 font-display text-2xl">{s.value}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <SectionTitle title="Upcoming Matches" link={{ to: "/app/tournaments", label: "View all" }} />
          <div className="grid gap-5 sm:grid-cols-2">
            {upcoming.map((t, i) => <TournamentCard key={t.id} t={t} index={i} />)}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <SectionTitle title="Recent Activity" />
            <div className="mt-4 glass-card divide-y divide-border">
              {myRegistrations.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-4 text-sm">
                  <div>
                    <p className="font-semibold">{r.tournament}</p>
                    <p className="text-xs text-muted-foreground">{r.team} · {r.date}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle title="Notifications" link={{ to: "/app/notifications", label: "See all" }} />
            <div className="mt-4 glass-card divide-y divide-border">
              {notifications.slice(0, 3).map((n) => (
                <div key={n.id} className="flex gap-3 p-4">
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-muted-foreground" : "bg-primary shadow-glow"}`} />
                  <div className="min-w-0 text-sm">
                    <p className="font-semibold">{n.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Approved: "border-success/40 bg-success/10 text-success",
    Pending: "border-warning/40 bg-warning/10 text-warning",
    Rejected: "border-danger/40 bg-danger/10 text-danger",
    Live: "border-primary/40 bg-primary/10 text-primary",
    Upcoming: "border-accent/40 bg-accent/10 text-accent",
    Completed: "border-border bg-white/5 text-muted-foreground",
    Active: "border-success/40 bg-success/10 text-success",
    Suspended: "border-danger/40 bg-danger/10 text-danger",
  };
  return <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${map[status] ?? map.Pending}`}>{status}</span>;
}

function SectionTitle({ title, link }: { title: string; link?: { to: string; label: string } }) {
  return (
    <div className="flex items-end justify-between">
      <h3 className="font-display text-xl tracking-wider">{title}</h3>
      {link && <Link to={link.to} className="text-xs font-semibold text-muted-foreground hover:text-primary">{link.label}</Link>}
    </div>
  );
}
