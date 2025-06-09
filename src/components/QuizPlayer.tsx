"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Quiz, QuizQuestion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ArrowLeft, ArrowRight, CheckSquare } from "lucide-react";

interface QuizPlayerProps {
  initialQuiz: Quiz;
}

export function QuizPlayer({ initialQuiz }: QuizPlayerProps) {
  const router = useRouter();
  const [currentQuiz, setCurrentQuiz] = useLocalStorage<Quiz | null>("quizzicalai_currentQuiz", initialQuiz);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentQuiz) {
      const newProgress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
      setProgress(newProgress);
    }
  }, [currentQuestionIndex, currentQuiz]);
  
  useEffect(() => {
    // Initialize selectedAnswers from currentQuiz if available (e.g. user revisits page)
    if (currentQuiz?.questions) {
      const initialAnswers: Record<number, string> = {};
      currentQuiz.questions.forEach((q, index) => {
        if (q.userAnswer) {
          initialAnswers[index] = q.userAnswer;
        }
      });
      setSelectedAnswers(initialAnswers);
    }
  }, [currentQuiz]);


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
          <Progress value={progress} className="w-full mt-2" />
        </CardHeader>
        <CardContent className="space-y-6 min-h-[200px]">
          <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>
          <RadioGroup
            value={selectedAnswers[currentQuestionIndex] || ""}
            onValueChange={handleAnswerSelect}
            className="space-y-2"
          >
            {currentQuestion.options.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-secondary/50 transition-colors">
                <RadioGroupItem value={option} id={`option-${idx}`} />
                <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer text-base">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
            <Button variant="default" onClick={handleSubmitQuiz} disabled={!selectedAnswers[currentQuestionIndex]}>
              <CheckSquare className="mr-2 h-4 w-4" /> Submit Quiz
            </Button>
          ) : (
            <Button variant="default" onClick={handleNext} disabled={!selectedAnswers[currentQuestionIndex]}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
