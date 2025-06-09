
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateQuizAction } from "@/lib/actions";
import type { Quiz, GeneratedQuizQuestion, QuizSetupFormValues } from "@/lib/types";
import { quizSetupSchema } from "@/lib/types"; // Import schema from types
import { Sparkles, Loader2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function QuizSetup() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [, setCurrentQuiz] = useLocalStorage<Quiz | null>("quizzicalai_currentQuiz", null);

  const form = useForm<QuizSetupFormValues>({
    resolver: zodResolver(quizSetupSchema),
    defaultValues: {
      topic: "",
      numQuestions: 10, // Default to 10
    },
  });

  const onSubmit: SubmitHandler<QuizSetupFormValues> = async (values) => {
    setIsLoading(true);
    try {
      const result = await handleGenerateQuizAction(values.topic, values.numQuestions);
      if (result.success && result.data) {
        const newQuiz: Quiz = {
          topic: values.topic,
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
        toast({ title: "Quiz Generated!", description: `Your quiz on "${values.topic}" is ready.` });
        router.push("/quiz");
      } else {
        toast({ variant: "destructive", title: "Error", description: result.error || "Failed to generate quiz." });
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
          <Sparkles className="w-8 h-8" /> Create Quiz by Topic
        </CardTitle>
        <CardDescription className="text-center pt-2">
          Enter a topic and number of questions (up to 100) to generate a new quiz using AI.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., World War II, Photosynthesis" {...field} />
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
                  <FormLabel>Number of Questions</FormLabel>
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
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Topic Quiz
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
