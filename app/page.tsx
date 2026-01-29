import { Suspense } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { Solution } from "@/components/landing/Solution";
import { ForEmployers } from "@/components/landing/ForEmployers";
import { EmailCapture } from "@/components/landing/EmailCapture";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Home",
  description:
    "Find restaurant jobs with real transparency. See verified pay and honest culture reviews from workers at that location—before you apply.",
};

export default function Home() {
  return (
    <>
      {/* Structured Data - JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "ShiftCrew",
            url: "https://www.shift-crew.com",
            logo: "https://www.shift-crew.com/logo.png",
            description:
              "The Professional Network for Restaurant Workers. See verified pay, culture reviews, and W-2 career jobs.",
            sameAs: [],
            contactPoint: {
              "@type": "ContactPoint",
              email: "fullstackbrian@gmail.com",
              contactType: "Customer Service",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "ShiftCrew",
            url: "https://www.shift-crew.com",
            description:
              "The Professional Network for Restaurant Workers. See verified pay, culture reviews, and W-2 career jobs.",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://www.shift-crew.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "ShiftCrew - Restaurant Worker Job Platform",
            description:
              "Find restaurant jobs with real transparency. See verified pay and honest culture reviews from workers at that location—before you apply.",
            url: "https://www.shift-crew.com",
            inLanguage: "en-US",
            isPartOf: {
              "@type": "WebSite",
              name: "ShiftCrew",
              url: "https://www.shift-crew.com",
            },
          }),
        }}
      />

      <div className="min-h-screen bg-background">
        <Header />
        <Hero />
        <Problem />
        <Solution />
        <Suspense fallback={<div className="h-96" />}>
          <EmailCapture />
        </Suspense>
        <ForEmployers />
        <Footer />
      </div>
    </>
  );
}
