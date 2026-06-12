import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({ meta: [{ title: "Privacy Policy — TournamentX" }] }),
  component: () => <Legal title="Privacy Policy" body="We collect minimum necessary data to run tournaments: account details, gaming UIDs, payment proofs, and gameplay results. We never sell your data. UPI payment screenshots are stored only for verification and deleted after settlement. For data requests email privacy@tournamentx.gg." />,
});

export function Legal({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-background pt-24">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-5xl">{title}</h1>
        <p className="mt-6 leading-relaxed text-muted-foreground">{body}</p>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </main>
      <Footer />
    </div>
  );
}
