import { createClient } from '@supabase/supabase-js';

// Reemplaza estos valores por los de tu proyecto Supabase
const supabaseUrl = 'https://pyyioonvcpbuoxghakgs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5eWlvb252Y3BidW94Z2hha2dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MDgxODUsImV4cCI6MjA2NjM4NDE4NX0.p-meiWJ28zD9ZcWOoxd2CUzoDR6BBaNnmV9gFkazuiU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
