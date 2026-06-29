"use client";

import { Link } from 'react-router-dom';
import { Button } from "./ui/button";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export function Header({ session }: { session: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert('Logged out successfully!');
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">SurplusShare</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium no-underline"
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  window.location.hash = '';
                }
              }}
            >
              Home
            </a>
            
            <a
              href="#impact"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium no-underline"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Impact
            </a>

            <a
              href="#portals"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium no-underline"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('portals')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Portals
            </a>

            {/* Added visibility to Donor Portal link if logged in */}
            {session && (
              <Link to="/donor" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium no-underline">
                Donor Portal
              </Link>
            )}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground max-w-[150px] truncate">
                  {session.user.email}
                </span>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button size="sm" asChild>
                <Link to="/login" className="no-underline">
                  Sign In
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Slideout */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col px-4 py-4 gap-4">
            <a
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium no-underline"
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Home
            </a>
            <a
              href="#impact"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium no-underline"
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Impact
            </a>
            <a
              href="#portals"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium no-underline"
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('portals')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Portals
            </a>
            {session && (
              <Link 
                to="/donor" 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Donor Portal
              </Link>
            )}

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              {session ? (
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground px-2 truncate">
                    {session.user.email}
                  </span>
                  <Button variant="destructive" className="justify-center" onClick={handleLogout}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button className="justify-center" asChild>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}