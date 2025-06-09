
"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { handleSolveQuestionAction } from "@/lib/actions";
import type { SolveQuestionOutput } from "@/lib/types";
import { Loader2, CheckSquare, Brain, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRecentActivity } from "@/hooks/useRecentActivity"; // Import the hook


const solverFormSchema = z.object({
  questionText: z.string().min(10, "Question must be at least 10 characters.").max(5000, "Question is too long (max 5000 chars)."),
});
type SolverFormValues = z.infer<typeof solverFormSchema>;

export function QuestionSolver() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<SolveQuestionOutput | null>(null);
  const { addActivity } = useRecentActivity(); // Get the addActivity function


  const form = useForm<SolverFormValues>({
    resolver: zodResolver(solverFormSchema),
    defaultValues: {
      questionText: "",
    },
  });

  const onSubmit: SubmitHandler<SolverFormValues> = async (values) => {
    setIsLoading(true);
    setSolution(null); 
    try {
      const result = await handleSolveQuestionAction(values.questionText);
      if (result.success && result.data) {
        setSolution(result.data);
        addActivity('solve', `Solved a question starting with: "${values.questionText.substring(0, 30)}..."`);
        toast({ title: "Solution Generated!", icon: <Sparkles className="h-5 w-5 text-yellow-400" /> });
      } else {
        toast({ variant: "destructive", title: "Error", description: result.error || "Failed to solve the question." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-center text-primary flex items-center justify-center gap-2">
          <Brain className="w-8 h-8" /> AI Question Solver
        </CardTitle>
        <CardDescription className="text-center pt-2">
          Paste a question and let AI provide a solution and explanation.
          Please ensure the question is clear and complete for the best results.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="questionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your question here..."
                      {...field}
                      rows={5}
                      className="min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Solving...
                </>
              ) : (
                <>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Solve Question
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>

      {isLoading && (
        <div className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">AI is thinking...</p>
        </div>
      )}

      {solution && !isLoading && (
        <div className="p-6 border-t">
          <Alert variant="default" className="bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-600">
            <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-700 dark:text-green-300 text-xl font-semibold">AI Solution</AlertTitle>
            <AlertDescription className="mt-2">
              <h3 className="font-semibold text-lg mb-1 text-foreground">Solution Steps:</h3>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap p-3 bg-card rounded-md border">
                {solution.solution}
              </div>
              {solution.explanation && (
                <>
                  <h3 className="font-semibold text-lg mt-4 mb-1 text-foreground">Explanation:</h3>
                   <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap p-3 bg-card rounded-md border">
                    {solution.explanation}
                  </div>
                </>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  );
}
