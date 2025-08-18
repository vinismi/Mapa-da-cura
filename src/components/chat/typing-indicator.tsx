export function TypingIndicator() {
  return (
    <div className="flex items-center justify-start">
      <div className="flex items-center space-x-1.5 bg-white dark:bg-zinc-700 p-3 rounded-lg shadow-sm">
        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse"></span>
      </div>
    </div>
  );
}
