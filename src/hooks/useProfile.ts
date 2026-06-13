import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { TablesUpdate } from "@/integrations/supabase/types";

export function useProfile() {
  const { profile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (updates: TablesUpdate<"profiles">) => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    const { error: err } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profile.id);
    if (err) {
      setError(err.message);
    } else {
      await refreshProfile();
    }
    setSaving(false);
    return err;
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!profile) return null;
    const ext = file.name.split(".").pop();
    const path = `${profile.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (uploadError) return null;
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    return data.publicUrl;
  };

  return { profile, updateProfile, uploadAvatar, saving, error };
}
