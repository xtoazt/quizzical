
import { AppHeader } from "@/components/AppHeader";
import { QuestionSolver } from "@/components/QuestionSolver";

export default function SolverPage() {
  return (
    <>
      <AppHeader />
      <main className="flex-grow flex flex-col items-center py-8 px-4 bg-muted/30">
        <QuestionSolver />
      </main>
    </>
  );
}
