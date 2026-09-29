import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://wzunwgdrnexcdntwjuiu.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_XbTrFoqLXtYBsjn5mZaBuA_XCiAmDdf';

export const supabase = createClient(supabaseUrl, supabaseKey);
