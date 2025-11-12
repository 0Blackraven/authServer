-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."provider" AS ENUM('google', 'github', 'default');--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(150) NOT NULL,
	"username" varchar(100) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"password" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"avatar" text,
	"refresh_token" varchar(255) NOT NULL,
	"refresh_token_expiry" timestamp DEFAULT (now() + '30 days'::interval) NOT NULL,
	CONSTRAINT "users_email_key" UNIQUE("email"),
	CONSTRAINT "users_username_key" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "user_provider" (
	"provider_id" bigserial PRIMARY KEY NOT NULL,
	"provider" "provider" NOT NULL,
	"provider_ref_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_provider_provider_ref_id_key" UNIQUE("provider_ref_id")
);
--> statement-breakpoint
ALTER TABLE "user_provider" ADD CONSTRAINT "user_id" FOREIGN KEY ("provider_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
*/