import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy, Users, Flame, Play, ArrowRight, Star, Gamepad2, Activity, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-warrior.jpg";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { TournamentCard } from "@/components/site/TournamentCard";
import { tournaments, platformStats, testimonials, shortInr } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TournamentX — India's Premium Esports Tournament Platform" },
      { name: "description", content: "Compete in Free Fire MAX & BGMI tournaments. 25K+ players, ₹35L+ prize pool. Join the AAA esports experience built for India." },
      { property: "og:title", content: "TournamentX — Compete. Dominate. Win." },
      { property: "og:description", content: "Premium Free Fire MAX & BGMI tournaments. Real prizes. Real glory." },
    ],
  }),
  component: Landing,
});

const featured = tournaments.filter((t) => t.status !== "Completed").slice(0, 3);

function Landing() {
  return (
    <div className="relative overflow-hidden bg-background text-foreground">
      <Navbar />
      <Hero />
      <FeaturedTournaments />
      <GameCategories />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-24">
      <div className="absolute inset-0 -z-10">
        <img src={heroImg} alt="" width={1920} height={1080} className="h-full w-full object-cover object-[60%_center] opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-10 sm:px-6 md:grid-cols-2 md:items-center md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary backdrop-blur">
            <Sparkles className="h-3 w-3" /> Season 4 Live · ₹5L Prize Pool
          </span>
          <h1 className="font-display text-5xl leading-[0.95] sm:text-7xl md:text-[5.5rem]">
            <span className="block">Compete.</span>
            <span className="block text-gradient-primary">Dominate.</span>
            <span className="block">Win.</span>
          </h1>
          <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
            India's premium <span className="text-foreground">Free Fire MAX</span> & <span className="text-foreground">BGMI</span> tournament platform. Built for serious squads. Engineered for glory.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/signup" className="group inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-3.5 text-sm font-bold uppercase tracking-widest shadow-glow transition hover:brightness-110">
              Join Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link to="/tournaments" className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-glass px-6 py-3.5 text-sm font-bold uppercase tracking-widest backdrop-blur transition hover:border-primary hover:text-primary">
              Explore Tournaments
            </Link>
            <Link to="/app/tournament/$id" params={{ id: "bgmi-pro-league" }} className="inline-flex items-center gap-2 rounded-xl px-2 py-3.5 text-sm font-bold uppercase tracking-widest text-muted-foreground transition hover:text-primary">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-primary/50 text-primary animate-pulse-glow"><Play className="h-4 w-4 fill-current" /></span>
              Watch Live
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-6 md:max-w-md">
            <HeroStat value="25K+" label="Active Players" />
            <HeroStat value="1.2K+" label="Tournaments" />
            <HeroStat value="₹35L+" label="Prize Pool" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative hidden md:block"
        >
          <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-primary/30 via-accent/20 to-transparent blur-3xl" />
          <div className="glass-card-strong space-y-4 p-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> Live Now
              </span>
              <span className="text-xs text-muted-foreground">847 watching</span>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-red-500 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">BGMI Pro League S4</p>
              <h3 className="mt-1 font-display text-3xl">Finals · Erangel</h3>
              <div className="mt-4 flex items-center justify-between">
                <div><p className="text-[10px] uppercase opacity-75">Prize</p><p className="font-display text-2xl">₹1,00,000</p></div>
                <div><p className="text-[10px] uppercase opacity-75">Squads</p><p className="font-display text-2xl">16/16</p></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MiniStat icon={Flame} value="142" label="Kills" />
              <MiniStat icon={Activity} value="24:18" label="Match time" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl text-gradient-primary">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
function MiniStat({ icon: Icon, value, label }: { icon: typeof Flame; value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-black/30 p-3">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-1 font-display text-xl">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function FeaturedTournaments() {
  return (
    <section className="relative px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Featured" title="Tournaments Live Now" cta={{ to: "/tournaments", label: "View All" }} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((t, i) => <TournamentCard key={t.id} t={t} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function GameCategories() {
  const cats = [
    { name: "Free Fire MAX", color: "from-red-600 to-orange-500", tournaments: 48, live: 6, players: "18K+", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&q=60" },
    { name: "BGMI", color: "from-purple-600 to-red-500", tournaments: 36, live: 4, players: "12K+", img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=900&q=60" },
  ];
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Categories" title="Choose Your Battleground" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {cats.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border"
            >
              <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${c.color} opacity-90 transition group-hover:opacity-100`} />
              <div className="absolute inset-0 -z-10 grid-bg opacity-25" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="flex flex-col gap-6 p-8 md:flex-row md:items-end md:justify-between">
                <div>
                  <Gamepad2 className="h-10 w-10 text-white/80" />
                  <h3 className="mt-4 font-display text-4xl">{c.name}</h3>
                  <p className="mt-1 text-sm text-white/70">Battle royale. Squad mode. Maximum chaos.</p>
                </div>
                <div className="grid grid-cols-3 gap-4 md:gap-6">
                  <CatStat value={String(c.tournaments)} label="Active" />
                  <CatStat value={String(c.live)} label="Live" />
                  <CatStat value={c.players} label="Players" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
function CatStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-2xl">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-white/70">{label}</p>
    </div>
  );
}

function Stats() {
  const items = [
    { value: platformStats.players.toLocaleString(), label: "Registered Players", icon: Users },
    { value: platformStats.tournaments.toLocaleString(), label: "Matches Hosted", icon: Trophy },
    { value: shortInr(platformStats.prizeDistributed), label: "Prize Distributed", icon: Sparkles },
    { value: platformStats.dailyActive.toLocaleString(), label: "Daily Active", icon: Flame },
  ];
  return (
    <section className="relative px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="glass-card-strong relative overflow-hidden p-8 md:p-12">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-black/30 p-6"
              >
                <s.icon className="h-6 w-6 text-primary" />
                <p className="mt-4 font-display text-4xl text-gradient-primary">{s.value}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Voices" title="Players Speak" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card flex h-full flex-col p-6"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, k) => <Star key={k} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">"{t.body}"</p>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <img src={t.avatar} alt="" className="h-10 w-10 rounded-full border border-border bg-surface" />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.team}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-border-strong bg-gradient-to-br from-primary/30 via-background to-accent/30 p-10 text-center md:p-16">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative">
            <h2 className="font-display text-4xl sm:text-6xl">Ready To <span className="text-gradient-primary">Drop In?</span></h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Create your account in 60 seconds. Join your first tournament today. The arena doesn't wait.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/signup" className="rounded-xl gradient-primary px-6 py-3.5 text-sm font-bold uppercase tracking-widest shadow-glow transition hover:brightness-110">Create Account</Link>
              <Link to="/tournaments" className="rounded-xl border border-border-strong bg-glass px-6 py-3.5 text-sm font-bold uppercase tracking-widest backdrop-blur transition hover:border-primary">Browse Tournaments</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, cta }: { eyebrow: string; title: string; cta?: { to: string; label: string } }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
        <h2 className="mt-2 font-display text-4xl sm:text-5xl">{title}</h2>
      </div>
      {cta && <Link to={cta.to} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">{cta.label} <ArrowRight className="h-4 w-4" /></Link>}
    </div>
  );
}
