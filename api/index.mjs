// Vercel serverless function that runs the Angular SSR Express server
// (src/server.ts). That server renders the pages and also serves the Contlify
// API (/api/contlify/v1/...), which reads and writes Supabase.
//
// vercel.json rewrites every request that isn't a static file to this function.
export default async function handler(req, res) {
  const { reqHandler } = await import('../dist/contlify-blog/server/server.mjs');
  return reqHandler(req, res);
}
