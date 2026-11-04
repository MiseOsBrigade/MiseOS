import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const orchestrationJobsTable = pgTable("orchestration_jobs", {
  id: serial("id").primaryKey(),
  triggerEvent: text("trigger_event").notNull(),
  status: text("status").notNull().default("Queued"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const insertOrchestrationJobSchema = createInsertSchema(orchestrationJobsTable).omit({ id: true, startedAt: true, completedAt: true });
export type InsertOrchestrationJob = z.infer<typeof insertOrchestrationJobSchema>;
export type OrchestrationJob = typeof orchestrationJobsTable.$inferSelect;
