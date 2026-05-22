import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { useUser } from "../context/UserContext";
import { postJson } from "../lib/api";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  reply: string;
  model?: string;
}

export default function AIChatWidget() {
  const { fitnessProfile, workoutPlan, nutritionPlan } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Xin chao! Toi la huan luyen vien AI cua ban. Hay hoi toi ve tap luyen, dinh duong hoac muc tieu the duc.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const currentInput = input.trim();
    if (!currentInput || isSending) return;

    const userMessage: Message = {
      role: "user",
      content: currentInput,
      timestamp: new Date(),
    };

    const history = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await postJson<ChatResponse>("/api/chat", {
        message: currentInput,
        history,
        fitnessProfile,
        workoutPlan,
        nutritionPlan,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: response.reply || "AI chua co cau tra loi phu hop luc nay.",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            err instanceof Error
              ? `Minh chua ket noi duoc AI backend: ${err.message}`
              : "Minh chua ket noi duoc AI backend.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 shadow-xl shadow-green-500/30 flex items-center justify-center hover:scale-105 hover:shadow-green-500/40 transition-all duration-200"
        >
          <Sparkles className="h-6 w-6 text-white" />
        </button>
      ) : (
        <Card className="w-80 h-[500px] rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden border border-white/8 bg-[#0B1120]">
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-white/5 shrink-0 bg-gradient-to-r from-green-700 to-emerald-600">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-white" />
              <CardTitle className="text-sm font-semibold text-white">
                AI Fitness Coach
              </CardTitle>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 p-0 rounded-lg flex items-center justify-center hover:bg-white/15 text-white/80 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden flex flex-col min-h-0 p-0 bg-[#050816]">
            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
              {messages.map((message, idx) => (
                <div
                  key={`${message.timestamp.toISOString()}-${idx}`}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-green-600 to-emerald-500 text-white shadow-md shadow-green-500/20"
                        : "bg-[#111827] border border-white/6 text-slate-200"
                    }`}
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>

                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isSending ? (
                <div className="text-xs text-slate-500">
                  AI dang suy nghi...
                </div>
              ) : null}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 shrink-0 bg-[#0B1120]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Hoi toi bat cu dieu gi..."
                  className="flex-1 bg-[#111827] border border-white/8 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-green-500/40 transition-colors"
                  disabled={isSending}
                />

                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() || isSending}
                  className="h-9 w-9 p-0 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center disabled:opacity-40 hover:shadow-md hover:shadow-green-500/20 transition-all border-0"
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}