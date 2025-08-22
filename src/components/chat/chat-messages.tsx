
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);


  return (
    <div className="p-4 md:p-6 space-y-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} onSendMessage={onSendMessage} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}
