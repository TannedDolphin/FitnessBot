import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
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
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-80 h-[500px] shadow-xl flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b shrink-0">
            <CardTitle className="text-base">AI Fitness Coach</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col min-h-0 p-0">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, idx) => (
                <div
                  key={`${message.timestamp.toISOString()}-${idx}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                    style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isSending ? (
                <div className="text-xs text-gray-500">AI dang suy nghi...</div>
              ) : null}
            </div>
            <div className="p-4 border-t shrink-0 bg-white">
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
                  className="flex-1"
                  disabled={isSending}
                />
                <Button type="submit" size="sm" disabled={!input.trim() || isSending}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
