"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send, Bot, User } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export function ChatInterface({ meetingId }: { meetingId: string }) {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    { role: "ai", content: "Hi! How can I help you extract insights from this meeting?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId, question: userMessage }),
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: "ai", content: data.answer }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, I had trouble answering that." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full border-slate-100 bg-white shadow-sm flex flex-col xl:h-auto">
      <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50 rounded-t-xl">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Bot className="w-4 h-4 text-indigo-600" />
          Ask OmniSync
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col h-[350px] p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 text-sm ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === "user" ? "bg-slate-200 text-slate-700" : "bg-indigo-100 text-indigo-700"
                }`}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3 rounded-2xl max-w-[80%] ${
                  msg.role === "user" 
                    ? "bg-indigo-600 text-white rounded-tr-sm" 
                    : "bg-slate-100 text-slate-800 rounded-tl-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 text-sm">
                <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 bg-slate-100 text-slate-500 rounded-2xl rounded-tl-sm max-w-[80%]">
                  <div className="flex gap-1.5 items-center px-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex gap-2">
          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about this meeting..."
            className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="shrink-0 bg-indigo-600 hover:bg-indigo-700">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
