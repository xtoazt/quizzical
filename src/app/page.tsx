
import { AppHeader } from "@/components/AppHeader";
import { QuizSetup } from "@/components/QuizSetup";
import { ReleasedTestQuizSetup } from "@/components/ReleasedTestQuizSetup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, BookMarked } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <main className="flex-grow flex flex-col items-center py-8 px-4">
        <Tabs defaultValue="topic" className="w-full max-w-lg">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="topic">
              <Sparkles className="mr-2 h-4 w-4" /> By Topic
            </TabsTrigger>
            <TabsTrigger value="released-tests">
              <BookMarked className="mr-2 h-4 w-4" /> Released Tests
            </TabsTrigger>
          </TabsList>
          <TabsContent value="topic">
            <QuizSetup />
          </TabsContent>
          <TabsContent value="released-tests">
            <ReleasedTestQuizSetup />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
