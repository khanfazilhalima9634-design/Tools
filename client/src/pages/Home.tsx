import { useState } from "react";
import { useSubmitAnalysis } from "@/hooks/use-analyze";
import { ResumeForm } from "@/components/ResumeForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { useToast } from "@/hooks/use-toast";
import type { AnalysisResult } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, History } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { mutate, isPending } = useSubmitAnalysis();
  const { toast } = useToast();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = (data: any) => {
    mutate(data, {
      onSuccess: (response) => {
        setResult(response.analysisResult);
        toast({
          title: "Analysis Complete",
          description: "Scroll down to see your ATS score and feedback.",
        });
        
        // Smooth scroll to results
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      onError: (error) => {
        toast({
          title: "Analysis Failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-foreground text-background py-16 md:py-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="p-3 bg-primary rounded-xl shadow-lg shadow-primary/30">
                <FileText className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">ATS Resume Checker</h1>
                <p className="text-muted-foreground mt-1">AI-Powered Analysis & Optimization</p>
              </div>
            </motion.div>

            <Link href="/history">
              <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white gap-2">
                <History className="w-4 h-4" />
                View History
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area - overlaps hero */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ResumeForm onSubmit={handleSubmit} isPending={isPending} />
          </motion.div>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                id="results-section"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="py-8">
                  <h2 className="text-2xl font-display font-bold mb-6 text-foreground flex items-center gap-2">
                    Analysis Results
                    <div className="h-px flex-1 bg-border ml-4" />
                  </h2>
                  <ResultsDisplay result={result} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
