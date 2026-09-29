import { readEnv } from "@/lib/env";

/**
 * GET /api/health: which deployment is live. Bookings are handled entirely by
 * the Cal.com embed, so there's no booking backend to report on.
 */
export async function GET() {
  return Response.json(
    {
      ok: true,
      deployment: {
        environment: readEnv(process.env.VERCEL_ENV) ?? "local",
        commit: readEnv(process.env.VERCEL_GIT_COMMIT_SHA)?.slice(0, 7) ?? null,
        builtAt: process.env.NEXT_PUBLIC_BUILD_TIME ?? null,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
