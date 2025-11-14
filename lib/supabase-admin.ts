// lib/supabase-admin.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !serviceKey) {
  throw new Error("Supabase Admin: credenciais faltando no .env");
}

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false },
});
