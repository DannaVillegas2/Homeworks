import {createClient} from '@supabase/supabase-js';
const url=import.meta.env.VITE_SUPABASE_URL;
const clave=import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = url && clave ? createClient(url,clave) : null;
export const supabaseConfigurado=Boolean(supabase);
