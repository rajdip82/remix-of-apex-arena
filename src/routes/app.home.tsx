import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/app/AppShell";
import { Swords, Trophy, Users, Zap, ArrowRight, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTournaments } from "@/hooks/useTournaments";

export const Route = createFileRoute("/app/home")({
  head: () => ({ meta: [{ title: "Home — TournamentX" }] }),
  component: AppHome,
});

function inr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function AppHome() {
  const { user, profile, loading } = useAuth();
  const { tournaments } = useTournaments();
  const nav = useNavigate();

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading]);

  const live = tournaments.filter((t) => t.status === "Live");
  const upcoming = tournaments.filter((t) => t.status === "Upcoming").slice(0, 4);
  const totalPrize = tournaments.reduce((a, t) => a + t.prize_pool, 0);

  const greeting = profile?.username
    ? `Welcome back, ${profile.username}!`
    : profile?.full_name
      ? `Hey ${profile.full_name.split(" ")[0]}!`
      : "Welcome to TournamentX!";

  if (loading) return (
    <AppShell title="Home">
      <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    </AppShell>
  );

  return (
    <AppShell title="Home">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        {/* Hero greeting */}
        <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 gradient-primary">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/80">Arena Dashboard</p>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl">{greeting}</h1>
            <p className="mt-2 max-w-sm text-sm text-white/70">Ready to compete? {live.length > 0 ? `${live.length} tournament${live.length !== 1 ? "s" : ""} live right now.` : "Check upcoming tournaments and register."}</p>
            <Link to="/app/tournaments" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur-sm hover:bg-white/30 transition">
              Browse Tournaments <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Trophy, label: "Live Tournaments", value: String(live.length), sub: "right now" },
            { icon: Swords, label: "Upcoming", value: String(upcoming.length), sub: "this week" },
            { icon: Zap, label: "Total Prize Pool", value: inr(totalPrize), sub: "across all events" },
            { icon: Users, label: "Total Events", value: String(tournaments.length), sub: "on platform" },
          ].map((s) => (
            <div key={s.label} className="glass-card p-5 flex items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-primary/20 text-primary">
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-2xl">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Live tournaments */}
        {live.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Live Now
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {live.map((t) => <TournamentCard key={t.id} t={t} />)}
            </div>
          </section>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl">Upcoming Tournaments</h2>
              <Link to="/app/tournaments" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {upcoming.map((t) => <TournamentCard key={t.id} t={t} />)}
            </div>
          </section>
        )}

        {tournaments.length === 0 && (
          <div className="py-20 text-center glass-card">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 font-display text-2xl">No Tournaments Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">The admin will add tournaments soon. Check back later!</p>
          </div>
        )}
      </motion.div>
    </AppShell>
  );
}

function TournamentCard({ t }: { t: ReturnType<typeof useTournaments>["tournaments"][number] }) {
  const pct = t.total_slots > 0 ? Math.round((t.filled_slots / t.total_slots) * 100) : 0;
  return (
    <Link to="/app/tournament/$id" params={{ id: t.id }} className="glass-card group block p-5 hover:border-primary/40 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{t.game} · {t.mode}</p>
          <h3 className="mt-1 font-display text-lg leading-tight line-clamp-1">{t.title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{t.map}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${t.status === "Live" ? "border-success/40 bg-success/10 text-success" : "border-warning/40 bg-warning/10 text-warning"}`}>
          {t.status}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-bold text-success">₹{t.prize_pool.toLocaleString("en-IN")}</span>
        <span className="text-xs text-muted-foreground">{t.entry_fee === 0 ? "Free" : `₹${t.entry_fee} entry`}</span>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>{t.filled_slots}/{t.total_slots} slots</span>
          <span>{pct}% full</span>
        </div>
        <div className="h-1.5 rounded-full bg-border">
          <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </Link>
  );
}
