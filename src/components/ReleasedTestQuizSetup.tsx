
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateReleasedTestQuizAction } from "@/lib/actions";
import type { Quiz, GeneratedQuizQuestion, ReleasedTestQuizSetupFormValues } from "@/lib/types";
import { BookMarked, Loader2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const releasedTestQuizSetupSchema = z.object({
  county: z.string().min(3, "County/Region must be at least 3 characters long."),
  unit: z.string().min(3, "Unit/Subject must be at least 3 characters long."),
  numQuestions: z.coerce.number().min(1, "Number of questions must be at least 1.").max(100, "Max 100 questions."),
});


export function ReleasedTestQuizSetup() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [, setCurrentQuiz] = useLocalStorage<Quiz | null>("quizzicalai_currentQuiz", null);

  const form = useForm<ReleasedTestQuizSetupFormValues>({
    resolver: zodResolver(releasedTestQuizSetupSchema),
    defaultValues: {
      county: "",
      unit: "",
      numQuestions: 10,
    },
  });

  const onSubmit: SubmitHandler<ReleasedTestQuizSetupFormValues> = async (values) => {
    setIsLoading(true);
    try {
      const result = await handleGenerateReleasedTestQuizAction(values.county, values.unit, values.numQuestions);
      if (result.success && result.data) {
        const newQuiz: Quiz = {
          topic: `Released Test: ${values.unit} (${values.county})`,
          questions: result.data.quiz.map((q: GeneratedQuizQuestion) => ({
            ...q,
            userAnswer: undefined,
            aiExplanation: undefined,
            isCorrect: undefined,
            hintUsed: false,
            hintText: undefined,
          })),
          scoringSystemContext: result.data.scoringSystemContext,
        };
        setCurrentQuiz(newQuiz);
        toast({ title: "Quiz Generated!", description: `Your quiz based on released tests for "${values.unit}" is ready.` });
        router.push("/quiz");
      } else {
        toast({ variant: "destructive", title: "Error", description: result.error || "Failed to generate quiz from released tests." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-center text-primary flex items-center justify-center gap-2">
          <BookMarked className="w-8 h-8" /> Create Quiz from Released Tests
        </CardTitle>
        <CardDescription className="text-center pt-2">
          Enter a county/region and educational unit/subject to find questions (up to 100) from publicly available released tests. The AI may also include relevant images.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="county"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>County/Region</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Fairfax County, Virginia; California" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Educational Unit/Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Grade 8 Science, AP US History, NC EOG Math Grade 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="numQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Questions (approximate)</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" max="100" {...field} />
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
                  Searching & Generating...
                </>
              ) : (
                <>
                  <BookMarked className="mr-2 h-4 w-4" />
                  Generate Released Test Quiz
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
