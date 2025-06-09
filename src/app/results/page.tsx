
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
  // quizDataFromHook is initialized by useLocalStorage.
  const [quizDataFromHook] = useLocalStorage<Quiz | null>("quizzicalai_currentQuiz", null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      // Check if it's a valid quiz structure with results
      if (quizDataFromHook && quizDataFromHook.questions && quizDataFromHook.questions.some((q: any) => typeof q.isCorrect !== 'undefined')) {
        // Valid quiz results are loaded.
      } else {
        // Invalid or incomplete quiz data for results page.
        router.replace("/");
      }
    }
  }, [isClient, quizDataFromHook, router]);

  const isLoading = !isClient;

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

  if (!quizDataFromHook || !quizDataFromHook.questions || quizDataFromHook.questions.length === 0 || !quizDataFromHook.questions.some(q => typeof q.isCorrect !== 'undefined')) {
    return (
        <>
            <AppHeader />
            <main className="flex-grow flex items-center justify-center">
                <p>No quiz results found or data is invalid. Redirecting...</p>
            </main>
        </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="flex-grow flex flex-col">
        <QuizResultDisplay quizResults={quizDataFromHook} />
      </main>
    </>
  );
}
