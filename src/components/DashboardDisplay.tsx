
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Lightbulb, BookOpenCheck, ArrowRight, History, BarChart3 } from "lucide-react";

export function DashboardDisplay() {
  // In a real app, you might fetch user data, recent quizzes, etc.
  // For now, it's a static display.

  return (
    <div className="w-full max-w-4xl space-y-8">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Welcome to Your Dashboard!</CardTitle>
          <CardDescription className="text-lg">
            Manage your learning journey, track progress, and access all QuizzicalAI features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is your central hub for QuizzicalAI. From here, you can create new quizzes,
            review past results, engage with the AI Study Zone, or use the Question Solver.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          title="Create a New Quiz"
          description="Generate quizzes by topic or from released tests."
          icon={<BookOpenCheck className="w-10 h-10 text-primary" />}
          linkHref="/"
          linkText="Start Quiz Setup"
        />
        <FeatureCard
          title="AI Study Zone"
          description="Chat with an AI tutor to deepen your understanding."
          icon={<Lightbulb className="w-10 h-10 text-yellow-500" />}
          linkHref="/study"
          linkText="Enter Study Zone"
        />
        <FeatureCard
          title="Question Solver"
          description="Get AI-powered solutions and explanations for questions."
          icon={<ArrowRight className="w-10 h-10 text-green-500" />}
          linkHref="/solver"
          linkText="Use Solver"
        />
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <History className="w-7 h-7 text-primary" />
            <CardTitle className="text-2xl font-headline">Recent Activity</CardTitle>
          </div>
          <CardDescription>Review your latest quizzes and study sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            (Placeholder: Your recent quizzes and study interactions will appear here.)
          </p>
          {/* Example placeholder items - replace with dynamic data later */}
          <ul className="mt-4 space-y-2">
            <li className="p-3 bg-muted/50 rounded-md text-sm">Completed: "World War II Basics" - Score: 80%</li>
            <li className="p-3 bg-muted/50 rounded-md text-sm">Studied: "Photosynthesis" in Study Zone</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-primary" />
            <CardTitle className="text-2xl font-headline">Progress Overview</CardTitle>
          </div>
          <CardDescription>Track your learning trends and improvements.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            (Placeholder: Charts and stats on your performance will be displayed here.)
          </p>
           <div className="mt-4 h-40 bg-muted/50 rounded-md flex items-center justify-center">
            <p className="text-sm text-muted-foreground italic">Analytics coming soon!</p>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkHref: string;
  linkText: string;
}

function FeatureCard({ title, description, icon, linkHref, linkText }: FeatureCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <CardHeader className="flex-grow">
        <div className="flex items-center gap-4 mb-3">
          {icon}
          <CardTitle className="text-xl font-headline">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full mt-auto">
          <Link href={linkHref}>
            {linkText} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
