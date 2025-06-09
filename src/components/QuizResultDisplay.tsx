
"use client";

import type { Quiz } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AITutor } from "@/components/AITutor";
import { CheckCircle2, XCircle, PercentIcon, Lightbulb, Info } from "lucide-react";
import Link from "next/link";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface QuizResultDisplayProps {
  quizResults: Quiz;
}

export function QuizResultDisplay({ quizResults: initialQuizResults }: QuizResultDisplayProps) {
  const [quizResults, setQuizResults] = useLocalStorage<Quiz | null>("quizzicalai_currentQuiz", initialQuizResults);

  if (!quizResults || !quizResults.questions) {
    return <p>No quiz results found.</p>;
  }

  const totalQuestions = quizResults.questions.length;
  
  let effectiveCorrectAnswers = 0;
  quizResults.questions.forEach(q => {
    if (q.isCorrect) {
      effectiveCorrectAnswers += q.hintUsed ? 0.5 : 1;
    }
  });
  
  const scorePercentage = totalQuestions > 0 ? (effectiveCorrectAnswers / totalQuestions) * 100 : 0;

  const handleExplanationUpdate = (questionIndex: number, explanation: string) => {
    if (quizResults) {
      const updatedQuestions = [...quizResults.questions];
      updatedQuestions[questionIndex].aiExplanation = explanation;
      setQuizResults({ ...quizResults, questions: updatedQuestions });
    }
  };

  return (
    <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl text-primary flex items-center justify-center gap-2">
            <PercentIcon className="w-8 h-8" /> Quiz Results
          </CardTitle>
          <CardDescription className="text-xl pt-2">
            Topic: {quizResults.topic}
          </CardDescription>
          <div className="mt-4 text-2xl font-semibold">
            Your Score: <span className={scorePercentage >= 70 ? "text-green-600" : "text-destructive"}>{effectiveCorrectAnswers} / {totalQuestions} ({scorePercentage.toFixed(0)}%)</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {quizResults.scoringSystemContext && (
            <Card className="mt-2 mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-md flex items-center gap-2 text-blue-700 dark:text-blue-300 font-headline">
                  <Info className="h-5 w-5" /> Scoring Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-600 dark:text-blue-400">{quizResults.scoringSystemContext}</p>
              </CardContent>
            </Card>
          )}

          {quizResults.questions.map((q, index) => (
            <Card key={index} className={`p-4 rounded-lg ${q.isCorrect ? 'border-green-500 bg-green-500/10' : 'border-destructive bg-destructive/10'}`}>
              <div className="flex justify-between items-start">
                <p className="font-semibold text-lg">Question {index + 1}: {q.question}</p>
                {q.isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0 ml-2" />
                ) : (
                  <XCircle className="h-6 w-6 text-destructive shrink-0 ml-2" />
                )}
              </div>
              {q.imageUrl && (
                <div className="my-2 flex justify-center">
                  {/* Using a simple img tag here for results, next/image could also be used */}
                  <img src={q.imageUrl} alt={q.imageDescription || "Question image"} style={{maxWidth: '300px', maxHeight: '200px', objectFit: 'contain'}} className="rounded-md" />
                </div>
              )}
              {q.imageDescription && !q.imageUrl && (
                <p className="my-1 text-xs text-muted-foreground italic">Visual element: {q.imageDescription}</p>
              )}
              <p className="text-sm mt-1">Your answer: <span className="font-medium">{q.userAnswer || "Not answered"}</span></p>
              {!q.isCorrect && (
                <p className="text-sm mt-1">Correct answer: <span className="font-medium text-green-700 dark:text-green-400">{q.correctAnswer}</span></p>
              )}
              {q.hintUsed && (
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1">
                  <Lightbulb className="h-3 w-3" /> Hint was used for this question.
                </p>
              )}
              
              {!q.isCorrect && q.userAnswer && (
                <AITutor question={q} onExplanationFetched={handleExplanationUpdate} questionIndex={index} />
              )}
            </Card>
          ))}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant="default">
            <Link href="/">Take Another Quiz</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
