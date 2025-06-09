"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { QuizResultDisplay } from "@/components/QuizResultDisplay";
import type { Quiz } from "@/lib/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Loader2 } from "lucide-react";

export default function ResultsPage() {
  const router = useRouter();
  // Use quizData from localStorage, which should include userAnswers and isCorrect flags
  const [quizData, setQuizData] = useLocalStorage<Quiz | null>("quizzicalai_currentQuiz", null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedQuiz = localStorage.getItem("quizzicalai_currentQuiz");
     if (storedQuiz) {
      try {
        const parsedQuiz = JSON.parse(storedQuiz);
        // Check if it's a valid quiz structure with results
        if (parsedQuiz && parsedQuiz.questions && parsedQuiz.questions.some((q:any) => typeof q.isCorrect !== 'undefined')) {
          setQuizData(parsedQuiz);
        } else {
          router.replace("/"); // Invalid or incomplete quiz data for results
        }
      } catch (error) {
        console.error("Failed to parse quiz results from localStorage", error);
        router.replace("/");
      }
    } else if (!quizData || !quizData.questions.some(q => typeof q.isCorrect !== 'undefined')) {
        router.replace("/"); // No quiz data for results
    }
    setIsLoading(false);
  }, [router, setQuizData, quizData]);

  if (isLoading) {
    return (
      <>
        <AppHeader />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </>
    );
  }

  if (!quizData || !quizData.questions || quizData.questions.length === 0 || !quizData.questions.some(q => typeof q.isCorrect !== 'undefined')) {
    // This case should ideally be caught by useEffect redirecting, but as a fallback:
    useEffect(() => { router.replace("/"); }, [router]);
    return (
        <>
            <AppHeader />
            <main className="flex-grow flex items-center justify-center">
                <p>No quiz results found. Redirecting...</p>
            </main>
        </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="flex-grow flex flex-col">
        <QuizResultDisplay quizResults={quizData} />
      </main>
    </>
  );
}
