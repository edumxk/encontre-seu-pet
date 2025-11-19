import { createClient } from '@supabase/supabase-js';

// Essas variáveis devem estar no seu .env (e no Vercel)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);