import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { User, LogOut, BookUser } from 'lucide-react';


export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 no-print">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <h1 className="text-2xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
          পরীক্ষা কারিগর
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-amber-500/50">
                <AvatarImage src="https://placehold.co/100x100.png" alt="Teacher" />
                <AvatarFallback>T</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">শিক্ষক</p>
                <p className="text-xs leading-none text-muted-foreground">
                  teacher@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>প্রোফাইল</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BookUser className="mr-2 h-4 w-4" />
              <span>আমার প্রশ্নপত্র</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
               <LogOut className="mr-2 h-4 w-4" />
              <span>লগ আউট</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
