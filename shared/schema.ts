import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  resumeText: text("resume_text").notNull(),
  jobRole: text("job_role").notNull(),
  experienceLevel: text("experience_level").notNull(),
  targetCountry: text("target_country").notNull(),
  atsScore: integer("ats_score").notNull(),
  analysisResult: jsonb("analysis_result").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({ 
  id: true, 
  createdAt: true, 
  atsScore: true, 
  analysisResult: true 
});

export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;

export const analysisResultSchema = z.object({
  atsScore: z.number(),
  status: z.string(), // "ATS Friendly" or "Needs Improvement"
  topIssues: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  formattingProblems: z.array(z.string()),
  improvementSuggestions: z.array(z.string()),
  finalVerdict: z.string(),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

export const analyzeResumeSchema = insertAnalysisSchema;
export type AnalyzeResumeRequest = z.infer<typeof analyzeResumeSchema>;
