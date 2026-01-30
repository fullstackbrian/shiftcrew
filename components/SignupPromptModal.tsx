"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SignupPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  action: "save" | "apply" | "review";
}

export function SignupPromptModal({ isOpen, onClose, message, action }: SignupPromptModalProps) {
  const actionLabels = {
    save: "save jobs",
    apply: "apply",
    review: "leave reviews",
  };

  const actionLabel = actionLabels[action];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Sign up to {actionLabel}
          </DialogTitle>
          <DialogDescription className="text-base text-neutral-600 mt-2">
            {message}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/sign-up" onClick={onClose} aria-label="Sign up for a free account">
              Sign Up Free
            </Link>
          </Button>
          <p className="text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link 
              href="/sign-in" 
              className="text-[#A52A2A] hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-[#A52A2A] focus:ring-offset-2 rounded-sm" 
              onClick={onClose}
              aria-label="Sign in to your account"
            >
              Sign in
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
