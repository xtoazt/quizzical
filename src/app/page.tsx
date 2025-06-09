import { AppHeader } from "@/components/AppHeader";
import { QuizSetup } from "@/components/QuizSetup";

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <main className="flex-grow flex flex-col">
        <QuizSetup />
      </main>
    </>
  );
}
