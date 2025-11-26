import { pgTable, unique, integer, varchar, boolean, timestamp, text, foreignKey, bigint, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const provider = pgEnum("provider", ['google', 'github', 'default'])


export const users = pgTable("users", {
	userId: integer("user_id").primaryKey().generatedAlwaysAsIdentity({ name: "users_user_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	email: varchar({ length: 150 }).notNull(),
	username: varchar({ length: 100 }).notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	password: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	avatar: text(),
}, (table) => [
	unique("users_email_key").on(table.email),
	unique("users_username_key").on(table.username),
]);

export const userProviders = pgTable("user_providers", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	providerId: bigint("provider_id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "user_provider_provider_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	providerRefId: varchar("provider_ref_id", { length: 255 }),
	provider: provider().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	userId: integer("user_id"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "user_id_ref"
		}).onDelete("cascade"),
]);
