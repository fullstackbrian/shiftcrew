"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { SignupPromptModal } from "@/components/SignupPromptModal";
import { useState } from "react";
import Link from "next/link";

interface LeaveReviewButtonProps {
  restaurantId: string;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function LeaveReviewButton({ 
  restaurantId, 
  variant = "default",
  size = "default",
  className 
}: LeaveReviewButtonProps) {
  const { isSignedIn = false } = useUser();
  const [showSignupModal, setShowSignupModal] = useState(false);

  if (isSignedIn) {
    // If signed in, show regular link button
    return (
      <Button 
        asChild 
        variant={variant}
        size={size}
        className={className}
      >
        <Link href={`/review/new?restaurant=${restaurantId}`}>
          Leave a Review
        </Link>
      </Button>
    );
  }

  // If not signed in, show button that opens signup modal
  return (
    <>
      <Button 
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowSignupModal(true)}
      >
        Leave a Review
      </Button>
      <SignupPromptModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        message="Create a free account to share your experience and help other workers."
        action="review"
      />
    </>
  );
}
