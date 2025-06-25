import { createClient } from '@supabase/supabase-js';

// Reemplaza estos valores por los de tu proyecto Supabase
const supabaseUrl = 'https://pyyioonvcpbuoxghakgs.supabase.co';
const supabaseAnonKey = 'TU_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
