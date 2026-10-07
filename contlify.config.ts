// Note: Ensure your Supabase project URL & Secret Key are configured
//
// Required environment variables:
// SUPABASE_URL=https://your-project.supabase.co
// SUPABASE_SECRET_KEY=your_service_role_key
// CONTLIFY_API_KEY=your_secret_api_key

// Load .env before the config below reads process.env (ES imports are evaluated
// before server.ts runs, so this has to happen here rather than in server.ts).
// In production the platform provides real env vars and the file is optional.
try {
  process.loadEnvFile?.();
} catch {}
try {
  process.loadEnvFile?.(".env.local");
} catch {}

import { createClient } from "@supabase/supabase-js";
import { defineConfig } from "contlify";

// Lazy Supabase client factory — safely handles build time when secrets are not yet defined.
let _supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SECRET_KEY"] || process.env["SUPABASE_SERVICE_ROLE_KEY"] || process.env["SUPABASE_ANON_KEY"];
  if (!url || !key) return null;
  if (!_supabaseClient) {
    _supabaseClient = createClient(url, key);
  }
  return _supabaseClient;
}

export default defineConfig({
  apiKey: process.env["CONTLIFY_API_KEY"],

  storage: {
    driver: "supabase",
    // Lazily resolves the Supabase client per-request, preventing build-time evaluation errors.
    client: getSupabaseClient,
  },

  api: {
    path: "/api/contlify/v1",
  },

  postUrl: "/blog/{slug}",
});
