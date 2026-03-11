import { Outlet, Link } from 'react-router-dom';
import { Activity, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLocation } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4 justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">SubTrack</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                location.pathname === '/' ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Activity className="h-4 w-4" />
              Home
            </Link>

            {/* Show Dashboard link only when signed in */}
            <SignedIn>
              <Link
                to="/dashboard"
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === '/dashboard' ? "text-primary" : "text-muted-foreground"
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </SignedIn>

            {/* Show Login/Signup when signed out, UserButton when signed in */}
            <SignedOut>
              <Link
                to="/login"
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  location.pathname.startsWith('/login') ? "text-primary" : "text-muted-foreground"
                )}
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                to="/signup"
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  location.pathname.startsWith('/signup') ? "text-primary" : "text-muted-foreground"
                )}
              >
                <UserPlus className="h-4 w-4" />
                Signup
              </Link>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>
    </div>
  );
}
