import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface ExternalAIMessage {
  id: string;
  content: string;
}

interface AIChatContextValue {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  externalMessage: ExternalAIMessage | null;
  sendAIMessage: (content: string) => void;
  clearExternalMessage: () => void;
}

const AIChatContext = createContext<AIChatContextValue | null>(null);

export function AIChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [externalMessage, setExternalMessage] =
    useState<ExternalAIMessage | null>(null);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);

  const sendAIMessage = useCallback((content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    setIsOpen(true);
    setExternalMessage({ id, content: trimmed });
  }, []);

  const clearExternalMessage = useCallback(() => {
    setExternalMessage(null);
  }, []);

  const value = useMemo<AIChatContextValue>(
    () => ({
      isOpen,
      openChat,
      closeChat,
      toggleChat,
      externalMessage,
      sendAIMessage,
      clearExternalMessage,
    }),
    [
      isOpen,
      openChat,
      closeChat,
      toggleChat,
      externalMessage,
      sendAIMessage,
      clearExternalMessage,
    ],
  );

  return (
    <AIChatContext.Provider value={value}>
      {children}
    </AIChatContext.Provider>
  );
}

export function useAIChat(): AIChatContextValue {
  const context = useContext(AIChatContext);

  if (!context) {
    throw new Error("useAIChat must be used within an AIChatProvider");
  }

  return context;
}
