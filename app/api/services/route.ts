import { getAdapter } from "@/lib/booking/adapters";
import { errorResponse } from "@/lib/booking/errors";

export async function GET() {
  try {
    const services = await getAdapter().listServices();
    return Response.json({ services }, { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" } });
  } catch (err) {
    return errorResponse(err);
  }
}
