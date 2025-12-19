import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAnalysisSchema, type InsertAnalysis } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";

interface ResumeFormProps {
  onSubmit: (data: InsertAnalysis) => void;
  isPending: boolean;
}

export function ResumeForm({ onSubmit, isPending }: ResumeFormProps) {
  const form = useForm<InsertAnalysis>({
    resolver: zodResolver(insertAnalysisSchema),
    defaultValues: {
      resumeText: "",
      jobRole: "",
      experienceLevel: "Fresher",
      targetCountry: "Global",
    },
  });

  return (
    <Card className="border-border/50 shadow-xl shadow-primary/5">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="jobRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Target Job Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Senior Frontend Engineer" {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Experience</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Fresher">Fresher (0-1y)</SelectItem>
                          <SelectItem value="1-3 Years">1-3 Years</SelectItem>
                          <SelectItem value="3-5 Years">3-5 Years</SelectItem>
                          <SelectItem value="5+ Years">5+ Years</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Region</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Target Country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Global">Global</SelectItem>
                          <SelectItem value="USA">USA</SelectItem>
                          <SelectItem value="UK">UK</SelectItem>
                          <SelectItem value="EU">EU</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="resumeText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center justify-between">
                    Resume Content
                    <span className="text-xs font-normal text-muted-foreground">Paste your resume text here</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Copy and paste your resume text here..." 
                      className="min-h-[250px] font-mono text-sm leading-relaxed resize-y focus:ring-primary/20" 
                      {...field}
                      data-testid="textarea-resume"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Analyze My Resume
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
