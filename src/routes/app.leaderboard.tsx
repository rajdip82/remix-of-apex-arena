import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Crown, Flame, Medal, Trophy, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/app/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — TournamentX" }] }),
  component: Leaderboard,
});

type LeaderEntry = Tables<"profiles"> & { wins: number; total: number };

const tabs = ["All", "Free Fire MAX", "BGMI"] as const;

function Leaderboard() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");

  useEffect(() => { if (!authLoading && !user) nav({ to: "/login" }); }, [user, authLoading]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("registrations")
          .select("user_id, registration_status, profiles(*), tournaments(game)")
          .eq("registration_status", "approved");

        if (error || !data) { setLoading(false); return; }

        const map = new Map<string, LeaderEntry>();
        for (const row of data as any[]) {
          if (!row.profiles) continue;
          if (tab !== "All" && row.tournaments?.game !== tab) continue;
          const p = row.profiles as Tables<"profiles">;
          const existing = map.get(p.id) ?? { ...p, wins: 0, total: 0 };
          existing.wins += 1;
          existing.total += 1;
          map.set(p.id, existing);
        }

        const sorted = Array.from(map.values()).sort((a, b) => b.wins - a.wins);
        setEntries(sorted);
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, [tab]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  const podiumOrder = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;
  const podiumHeight = ["h-24", "h-32", "h-20"];
  const podiumLabel = ["2nd", "1st", "3rd"];
  const podiumIcon = [Medal, Crown, Medal];
  const podiumColor = ["text-slate-400", "text-warning", "text-orange-400"];

  return (
    <AppShell title="Leaderboard">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${tab === t ? "gradient-primary text-white shadow-glow" : "border border-border text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : entries.length === 0 ? (
        <div className="mt-10 py-20 text-center glass-card">
          <Trophy className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 font-display text-2xl">No Data Yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Complete tournaments to appear on the leaderboard.</p>
        </div>
      ) : (
        <>
          {top3.length === 3 && (
            <div className="mt-6 flex items-end justify-center gap-4">
              {podiumOrder.map((p, i) => {
                if (!p) return null;
                const Icon = podiumIcon[i];
                return (
                  <div key={p.id} className="flex flex-col items-center gap-2">
                    <Icon className={`h-6 w-6 ${podiumColor[i]}`} />
                    {p.avatar_url
                      ? <img src={p.avatar_url} className="h-14 w-14 rounded-2xl border-2 border-border object-cover" alt="" />
                      : <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary text-lg font-bold">{(p.username ?? "?").slice(0, 2).toUpperCase()}</div>
                    }
                    <p className="font-display text-sm">{p.username ?? "Player"}</p>
                    <p className="text-[10px] text-muted-foreground">{p.wins} wins</p>
                    <div className={`w-20 ${podiumHeight[i]} rounded-t-xl gradient-primary/30 border border-primary/20 flex items-center justify-center`}>
                      <span className="font-display text-xl text-primary">{podiumLabel[i]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Player</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">State</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Wins</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entries.map((p, i) => (
                  <tr key={p.id} className={`hover:bg-white/5 transition ${p.id === user?.id ? "bg-primary/5" : ""}`}>
                    <td className="px-4 py-3">
                      {i === 0 ? <Crown className="h-4 w-4 text-warning" />
                        : i === 1 ? <Medal className="h-4 w-4 text-slate-400" />
                        : i === 2 ? <Medal className="h-4 w-4 text-orange-400" />
                        : <span className="text-muted-foreground">{i + 1}</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.avatar_url
                          ? <img src={p.avatar_url} className="h-8 w-8 rounded-full object-cover" alt="" />
                          : <div className="grid h-8 w-8 place-items-center rounded-full gradient-primary text-xs font-bold">{(p.username ?? "?").slice(0, 2).toUpperCase()}</div>
                        }
                        <div>
                          <p className="font-semibold">{p.username ?? "Player"}</p>
                          {p.verified && <span className="text-[10px] text-success">✓ Verified</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.state ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="flex items-center justify-end gap-1 font-bold text-primary">
                        <Flame className="h-3 w-3" />{p.wins}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AppShell>
  );
}
