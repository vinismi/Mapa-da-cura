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
  const lastMessageWithOptions = messages.slice().reverse().find(m => m.options && m.options.length > 0);

  return (
    <div className="flex flex-col h-full w-full">
      <ChatHeader />
      <div 
        className="flex-1 overflow-y-auto bg-repeat bg-center" 
        style={{ 
          backgroundImage: "url('/spiritual-bg.png')",
          backgroundSize: '300px 300px' 
        }}
      >
        <ChatMessages messages={messages} onSendMessage={onSendMessage}/>
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

    