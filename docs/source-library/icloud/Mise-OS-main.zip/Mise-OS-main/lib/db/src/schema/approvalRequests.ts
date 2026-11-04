import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { orchestrationJobsTable } from "./orchestrationJobs";

export const approvalRequestsTable = pgTable("approval_requests", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull().references(() => orchestrationJobsTable.id),
  characterName: text("character_name").notNull(),
  department: text("department").notNull(),
  riskLevel: text("risk_level").notNull().default("medium"),
  proposedAction: text("proposed_action").notNull(),
  sqlPreview: text("sql_preview"),
  status: text("status").notNull().default("pending"),
  resolvedBy: text("resolved_by"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertApprovalRequestSchema = createInsertSchema(approvalRequestsTable).omit({ id: true, createdAt: true, resolvedAt: true, resolvedBy: true, status: true });
export type InsertApprovalRequest = z.infer<typeof insertApprovalRequestSchema>;
export type ApprovalRequest = typeof approvalRequestsTable.$inferSelect;
