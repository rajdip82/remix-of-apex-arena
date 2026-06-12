import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LayoutDashboard, Swords, Wallet, Ticket, CheckSquare, Users, FileBarChart, Shield, ArrowLeft } from "lucide-react";

const nav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/tournaments", label: "Tournaments", icon: Swords },
  { to: "/admin/payments", label: "Payments", icon: Wallet },
  { to: "/admin/redeem-codes", label: "Redeem Codes", icon: Ticket },
  { to: "/admin/approvals", label: "Approvals", icon: CheckSquare },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/reports", label: "Reports", icon: FileBarChart },
] as const;

export function AdminShell({ children, title }: { children: ReactNode; title?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10" style={{ background: "var(--gradient-radial)" }} />
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-surface/60 backdrop-blur-xl md:flex">
        <Link to="/admin/dashboard" className="flex items-center gap-2 px-6 py-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent shadow-glow-purple"><Shield className="h-5 w-5" /></span>
          <span className="font-display text-lg tracking-widest">TX Admin</span>
        </Link>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link key={n.to} to={n.to} className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-accent/15 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}>
                {active && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-accent shadow-glow-purple" />}
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <Link to="/app/home" className="m-3 flex items-center gap-2 rounded-xl border border-border bg-black/30 px-3 py-2.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to App
        </Link>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/70 px-4 backdrop-blur-xl sm:px-6 md:pl-72">
        <h1 className="font-display text-xl tracking-wider sm:text-2xl">{title}</h1>
        <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">Admin Mode</span>
      </header>

      <main className="md:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</div>
      </main>
    </div>
  );
}
