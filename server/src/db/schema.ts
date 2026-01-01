import { pgTable, text, timestamp, uuid, boolean, pgEnum, AnyPgColumn } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
    id: uuid("id").primaryKey(), // auth.users.id
    name: text("name"),
    bio: text("bio"),
    avatarUrl: text("avatar_url"),
    collegeName: text("college_name"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const organizations = pgTable("organizations", {
    id: uuid("id")
        .defaultRandom()
        .primaryKey(),

    name: text("name").notNull(),
    description: text("description"),

    // creator / owner
    createdBy: uuid("created_by")
        .references(() => profiles.id)
        .notNull(),

    // optional org settings
    isPublic: boolean("is_public").default(false),
    avatar : text("avatar_url"),

    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const organizationRoleEnum = pgEnum("organization_role", [
    "owner",
    "admin",
    "member",
]);

export const organizationMembers = pgTable("organization_members", {
    id: uuid("id")
        .defaultRandom()
        .primaryKey(),

    organizationId: uuid("organization_id")
        .references(() => organizations.id, { onDelete: "cascade" })
        .notNull(),

    profileId: uuid("profile_id")
        .references(() => profiles.id, { onDelete: "cascade" })
        .notNull(),

    role: organizationRoleEnum("role")
        .default("member")
        .notNull(),

    joinedAt: timestamp("joined_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const channels = pgTable("channels", {
    id: uuid("id")
        .defaultRandom()
        .primaryKey(),

    organizationId: uuid("organization_id")
        .references(() => organizations.id, { onDelete: "cascade" })
        .notNull(),

    // NULL → subject channel
    // NOT NULL → sub-channel
    parentChannelId: uuid("parent_channel_id")
        .references((): AnyPgColumn => channels.id, { onDelete: "cascade" }),

    name: text("name").notNull(),

    createdBy: uuid("created_by")
        .references(() => profiles.id)
        .notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const messages = pgTable("messages", {
    id: uuid("id")
        .defaultRandom()
        .primaryKey(),

    channelId: uuid("channel_id")
        .references(() => channels.id, { onDelete: "cascade" })
        .notNull(),

    senderId: uuid("sender_id")
        .references(() => profiles.id, { onDelete: "cascade" })
        .notNull(),

    content: text("content"),

    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export type Channel = typeof channels.$inferSelect;
