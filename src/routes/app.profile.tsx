import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Verified, Trophy, Crosshair, Target, Award, Settings, Gamepad2, Loader2, Camera, X, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useMyRegistrations } from "@/hooks/useTournaments";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [{ title: "Profile — TournamentX" }] }),
  component: Profile,
});

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
];

function Profile() {
  const { user, loading } = useAuth();
  const { profile, updateProfile, uploadAvatar, saving } = useProfile();
  const { registrations } = useMyRegistrations();
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: "", full_name: "", free_fire_uid: "", bgmi_uid: "",
    favorite_game: "" as "Free Fire MAX" | "BGMI" | "",
    state: "",
  });

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading]);

  useEffect(() => {
    if (profile) setForm({
      username: profile.username ?? "",
      full_name: profile.full_name ?? "",
      free_fire_uid: profile.free_fire_uid ?? "",
      bgmi_uid: profile.bgmi_uid ?? "",
      favorite_game: (profile.favorite_game ?? "") as "Free Fire MAX" | "BGMI" | "",
      state: profile.state ?? "",
    });
  }, [profile]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const url = await uploadAvatar(file);
    if (url) { await updateProfile({ avatar_url: url }); toast.success("Avatar updated!"); }
    else toast.error("Upload failed");
  };

  const handleSave = async () => {
    const err = await updateProfile({
      username: form.username.trim().toLowerCase(),
      full_name: form.full_name.trim() || null,
      free_fire_uid: form.free_fire_uid.trim() || null,
      bgmi_uid: form.bgmi_uid.trim() || null,
      favorite_game: (form.favorite_game || null) as "Free Fire MAX" | "BGMI" | null,
      state: form.state || null,
    });
    if (err) toast.error(err.message.includes("unique") ? "Username taken." : err.message);
    else { toast.success("Profile updated!"); setEditing(false); }
  };

  if (loading || !profile) return (
    <AppShell title="Profile"><div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AppShell>
  );

  const wins = registrations.filter((r) => r.registration_status === "approved").length;
  const joinYear = new Date(profile.created_at).getFullYear();
  const joinMonth = new Date(profile.created_at).toLocaleString("en-IN", { month: "long" });

  return (
    <AppShell title="Profile">
      <div className="glass-card-strong relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-radial)" }} />
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
          <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="" className="h-28 w-28 rounded-2xl border-2 border-primary bg-surface shadow-glow object-cover" />
              : <div className="h-28 w-28 rounded-2xl border-2 border-primary bg-surface shadow-glow flex items-center justify-center font-display text-3xl">{(profile.username ?? "TX").slice(0, 2).toUpperCase()}</div>
            }
            <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"><Camera className="h-6 w-6" /></div>
            {profile.verified && <span className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-full gradient-primary"><Verified className="h-4 w-4" /></span>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start flex-wrap">
              <h2 className="font-display text-4xl">{profile.username ?? "Anonymous"}</h2>
              {profile.verified && <span className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-success">Verified</span>}
              {profile.role === "admin" && <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-accent">Admin</span>}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{profile.state ? `${profile.state}, India` : "India"} · Joined {joinMonth} {joinYear}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              {profile.free_fire_uid && <UidPill label="FF MAX" value={profile.free_fire_uid} />}
              {profile.bgmi_uid && <UidPill label="BGMI" value={profile.bgmi_uid} />}
            </div>
          </div>
          <button onClick={() => setEditing((e) => !e)} className="rounded-xl border border-border px-4 py-2 text-sm hover:border-primary transition">
            {editing ? <><X className="mr-1 inline h-4 w-4" />Cancel</> : <><Settings className="mr-1 inline h-4 w-4" />Edit</>}
          </button>
        </div>
      </div>

      {editing && (
        <div className="mt-6 glass-card p-6 space-y-4">
          <h3 className="font-display text-xl">Edit Profile</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <LabelField label="Username"><input value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value.toLowerCase().replace(/\s/g, "") }))} className="tx-input" /></LabelField>
            <LabelField label="Full Name"><input value={form.full_name} onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))} className="tx-input" /></LabelField>
            <LabelField label="Free Fire MAX UID"><input value={form.free_fire_uid} onChange={(e) => setForm((p) => ({ ...p, free_fire_uid: e.target.value }))} className="tx-input" /></LabelField>
            <LabelField label="BGMI UID"><input value={form.bgmi_uid} onChange={(e) => setForm((p) => ({ ...p, bgmi_uid: e.target.value }))} className="tx-input" /></LabelField>
            <LabelField label="Favourite Game">
              <select value={form.favorite_game} onChange={(e) => setForm((p) => ({ ...p, favorite_game: e.target.value as any }))} className="tx-input">
                <option value="">Select</option>
                <option value="Free Fire MAX">Free Fire MAX</option>
                <option value="BGMI">BGMI</option>
              </select>
            </LabelField>
            <LabelField label="State">
              <select value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))} className="tx-input">
                <option value="">Select</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </LabelField>
          </div>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-bold shadow-glow hover:brightness-110 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save Changes</>}
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          { icon: Trophy, label: "Tournaments", value: String(registrations.length) },
          { icon: Award, label: "Approved", value: String(wins) },
          { icon: Crosshair, label: "Kills", value: "—" },
          { icon: Target, label: "Win Rate", value: registrations.length ? `${Math.round((wins / registrations.length) * 100)}%` : "—" },
        ].map((s) => (
          <div key={s.label} className="glass-card flex items-center gap-4 p-5">
            <span className="grid h-11 w-11 place-items-center rounded-xl gradient-primary/20 text-primary"><s.icon className="h-5 w-5" /></span>
            <div><p className="font-display text-2xl">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          </div>
        ))}
      </div>
      {profile.favorite_game && (
        <div className="mt-6 glass-card p-5 flex items-center gap-4">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <div><p className="text-xs text-muted-foreground uppercase tracking-widest">Favourite Game</p><p className="font-display text-xl">{profile.favorite_game}</p></div>
        </div>
      )}
    </AppShell>
  );
}

function UidPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-border bg-black/30 px-3 py-1 text-xs">
      <span className="font-bold text-primary">{label}</span>
      <span className="text-muted-foreground">{value}</span>
    </span>
  );
}

function LabelField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
