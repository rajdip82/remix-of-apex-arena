import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Target, Shield, Zap, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — TournamentX" }, { name: "description", content: "About TournamentX — India's premium esports tournament platform." }] }),
  component: () => (
    <div className="bg-background pt-24">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Our Mission</p>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">Built For <span className="text-gradient-primary">Indian Esports</span></h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">TournamentX is a premium tournament platform engineered for serious Free Fire MAX and BGMI players across India. Real prize pools. Instant UPI payouts. Zero-nonsense ranked competition.</p>
        </header>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {[
            { icon: Target, title: "Pro-Grade Tournaments", body: "Solo, duo, and squad brackets across both games — daily, weekly, and seasonal cups." },
            { icon: Shield, title: "Verified Fair Play", body: "Manual admin verification, anti-cheat reporting, and transparent result publishing." },
            { icon: Zap, title: "Instant UPI Payouts", body: "Direct UPI payments. No wallets. No internal currency. Winners get paid fast." },
            { icon: Users, title: "Real Community", body: "Discord, leaderboards, team rosters, and head-to-head stats that actually matter." },
          ].map((f) => (
            <div key={f.title} className="glass-card p-6">
              <f.icon className="h-7 w-7 text-primary" />
              <h3 className="mt-3 font-display text-2xl">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  ),
});
