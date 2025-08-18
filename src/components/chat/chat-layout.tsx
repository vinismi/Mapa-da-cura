import type { Message } from "@/lib/types";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";

type ChatLayoutProps = {
  messages: Message[];
  isTyping: boolean;
  userInput: string;
  onUserInput: (text: string) => void;
  onSendMessage: (text: string) => void;
};

export function ChatLayout({
  messages,
  isTyping,
  userInput,
  onUserInput,
  onSendMessage,
}: ChatLayoutProps) {
  return (
    <div className="flex flex-col h-full w-full">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto bg-[#F0F0F0] dark:bg-zinc-800">
        <ChatMessages messages={messages} isTyping={isTyping} />
      </div>
      <ChatInput
        userInput={userInput}
        onUserInput={onUserInput}
        onSendMessage={onSendMessage}
      />
    </div>
  );
}
