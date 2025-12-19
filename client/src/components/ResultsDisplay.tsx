import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lightbulb, 
  FileText,
  Search,
  LayoutTemplate
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreGauge } from "./ScoreGauge";
import type { AnalysisResult } from "@shared/schema";

interface ResultsDisplayProps {
  result: AnalysisResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <motion.div variants={item} className="md:col-span-1">
          <Card className="h-full border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <ScoreGauge score={result.atsScore} />
              <div className="mt-4 flex justify-center">
                <Badge variant={result.atsScore >= 70 ? "default" : "destructive"} className="px-4 py-1.5 text-sm">
                  {result.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Verdict Card */}
        <motion.div variants={item} className="md:col-span-2">
          <Card className="h-full border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-primary">
                <Lightbulb className="w-5 h-5" />
                Final Verdict
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-foreground/90 font-medium">
                {result.finalVerdict}
              </p>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-background/50 border border-border/50 flex flex-col items-center text-center gap-2">
                  <div className="p-2 rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Critical Issues</span>
                  <span className="text-xl font-bold">{result.topIssues.length}</span>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/50 flex flex-col items-center text-center gap-2">
                  <div className="p-2 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Missing Keywords</span>
                  <span className="text-xl font-bold">{result.missingKeywords.length}</span>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/50 flex flex-col items-center text-center gap-2">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <LayoutTemplate className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Formatting</span>
                  <span className="text-xl font-bold">{result.formattingProblems.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Issues */}
        <motion.div variants={item}>
          <Card className="h-full border-l-4 border-l-destructive shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" />
                Top Issues to Fix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.topIssues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 text-sm">
                    <span className="mt-0.5 text-destructive">•</span>
                    {issue}
                  </li>
                ))}
                {result.topIssues.length === 0 && (
                  <p className="text-muted-foreground italic">Great job! No critical issues found.</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Missing Keywords */}
        <motion.div variants={item}>
          <Card className="h-full border-l-4 border-l-amber-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-500" />
                Missing Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((keyword, i) => (
                  <Badge key={i} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                    {keyword}
                  </Badge>
                ))}
                {result.missingKeywords.length === 0 && (
                  <p className="text-muted-foreground italic">Your resume is well-optimized with keywords!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Formatting Problems */}
        <motion.div variants={item}>
          <Card className="h-full border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-blue-500" />
                Formatting Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.formattingProblems.map((prob, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 text-sm">
                    <span className="mt-0.5 text-blue-500">•</span>
                    {prob}
                  </li>
                ))}
                 {result.formattingProblems.length === 0 && (
                  <p className="text-muted-foreground italic">Formatting looks clean and ATS-friendly.</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Improvement Suggestions */}
        <motion.div variants={item}>
          <Card className="h-full border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Improvement Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.improvementSuggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50 dark:bg-green-900/10 text-sm">
                    <div className="mt-0.5 min-w-[1.25rem] h-5 flex items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400 text-xs font-bold">
                      {i + 1}
                    </div>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
