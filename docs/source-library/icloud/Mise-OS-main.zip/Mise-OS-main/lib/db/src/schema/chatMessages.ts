import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

/**
 * Kitchen Comms chat. Message bodies are encrypted at rest with AES-256-GCM:
 * `ciphertext`, `iv`, and `authTag` are base64-encoded components. The plaintext
 * is never stored. Decryption happens only in the API layer when serving reads.
 */
export const chatMessagesTable = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  agent: text("agent").notNull(),
  department: text("department").notNull(),
  role: text("role").notNull(),
  messageType: text("message_type").notNull().default("normal"),
  ciphertext: text("ciphertext").notNull(),
  iv: text("iv").notNull(),
  authTag: text("auth_tag").notNull(),
  postedToSlack: boolean("posted_to_slack").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessagesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessageRow = typeof chatMessagesTable.$inferSelect;
