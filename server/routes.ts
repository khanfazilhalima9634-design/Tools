import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024.
// do not download this model, this is just for your reference.
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SYSTEM_PROMPT = `You are a professional ATS Resume Checker designed for the GLOBAL job market.
Your task is to analyze the given resume text and evaluate it based on international ATS and recruiter standards.

Evaluate on:
1. ATS Compatibility
2. Keyword & Skill Matching
3. Resume Structure & Formatting
4. Content Quality
5. Global Hiring Standards

Return a JSON object STRICTLY matching this structure:
{
  "atsScore": number (0-100),
  "status": "ATS Friendly" | "Needs Improvement",
  "topIssues": string[],
  "missingKeywords": string[],
  "formattingProblems": string[],
  "improvementSuggestions": string[],
  "finalVerdict": string (YES/MAYBE/NO and 2-3 short lines explanation)
}`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.analyze.submit.path, async (req, res) => {
    try {
      const input = api.analyze.submit.input.parse(req.body);

      const prompt = `
Job Role: ${input.jobRole}
Experience Level: ${input.experienceLevel}
Target Country: ${input.targetCountry}

Resume Content:
${input.resumeText}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content received from AI");
      }

      const result = JSON.parse(content);
      
      const analysis = await storage.createAnalysis({
        ...input,
        atsScore: result.atsScore,
        analysisResult: result
      });

      res.json(analysis);
    } catch (err) {
      console.error('Analysis error:', err);
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message
        });
      } else {
        res.status(500).json({
          message: "Failed to analyze resume"
        });
      }
    }
  });

  app.get(api.analyze.list.path, async (req, res) => {
    const history = await storage.getAnalyses();
    res.json(history);
  });

  return httpServer;
}
