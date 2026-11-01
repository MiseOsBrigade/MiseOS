import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { orchestrationJobsTable } from "./orchestrationJobs";

export const agentInstancesTable = pgTable("agent_instances", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull().references(() => orchestrationJobsTable.id),
  characterId: integer("character_id").notNull(),
  characterName: text("character_name").notNull(),
  department: text("department").notNull(),
  state: text("state").notNull().default("Idle"),
  tokenUsage: integer("token_usage").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAgentInstanceSchema = createInsertSchema(agentInstancesTable).omit({ id: true, createdAt: true });
export type InsertAgentInstance = z.infer<typeof insertAgentInstanceSchema>;
export type AgentInstance = typeof agentInstancesTable.$inferSelect;
