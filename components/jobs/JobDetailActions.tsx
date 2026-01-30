"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { SignupPromptModal } from "@/components/SignupPromptModal";
import { useState } from "react";
import type { Job } from "@/lib/types";

interface JobDetailActionsProps {
  job: Job;
}

export function JobDetailActions({ job }: JobDetailActionsProps) {
  const { isSignedIn = false } = useUser();
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleApply = () => {
    if (!isSignedIn) {
      setShowSignupModal(true);
      return;
    }
    // If signed in and has source_url, open in new tab
    if (job.source_url) {
      window.open(job.source_url, "_blank", "noopener,noreferrer");
    }
  };

  if (!job.source_url) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleApply}
        size="lg"
        className="w-full md:w-auto"
      >
        Apply
        <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
      <SignupPromptModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        message="Create a free account to apply to jobs and track your applications."
        action="apply"
      />
    </>
  );
}
