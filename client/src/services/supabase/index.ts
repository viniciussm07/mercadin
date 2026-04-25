import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

export const isSupabaseConfigured = () =>
  Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

const getRequiredEnv = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`A variável ${key} não foi configurada.`);
  }

  return value;
};

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(
      getRequiredEnv("EXPO_PUBLIC_SUPABASE_URL"),
      getRequiredEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY"),
    );
  }

  return supabaseClient;
};
