
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Example users table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
