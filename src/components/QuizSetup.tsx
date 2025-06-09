"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateQuizAction } from "@/lib/actions";
import type { Quiz, GeneratedQuizQuestion } from "@/lib/types";
import { Sparkles, Loader2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const quizSetupSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  numQuestions: z.coerce.number().min(1, "Number of questions must be at least 1.").max(20, "Max 20 questions."),
});

type QuizSetupFormValues = z.infer<typeof quizSetupSchema>;

export function QuizSetup() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [, setCurrentQuiz] = useLocalStorage<Quiz | null>("quizzicalai_currentQuiz", null);

  const form = useForm<QuizSetupFormValues>({
    resolver: zodResolver(quizSetupSchema),
    defaultValues: {
      topic: "",
      numQuestions: 5,
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
          })),
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
    <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center text-primary flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8" /> Create Your Quiz
          </CardTitle>
          <CardDescription className="text-center pt-2">
            Enter a topic and number of questions to generate a new quiz using AI.
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
                      <Input type="number" min="1" max="20" {...field} />
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
                    Generate Quiz
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
