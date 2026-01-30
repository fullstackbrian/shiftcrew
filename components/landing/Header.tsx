"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building2 } from "lucide-react";

function UserButtonWithBadge({ userRole }: { userRole: "worker" | "employer" | null }) {
  useEffect(() => {
    if (!userRole) return;

    const injectBadge = () => {
      const mainSection = document.querySelector('.cl-userButtonPopoverMain');
      if (!mainSection) return;

      // Check if badge already exists
      if (mainSection.querySelector('.shiftcrew-role-badge')) return;

      // Create badge element
      const badge = document.createElement('div');
      badge.className = 'shiftcrew-role-badge';
      badge.style.cssText = `
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        margin-top: 16px;
        margin-bottom: 12px;
        font-size: 12px;
        font-weight: 500;
        border-radius: 6px;
        ${userRole === "employer" 
          ? "background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;"
          : "background-color: #dbeafe; color: #1e40af; border: 1px solid #93c5fd;"
        }
      `;
      
      const icon = userRole === "employer" ? "🏢" : "💼";
      const text = userRole === "employer" ? "Employer" : "Crew Finder";
      badge.textContent = `${icon} ${text}`;

      // Insert after user info section
      const userPreview = mainSection.querySelector('.cl-userPreview');
      if (userPreview && userPreview.parentElement) {
        userPreview.parentElement.insertBefore(badge, userPreview.nextSibling);
      } else if (mainSection.firstElementChild) {
        mainSection.insertBefore(badge, mainSection.firstElementChild.nextSibling);
      }
    };

    // Inject when dropdown opens
    const checkAndInject = () => {
      setTimeout(injectBadge, 50);
    };

    // Watch for dropdown
    const observer = new MutationObserver(checkAndInject);
    observer.observe(document.body, { childList: true, subtree: true });

    // Also check periodically
    const interval = setInterval(checkAndInject, 200);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [userRole]);

  return (
    <UserButton 
      afterSignOutUrl="/"
      appearance={{
        elements: {
          userButtonPopoverCard: "min-w-[300px]",
          userButtonPopoverActions: "p-6",
          userButtonPopoverActionButton: "text-sm py-3.5 px-5",
          userButtonPopoverFooter: "p-5",
          userButtonPopoverMain: "p-6",
          userButtonPopoverActionButtonText: "px-2",
        }
      }}
    />
  );
}

export function Header() {
  const [userRole, setUserRole] = useState<"worker" | "employer" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const response = await fetch("/api/user/current");
        const data = await response.json();
        setUserRole(data.user?.role || null);
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserRole();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-8 md:py-4">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex flex-col items-start hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#A52A2A] focus:ring-offset-2 rounded-sm"
          aria-label="ShiftCrew Home"
        >
          <span className="font-heading text-2xl font-bold text-[#A52A2A] leading-tight">
            ShiftCrew
          </span>
          <span className="text-xs font-medium text-[#D6895A] leading-tight mt-0.5">
            BUILT BY CREW, FOR CREW
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <SignedIn>
            {userRole === "worker" && (
              <Link
                href="/browse"
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A52A2A] focus:ring-offset-2 rounded-sm px-1"
                aria-label="Browse restaurant jobs"
              >
                Browse Jobs
              </Link>
            )}
            {userRole === "employer" && (
              <Link
                href="/employer/dashboard"
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A52A2A] focus:ring-offset-2 rounded-sm px-1"
                aria-label="Employer dashboard"
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/profile"
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A52A2A] focus:ring-offset-2 rounded-sm px-1"
              aria-label="View your profile"
            >
              Profile
            </Link>
          </SignedIn>
          <SignedOut>
            <Link
              href="/browse"
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A52A2A] focus:ring-offset-2 rounded-sm px-1"
              aria-label="Browse restaurant jobs"
            >
              Browse Jobs
            </Link>
            <Button asChild variant="outline" size="sm">
              <Link href="/sign-in" aria-label="Sign in to your account">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up" aria-label="Create a new account">Sign Up</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButtonWithBadge userRole={userRole} />
          </SignedIn>
        </nav>

        {/* Mobile menu */}
        <div className="flex items-center gap-4 md:hidden">
          <SignedIn>
            {userRole === "worker" && (
              <Link
                href="/browse"
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A52A2A] focus:ring-offset-2 rounded-sm px-1"
                aria-label="Browse restaurant jobs"
              >
                Browse
              </Link>
            )}
            {userRole === "employer" && (
              <Link
                href="/employer/dashboard"
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A52A2A] focus:ring-offset-2 rounded-sm px-1"
                aria-label="Employer dashboard"
              >
                Dashboard
              </Link>
            )}
          </SignedIn>
          <SignedOut>
            <Link
              href="/browse"
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A52A2A] focus:ring-offset-2 rounded-sm px-1"
              aria-label="Browse restaurant jobs"
            >
              Browse
            </Link>
          </SignedOut>
          <SignedOut>
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in" aria-label="Sign in to your account">Sign In</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButtonWithBadge userRole={userRole} />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
