import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text().primaryKey(),
  name: text(),
  email: text(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  theme: text().default("emerald").notNull(),
});

export const customApps = pgTable("custom_apps", {
  id: serial().primaryKey(),
  name: text().notNull(),
  nameUrdu: text("name_urdu"),
  url: text().notNull(),
  icon: text().notNull(),
  row: integer().notNull(),
  position: integer().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const tickerMessages = pgTable("ticker_messages", {
  id: serial().primaryKey(),
  message: text().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  order: integer().notNull(),
});
