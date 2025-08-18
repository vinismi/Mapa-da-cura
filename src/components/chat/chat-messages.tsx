"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/lib/types";
import { ChatMessage } from "./chat-message";
import { TypingIndicator } from "./typing-indicator";
import { Button } from "../ui/button";

type ChatMessagesProps = {
  messages: Message[];
  onSendMessage: (text: string) => void;
};

export function ChatMessages({ messages, onSendMessage }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const lastMessage = messages[messages.length - 1];
  const isTyping = lastMessage?.sender === "bot" && !lastMessage.content && !lastMessage.options;


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div ref={scrollAreaRef} className="h-full overflow-y-auto">
      <div className="p-4 md:p-6 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
}

    