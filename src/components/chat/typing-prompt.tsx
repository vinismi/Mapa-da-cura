
import { Hand } from 'lucide-react';

type TypingPromptProps = {
  prompt: string | null;
};

export function TypingPrompt({ prompt }: TypingPromptProps) {
  if (!prompt) {
    return null;
  }

  return (
    <div className="flex justify-center items-center px-4 pb-2 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-primary/20">
        <Hand size={18} className="text-primary transform -rotate-45" />
        <span className="text-sm font-medium text-primary">{prompt}</span>
      </div>
    </div>
  );
}
