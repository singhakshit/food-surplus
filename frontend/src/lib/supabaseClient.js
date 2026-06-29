import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nnhuyekwjwnncbmifgwj.supabase.co'
const supabaseAnonKey = 'sb_publishable_OMgUkk9e47nFb9hZUoPdFQ_VEr1GCnD'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)