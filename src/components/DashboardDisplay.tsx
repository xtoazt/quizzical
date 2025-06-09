
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Lightbulb, BookOpenCheck, ArrowRight, History, BarChart3, CheckSquare, User, Settings2, Target, Zap, Edit3, Save } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import type { StudyGoal } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from 'date-fns';

export function DashboardDisplay() {
  const [userName] = useLocalStorage<string | null>('quizzicalai_userName', null);
  const { activities } = useRecentActivity();
  const [studyGoal, setStudyGoal] = useLocalStorage<StudyGoal>("quizzicalai_studyGoal", { text: "" });
  const [editingGoal, setEditingGoal] = useState(false);
  const [currentGoalText, setCurrentGoalText] = useState(studyGoal?.text || "");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    setCurrentGoalText(studyGoal?.text || "");
  }, [studyGoal]);


  const handleSaveGoal = () => {
    setStudyGoal({ text: currentGoalText, lastUpdated: Date.now() });
    setEditingGoal(false);
  };

  if (!isClient) {
    return (
      <div className="w-full max-w-5xl space-y-8 animate-fadeIn">
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-primary/80 via-primary to-primary/70 p-8">
             <CardTitle className="text-3xl md:text-4xl font-headline text-primary-foreground">Loading Dashboard...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl space-y-8 animate-fadeIn">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary/80 via-primary to-primary/70 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Image removed as per request */}
            <div>
              <CardTitle className="text-3xl md:text-4xl font-headline text-primary-foreground">
                Welcome{userName ? `, ${userName}` : ' to QuizzicalAI'}!
              </CardTitle>
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
            {activities.length > 0 ? (
              <ul className="space-y-3">
                {activities.map(activity => (
                  <li key={activity.id} className="p-3 bg-muted/30 rounded-md text-sm hover:bg-muted/50 transition-colors flex items-center gap-3">
                    {activity.icon && <activity.icon className="w-5 h-5 text-muted-foreground" />}
                    <div className="flex-grow">
                      <span>{activity.description}</span>
                      <p className="text-xs text-muted-foreground/80">{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">No recent activity. Complete some quizzes or study sessions to see them here!</p>
            )}
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
            <div className="h-48 bg-muted/30 rounded-md flex flex-col items-center justify-center p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Complete activities to see your progress summary here.
              </p>
              <p className="text-lg font-semibold mt-2">Total Activities Logged: {activities.length}</p>
              <p className="text-xs text-muted-foreground mt-2 italic">(More detailed analytics coming soon!)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
            <div className="flex items-center gap-3">
                <Target className="w-7 h-7 text-primary" />
                <CardTitle className="text-2xl font-headline">Study Goals</CardTitle>
            </div>
            <CardDescription>Set your current learning target.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {editingGoal ? (
              <div className="flex items-center gap-2">
                <Input 
                  type="text" 
                  value={currentGoalText}
                  onChange={(e) => setCurrentGoalText(e.target.value)}
                  placeholder="e.g., Master Calculus Chapter 5"
                  className="flex-grow"
                />
                <Button onClick={handleSaveGoal} size="icon"><Save className="w-4 h-4"/></Button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 p-3 bg-muted/30 rounded-md min-h-[50px]">
                <p className="text-muted-foreground flex-grow">
                  {studyGoal?.text ? studyGoal.text : "No goal set. What are you working towards?"}
                  {studyGoal?.text && studyGoal.lastUpdated && (
                    <span className="block text-xs text-muted-foreground/70">
                      Last updated: {formatDistanceToNow(new Date(studyGoal.lastUpdated), { addSuffix: true })}
                    </span>
                  )}
                </p>
                <Button onClick={() => setEditingGoal(true)} variant="ghost" size="icon"><Edit3 className="w-4 h-4"/></Button>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="outline" asChild><Link href="/create-quiz?tab=released-tests">Practice Released Tests</Link></Button>
                <Button variant="outline" asChild><Link href="/study?topic=Mathematics">Study Math</Link></Button>
                <Button variant="outline" asChild><Link href="/solver">Quick Solve a Problem</Link></Button>
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
          <div className="p-2 bg-primary/10 rounded-lg text-primary flex-shrink-0">
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
