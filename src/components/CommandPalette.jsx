import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FileText, Home, Layers, Link as LinkIcon, FolderKanban, BookOpen, Dumbbell, MessageSquare, Phone, MessageCircle, Users, History, Code, Info, User, Settings } from "lucide-react";
import { Timer } from "lucide-react";
import { Target } from "lucide-react";

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  const pages = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Tasks", href: "/tasks", icon: Layers },
    { name: "Notes", href: "/notes", icon: FileText },
    { name: "Quick Links", href: "/quicklinks", icon: LinkIcon },
    { name: "About", href: "/about", icon: Info },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Pomodoro Timer", href: "/pomodoro-timer", icon: Timer },
    { name: "Goal Setting", href: "/goal-setting", icon: Target },
    { name: "Blogs", href: "/blogs", icon: BookOpen },
    { name: "Skills", href: "/skills", icon: Layers },
    { name: "Training", href: "/training", icon: Dumbbell },
    { name: "Queries", href: "/queries", icon: MessageSquare },
    { name: "Contact", href: "/contact", icon: Phone },
    { name: "Chat", href: "/chat", icon: MessageCircle },
    { name: "Chat Users", href: "/chat-user", icon: Users },
    { name: "Chat History", href: "/chat-history", icon: History },
    { name: "Code Log", href: "/code-log", icon: Code },
    { name: "Markdown to PDF", href: "/md-to-pdf", icon: FileText },
    { name: "Rich Text Editor", href: "/rich-text-editor", icon: FileText },
    { name: "JSON Formatter", href: "/json-formatter", icon: Code },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem
              key={page.href}
              onSelect={() => runCommand(() => navigate(page.href))}
            >
              <page.icon className="mr-2 h-4 w-4" />
              <span>{page.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
