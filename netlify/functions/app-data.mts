import { getUser } from "@netlify/identity";
import type { Config } from "@netlify/functions";
import { asc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import {
  customApps,
  tickerMessages,
  userPreferences,
} from "../../db/schema.js";

export default async (request: Request) => {
  const headers = { "Cache-Control": "private, no-store" };
  if (request.method !== "GET") {
    return Response.json(
      { error: "Method not allowed." },
      { status: 405, headers: { ...headers, Allow: "GET" } },
    );
  }

  try {
    const user = await getUser();
    const [apps, tickers, preferences] = await Promise.all([
      db
        .select()
        .from(customApps)
        .where(eq(customApps.isActive, true))
        .orderBy(asc(customApps.row), asc(customApps.position)),
      db
        .select()
        .from(tickerMessages)
        .where(eq(tickerMessages.isActive, true))
        .orderBy(asc(tickerMessages.order)),
      user
        ? db
            .select()
            .from(userPreferences)
            .where(eq(userPreferences.userId, user.id))
            .limit(1)
        : Promise.resolve([]),
    ]);

    return Response.json(
      {
        customApps: apps.map(({ id, nameUrdu, ...app }) => ({
          ...app,
          _id: String(id),
          nameUrdu: nameUrdu ?? undefined,
        })),
        tickers: tickers.map(({ id, ...ticker }) => ({
          ...ticker,
          _id: String(id),
        })),
        theme: preferences[0]?.theme ?? null,
      },
      { headers },
    );
  } catch {
    return Response.json(
      { error: "Content is temporarily unavailable. Please try again." },
      { status: 503, headers },
    );
  }
};

export const config: Config = { path: "/api/app-data" };
