import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Video, Phone, MoreVertical, BadgeCheck } from "lucide-react";

export function ChatHeader() {
  return (
    <header className="flex items-center justify-between p-2 md:p-3 border-b bg-background shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-green-500/50">
          <AvatarImage
            src="https://i.imgur.com/IhZA0Ke.png"
            alt="Luz"
            data-ai-hint="person portrait"
          />
          <AvatarFallback>L</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="font-bold text-lg text-foreground">Luz | Mentora do Despertar</h2>
            <BadgeCheck className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-sm text-green-500 font-medium">online</p>
        </div>
      </div>
      <div className="flex items-center gap-1 md:gap-2">
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary">
          <Video className="h-5 w-5" />
          <span className="sr-only">Video Call</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary">
          <Phone className="h-5 w-5" />
          <span className="sr-only">Audio Call</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary">
          <MoreVertical className="h-5 w-5" />
          <span className="sr-only">More Options</span>
        </Button>
      </div>
    </header>
  );
}
