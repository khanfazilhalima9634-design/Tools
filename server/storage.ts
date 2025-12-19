import { db } from "./db";
import {
  analyses,
  type InsertAnalysis,
  type Analysis,
  type AnalysisResult
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createAnalysis(analysis: InsertAnalysis & { atsScore: number, analysisResult: AnalysisResult }): Promise<Analysis>;
  getAnalyses(): Promise<Analysis[]>;
  getAnalysis(id: number): Promise<Analysis | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createAnalysis(analysis: InsertAnalysis & { atsScore: number, analysisResult: AnalysisResult }): Promise<Analysis> {
    const [created] = await db.insert(analyses).values(analysis).returning();
    return created;
  }

  async getAnalyses(): Promise<Analysis[]> {
    return await db.select().from(analyses).orderBy(desc(analyses.createdAt));
  }

  async getAnalysis(id: number): Promise<Analysis | undefined> {
    const [analysis] = await db.select().from(analyses).where(eq(analyses.id, id));
    return analysis;
  }
}

export const storage = new DatabaseStorage();
