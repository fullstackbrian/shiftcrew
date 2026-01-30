import { Header } from "@/components/landing/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description: "ShiftCrew Privacy Policy - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-6 py-12 md:px-8 md:py-16">
          <Link href="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <h1 className="mb-8 text-4xl font-bold text-neutral-900 md:text-5xl">
            Privacy Policy
          </h1>

          <div className="prose prose-neutral max-w-none space-y-8 text-base leading-relaxed text-neutral-700">
            <p className="text-sm text-neutral-500">
              Last updated: January 30, 2026
            </p>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                1. Information We Collect
              </h2>
              <p className="mb-2">We collect information that you provide directly to us:</p>
              <ul className="ml-6 list-disc space-y-2">
                <li><strong>Account Information:</strong> Name, email address, and authentication credentials (handled by Clerk)</li>
                <li><strong>Profile Information:</strong> Position, role (worker/employer), and restaurant affiliation</li>
                <li><strong>Reviews:</strong> Ratings, pros, cons, and other content you submit</li>
                <li><strong>Job Applications:</strong> Information related to jobs you save or apply for</li>
                <li><strong>Waitlist Information:</strong> Email address and user type when joining the waitlist</li>
              </ul>
              <p className="mt-4">
                We also automatically collect certain information when you use the Service, including IP address, browser type, device information, and usage patterns.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                2. How We Use Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Provide, maintain, and improve the Service</li>
                <li>Authenticate users and manage accounts</li>
                <li>Display job listings and restaurant information</li>
                <li>Show reviews and ratings from workers</li>
                <li>Send you updates about the Service (with your consent)</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                3. Third-Party Services
              </h2>
              <p>We use the following third-party services that may collect or process your information:</p>
              <ul className="ml-6 list-disc space-y-2">
                <li><strong>Clerk:</strong> Authentication and user management. See their privacy policy at{" "}
                  <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#A52A2A] hover:underline">
                    clerk.com/privacy
                  </a>
                </li>
                <li><strong>Supabase:</strong> Database and backend services. See their privacy policy at{" "}
                  <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#A52A2A] hover:underline">
                    supabase.com/privacy
                  </a>
                </li>
                <li><strong>Vercel:</strong> Hosting and deployment. See their privacy policy at{" "}
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#A52A2A] hover:underline">
                    vercel.com/legal/privacy-policy
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                4. Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                5. Your Rights
              </h2>
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="ml-6 list-disc space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at{" "}
                <a href="mailto:fullstackbrian@gmail.com" className="text-[#A52A2A] hover:underline">
                  fullstackbrian@gmail.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                6. Data Retention
              </h2>
              <p>
                We retain your personal information for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                7. Children&apos;s Privacy
              </h2>
              <p>
                The Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                8. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                9. Contact Information
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:fullstackbrian@gmail.com" className="text-[#A52A2A] hover:underline">
                  fullstackbrian@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
