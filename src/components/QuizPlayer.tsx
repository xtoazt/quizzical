
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Quiz, QuizQuestion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ArrowLeft, ArrowRight, CheckSquare, Lightbulb, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleGetHintAction } from "@/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface QuizPlayerProps {
  initialQuiz: Quiz;
}

export function QuizPlayer({ initialQuiz }: QuizPlayerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentQuiz, setCurrentQuiz] = useLocalStorage<Quiz | null>("quizzicalai_currentQuiz", initialQuiz);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [progressValue, setProgressValue] = useState(0);
  const [isHintLoading, setIsHintLoading] = useState(false);

  useEffect(() => {
    if (currentQuiz) {
      const newProgress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
      setProgressValue(newProgress);
    }
  }, [currentQuestionIndex, currentQuiz]);
  
  useEffect(() => {
    if (currentQuiz?.questions) {
      const initialAnswers: Record<number, string> = {};
      currentQuiz.questions.forEach((q, index) => {
        if (q.userAnswer) {
          initialAnswers[index] = q.userAnswer;
        }
      });
      setSelectedAnswers(initialAnswers);
    }
  }, [currentQuiz?.questions]);


  if (!currentQuiz || !currentQuiz.questions || currentQuiz.questions.length === 0) {
    return <div className="text-center p-8">Quiz data is missing or invalid.</div>;
  }

  const currentQuestion: QuizQuestion = currentQuiz.questions[currentQuestionIndex];

  const handleAnswerSelect = (option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: option }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    const updatedQuestions = currentQuiz.questions.map((q, index) => ({
      ...q,
      userAnswer: selectedAnswers[index] || undefined,
      isCorrect: selectedAnswers[index] === q.correctAnswer,
    }));
    
    const updatedQuiz: Quiz = { ...currentQuiz, questions: updatedQuestions };
    setCurrentQuiz(updatedQuiz);
    router.push("/results");
  };

  const getHint = async () => {
    if (!currentQuiz || currentQuestion.hintUsed || selectedAnswers[currentQuestionIndex]) return;
    setIsHintLoading(true);
    try {
      const result = await handleGetHintAction(currentQuestion.question, currentQuestion.options);
      if (result.success && result.data?.hint) {
        const updatedQuestions = [...currentQuiz.questions];
        updatedQuestions[currentQuestionIndex] = {
          ...updatedQuestions[currentQuestionIndex],
          hintUsed: true,
          hintText: result.data.hint,
        };
        setCurrentQuiz({ ...currentQuiz, questions: updatedQuestions });
        toast({ title: "Hint Unlocked!", description: "Your score for this question will be halved if correct.", icon: <Lightbulb className="h-5 w-5 text-yellow-400" /> });
      } else {
        toast({ variant: "destructive", title: "Hint Error", description: result.error || "Could not fetch hint." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Hint Error", description: "An unexpected error occurred." });
    } finally {
      setIsHintLoading(false);
    }
  };

  const canGetHint = !currentQuestion.hintUsed && !selectedAnswers[currentQuestionIndex];

  return (
    <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">
            Quiz: {currentQuiz.topic}
          </CardTitle>
          <CardDescription>
            Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
          </CardDescription>
          <Progress value={progressValue} className="w-full mt-2" />
        </CardHeader>
        <CardContent className="space-y-6 min-h-[250px]">
          <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>

          {currentQuestion.imageUrl && (
            <div className="my-4 flex justify-center">
              <Image 
                src={currentQuestion.imageUrl} 
                alt={currentQuestion.imageDescription || "Question image"} 
                width={400} 
                height={300} 
                className="rounded-md object-contain"
                data-ai-hint="diagram chart" 
              />
            </div>
          )}
          {currentQuestion.imageDescription && !currentQuestion.imageUrl && (
            <p className="my-2 text-sm text-muted-foreground italic text-center">Visual element: {currentQuestion.imageDescription}</p>
          )}

          <RadioGroup
            value={selectedAnswers[currentQuestionIndex] || ""}
            onValueChange={handleAnswerSelect}
            className="space-y-2"
            disabled={!!selectedAnswers[currentQuestionIndex]}
          >
            {currentQuestion.options.map((option, idx) => (
              <div key={idx} className={`flex items-center space-x-2 p-3 border rounded-md transition-colors ${selectedAnswers[currentQuestionIndex] ? (option === currentQuestion.correctAnswer ? 'bg-green-100 dark:bg-green-900 border-green-500' : (option === selectedAnswers[currentQuestionIndex] ? 'bg-red-100 dark:bg-red-900 border-red-500' : '')) : 'hover:bg-secondary/50'}`}>
                <RadioGroupItem value={option} id={`option-${idx}`} disabled={!!selectedAnswers[currentQuestionIndex]} />
                <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer text-base">{option}</Label>
              </div>
            ))}
          </RadioGroup>

          {currentQuestion.hintText && (
            <Alert variant="default" className="mt-4 bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              <AlertTitle className="text-blue-700 dark:text-blue-300">Hint</AlertTitle>
              <AlertDescription className="text-blue-600 dark:text-blue-400">
                {currentQuestion.hintText}
              </AlertDescription>
            </Alert>
          )}

        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={getHint} 
              disabled={!canGetHint || isHintLoading || !!selectedAnswers[currentQuestionIndex]}
              className="w-full sm:w-auto"
            >
              {isHintLoading ? <Loader2 className="animate-spin" /> : <Lightbulb />}
              Get Hint
            </Button>
            {currentQuestion.hintUsed && <p className="text-xs text-muted-foreground text-center sm:text-left mt-1">Hint used (score halved if correct)</p>}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="flex-1 sm:flex-initial">
              <ArrowLeft /> Previous
            </Button>
            {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
              <Button variant="default" onClick={handleSubmitQuiz} disabled={!selectedAnswers[currentQuestionIndex]} className="flex-1 sm:flex-initial">
                <CheckSquare/> Submit Quiz
              </Button>
            ) : (
              <Button variant="default" onClick={handleNext} disabled={!selectedAnswers[currentQuestionIndex]} className="flex-1 sm:flex-initial">
                Next <ArrowRight />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
