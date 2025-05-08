
import { useState, useEffect } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { ResourcesList } from "@/components/resources/ResourcesList";

const Resources = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);
  
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <main className="flex-1 py-8 container">
        <div className="mb-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
            Resources
          </h1>
          <p className="text-muted-foreground text-xl">
            Download our productivity templates, guides, and cheat sheets.
          </p>
        </div>
        
        <ResourcesList />
      </main>
    </div>
  );
};

export default Resources;
