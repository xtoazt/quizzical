
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
  // quizDataFromHook is initialized by useLocalStorage.
  // It will be null initially, then updated from localStorage by the hook's internal useEffect.
  const [quizDataFromHook] = useLocalStorage<Quiz | null>("quizzicalai_currentQuiz", null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures that any logic relying on client-side features runs after mount.
    setIsClient(true);
  }, []);

  useEffect(() => {
    // This effect runs when isClient becomes true, or when quizDataFromHook changes.
    // It handles redirection if quiz data is invalid after the initial load attempt.
    if (isClient) {
      if (quizDataFromHook && quizDataFromHook.questions && quizDataFromHook.questions.length > 0 && quizDataFromHook.topic) {
        // Quiz data is valid and loaded.
      } else {
        // Quiz data is not valid (null, empty questions, etc.) after initial load attempt from localStorage.
        router.replace("/");
      }
    }
  }, [isClient, quizDataFromHook, router]);

  // isLoading is true if we are not yet on the client (hydration phase)
  // or if quizDataFromHook is still null (implying it hasn't loaded or isn't in LS).
  // If isClient is true and quizDataFromHook is null, the effect above will redirect.
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
  
  // If not loading, and we are here, the useEffect above should have handled redirection
  // if quizDataFromHook was invalid. This is an additional safeguard or handles the
  // brief moment before redirection completes.
  if (!quizDataFromHook || !quizDataFromHook.questions || quizDataFromHook.questions.length === 0) {
    return (
        <>
            <AppHeader />
            <main className="flex-grow flex items-center justify-center">
                <p>Loading quiz data or redirecting...</p>
            </main>
        </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="flex-grow flex flex-col">
        <QuizPlayer initialQuiz={quizDataFromHook} />
      </main>
    </>
  );
}
