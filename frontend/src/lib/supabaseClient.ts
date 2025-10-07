import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Khai báo kiểu rõ ràng
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
