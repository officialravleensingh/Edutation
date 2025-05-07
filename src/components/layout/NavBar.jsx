
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { UserNav } from "./UserNav";


export function NavBar({ toggleTheme, isDarkMode }) {
  const [activeTab, setActiveTab] = useState("pomodoro");
  
  return (
    <header className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent">
              Edutation
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeTab === "pomodoro" ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("pomodoro")}
            >
              Pomodoro
            </Link>
            <Link 
              to="/videos" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeTab === "videos" ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("videos")}
            >
              Videos
            </Link>
            <Link 
              to="/resources" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeTab === "resources" ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("resources")}
            >
              Resources
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="rounded-full"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
