
"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import type { Message } from "@/lib/types";
import { ChatMessage } from "./chat-message";
import { TypingIndicator } from "./typing-indicator";

type ChatMessagesProps = {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
};

export const ChatMessages = forwardRef<
  { scrollToBottom: () => void },
  ChatMessagesProps
>(({ messages, isTyping, onSendMessage }, ref) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useImperativeHandle(ref, () => ({
    scrollToBottom,
  }));

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);


  return (
    <div ref={scrollAreaRef} className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} onSendMessage={onSendMessage} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
});

ChatMessages.displayName = "ChatMessages";
