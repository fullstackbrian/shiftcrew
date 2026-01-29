import { Suspense } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { Solution } from "@/components/landing/Solution";
import { ForEmployers } from "@/components/landing/ForEmployers";
import { EmailCapture } from "@/components/landing/EmailCapture";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
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
  );
}
