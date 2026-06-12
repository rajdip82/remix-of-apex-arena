import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { teams } from "@/lib/mock-data";
import { Crown, Users, Plus } from "lucide-react";

export const Route = createFileRoute("/app/my-teams")({
  head: () => ({ meta: [{ title: "My Teams — TournamentX" }] }),
  component: () => (
    <AppShell title="My Teams">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Manage your squads and rosters.</p>
        <button className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-sm font-bold shadow-glow"><Plus className="h-4 w-4" /> Create Team</button>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {teams.map((t) => (
          <div key={t.id} className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl gradient-primary font-display text-xl shadow-glow">{t.tag}</span>
                <div>
                  <h3 className="font-display text-xl">{t.name}</h3>
                  <p className="text-xs text-muted-foreground">{t.game} · {t.wins} wins</p>
                </div>
              </div>
              <span className="rounded-full border border-warning/40 bg-warning/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-warning"><Crown className="mr-1 inline h-3 w-3" />Captain</span>
            </div>
            <div className="mt-4 space-y-2">
              {t.members.map((m, i) => (
                <div key={m} className="flex items-center justify-between rounded-xl border border-border bg-black/30 p-2.5 text-sm">
                  <div className="flex items-center gap-3">
                    <img src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${m}`} className="h-8 w-8 rounded-full bg-surface" />
                    <span>{m}</span>
                    {i === 0 && <Crown className="h-3 w-3 text-warning" />}
                  </div>
                  <button className="text-xs text-muted-foreground hover:text-danger">Remove</button>
                </div>
              ))}
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-sm text-muted-foreground hover:border-primary hover:text-primary"><Users className="h-4 w-4" /> Invite Player</button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  ),
});
