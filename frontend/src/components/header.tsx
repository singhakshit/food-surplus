"use client";

import { Link } from 'react-router-dom';
import { Button } from "./ui/button";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">FoodShare</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="#impact"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Impact
            </Link>
            <Link
              to="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              How It Works
            </Link>
            <Link
              to="#portals"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Portals
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="#portals">Sign In</Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col px-4 py-4 gap-4">
            <Link
              to="#impact"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Impact
            </Link>
            <Link
              to="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              to="#portals"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Portals
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="#portals" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
