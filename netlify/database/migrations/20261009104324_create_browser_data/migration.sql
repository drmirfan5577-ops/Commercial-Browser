CREATE TABLE "custom_apps" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"name_urdu" text,
	"url" text NOT NULL,
	"icon" text NOT NULL,
	"row" integer NOT NULL,
	"position" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticker_messages" (
	"id" serial PRIMARY KEY,
	"message" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"user_id" text PRIMARY KEY,
	"theme" text DEFAULT 'emerald' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY,
	"name" text,
	"email" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;