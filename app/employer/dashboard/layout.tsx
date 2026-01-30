"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, LayoutDashboard, Briefcase, Users, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface UserData {
  restaurant_id: string | null;
  restaurant?: {
    id: string;
    name: string;
  };
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch("/api/user/current");
        const data = await response.json();

        if (!data.user || data.user.role !== "employer") {
          router.replace("/onboarding");
          return;
        }

        if (!data.user.restaurant_id) {
          router.replace("/employer/onboarding");
          return;
        }

        setUserData({
          restaurant_id: data.user.restaurant_id,
          restaurant: data.restaurant,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A52A2A]"></div>
      </div>
    );
  }

  if (!userData?.restaurant_id) {
    return null;
  }

  const navItems = [
    {
      href: "/employer/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/employer/dashboard/jobs",
      label: "Jobs",
      icon: Briefcase,
    },
    {
      href: "/employer/dashboard/applications",
      label: "Applications",
      icon: Users,
    },
    {
      href: "/employer/dashboard/restaurant",
      label: "Restaurant",
      icon: Building2,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/employer/dashboard" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#A52A2A]">ShiftCrew</span>
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800 border-orange-200 text-xs"
              >
                <Building2 className="mr-1 h-3 w-3" />
                Employer
              </Badge>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || 
                  (item.href !== "/employer/dashboard" && pathname?.startsWith(item.href));
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium flex items-center gap-2 transition-colors pb-1",
                      isActive
                        ? "text-[#A52A2A] border-b-2 border-[#A52A2A]"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {userData.restaurant && (
              <Link
                href={`/restaurants/${userData.restaurant.id}`}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                View Public Profile
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800 border-orange-200 text-xs"
              >
                <Building2 className="mr-1 h-3 w-3" />
                Employer
              </Badge>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
