import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/supabase-config")({
  server: {
    handlers: {
      GET: async () => {
        const url = process.env.APP_SUPABASE_URL;
        const anonKey = process.env.APP_SUPABASE_ANON_KEY;
        if (!url || !anonKey) {
          return Response.json(
            { error: "Supabase env not configured" },
            { status: 500 },
          );
        }
        return Response.json(
          { url, anonKey },
          { headers: { "cache-control": "public, max-age=300" } },
        );
      },
    },
  },
});
