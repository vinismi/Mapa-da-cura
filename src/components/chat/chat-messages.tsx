
"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/lib/types";
import { ChatMessage } from "./chat-message";
import { TypingIndicator } from "./typing-indicator";

type ChatMessagesProps = {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
};

export function ChatMessages({ messages, isTyping, onSendMessage }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (scrollAreaRef.current && lastMessage?.sender === "bot") {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div ref={scrollAreaRef} className="h-full overflow-y-auto">
      <div className="p-4 md:p-6 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} onSendMessage={onSendMessage} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
}
