import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Flame, Trophy, Medal } from "lucide-react";
import { leaderboard } from "@/lib/mock-data";

const tabs = ["Global", "Free Fire", "BGMI", "Weekly", "Monthly", "All Time"] as const;

export function LeaderboardTable() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Global");
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="space-y-6">
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

      {/* Podium */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[top3[1], top3[0], top3[2]].map((p, i) => {
          const place = p.rank;
          const styles = place === 1 ? "from-yellow-500/30 to-amber-600/10 border-yellow-500/50" : place === 2 ? "from-zinc-300/20 to-zinc-500/10 border-zinc-400/40" : "from-orange-700/30 to-amber-800/10 border-orange-600/40";
          const Icon = place === 1 ? Crown : place === 2 ? Trophy : Medal;
          return (
            <motion.div
              key={p.username}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`glass-card border bg-gradient-to-b ${styles} ${place === 1 ? "sm:-translate-y-4" : ""} p-6 text-center`}
            >
              <Icon className={`mx-auto h-7 w-7 ${place === 1 ? "text-yellow-400" : place === 2 ? "text-zinc-300" : "text-orange-400"}`} />
              <div className="relative mx-auto mt-3 h-20 w-20">
                <img src={p.avatar} alt="" className="h-full w-full rounded-full border-2 border-border bg-surface" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-2.5 py-0.5 text-[10px] font-bold">#{p.rank}</span>
              </div>
              <h3 className="mt-4 font-display text-xl">{p.username}</h3>
              <p className="font-display text-2xl text-gradient-primary">{p.points.toLocaleString()}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Points</p>
            </motion.div>
          );
        })}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-black/30 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Player</th>
              <th className="hidden px-4 py-3 sm:table-cell">Matches</th>
              <th className="hidden px-4 py-3 md:table-cell">Kills</th>
              <th className="hidden px-4 py-3 md:table-cell">Win %</th>
              <th className="px-4 py-3 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {rest.map((p) => (
              <tr key={p.username} className="border-b border-border last:border-0 transition hover:bg-white/5">
                <td className="px-4 py-3 font-display text-lg text-muted-foreground">{p.rank}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.avatar} alt="" className="h-9 w-9 rounded-full border border-border bg-surface" />
                    <div>
                      <p className="font-semibold">{p.username}</p>
                      {p.streak > 5 && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-warning">
                          <Flame className="h-3 w-3 fill-current" /> {p.streak} streak
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{p.matches}</td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{p.kills}</td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{p.winRate.toFixed(1)}%</td>
                <td className="px-4 py-3 text-right font-display text-lg text-gradient-primary">{p.points.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
