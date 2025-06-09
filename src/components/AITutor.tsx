
"use client";

import { useState, useEffect } from "react";
import type { QuizQuestion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { handleExplainAnswerAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lightbulb, MessageCircle, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label"; // Corrected import

interface AITutorProps {
  question: QuizQuestion;
  onExplanationFetched: (questionIndex: number, explanation: string, userSubmittedReasoning?: string) => void;
  questionIndex: number;
}

export function AITutor({ question, onExplanationFetched, questionIndex }: AITutorProps) {
  const [currentAiExplanation, setCurrentAiExplanation] = useState<string | null>(question.aiExplanation || null);
  const [userReasoningInput, setUserReasoningInput] = useState<string>("");
  const [submittedReasoning, setSubmittedReasoning] = useState<string | null>(question.userSubmittedReasoning || null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchExplanation = async (reasoning?: string) => {
    if (!question.userAnswer) {
      toast({ variant: "destructive", title: "Cannot get explanation", description: "You did not answer this question." });
      return;
    }

    setIsLoading(true);
    try {
      const result = await handleExplainAnswerAction(
        question.question,
        question.userAnswer,
        question.correctAnswer,
        reasoning // Pass user's reasoning if available
      );
      if (result.success && result.data?.explanation) {
        setCurrentAiExplanation(result.data.explanation);
        onExplanationFetched(questionIndex, result.data.explanation, reasoning);
        if (reasoning) {
          setSubmittedReasoning(reasoning);
        }
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
  
  useEffect(() => {
    if (!question.aiExplanation && question.userAnswer && !question.isCorrect && !isLoading && !currentAiExplanation && !submittedReasoning) {
      fetchExplanation(); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.aiExplanation, question.userAnswer, question.isCorrect, submittedReasoning]);

  const handleSubmitReasoning = () => {
    if (!userReasoningInput.trim()) {
      toast({ variant: "destructive", title: "Empty Reasoning", description: "Please explain your thought process." });
      return;
    }
    fetchExplanation(userReasoningInput);
  };

  if (question.isCorrect) {
    return null; 
  }
  
  if (!question.userAnswer) {
     return <p className="text-sm text-muted-foreground mt-2">You did not answer this question.</p>;
  }

  return (
    <div className="mt-4 space-y-3">
      {!submittedReasoning && !currentAiExplanation && !isLoading && (
        <Button onClick={() => fetchExplanation()} variant="outline" size="sm" disabled={isLoading}>
           <MessageCircle className="mr-2 h-4 w-4" /> Get AI Explanation
        </Button>
      )}

      {isLoading && (
        <div className="flex items-center text-muted-foreground text-sm">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Getting explanation...</span>
        </div>
      )}

      {!submittedReasoning && !question.isCorrect && question.userAnswer && (
        <div className="space-y-2">
          <Label htmlFor={`reasoning-${questionIndex}`} className="text-sm font-medium">Explain your reasoning for your answer:</Label>
          <Textarea
            id={`reasoning-${questionIndex}`}
            value={userReasoningInput}
            onChange={(e) => setUserReasoningInput(e.target.value)}
            placeholder="Why did you choose your answer?"
            className="min-h-[80px]"
            disabled={isLoading}
          />
          <Button onClick={handleSubmitReasoning} size="sm" disabled={isLoading || !userReasoningInput.trim()}>
            <Send className="mr-2 h-4 w-4" /> Submit Reasoning & Get Tailored Feedback
          </Button>
        </div>
      )}
      
      {submittedReasoning && (
        <Card className="mt-2 bg-muted/20 border-border/70">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-sm font-semibold text-foreground">Your Reasoning:</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap italic">"{submittedReasoning}"</p>
          </CardContent>
        </Card>
      )}

      {currentAiExplanation && (
        <Card className="mt-2 bg-secondary/30 border-accent">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-md flex items-center gap-2 text-accent font-headline">
              <Lightbulb className="h-5 w-5" /> AI Tutor Says:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{currentAiExplanation}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
