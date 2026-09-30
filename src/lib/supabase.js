import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://cydnoncvkhzhopcwekoi.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable__99L3Y1K7_kXJzsFYyy8Ag_TvuERUXF';

export const supabase = createClient(supabaseUrl, supabaseKey);
