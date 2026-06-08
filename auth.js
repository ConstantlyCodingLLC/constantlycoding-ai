import { supabase } from "./supabase.js";

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getProfile(userId) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return data;
}
