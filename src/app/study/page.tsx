
import { AppHeader } from "@/components/AppHeader";
import { StudyChatbot } from "@/components/StudyChatbot";

export default function StudyPage() {
  return (
    <>
      <AppHeader />
      <main className="flex-grow flex flex-col items-center py-8 px-4 bg-muted/30">
        <StudyChatbot />
      </main>
    </>
  );
}
