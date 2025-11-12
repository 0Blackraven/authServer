import { relations } from "drizzle-orm/relations";
import { users, userProvider } from "./schema";

export const userProviderRelations = relations(userProvider, ({one}) => ({
	user: one(users, {
		fields: [userProvider.userId],
		references: [users.userId]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	userProviders: many(userProvider),
}));