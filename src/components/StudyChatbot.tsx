
"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { handleStudyChatMessageAction } from "@/lib/actions";
import { Loader2, Send, Lightbulb, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const studyFormSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long.").max(100, "Topic too long."),
  userMessage: z.string().min(1, "Message cannot be empty.").max(1000, "Message too long."),
});
type StudyFormValues = z.infer<typeof studyFormSchema>;

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
}

export function StudyChatbot() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const [isTopicSet, setIsTopicSet] = useState<boolean>(false);

  const topicForm = useForm<{ topic: string }>({
    resolver: zodResolver(z.object({ topic: z.string().min(3, "Topic must be at least 3 characters long.").max(100, "Topic too long.") })),
    defaultValues: { topic: "" },
  });

  const messageForm = useForm<Omit<StudyFormValues, 'topic'>>({
    resolver: zodResolver(studyFormSchema.omit({ topic: true })),
    defaultValues: { userMessage: "" },
  });

  const handleTopicSubmit: SubmitHandler<{ topic: string }> = (values) => {
    setCurrentTopic(values.topic);
    setIsTopicSet(true);
    setChatHistory([]); // Reset chat history for new topic
    toast({ title: "Topic Set!", description: `AI Tutor is ready to help you with "${values.topic}".` });
  };

  const handleMessageSubmit: SubmitHandler<Omit<StudyFormValues, 'topic'>> = async (values) => {
    if (!currentTopic) {
      toast({ variant: "destructive", title: "No Topic Set", description: "Please set a topic first." });
      return;
    }
    setIsLoading(true);
    const newUserMessage: ChatMessage = { id: Date.now().toString(), role: "user", content: values.userMessage };
    setChatHistory(prev => [...prev, newUserMessage]);
    messageForm.reset();

    try {
      const result = await handleStudyChatMessageAction(currentTopic, values.userMessage);
      if (result.success && result.data?.aiResponseMessage) {
        const aiResponse: ChatMessage = { id: (Date.now() + 1).toString(), role: "ai", content: result.data.aiResponseMessage };
        setChatHistory(prev => [...prev, aiResponse]);
      } else {
        toast({ variant: "destructive", title: "Error", description: result.error || "Failed to get AI response." });
         setChatHistory(prev => prev.filter(m => m.id !== newUserMessage.id)); // Remove user message if AI fails
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
      setChatHistory(prev => prev.filter(m => m.id !== newUserMessage.id)); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl flex flex-col" style={{minHeight: '70vh'}}>
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-center text-primary flex items-center justify-center gap-2">
          <Lightbulb className="w-8 h-8" /> AI Study Zone
        </CardTitle>
        <CardDescription className="text-center pt-2">
          Chat with an AI tutor to learn about a topic. Ask questions, get explanations, and test your knowledge.
          {isTopicSet && <p className="font-semibold mt-1">Current Topic: {currentTopic}</p>}
        </CardDescription>
      </CardHeader>
      
      {!isTopicSet ? (
        <Form {...topicForm}>
          <form onSubmit={topicForm.handleSubmit(handleTopicSubmit)} className="p-6 space-y-4">
            <FormField
              control={topicForm.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What topic would you like to study today?</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The French Revolution, Quantum Physics Basics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Set Topic</Button>
          </form>
        </Form>
      ) : (
        <>
          <CardContent className="flex-grow flex flex-col p-0">
            <ScrollArea className="flex-grow h-96 p-6 space-y-4">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-3 rounded-lg shadow ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card border'
                  }`}>
                    {msg.role === 'ai' && <Bot className="w-4 h-4 mb-1 inline-block mr-1 text-muted-foreground"/>}
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {chatHistory.length === 0 && (
                 <div className="text-center text-muted-foreground py-10">
                    <p>No messages yet. Ask a question about "{currentTopic}" to get started!</p>
                 </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-6 border-t">
            <Form {...messageForm}>
              <form onSubmit={messageForm.handleSubmit(handleMessageSubmit)} className="w-full flex gap-2 items-start">
                <FormField
                  control={messageForm.control}
                  name="userMessage"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Textarea placeholder="Ask a question or type your message..." {...field} rows={1} className="min-h-[40px] resize-none"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="h-auto py-2.5 px-4">
                  {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
                </Button>
              </form>
            </Form>
          </CardFooter>
           <Button variant="link" size="sm" onClick={() => { setIsTopicSet(false); setCurrentTopic(""); setChatHistory([]); }} className="mt-0 mb-2 mx-auto">
              Change Topic
            </Button>
        </>
      )}
    </Card>
  );
}
