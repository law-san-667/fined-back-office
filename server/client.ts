import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase-types";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_KEY
) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_KEY env variable");
}

export const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);
