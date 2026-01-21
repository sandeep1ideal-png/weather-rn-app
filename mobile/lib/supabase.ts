import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      detectSessionInUrl: true,   // 🔥 MUST
      persistSession: true,       // store session locally
      autoRefreshToken: true,     // auto refresh
    },
  }
);


// import { createClient } from "@supabase/supabase-js";

// export const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_ANON_KEY!,
//   {
//     auth: {
//       detectSessionInUrl: true,   // 🔥 MUST
//       persistSession: true,       // store session locally
//       autoRefreshToken: true,     // auto refresh
//     },
//   }
// );
