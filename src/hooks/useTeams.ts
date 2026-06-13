import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Team = Tables<"teams"> & {
  team_members: (Tables<"team_members"> & { profiles: Tables<"profiles"> | null })[];
};

export function useMyTeams() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    if (!user) { setTeams([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("team_members")
      .select("team_id, teams(*, team_members(*, profiles(*)))")
      .eq("user_id", user.id);
    const result = (data ?? [])
      .map((d: any) => d.teams)
      .filter(Boolean) as Team[];
    setTeams(result);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [user?.id]);

  const createTeam = async (insert: TablesInsert<"teams">) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("teams")
      .insert({ ...insert, captain_id: user.id })
      .select()
      .single();
    if (error || !data) return error;
    await supabase.from("team_members").insert({
      team_id: data.id,
      user_id: user.id,
      role: "captain",
    });
    await fetch();
    return null;
  };

  return { teams, loading, refetch: fetch, createTeam };
}

export function useAllTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("teams")
      .select("*, team_members(*, profiles(*))")
      .then(({ data }) => {
        setTeams((data ?? []) as Team[]);
        setLoading(false);
      });
  }, []);

  return { teams, loading };
}
