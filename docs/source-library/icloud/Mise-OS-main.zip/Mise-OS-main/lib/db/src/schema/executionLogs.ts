import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const executionLogsTable = pgTable("execution_logs", {
  id: serial("id").primaryKey(),
  instanceId: integer("instance_id"),
  jobId: integer("job_id"),
  characterName: text("character_name").notNull(),
  department: text("department").notNull(),
  logLevel: text("log_level").notNull().default("INFO"),
  message: text("message").notNull(),
  actionTaken: text("action_taken"),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
});

export const insertExecutionLogSchema = createInsertSchema(executionLogsTable).omit({ id: true, timestamp: true });
export type InsertExecutionLog = z.infer<typeof insertExecutionLogSchema>;
export type ExecutionLog = typeof executionLogsTable.$inferSelect;
