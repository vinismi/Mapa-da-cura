
"use client";

import type { Message } from "@/lib/types";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { cn } from "@/lib/utils";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { TypingPrompt } from "./typing-prompt";

type ChatLayoutProps = {
  messages: Message[];
  isTyping: boolean;
  userInput: string;
  onUserInput: (text: string) => void;
  onSendMessage: (text: string) => void;
  hide?: boolean;
  inputPlaceholder?: string;
  typingPrompt?: string | null;
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
      hide = false,
      inputPlaceholder,
      typingPrompt,
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
      <div className={cn("flex h-dvh flex-col bg-background", hide && "invisible")}>
        <ChatHeader />
        <div
          className="flex flex-1 flex-col overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: "url('https://i.imgur.com/G2Fa071.jpeg')",
          }}
        >
          <div className="flex-1 overflow-y-auto bg-black/10 backdrop-blur-[2px]">
            <ChatMessages ref={messagesRef} messages={messages} onSendMessage={onSendMessage} isTyping={isTyping} />
          </div>
          <TypingPrompt prompt={typingPrompt} />
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
