import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { getAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

const Body = z.object({ password: z.string().min(1).max(256) });

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export async function POST(request: Request) {
  const configured = process.env.ADMIN_PASSWORD ?? "";
  if (!configured) {
    return Response.json(
      { ok: false, error: "ADMIN_PASSWORD is not configured on the server." },
      { status: 500 },
    );
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "Password is required." }, { status: 400 });
  }
  if (!safeEqual(parsed.data.password, configured)) {
    // Same shape as success-path failure to avoid user enumeration (single user anyway)
    await new Promise((r) => setTimeout(r, 400)); // slow brute force slightly
    return Response.json({ ok: false, error: "Wrong password." }, { status: 401 });
  }
  const session = await getAdminSession();
  session.admin = true;
  await session.save();
  return Response.json({ ok: true });
}
