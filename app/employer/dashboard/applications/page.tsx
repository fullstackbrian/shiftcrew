"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Calendar, Briefcase } from "lucide-react";

// TODO: Create applications table in database
// For now, this is a placeholder interface
interface Application {
  id: string;
  job_id: string;
  user_id: string;
  status: "new" | "reviewing" | "interview" | "hired" | "rejected";
  applied_at: string;
  job?: {
    title: string;
  };
  user?: {
    name: string;
    email: string;
  };
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      try {
        // TODO: Replace with actual API call when applications table exists
        // const response = await fetch("/api/employer/applications");
        // const data = await response.json();
        // setApplications(data.applications || []);
        
        // Placeholder: Empty array until applications table is created
        setApplications([]);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  const getStatusBadge = (status: Application["status"]) => {
    const variants = {
      new: "bg-blue-100 text-blue-800 border-blue-200",
      reviewing: "bg-yellow-100 text-yellow-800 border-yellow-200",
      interview: "bg-purple-100 text-purple-800 border-purple-200",
      hired: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      <Badge className={variants[status]} variant="outline">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#16A34A]" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-600 mt-1">Review applications for your job postings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>
            Applications from workers interested in your jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-2">No applications yet</p>
              <p className="text-sm text-gray-400">
                Applications will appear here when workers apply to your jobs
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Applicant</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Job Title</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Applied Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr
                      key={application.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/employer/dashboard/applications/${application.id}`)}
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">
                          {application.user?.name || "Anonymous"}
                        </div>
                        {application.user?.email && (
                          <div className="text-sm text-gray-500">{application.user.email}</div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{application.job?.title || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {formatDate(application.applied_at)}
                        </div>
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(application.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
