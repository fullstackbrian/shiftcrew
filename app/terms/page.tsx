import { Header } from "@/components/landing/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service",
  description: "ShiftCrew Terms of Service - Read our terms and conditions for using the platform.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>

          <div className="prose prose-neutral max-w-none space-y-8 text-base leading-relaxed text-neutral-700">
            <p className="text-sm text-neutral-500">
              Last updated: January 30, 2026
            </p>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using ShiftCrew ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                2. User Accounts
              </h2>
              <p>
                To access certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                3. Prohibited Uses
              </h2>
              <p>You agree not to use the Service to:</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Post false, misleading, or fraudulent information</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Impersonate any person or entity</li>
                <li>Collect or store personal data about other users</li>
                <li>Use automated systems to access the Service without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                4. User Content
              </h2>
              <p>
                You retain ownership of any content you post, including reviews and profile information. By posting content, you grant ShiftCrew a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content on the Service.
              </p>
              <p className="mt-4">
                You are solely responsible for your content and agree that it:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Is accurate and truthful</li>
                <li>Does not violate any third-party rights</li>
                <li>Complies with all applicable laws</li>
                <li>Is not defamatory, obscene, or offensive</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                5. Disclaimers
              </h2>
              <p>
                ShiftCrew provides the Service "as is" without warranties of any kind. We do not guarantee:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>The accuracy or completeness of job listings</li>
                <li>The accuracy of pay information or reviews</li>
                <li>That the Service will be uninterrupted or error-free</li>
                <li>The quality or safety of any restaurant or job opportunity</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                6. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, ShiftCrew shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                7. Termination
              </h2>
              <p>
                We reserve the right to suspend or terminate your account and access to the Service at any time, with or without cause or notice, for any reason including, but not limited to, breach of these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                8. Governing Law
              </h2>
              <p>
                These Terms of Service shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                9. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by posting the new Terms of Service on this page. Your continued use of the Service after such changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                10. Contact Information
              </h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at{" "}
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
