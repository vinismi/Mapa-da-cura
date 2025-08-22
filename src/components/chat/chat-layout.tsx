
import type { Message } from "@/lib/types";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { cn } from "@/lib/utils";

type ChatLayoutProps = {
  messages: Message[];
  isTyping: boolean;
  userInput: string;
  onUserInput: (text: string) => void;
  onSendMessage: (text: string) => void;
  hide?: boolean;
};

export function ChatLayout({
  messages,
  isTyping,
  userInput,
  onUserInput,
  onSendMessage,
  hide = false,
}: ChatLayoutProps) {
  const lastMessageWithOptions = messages.slice().reverse().find(m => m.options && m.options.length > 0);

  return (
    <div className={cn("flex h-dvh flex-col", hide && "invisible")}>
      <ChatHeader />
      <div 
        className="flex-1 overflow-hidden bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://i.imgur.com/G2Fa071.jpeg')",
        }}
      >
        <div className="h-full bg-black/10 backdrop-blur-[2px]">
          <ChatMessages messages={messages} onSendMessage={onSendMessage} isTyping={isTyping} />
        </div>
      </div>
      <ChatInput
        userInput={userInput}
        onUserInput={onUserInput}
        onSendMessage={onSendMessage}
        options={lastMessageWithOptions?.options}
      />
    </div>
  );
}
