import { Link, useRouterState, type ReactNode } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { Home, Swords, Trophy, Users, User, Bell, ClipboardList, Search, Shield } from "lucide-react";

const nav = [
  { to: "/app/home", label: "Home", icon: Home },
  { to: "/app/tournaments", label: "Tournaments", icon: Swords },
  { to: "/app/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/app/my-teams", label: "My Teams", icon: Users },
  { to: "/app/my-registrations", label: "Registrations", icon: ClipboardList },
  { to: "/app/notifications", label: "Notifications", icon: Bell },
  { to: "/app/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children, title }: { children: ReactNode; title?: string }): ReactElement {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="relative min-h-screen bg-background pb-24 md:pb-0">
      <div className="pointer-events-none fixed inset-0 -z-10" style={{ background: "var(--gradient-radial)" }} />
      {/* Sidebar (desktop) */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-surface/60 backdrop-blur-xl md:flex">
        <Link to="/app/home" className="flex items-center gap-2 px-6 py-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-glow"><Swords className="h-5 w-5" /></span>
          <span className="font-display text-xl tracking-widest">Tournament<span className="text-gradient-primary">X</span></span>
        </Link>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((n) => {
            const active = pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}>
                {active && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full gradient-primary shadow-glow" />}
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <Link to="/admin" className="m-3 flex items-center gap-2 rounded-xl border border-border bg-black/30 px-3 py-2.5 text-xs text-muted-foreground transition hover:border-accent hover:text-accent">
          <Shield className="h-4 w-4" /> Admin Panel
        </Link>
      </aside>

      {/* Topbar (desktop) */}
      <header className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-border bg-background/70 px-6 backdrop-blur-xl md:flex md:pl-72">
        <div>
          {title && <h1 className="font-display text-2xl tracking-wider">{title}</h1>}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted-foreground w-72">
            <Search className="h-4 w-4" /> <input className="w-full bg-transparent outline-none" placeholder="Search tournaments, players..." />
          </div>
          <Link to="/app/notifications" className="grid h-10 w-10 place-items-center rounded-xl border border-border hover:border-primary"><Bell className="h-4 w-4" /></Link>
          <Link to="/app/profile" className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-xs font-bold">SB</Link>
        </div>
      </header>

      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl md:hidden">
        <Link to="/app/home" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg gradient-primary shadow-glow"><Swords className="h-4 w-4" /></span>
          <span className="font-display tracking-widest">TX</span>
        </Link>
        <p className="font-display text-sm tracking-widest text-muted-foreground">{title}</p>
        <Link to="/app/notifications" className="grid h-9 w-9 place-items-center rounded-lg border border-border"><Bell className="h-4 w-4" /></Link>
      </header>

      <main className="md:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8">{children}</div>
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed inset-x-3 bottom-3 z-40 md:hidden">
        <div className="glass-card-strong flex justify-around px-2 py-2">
          {nav.slice(0, 5).map((n) => {
            const active = pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={`relative flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] ${active ? "text-foreground" : "text-muted-foreground"}`}>
                {active && <span className="absolute -top-1.5 h-1 w-8 rounded-full gradient-primary shadow-glow" />}
                <n.icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} />
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
