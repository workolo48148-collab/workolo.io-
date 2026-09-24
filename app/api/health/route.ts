import { resolveAdapter } from "@/lib/booking/adapters";
import { readEnv } from "@/lib/env";

/**
 * GET /api/health: which booking backend is live and why. Reports only
 * whether variables are present, never their values.
 */
export async function GET() {
  const r = resolveAdapter();
  const present = (name: string) => Boolean(readEnv(process.env[name]));

  return Response.json(
    {
      ok: Boolean(r.adapter),
      booking: {
        adapter: r.adapter?.name ?? null,
        chosenBy: r.source,
        problem: r.problem ?? null,
        env: {
          BOOKING_ADAPTER: present("BOOKING_ADAPTER") ? readEnv(process.env.BOOKING_ADAPTER) : null,
          CALCOM_API_KEY: present("CALCOM_API_KEY"),
          CALCOM_EVENT_TYPE_ID: present("CALCOM_EVENT_TYPE_ID"),
        },
      },
      deployment: {
        environment: readEnv(process.env.VERCEL_ENV) ?? "local",
        commit: readEnv(process.env.VERCEL_GIT_COMMIT_SHA)?.slice(0, 7) ?? null,
        builtAt: process.env.NEXT_PUBLIC_BUILD_TIME ?? null,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
