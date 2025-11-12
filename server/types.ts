import {users, userProviders} from "./drizzle/schema";

export type User = typeof users.$inferInsert;
export type UserProvider = typeof userProviders.$inferInsert;