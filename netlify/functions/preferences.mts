import { getUser } from "@netlify/identity";
import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { users, userPreferences } from "../../db/schema.js";
import { THEMES } from "../../src/lib/themes.js";

export default async (request: Request) => {
  const headers = { "Cache-Control": "private, no-store" };
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed." },
      { status: 405, headers: { ...headers, Allow: "POST" } },
    );
  }
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json(
      { error: "Cross-origin requests are not allowed." },
      { status: 403, headers },
    );
  }
  const user = await getUser();
  if (!user) {
    return Response.json(
      { error: "Sign in to save your preferences." },
      { status: 401, headers },
    );
  }

  let theme: string;
  try {
    const body = await request.text();
    if (body.length > 1024) {
      return Response.json(
        { error: "Request is too large." },
        { status: 413, headers },
      );
    }
    const payload: unknown = JSON.parse(body);
    if (
      !payload ||
      typeof payload !== "object" ||
      !("theme" in payload) ||
      typeof payload.theme !== "string" ||
      !THEMES.some((option) => option.id === payload.theme)
    ) {
      return Response.json(
        { error: "Choose a valid theme." },
        { status: 400, headers },
      );
    }
    theme = payload.theme;
  } catch {
    return Response.json(
      { error: "Invalid JSON request." },
      { status: 400, headers },
    );
  }

  try {
    await db
      .insert(users)
      .values({
        id: user.id,
        name: user.name ?? null,
        email: user.email ?? null,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: { name: user.name ?? null, email: user.email ?? null },
      });
    await db
      .insert(userPreferences)
      .values({ userId: user.id, theme })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: { theme },
      });
    return Response.json({ theme }, { headers });
  } catch {
    return Response.json(
      { error: "Your preference could not be saved. Please try again." },
      { status: 503, headers },
    );
  }
};

export const config: Config = { path: "/api/preferences" };
