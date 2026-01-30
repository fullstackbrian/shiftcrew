"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Pause,
  Play,
  CheckCircle,
  Trash2,
  Loader2,
  Calendar,
  Users,
  Briefcase,
} from "lucide-react";
import { getEmployerJobs, updateJobStatus, deleteJob } from "@/app/actions/employer";
import { Job } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "paused" | "filled">("all");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const statusMap = {
          all: undefined,
          active: "active" as const,
          paused: "paused" as const,
          filled: "filled" as const,
        };
        const fetchedJobs = await getEmployerJobs(statusMap[activeTab]);
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [activeTab]);

  const handleStatusUpdate = async (jobId: string, status: "active" | "paused" | "filled" | "expired") => {
    setUpdating(jobId);
    try {
      await updateJobStatus(jobId, status);
      // Refresh jobs
      const statusMap = {
        all: undefined,
        active: "active" as const,
        paused: "paused" as const,
        filled: "filled" as const,
      };
      const fetchedJobs = await getEmployerJobs(statusMap[activeTab]);
      setJobs(fetchedJobs);
    } catch (error) {
      console.error("Error updating job status:", error);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) {
      return;
    }
    setUpdating(jobId);
    try {
      await deleteJob(jobId);
      setJobs(jobs.filter((j) => j.id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: Job["status"]) => {
    const variants = {
      active: "bg-[#A52A2A]/20 text-[#A52A2A] border-[#A52A2A]/30",
      paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
      filled: "bg-blue-100 text-blue-800 border-blue-200",
      expired: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      <Badge className={variants[status]} variant="outline">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#A52A2A]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600 mt-1">Manage your job postings</p>
        </div>
        <Link href="/employer/dashboard/jobs/new">
          <Button className="bg-[#A52A2A] hover:bg-[#8B0000]">
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="paused">Paused</TabsTrigger>
              <TabsTrigger value="filled">Filled</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-2">No jobs found</p>
              <p className="text-sm text-gray-400">
                {activeTab === "all"
                  ? "Post your first job to get started!"
                  : `No ${activeTab} jobs at the moment.`}
              </p>
              {activeTab === "all" && (
                <Link href="/employer/dashboard/jobs/new">
                  <Button className="mt-4 bg-[#16A34A] hover:bg-[#15803d]">
                    <Plus className="mr-2 h-4 w-4" />
                    Post New Job
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Job Title</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Posted Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Applications</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{job.title}</div>
                        {job.pay_range && (
                          <div className="text-sm text-gray-500 mt-1">{job.pay_range}</div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {formatDate(job.posted_date || job.created_at)}
                        </div>
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(job.status)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          {/* TODO: Replace with actual application count when applications table exists */}
                          0
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={updating === job.id}
                              >
                                {updating === job.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MoreVertical className="h-4 w-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => router.push(`/jobs/${job.id}`)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => router.push(`/employer/dashboard/jobs/${job.id}/edit`)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {job.status === "active" ? (
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(job.id, "paused")}
                                >
                                  <Pause className="mr-2 h-4 w-4" />
                                  Pause
                                </DropdownMenuItem>
                              ) : job.status === "paused" ? (
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(job.id, "active")}
                                >
                                  <Play className="mr-2 h-4 w-4" />
                                  Activate
                                </DropdownMenuItem>
                              ) : null}
                              {job.status !== "filled" && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(job.id, "filled")}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark Filled
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(job.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
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
