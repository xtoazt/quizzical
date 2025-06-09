"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { QuizPlayer } from "@/components/QuizPlayer";
import type { Quiz } from "@/lib/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Loader2 } from "lucide-react";

export default function QuizPage() {
  const router = useRouter();
  const [quizData, setQuizData] = useLocalStorage<Quiz | null>("quizzicalai_currentQuiz", null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedQuiz = localStorage.getItem("quizzicalai_currentQuiz");
    if (storedQuiz) {
      try {
        const parsedQuiz = JSON.parse(storedQuiz);
         // Check if it's a valid quiz structure (basic check)
        if (parsedQuiz && parsedQuiz.questions && parsedQuiz.topic) {
          setQuizData(parsedQuiz);
        } else {
           router.replace("/"); // Invalid quiz data
        }
      } catch (error) {
        console.error("Failed to parse quiz data from localStorage", error);
        router.replace("/"); // Error parsing, redirect
      }
    } else if (!quizData) { // If nothing in localStorage and quizData hook also null
        router.replace("/"); // No quiz data, redirect
    }
    setIsLoading(false);
  }, [router, setQuizData, quizData]); // Added quizData to dependency array

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
  
  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    // This case should ideally be caught by useEffect redirecting, but as a fallback:
     useEffect(() => { router.replace("/"); }, [router]);
    return (
        <>
            <AppHeader />
            <main className="flex-grow flex items-center justify-center">
                <p>No quiz found. Redirecting...</p>
            </main>
        </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="flex-grow flex flex-col">
        <QuizPlayer initialQuiz={quizData} />
      </main>
    </>
  );
}
