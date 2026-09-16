"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  const handleAuthAction = () => {
    setIsOpen(false);
    if (status === "authenticated") {
      signOut();
    } else {
      signIn();
    }
  };

  return (
    <nav className="relative m-2">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-slate-950 text-white shadow-lg shadow-slate-900 py-3 px-6 md:px-12 border-2 border-slate-900 rounded-2xl">
        {/* Brand Logo / Name */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold font-playfair">Planora</span>
        </div>

        {/* Desktop Navigation (Hidden on mobile, visible on md+) */}
        <div className="hidden md:flex items-center">
          <Menubar className="border-none bg-transparent gap-7 space-x-1">
            <MenubarMenu>
              <MenubarTrigger className="px-4 py-2 text-slate-200 hover:text-white hover:bg-slate-900 rounded-xl transition-colors cursor-pointer">
                About
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="px-4 py-2 text-slate-200 hover:text-white hover:bg-slate-900 rounded-xl transition-colors cursor-pointer">
                Projects
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="px-4 py-2 text-slate-200 hover:text-white hover:bg-slate-900 rounded-xl transition-colors cursor-pointer">
                How It Works
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              {/* Attached onClick directly to trigger to avoid nested <button> tags */}
              <MenubarTrigger
                onClick={handleAuthAction}
                className="px-4 py-2 text-slate-200 hover:text-white hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
              >
                {status === "authenticated" ? "Sign out" : "Sign in"}
              </MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            type="button"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      {isOpen && (
        <div className="md:hidden mt-2 bg-slate-950 border-2 border-slate-900 rounded-2xl p-4 shadow-lg shadow-slate-900 flex flex-col space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-slate-200 hover:text-white hover:bg-slate-900 rounded-xl transition-colors text-left"
          >
            About
          </a>
          <a
            href="#projects"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-slate-200 hover:text-white hover:bg-slate-900 rounded-xl transition-colors text-left"
          >
            Projects
          </a>
          <a
            href="#how-it-works"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-slate-200 hover:text-white hover:bg-slate-900 rounded-xl transition-colors text-left"
          >
            How It Works
          </a>

          {/* Mobile Sign in / Sign out button */}
          <button
            onClick={handleAuthAction}
            className="px-4 py-2 text-slate-200 hover:text-white hover:bg-slate-900 rounded-xl transition-colors text-left font-medium"
          >
            {status === "authenticated" ? "Sign out" : "Sign in"}
          </button>
        </div>
      )}
    </nav>
  );
}
