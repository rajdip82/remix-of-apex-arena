import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Tournament = Tables<"tournaments">;
export type Registration = Tables<"registrations"> & {
  tournaments: Tournament | null;
  teams: Tables<"teams"> | null;
};

export function useTournaments(status?: Tournament["status"]) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = supabase.from("tournaments").select("*").order("start_time", { ascending: true });
    if (status) q = q.eq("status", status);
    q.then(({ data }) => {
      setTournaments((data ?? []) as Tournament[]);
      setLoading(false);
    });

    const sub = supabase
      .channel("tournaments-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "tournaments" }, () => {
        q.then(({ data }) => setTournaments((data ?? []) as Tournament[]));
      })
      .subscribe();

    return () => { sub.unsubscribe(); };
  }, [status]);

  return { tournaments, loading };
}

export function useTournament(id: string) {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("tournaments").select("*").eq("id", id).single()
      .then(({ data }) => { setTournament(data); setLoading(false); });
  }, [id]);

  return { tournament, loading };
}

export function useMyRegistrations() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setRegistrations([]); setLoading(false); return; }
    supabase
      .from("registrations")
      .select("*, tournaments(*), teams(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRegistrations((data ?? []) as Registration[]);
        setLoading(false);
      });
  }, [user?.id]);

  const register = async (
    tournamentId: string,
    teamId?: string | null,
  ) => {
    if (!user) return { error: "Not logged in" };
    const insert: TablesInsert<"registrations"> = {
      tournament_id: tournamentId,
      user_id: user.id,
      team_id: teamId ?? null,
    };
    const { error } = await supabase.from("registrations").insert(insert);
    return { error: error?.message ?? null };
  };

  return { registrations, loading, register };
}

export function useAdminTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    supabase.from("tournaments").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setTournaments((data ?? []) as Tournament[]); setLoading(false); });
  };

  useEffect(() => { fetch(); }, []);

  const createTournament = async (data: TablesInsert<"tournaments">) => {
    const { error } = await supabase.from("tournaments").insert(data);
    if (!error) fetch();
    return error;
  };

  const updateTournament = async (id: string, data: Partial<Tournament>) => {
    const { error } = await supabase.from("tournaments").update(data).eq("id", id);
    if (!error) fetch();
    return error;
  };

  return { tournaments, loading, createTournament, updateTournament, refetch: fetch };
}
