"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { saveJob, unsaveJob } from "@/app/actions/jobs";
import { SignupPromptModal } from "@/components/SignupPromptModal";

interface SaveJobButtonProps {
  jobId: string;
  initiallySaved: boolean;
  size?: "sm" | "default";
}

export function SaveJobButton({ jobId, initiallySaved, size = "default" }: SaveJobButtonProps) {
  const [isSaved, setIsSaved] = useState(initiallySaved);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const router = useRouter();
  
  // Get auth state - useUser returns { isSignedIn: false } when not authenticated
  const { isSignedIn = false } = useUser();

  const handleToggle = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // If not signed in, show signup modal
    if (!isSignedIn) {
      setShowSignupModal(true);
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        await unsaveJob(jobId);
        setIsSaved(false);
      } else {
        await saveJob(jobId);
        setIsSaved(true);
      }
      router.refresh();
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Compact icon-only version for browse page
  if (size === "sm") {
    return (
      <>
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`rounded-full p-2 transition-all hover:bg-neutral-100 ${
            isSaved ? "text-[#A52A2A]" : "text-neutral-400 hover:text-neutral-600"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-label={isSaved ? "Unsave job" : "Save job"}
          title={!isSignedIn ? "Sign up to save jobs" : isSaved ? "Unsave job" : "Save job"}
        >
          {isSaved ? (
            <BookmarkCheck className="h-5 w-5 fill-current" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </button>
        <SignupPromptModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          message="Create a free account to save jobs and track your applications."
          action="save"
        />
      </>
    );
  }

  // Full button version for job detail page
  return (
    <>
      <Button
        onClick={handleToggle}
        disabled={isLoading}
        variant={isSaved ? "default" : "outline"}
        className="gap-2"
      >
        {isSaved ? (
          <>
            <BookmarkCheck className="h-4 w-4" />
            Saved
          </>
        ) : (
          <>
            <Bookmark className="h-4 w-4" />
            Save Job
          </>
        )}
      </Button>
      <SignupPromptModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        message="Create a free account to save jobs and track your applications."
        action="save"
      />
    </>
  );
}
