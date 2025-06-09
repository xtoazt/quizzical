
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Lightbulb, BookOpenCheck, ArrowRight, History, BarChart3, CheckSquare, User, Settings2, Target, Zap } from "lucide-react";
import Image from "next/image";

export function DashboardDisplay() {
  return (
    <div className="w-full max-w-5xl space-y-8 animate-fadeIn">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary/80 via-primary to-primary/70 p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <Image 
              src="https://placehold.co/120x120.png" // Replace with a better placeholder or app logo
              alt="QuizzicalAI Welcome" 
              width={100} 
              height={100} 
              className="rounded-full border-4 border-primary-foreground/50 shadow-md object-cover"
              data-ai-hint="brain study"
            />
            <div>
              <CardTitle className="text-3xl md:text-4xl font-headline text-primary-foreground">Welcome to QuizzicalAI!</CardTitle>
              <CardDescription className="text-lg text-primary-foreground/90 mt-1">
                Your intelligent partner for learning and quiz preparation.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-muted-foreground mb-6">
            Explore AI-powered tools to create custom quizzes, get instant solutions,
            chat with a study tutor, and track your learning journey.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button asChild size="lg" className="btn-subtle-hover">
              <Link href="/create-quiz">
                <Zap className="mr-2 h-5 w-5" /> Create a New Quiz
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="btn-subtle-hover">
              <Link href="/study">
                <Lightbulb className="mr-2 h-5 w-5" /> Enter AI Study Zone
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          title="Create Custom Quizzes"
          description="Generate quizzes by topic or from real released tests. Tailor your study sessions."
          icon={<BookOpenCheck className="w-10 h-10 text-primary" />}
          linkHref="/create-quiz"
          linkText="Start Quiz Setup"
        />
        <FeatureCard
          title="AI Study Zone"
          description="Engage in interactive chat with an AI tutor to deepen your understanding of any topic."
          icon={<Lightbulb className="w-10 h-10 text-yellow-500" />}
          linkHref="/study"
          linkText="Chat with Tutor"
        />
        <FeatureCard
          title="Question Solver"
          description="Get AI-powered step-by-step solutions and explanations for challenging questions."
          icon={<CheckSquare className="w-10 h-10 text-green-500" />}
          linkHref="/solver"
          linkText="Use Solver"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <History className="w-7 h-7 text-primary" />
              <CardTitle className="text-xl font-headline">Recent Activity</CardTitle>
            </div>
            <CardDescription>Review your latest quizzes and study sessions.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="p-3 bg-muted/30 rounded-md text-sm hover:bg-muted/50 transition-colors">Completed: "Algebra Basics" - Score: 85%</li>
              <li className="p-3 bg-muted/30 rounded-md text-sm hover:bg-muted/50 transition-colors">Studied: "Cellular Respiration" in Study Zone</li>
              <li className="p-3 bg-muted/30 rounded-md text-sm hover:bg-muted/50 transition-colors">Solved: "Physics projectile motion problem"</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3 italic">(Placeholder: Dynamic recent activity will appear here.)</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-primary" />
              <CardTitle className="text-xl font-headline">Progress Overview</CardTitle>
            </div>
            <CardDescription>Track your learning trends and improvements.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-muted/30 rounded-md flex items-center justify-center p-4">
              <p className="text-sm text-muted-foreground italic text-center">
                Exciting charts and detailed performance analytics are coming soon to help you visualize your growth!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
            <div className="flex items-center gap-3">
                <Target className="w-7 h-7 text-primary" />
                <CardTitle className="text-2xl font-headline">Study Goals & Quick Links</CardTitle>
            </div>
            <CardDescription>Set learning targets and quickly access key areas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-muted-foreground">
                (Placeholder: Set and track your study goals here. e.g., "Master Calculus by next month")
            </p>
            <div className="flex flex-wrap gap-2">
                <Button variant="outline"><Link href="/create-quiz?tab=released-tests">Practice Released Tests</Link></Button>
                <Button variant="outline"><Link href="/study?topic=Mathematics">Study Math</Link></Button>
                <Button variant="outline"><Link href="/solver">Quick Solve a Problem</Link></Button>
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
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col bg-card">
      <CardHeader className="flex-grow">
        <div className="flex items-start gap-4 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
          <div>
            <CardTitle className="text-xl font-headline">{title}</CardTitle>
            <CardDescription className="mt-1 text-sm">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardFooter>
        <Button asChild className="w-full mt-auto btn-subtle-hover">
          <Link href={linkHref}>
            {linkText} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Basic fadeIn animation (add to globals.css or tailwind config if preferred)
// @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
// .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
// For simplicity, using inline style or direct Tailwind class if available, otherwise rely on existing transitions.
// The DashboardDisplay has animate-fadeIn which would need to be defined in globals or tailwind.config.
// Let's add it to globals.css

    