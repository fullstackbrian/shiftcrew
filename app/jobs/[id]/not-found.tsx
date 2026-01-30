import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-bold text-neutral-900">
          Job Not Found
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          This job listing doesn't exist or has been removed.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/browse">Browse All Jobs</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
