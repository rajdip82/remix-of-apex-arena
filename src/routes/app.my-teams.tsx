import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Crown, Users, Plus, Loader2, Swords, Trash2, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useMyTeams } from "@/hooks/useTeams";
import type { TablesInsert } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/my-teams")({
  head: () => ({ meta: [{ title: "My Teams — TournamentX" }] }),
  component: MyTeams,
});

function MyTeams() {
  const { user, loading: authLoading } = useAuth();
  const { teams, loading, createTeam, refetch } = useMyTeams();
  const nav = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", game: "Free Fire MAX" as "Free Fire MAX" | "BGMI" });
  const [creating, setCreating] = useState(false);

  useEffect(() => { if (!authLoading && !user) nav({ to: "/login" }); }, [user, authLoading]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setCreating(true);
    const err = await createTeam({ name: form.name.trim(), game: form.game });
    if (err) toast.error((err as any).message ?? "Failed to create team");
    else { toast.success("Team created!"); setShowCreate(false); setForm({ name: "", game: "Free Fire MAX" }); }
    setCreating(false);
  };

  const handleLeave = async (teamId: string) => {
    if (!user) return;
    const { error } = await supabase.from("team_members").delete().eq("team_id", teamId).eq("user_id", user.id);
    if (error) toast.error(error.message);
    else { toast.success("Left team"); refetch(); }
  };

  return (
    <AppShell title="My Teams">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Manage your squads and rosters.</p>
        <button onClick={() => setShowCreate((s) => !s)} className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-sm font-bold shadow-glow">
          <Plus className="h-4 w-4" /> Create Team
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mt-5 glass-card p-5 space-y-4">
          <h3 className="font-display text-lg">Create New Team</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Team Name</label>
              <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="ShadowStrike Esports" className="tx-input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Game</label>
              <select value={form.game} onChange={(e) => setForm((p) => ({ ...p, game: e.target.value as any }))} className="tx-input">
                <option value="Free Fire MAX">Free Fire MAX</option>
                <option value="BGMI">BGMI</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={creating} className="flex items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-sm font-bold shadow-glow disabled:opacity-60">
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Team"}
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="rounded-xl border border-border px-4 py-2 text-sm hover:border-primary">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="mt-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : teams.length === 0 ? (
        <div className="mt-10 text-center py-16 glass-card">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 font-display text-2xl">No Teams Yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Create your first squad to compete together.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {teams.map((t) => {
            const isCaptain = t.captain_id === user?.id;
            return (
              <div key={t.id} className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-xl gradient-primary font-display text-xl shadow-glow">
                      {t.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <h3 className="font-display text-xl">{t.name}</h3>
                      <p className="text-xs text-muted-foreground"><Swords className="mr-1 inline h-3 w-3" />{t.game}</p>
                    </div>
                  </div>
                  {isCaptain && (
                    <span className="rounded-full border border-warning/40 bg-warning/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-warning">
                      <Crown className="mr-1 inline h-3 w-3" />Captain
                    </span>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  {t.team_members.map((m) => (
                    <div key={m.id} className="flex items-center justify-between rounded-xl border border-border bg-black/30 p-2.5 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 place-items-center rounded-full gradient-primary/20 text-xs font-bold">
                          {(m.profiles?.username ?? "?").slice(0, 2).toUpperCase()}
                        </div>
                        <span>{m.profiles?.username ?? "Unknown"}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase ${m.role === "captain" ? "text-warning" : "text-muted-foreground"}`}>{m.role}</span>
                    </div>
                  ))}
                </div>
                {!isCaptain && (
                  <button onClick={() => handleLeave(t.id)} className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-red-400 transition">
                    <UserMinus className="h-3 w-3" /> Leave Team
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
