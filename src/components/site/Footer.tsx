import { Link } from "@tanstack/react-router";
import { Swords, Instagram, Youtube, Facebook, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border bg-surface/40 px-4 pt-16 pb-10 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-glow">
              <Swords className="h-5 w-5 text-white" />
            </span>
            <span className="font-display text-xl tracking-widest">Tournament<span className="text-gradient-primary">X</span></span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">India's premium Free Fire MAX & BGMI tournament platform. Compete. Dominate. Win.</p>
        </div>
        <FooterCol title="Platform" links={[
          { to: "/tournaments", label: "Tournaments" },
          { to: "/leaderboard", label: "Leaderboard" },
          { to: "/app/home", label: "Dashboard" },
        ]} />
        <FooterCol title="Company" links={[
          { to: "/about", label: "About" },
          { to: "/contact", label: "Contact" },
          { to: "/admin", label: "Admin" },
        ]} />
        <FooterCol title="Legal" links={[
          { to: "/privacy-policy", label: "Privacy Policy" },
          { to: "/terms", label: "Terms of Service" },
        ]} />
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} TournamentX. All rights reserved.</p>
        <div className="flex items-center gap-3">
          {[MessageCircle, Instagram, Youtube, Facebook].map((Icon, i) => (
            <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition hover:border-primary hover:text-primary">
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="font-display text-sm tracking-widest text-muted-foreground">{title}</h4>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.to}><Link to={l.to} className="text-sm text-foreground/80 transition hover:text-primary">{l.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
