
"use client";

import type { Message } from "@/lib/types";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { cn } from "@/lib/utils";
import { forwardRef, useImperativeHandle, useRef } from "react";

type ChatLayoutProps = {
  messages: Message[];
  isTyping: boolean;
  userInput: string;
  onUserInput: (text: string) => void;
  onSendMessage: (text: string) => void;
  inputPlaceholder?: string;
};

export const ChatLayout = forwardRef<
  { scrollToBottom: () => void },
  ChatLayoutProps
>(
  (
    {
      messages,
      isTyping,
      userInput,
      onUserInput,
      onSendMessage,
      inputPlaceholder,
    },
    ref
  ) => {
    const lastMessageWithOptions = messages
      .slice()
      .reverse()
      .find((m) => m.options && m.options.length > 0);
    
    const messagesRef = useRef<{ scrollToBottom: () => void }>(null);

    useImperativeHandle(ref, () => ({
      scrollToBottom: () => {
        messagesRef.current?.scrollToBottom();
      },
    }));

    return (
      <div className="flex h-dvh flex-col bg-background">
        <ChatHeader />
        <div
          className="flex flex-1 flex-col overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: "url('https://i.imgur.com/mrFbPoi.jpeg')",
          }}
        >
          <div className="flex-1 overflow-y-auto bg-black/50 backdrop-blur-[2px]">
            <ChatMessages ref={messagesRef} messages={messages} onSendMessage={onSendMessage} isTyping={isTyping} />
          </div>
          <ChatInput
            userInput={userInput}
            onUserInput={onUserInput}
            onSendMessage={onSendMessage}
            options={lastMessageWithOptions?.options}
            placeholder={inputPlaceholder}
          />
        </div>
      </div>
    );
  }
);

ChatLayout.displayName = "ChatLayout";
