"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface BrowseTabsProps {
  hasUser: boolean;
  children: {
    all: React.ReactNode;
    saved: React.ReactNode;
  };
}

export function BrowseTabs({ hasUser, children }: BrowseTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "all";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("tab");
    } else {
      params.set("tab", value);
    }
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
      <TabsList>
        <TabsTrigger value="all">All Jobs</TabsTrigger>
        <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-6">
        {children.all}
      </TabsContent>
      
      <TabsContent value="saved" className="mt-6">
        {children.saved}
      </TabsContent>
    </Tabs>
  );
}
