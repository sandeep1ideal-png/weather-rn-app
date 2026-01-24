import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// export const supabase = createClient(
//   process.env.EXPO_PUBLIC_SUPABASE_URL!,
//   process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
//   {
//     auth: {
//       detectSessionInUrl: true,   // 🔥 MUST
//       persistSession: true,       // store session locally
//       autoRefreshToken: true,     // auto refresh
//     },
//   }
// );

const AsyncStorageAdapter = {
  getItem: async (key: string) => {
    console.log('🔍 getItem called by Supabase');
    return await AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: any) => {
    // console.log('💾 setItem called by Supabase',value); // ← You'll see this
          console.log('token:2  usersetitesm called by Supabase', value);

    return await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    console.log('🗑️ removeItem called by Supabase');
    return await AsyncStorage.removeItem(key);
  },
};

// 2️⃣ Pass adapter to Supabase
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorageAdapter, // ← Just pass it here
      persistSession: true,
      autoRefreshToken: true,
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
