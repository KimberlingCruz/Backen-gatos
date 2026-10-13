import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = url && key
  ? createClient(url, key)
  : {
      storage: {
        from: () => ({
          upload: async () => ({ error: new Error("Supabase no configurado") }),
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
          remove: async () => ({ data: null, error: null }),
        }),
      },
    };

export default supabase;
