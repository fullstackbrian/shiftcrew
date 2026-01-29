"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, Building2 } from "lucide-react";

interface UserTypePickerProps {
  onClose: () => void;
}

export function UserTypePicker({ onClose }: UserTypePickerProps) {
  const router = useRouter();

  const handleSelect = (userType: "worker" | "employer") => {
    onClose();
    if (userType === "worker") {
      // Scroll to worker waitlist section
      setTimeout(() => {
        const section = document.getElementById("waitlist");
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      // Scroll to employer section
      setTimeout(() => {
        const section = document.getElementById("for-employers");
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <Button
        onClick={() => handleSelect("worker")}
        variant="outline"
        className="group h-32 flex-col gap-3 border-2 border-neutral-200 bg-white hover:border-green-500 hover:bg-green-50"
      >
        <Users className="h-8 w-8 text-green-600" />
        <span className="text-base font-semibold">Worker</span>
        <span className="text-sm text-neutral-600">Looking for a job</span>
      </Button>
      <Button
        onClick={() => handleSelect("employer")}
        variant="outline"
        className="group h-32 flex-col gap-3 border-2 border-neutral-200 bg-white hover:border-neutral-900 hover:bg-neutral-50"
      >
        <Building2 className="h-8 w-8 text-neutral-900" />
        <span className="text-base font-semibold">Restaurant</span>
        <span className="text-sm text-neutral-600">Looking to hire</span>
      </Button>
    </div>
  );
}
