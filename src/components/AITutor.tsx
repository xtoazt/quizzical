"use client";

import { useState, useEffect } from "react";
import type { QuizQuestion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { handleExplainAnswerAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lightbulb, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AITutorProps {
  question: QuizQuestion;
  onExplanationFetched: (questionIndex: number, explanation: string) => void;
  questionIndex: number;
}

export function AITutor({ question, onExplanationFetched, questionIndex }: AITutorProps) {
  const [explanation, setExplanation] = useState<string | null>(question.aiExplanation || null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchExplanation = async () => {
    if (!question.userAnswer) {
      toast({ variant: "destructive", title: "Cannot get explanation", description: "You did not answer this question." });
      return;
    }
    if (question.isCorrect) {
       toast({ title: "Correct!", description: "No explanation needed for a correct answer." });
      return;
    }

    setIsLoading(true);
    try {
      const result = await handleExplainAnswerAction(
        question.question,
        question.userAnswer,
        question.correctAnswer
      );
      if (result.success && result.data?.explanation) {
        setExplanation(result.data.explanation);
        onExplanationFetched(questionIndex, result.data.explanation);
        toast({ title: "Explanation Ready", icon: <Lightbulb className="h-5 w-5 text-yellow-400" /> });
      } else {
        toast({ variant: "destructive", title: "Error", description: result.error || "Failed to get explanation." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Automatically fetch explanation if not already fetched and answer is incorrect
  useEffect(() => {
    if (!question.aiExplanation && question.userAnswer && !question.isCorrect && !isLoading && !explanation) {
      fetchExplanation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.aiExplanation, question.userAnswer, question.isCorrect]);


  if (question.isCorrect) {
    return null; // Don't show tutor for correct answers
  }
  
  if (!question.userAnswer) {
     return <p className="text-sm text-muted-foreground mt-2">You did not answer this question.</p>;
  }

  return (
    <div className="mt-4">
      {!explanation && !isLoading && (
        <Button onClick={fetchExplanation} variant="outline" size="sm" disabled={isLoading}>
           <MessageCircle className="mr-2 h-4 w-4" /> Get AI Explanation
        </Button>
      )}
      {isLoading && (
        <div className="flex items-center text-muted-foreground text-sm">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Getting explanation...</span>
        </div>
      )}
      {explanation && (
        <Card className="mt-2 bg-secondary/30 border-accent">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-md flex items-center gap-2 text-accent font-headline">
              <Lightbulb className="h-5 w-5" /> AI Tutor Says:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{explanation}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
