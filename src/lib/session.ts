import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";

export type AdminSession = {
  admin?: boolean;
};

function sessionOptions(): SessionOptions {
  const password = process.env.SESSION_SECRET ?? "";
  // During `next build` (no env yet) fall back to a dummy so prerender
  // probes don't crash; real requests in production still require it.
  const effective =
    password.length >= 32
      ? password
      : process.env.NEXT_PHASE === "phase-production-build"
        ? "build-only-dummy-password-0123456789"
        : "";
  if (effective.length < 32) {
    throw new Error(
      "SESSION_SECRET must be set to a string of 32+ characters (see .env.example).",
    );
  }
  return {
    cookieName: "phorish_admin",
    password: effective,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  };
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return getIronSession<AdminSession>(cookieStore, sessionOptions());
}

export async function isAdmin() {
  const session = await getAdminSession();
  return session.admin === true;
}
