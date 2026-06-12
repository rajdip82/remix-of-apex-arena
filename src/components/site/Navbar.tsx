import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Swords } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/tournaments", label: "Tournaments" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-3 max-w-7xl px-3 sm:px-6">
        <nav className="glass-card flex items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-glow">
              <Swords className="h-5 w-5 text-white" />
            </span>
            <span className="font-display text-xl tracking-widest">
              Tournament<span className="text-gradient-primary">X</span>
            </span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground"
                activeProps={{ className: "rounded-lg px-3 py-2 text-sm text-foreground bg-white/5" }}
                activeOptions={{ exact: true }}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-foreground/80 transition hover:text-foreground">Login</Link>
            <Link to="/signup" className="rounded-xl gradient-primary px-4 py-2 text-sm font-semibold shadow-glow transition hover:brightness-110">Join Now</Link>
          </div>
          <button className="rounded-lg p-2 md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </button>
        </nav>
        {open && (
          <div className="glass-card mt-2 flex flex-col gap-1 p-3 md:hidden">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-white/5">{l.label}</Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setOpen(false)} className="rounded-xl border border-border px-4 py-2 text-center text-sm">Login</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="rounded-xl gradient-primary px-4 py-2 text-center text-sm font-semibold shadow-glow">Join Now</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
