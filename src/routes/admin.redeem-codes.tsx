import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Ticket, Plus, Copy, Loader2, ToggleLeft, ToggleRight, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/redeem-codes")({
  head: () => ({ meta: [{ title: "Redeem Codes — TX Admin" }] }),
  component: AdminRedeemCodes,
});

function AdminRedeemCodes() {
  const [codes, setCodes] = useState<Tables<"redeem_codes">[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", discount_percentage: "0", free_entry: false, max_usage: "100", expiry_date: "" });
  const [creating, setCreating] = useState(false);

  const fetch = () => {
    supabase.from("redeem_codes").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setCodes((data ?? []) as Tables<"redeem_codes">[]); setLoading(false); });
  };

  useEffect(() => { fetch(); }, []);

  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setForm((p) => ({ ...p, code: `TX-${code}` }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const insert: TablesInsert<"redeem_codes"> = {
      code: form.code.trim().toUpperCase(),
      discount_percentage: parseInt(form.discount_percentage) || 0,
      free_entry: form.free_entry,
      max_usage: parseInt(form.max_usage) || 1,
      expiry_date: form.expiry_date || null,
    };
    const { error } = await supabase.from("redeem_codes").insert(insert);
    if (error) { toast.error(error.message.includes("unique") ? "Code already exists" : error.message); }
    else { toast.success("Redeem code created!"); setShowForm(false); setForm({ code: "", discount_percentage: "0", free_entry: false, max_usage: "100", expiry_date: "" }); fetch(); }
    setCreating(false);
  };

  const toggleStatus = async (c: Tables<"redeem_codes">) => {
    const { error } = await supabase.from("redeem_codes").update({ status: !c.status }).eq("id", c.id);
    if (error) toast.error(error.message);
    else { toast.success(`Code ${!c.status ? "activated" : "deactivated"}`); fetch(); }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  return (
    <AdminShell title="Redeem Codes">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">{codes.length} codes · {codes.filter((c) => c.status).length} active</p>
        <button onClick={() => setShowForm((s) => !s)} className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-sm font-bold shadow-glow">
          <Plus className="h-4 w-4" /> Create Code
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl">New Redeem Code</h3>
            <button type="button" onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Code</label>
              <div className="flex gap-2">
                <input required value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} className="tx-input flex-1" placeholder="TX-SUMMER25" />
                <button type="button" onClick={generateCode} className="rounded-xl border border-border px-3 text-xs hover:border-primary transition">Auto</button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Discount %</label>
              <input type="number" min="0" max="100" value={form.discount_percentage} onChange={(e) => setForm((p) => ({ ...p, discount_percentage: e.target.value }))} className="tx-input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Max Usage</label>
              <input type="number" min="1" value={form.max_usage} onChange={(e) => setForm((p) => ({ ...p, max_usage: e.target.value }))} className="tx-input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Expiry Date</label>
              <input type="date" value={form.expiry_date} onChange={(e) => setForm((p) => ({ ...p, expiry_date: e.target.value }))} className="tx-input" />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.free_entry} onChange={(e) => setForm((p) => ({ ...p, free_entry: e.target.checked }))} className="h-4 w-4 rounded border-border" />
            <span className="text-sm">Free entry (100% off)</span>
          </label>
          <button type="submit" disabled={creating} className="flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-bold shadow-glow disabled:opacity-60">
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Code"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">{["Code","Discount","Free Entry","Usage","Expiry","Status",""].map((h) => <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {codes.map((c) => {
                const isExpired = c.expiry_date && new Date(c.expiry_date) < new Date();
                return (
                  <tr key={c.id} className={`hover:bg-white/5 transition ${!c.status ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{c.code}</span>
                        <button onClick={() => copyCode(c.code)} className="text-muted-foreground hover:text-primary transition"><Copy className="h-3 w-3" /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-primary">{c.discount_percentage}%</td>
                    <td className="px-4 py-3">{c.free_entry ? <span className="text-success text-xs font-bold">Yes</span> : "No"}</td>
                    <td className="px-4 py-3 text-xs">{c.current_usage}/{c.max_usage}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {c.expiry_date ? <span className={isExpired ? "text-red-400" : ""}>{c.expiry_date}</span> : "No expiry"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${c.status && !isExpired ? "border-success/40 bg-success/10 text-success" : "border-border text-muted-foreground"}`}>
                        {isExpired ? "Expired" : c.status ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStatus(c)} className="text-muted-foreground hover:text-primary transition">
                        {c.status ? <ToggleRight className="h-5 w-5 text-success" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {codes.length === 0 && (
            <div className="py-16 text-center">
              <Ticket className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">No redeem codes yet.</p>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}
