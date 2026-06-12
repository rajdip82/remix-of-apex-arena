import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Mail, MessageCircle, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — TournamentX" }, { name: "description", content: "Get in touch with the TournamentX support team." }] }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="bg-background pt-24">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Get In Touch</p>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">Contact <span className="text-gradient-primary">Support</span></h1>
        </header>
        <div className="mt-10 grid gap-6 md:grid-cols-[1fr_2fr]">
          <div className="space-y-3">
            {[
              { icon: Mail, title: "Email", value: "support@tournamentx.gg" },
              { icon: MessageCircle, title: "Discord", value: "discord.gg/tx" },
            ].map((i) => (
              <div key={i.title} className="glass-card flex items-center gap-4 p-5">
                <span className="grid h-11 w-11 place-items-center rounded-xl gradient-primary shadow-glow"><i.icon className="h-5 w-5" /></span>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{i.title}</p>
                  <p className="font-semibold">{i.value}</p>
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="glass-card space-y-4 p-6"
          >
            {sent && <div className="rounded-xl border border-success/40 bg-success/10 p-3 text-sm text-success">Message sent! We'll reply within 24 hours.</div>}
            <Field label="Name" placeholder="Your gamer tag" />
            <Field label="Email" type="email" placeholder="you@email.com" />
            <Field label="Subject" placeholder="What's this about?" />
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Message</label>
              <textarea required rows={5} className="mt-1 w-full rounded-xl border border-border bg-black/30 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-glow" placeholder="Tell us more..." />
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-bold uppercase tracking-widest shadow-glow transition hover:brightness-110">
              <Send className="h-4 w-4" /> Send Message
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
      <input required {...rest} className="mt-1 w-full rounded-xl border border-border bg-black/30 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-glow" />
    </div>
  );
}
