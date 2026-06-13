import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Plus, Loader2, Edit2, Swords, X, Save } from "lucide-react";
import { toast } from "sonner";
import { useAdminTournaments } from "@/hooks/useTournaments";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/tournaments")({
  head: () => ({ meta: [{ title: "Tournaments — TX Admin" }] }),
  component: AdminTournaments,
});

type TournamentForm = {
  title: string; game: "Free Fire MAX" | "BGMI"; mode: "Solo" | "Duo" | "Squad";
  map: string; prize_pool: string; entry_fee: string; total_slots: string;
  start_time: string; status: "Upcoming" | "Live" | "Completed" | "Cancelled"; rules: string;
};

const empty: TournamentForm = {
  title: "", game: "Free Fire MAX", mode: "Squad", map: "Bermuda",
  prize_pool: "0", entry_fee: "0", total_slots: "100",
  start_time: "", status: "Upcoming", rules: "",
};

function AdminTournaments() {
  const { tournaments, loading, createTournament, updateTournament } = useAdminTournaments();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<TournamentForm>(empty);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const openCreate = () => { setForm(empty); setEditId(null); setShowForm(true); };
  const openEdit = (t: Tables<"tournaments">) => {
    setForm({
      title: t.title, game: t.game, mode: t.mode, map: t.map,
      prize_pool: String(t.prize_pool), entry_fee: String(t.entry_fee),
      total_slots: String(t.total_slots), rules: t.rules ?? "",
      start_time: t.start_time.slice(0, 16),
      status: t.status,
    });
    setEditId(t.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.start_time) { toast.error("Start time is required"); return; }
    setSaving(true);
    const data: TablesInsert<"tournaments"> = {
      title: form.title, game: form.game, mode: form.mode, map: form.map,
      prize_pool: parseInt(form.prize_pool) || 0,
      entry_fee: parseInt(form.entry_fee) || 0,
      total_slots: parseInt(form.total_slots) || 100,
      start_time: new Date(form.start_time).toISOString(),
      status: form.status,
      rules: form.rules || null,
    };
    const err = editId ? await updateTournament(editId, data) : await createTournament(data);
    if (err) toast.error(err.message);
    else { toast.success(editId ? "Tournament updated!" : "Tournament created!"); setShowForm(false); }
    setSaving(false);
  };

  const statusColor: Record<string, string> = {
    Upcoming: "border-warning/40 bg-warning/10 text-warning",
    Live: "border-success/40 bg-success/10 text-success",
    Completed: "border-border text-muted-foreground",
    Cancelled: "border-red-500/40 bg-red-500/10 text-red-400",
  };

  return (
    <AdminShell title="Tournaments">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">{tournaments.length} total tournaments</p>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-sm font-bold shadow-glow">
          <Plus className="h-4 w-4" /> New Tournament
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl">{editId ? "Edit Tournament" : "Create Tournament"}</h3>
            <button type="button" onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground hover:text-foreground" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <F label="Title" span2><input required value={form.title} onChange={(e) => set("title", e.target.value)} className="tx-input" placeholder="Grand Finals" /></F>
            <F label="Game">
              <select value={form.game} onChange={(e) => set("game", e.target.value)} className="tx-input">
                <option value="Free Fire MAX">Free Fire MAX</option>
                <option value="BGMI">BGMI</option>
              </select>
            </F>
            <F label="Mode">
              <select value={form.mode} onChange={(e) => set("mode", e.target.value)} className="tx-input">
                <option value="Solo">Solo</option><option value="Duo">Duo</option><option value="Squad">Squad</option>
              </select>
            </F>
            <F label="Map"><input value={form.map} onChange={(e) => set("map", e.target.value)} className="tx-input" placeholder="Bermuda" /></F>
            <F label="Prize Pool (₹)"><input type="number" min="0" value={form.prize_pool} onChange={(e) => set("prize_pool", e.target.value)} className="tx-input" /></F>
            <F label="Entry Fee (₹)"><input type="number" min="0" value={form.entry_fee} onChange={(e) => set("entry_fee", e.target.value)} className="tx-input" /></F>
            <F label="Total Slots"><input type="number" min="1" value={form.total_slots} onChange={(e) => set("total_slots", e.target.value)} className="tx-input" /></F>
            <F label="Start Date & Time"><input required type="datetime-local" value={form.start_time} onChange={(e) => set("start_time", e.target.value)} className="tx-input" /></F>
            <F label="Status">
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className="tx-input">
                <option value="Upcoming">Upcoming</option><option value="Live">Live</option>
                <option value="Completed">Completed</option><option value="Cancelled">Cancelled</option>
              </select>
            </F>
          </div>
          <F label="Rules (optional)">
            <textarea value={form.rules} onChange={(e) => set("rules", e.target.value)} rows={3} className="tx-input resize-none" placeholder="Tournament rules..." />
          </F>
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-bold shadow-glow disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> {editId ? "Save Changes" : "Create Tournament"}</>}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">{["Tournament","Game / Mode","Prize Pool","Entry","Slots","Status",""].map((h) => <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {tournaments.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(t.start_time).toLocaleDateString("en-IN")}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{t.game}<br />{t.mode} · {t.map}</td>
                  <td className="px-4 py-3 font-bold text-success">₹{t.prize_pool.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">{t.entry_fee === 0 ? <span className="text-success">Free</span> : `₹${t.entry_fee}`}</td>
                  <td className="px-4 py-3 text-xs">{t.filled_slots}/{t.total_slots}</td>
                  <td className="px-4 py-3"><span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${statusColor[t.status]}`}>{t.status}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(t)} className="flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[10px] font-bold uppercase hover:border-primary hover:text-primary transition">
                      <Edit2 className="h-3 w-3" />Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tournaments.length === 0 && (
            <div className="py-16 text-center">
              <Swords className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">No tournaments yet. Create one above.</p>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}

function F({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <div className={`space-y-1.5 ${span2 ? "sm:col-span-2" : ""}`}>
      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
