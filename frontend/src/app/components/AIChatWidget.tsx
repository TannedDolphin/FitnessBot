import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Sparkles, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useUser } from "../context/UserContext";
import { useAIChat } from "../context/AIChatContext";
import { postJson } from "../lib/api";
import { cn } from "./ui/utils";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  reply: string;
  model?: string;
}

function Avatar({ role }: { role: "user" | "ai" }) {
  if (role === "user") {
    return (
      <div className="h-8 w-8 rounded-full bg-[#111827] border border-white/10 flex items-center justify-center shadow-sm">
        <User className="h-4 w-4 text-slate-200" />
      </div>
    );
  }

  return (
    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shadow-green-500/20">
      <Sparkles className="h-4 w-4 text-white" />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 animate-in fade-in duration-300">
      <Avatar role="ai" />

      <div className="rounded-3xl rounded-bl-md border border-white/10 bg-[#111827] px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.2s]" />
          <span className="h-2 w-2 rounded-full bg-emerald-300 animate-bounce [animation-delay:-0.1s]" />
          <span className="h-2 w-2 rounded-full bg-emerald-200 animate-bounce" />
        </div>

        <p className="mt-2 text-[11px] text-slate-400">
          AI đang suy nghĩ...
        </p>
      </div>
    </div>
  );
}

export default function AIChatWidget() {
  const { fitnessProfile, workoutPlan, nutritionPlan } = useUser();
  const {
    isOpen,
    openChat,
    closeChat,
    externalMessage,
    clearExternalMessage,
  } = useAIChat();

  const [isSending, setIsSending] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Xin chào! Tôi là AI Fitness Coach của bạn 💪 Hãy hỏi tôi về luyện tập, dinh dưỡng hoặc mục tiêu thể hình.",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending, isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      const currentInput = text.trim();
      if (!currentInput) return;

      const userMessage: Message = {
        role: "user",
        content: currentInput,
        timestamp: new Date(),
      };

      const history = messagesRef.current.map((message) => ({
        role: message.role,
        content: message.content,
      }));

      setMessages((prev) => [...prev, userMessage]);
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
            content:
              response.reply ||
              "AI chưa có câu trả lời phù hợp lúc này.",
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
                ? `Chưa thể kết nối AI backend: ${err.message}`
                : "Chưa thể kết nối AI backend.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [fitnessProfile, workoutPlan, nutritionPlan],
  );

  const sendMessageRef = useRef(sendMessage);
  sendMessageRef.current = sendMessage;

  useEffect(() => {
    if (!externalMessage) return;

    const content = externalMessage.content;

    void sendMessageRef.current(content).finally(() => {
      clearExternalMessage();
    });
  }, [externalMessage?.id, clearExternalMessage]);

  const handleSend = async () => {
    const currentInput = input.trim();
    if (!currentInput || isSending) return;

    setInput("");
    await sendMessage(currentInput);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        type="button"
        onClick={openChat}
        aria-label="Mở AI Fitness Coach"
        className={cn(
          "group relative h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30 transition-all duration-300 hover:scale-110",
          isOpen && "pointer-events-none scale-0 opacity-0",
          !isOpen && "scale-100 opacity-100",
        )}
      >
        <div className="absolute inset-0 rounded-full bg-green-500/20 blur-xl group-hover:blur-2xl transition-all duration-300" />
        <Sparkles className="relative h-7 w-7 text-white" />
      </button>

      <div
        className={cn(
          "w-[360px] h-[620px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0B1120]/95 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.7)] flex flex-col transition-all duration-300 origin-bottom-right",
          isOpen
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-95 opacity-0 pointer-events-none absolute bottom-0 right-0",
        )}
        aria-hidden={!isOpen}
      >
        {/* HEADER */}
        <div className="h-16 shrink-0 border-b border-white/10 bg-[#0F172A]/90 backdrop-blur-xl px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>

              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-[#0F172A] animate-pulse" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                AI Fitness Coach
              </h2>

              <p className="text-xs text-green-400">Active now</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={closeChat}
            className="h-9 w-9 rounded-full p-0 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* CHAT */}
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-gradient-to-b from-[#050816] to-[#0B1120]"
          style={{ scrollbarWidth: "none" }}
        >
          {messages.map((message, idx) => {
            const isUser = message.role === "user";

            return (
              <div
                key={`${message.role}-${idx}-${message.timestamp.toISOString()}`}
                className={`flex items-end gap-2 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && <Avatar role="ai" />}

                <div className="relative max-w-[75%]">
                  <div
                    className={`relative rounded-3xl px-4 py-3 shadow-md border ${
                      isUser
                        ? "rounded-br-md bg-gradient-to-br from-green-500 to-emerald-600 border-white/10 text-white shadow-green-500/20"
                        : "rounded-bl-md bg-[#111827] border-white/10 text-slate-200"
                    }`}
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>

                    <p
                      className={`mt-2 text-[11px] ${
                        isUser ? "text-white/70" : "text-slate-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div
                    className={`absolute bottom-[2px] h-3 w-3 rotate-45 ${
                      isUser
                        ? "right-1 bg-emerald-500 border-r border-b border-white/10"
                        : "left-1 bg-[#111827] border-l border-t border-white/10"
                    }`}
                  />
                </div>

                {isUser && <Avatar role="user" />}
              </div>
            );
          })}

          {isSending && <TypingIndicator />}
        </div>

        {/* INPUT */}
        <div className="shrink-0 border-t border-white/10 bg-[#0F172A]/80 backdrop-blur-xl p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSend();
            }}
            className="flex items-end gap-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhắn tin với AI Coach..."
              disabled={isSending}
              className="min-h-[48px] flex-1 rounded-2xl border border-white/10 bg-[#111827]/90 px-4 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-green-500/30 focus-visible:border-green-500/30"
            />

            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20 transition-all duration-200 hover:scale-105 disabled:opacity-40"
            >
              <Send className="h-5 w-5 text-white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
