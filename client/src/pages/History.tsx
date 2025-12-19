import { useAnalysisHistory } from "@/hooks/use-analyze";
import { Link } from "wouter";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Calendar, User, Globe, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function History() {
  const { data: analyses, isLoading, error } = useAnalysisHistory();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">Failed to load history</p>
        <Link href="/">
          <Button>Go Back</Button>
        </Link>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold">Analysis History</h1>
            <p className="text-muted-foreground">Previous resume scans and scores</p>
          </div>
        </div>

        {analyses?.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-card/50">
            <h3 className="text-xl font-medium text-muted-foreground">No analyses yet</h3>
            <p className="text-sm text-muted-foreground/80 mt-2">Submit your first resume to see it here.</p>
            <Link href="/">
              <Button className="mt-6" variant="secondary">Go to Scanner</Button>
            </Link>
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4"
          >
            {analyses?.map((analysis) => {
              const result = analysis.analysisResult as any;
              return (
                <motion.div key={analysis.id} variants={item}>
                  <Card className="hover:shadow-md transition-shadow group cursor-default">
                    <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-lg text-primary">{analysis.jobRole}</h3>
                          <Badge variant="outline" className="font-mono text-xs text-muted-foreground">
                            {analysis.experienceLevel}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Globe className="w-4 h-4" />
                            {analysis.targetCountry}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {analysis.createdAt && format(new Date(analysis.createdAt), "PPP")}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                        <div className="text-right">
                          <p className="text-xs font-medium uppercase text-muted-foreground mb-1">Status</p>
                          <Badge variant={result.atsScore >= 70 ? "default" : "secondary"}>
                            {result.status}
                          </Badge>
                        </div>

                        <div className="flex flex-col items-center min-w-[80px]">
                           <span className="text-xs font-medium uppercase text-muted-foreground mb-1">Score</span>
                           <div className={`text-2xl font-bold font-display ${
                             result.atsScore >= 70 ? "text-green-600 dark:text-green-400" : 
                             result.atsScore >= 50 ? "text-primary" : "text-destructive"
                           }`}>
                             {result.atsScore}
                           </div>
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
