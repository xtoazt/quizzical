
"use client";

import { useState, useRef, useEffect } from "react";
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
import { Loader2, Send, Lightbulb, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { useRecentActivity } from "@/hooks/useRecentActivity"; // Import the hook


const messageFormSchema = z.object({
  userMessage: z.string().min(1, "Message cannot be empty.").max(1000, "Message too long."),
});
type MessageFormValues = z.infer<typeof messageFormSchema>;

const topicFormSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long.").max(100, "Topic too long."),
});
type TopicFormValues = z.infer<typeof topicFormSchema>;


export function StudyChatbot() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const [isTopicSet, setIsTopicSet] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { addActivity } = useRecentActivity(); // Get the addActivity function
  const [hasLoggedStudySession, setHasLoggedStudySession] = useState(false);


  const topicForm = useForm<TopicFormValues>({
    resolver: zodResolver(topicFormSchema),
    defaultValues: { topic: "" },
  });

  const messageForm = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: { userMessage: "" },
  });

  useEffect(() => {
    // Scroll to bottom when chatHistory changes
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [chatHistory]);

  const handleTopicSubmit: SubmitHandler<TopicFormValues> = (values) => {
    setCurrentTopic(values.topic);
    setIsTopicSet(true);
    setChatHistory([]); 
    setHasLoggedStudySession(false); // Reset for new topic
    toast({ title: "Topic Set!", description: `AI Tutor is ready to help you with "${values.topic}".` });
  };

  const handleMessageSubmit: SubmitHandler<MessageFormValues> = async (values) => {
    if (!currentTopic) {
      toast({ variant: "destructive", title: "No Topic Set", description: "Please set a topic first." });
      return;
    }
    
    const newUserMessage: ChatMessageType = { role: "user", content: values.userMessage };
    // Pass the current chatHistory (before adding the new user message) to the AI.
    // The AI will use this context. Then, we update the displayed history with both messages.
    const historyForAI = [...chatHistory]; 
    setChatHistory(prev => [...prev, newUserMessage]);
    messageForm.reset();
    setIsLoading(true);

    try {
      // Log study session on first message for a new topic
      if (!hasLoggedStudySession) {
        addActivity('study', `Started studying "${currentTopic}"`);
        setHasLoggedStudySession(true);
      }

      const result = await handleStudyChatMessageAction(currentTopic, values.userMessage, historyForAI);
      if (result.success && result.data?.aiResponseMessage) {
        const aiResponse: ChatMessageType = { role: "model", content: result.data.aiResponseMessage };
        setChatHistory(prev => [...prev, aiResponse]);
      } else {
        toast({ variant: "destructive", title: "Error", description: result.error || "Failed to get AI response." });
         setChatHistory(prev => prev.slice(0, -1)); // Remove user message if AI fails
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
      setChatHistory(prev => prev.slice(0, -1)); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl flex flex-col" style={{minHeight: '70vh', maxHeight: '85vh'}}>
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-center text-primary flex items-center justify-center gap-2">
          <Lightbulb className="w-8 h-8" /> AI Study Zone
        </CardTitle>
        <CardDescription className="text-center pt-2">
          Chat with an AI tutor to learn about a topic. Ask questions, get explanations, and test your knowledge.
          {isTopicSet && <p className="font-semibold mt-1">Current Topic: <span className="text-accent">{currentTopic}</span></p>}
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
            <Button type="submit" className="w-full btn-subtle-hover">Set Topic</Button>
          </form>
        </Form>
      ) : (
        <>
          <CardContent className="flex-grow flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-grow p-4 sm:p-6 space-y-4" ref={scrollAreaRef}>
              {chatHistory.map((msg, index) => (
                <div key={index} className={`flex flex-col mb-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-start gap-2.5 max-w-[85%]`}>
                    {msg.role === 'model' && <Bot className="w-6 h-6 text-primary shrink-0 mt-1"/>}
                    <div className={`p-3 rounded-lg shadow-md text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-none' 
                        : 'bg-card border border-border rounded-bl-none'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                     {msg.role === 'user' && <User className="w-6 h-6 text-muted-foreground shrink-0 mt-1"/>}
                  </div>
                </div>
              ))}
              {chatHistory.length === 0 && (
                 <div className="text-center text-muted-foreground py-10">
                    <p>No messages yet. Ask a question about "{currentTopic}" to get started!</p>
                 </div>
              )}
              {isLoading && chatHistory.length > 0 && chatHistory[chatHistory.length -1].role === 'user' && (
                <div className="flex items-start gap-2.5 max-w-[85%] self-start mb-3">
                    <Bot className="w-6 h-6 text-primary shrink-0 mt-1"/>
                    <div className="p-3 rounded-lg shadow-md text-sm bg-card border border-border rounded-bl-none">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 sm:p-6 border-t bg-muted/50">
            <Form {...messageForm}>
              <form onSubmit={messageForm.handleSubmit(handleMessageSubmit)} className="w-full flex gap-2 items-start">
                <FormField
                  control={messageForm.control}
                  name="userMessage"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Textarea 
                            placeholder={`Message AI about "${currentTopic}"...`} 
                            {...field} 
                            rows={1} 
                            className="min-h-[42px] resize-none border-border focus:border-primary ring-offset-0 focus:ring-1 focus:ring-primary"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    messageForm.handleSubmit(handleMessageSubmit)();
                                }
                            }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || !messageForm.formState.isValid} className="h-auto py-2.5 px-4 btn-subtle-hover">
                  {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
                </Button>
              </form>
            </Form>
          </CardFooter>
           <Button variant="link" size="sm" onClick={() => { setIsTopicSet(false); setCurrentTopic(""); setChatHistory([]); topicForm.reset(); setHasLoggedStudySession(false); }} className="mt-0 mb-2 mx-auto text-xs">
              Change Topic
            </Button>
        </>
      )}
    </Card>
  );
}
