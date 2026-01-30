"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Building2, Loader2 } from "lucide-react";
import { updateUserRole } from "@/app/actions/user";
import Link from "next/link";

export function OnboardingClient() {
  const router = useRouter();
  const [loading, setLoading] = useState<"worker" | "employer" | null>(null);

  const handleSelectRole = async (role: "worker" | "employer") => {
    setLoading(role);
    try {
      await updateUserRole(role);
      if (role === "worker") {
        router.push("/browse");
      } else {
        router.push("/employer/onboarding");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#A52A2A]">ShiftCrew</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to ShiftCrew!
            </h1>
            <p className="text-gray-600">
              How would you like to use ShiftCrew?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Worker Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[#A52A2A]">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-2">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">I&apos;m looking for restaurant jobs</CardTitle>
                <CardDescription>
                  Browse jobs, read reviews, and find your next opportunity
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  onClick={() => handleSelectRole("worker")}
                  disabled={loading !== null}
                >
                  {loading === "worker" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    "Continue as Job Seeker"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Employer Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[#A52A2A]">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-orange-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-2">
                  <Building2 className="h-8 w-8 text-[#A52A2A]" />
                </div>
                <CardTitle className="text-xl">I&apos;m hiring restaurant workers</CardTitle>
                <CardDescription>
                  Post jobs, receive applications, and find great talent
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Button
                  className="w-full bg-[#A52A2A] hover:bg-[#8B0000]"
                  size="lg"
                  onClick={() => handleSelectRole("employer")}
                  disabled={loading !== null}
                >
                  {loading === "employer" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    "Continue as Employer"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
