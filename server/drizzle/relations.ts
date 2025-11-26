import { relations } from "drizzle-orm/relations";
import { users, userProviders } from "./schema";

export const userProvidersRelations = relations(userProviders, ({one}) => ({
	user: one(users, {
		fields: [userProviders.userId],
		references: [users.userId]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	userProviders: many(userProviders),
}));