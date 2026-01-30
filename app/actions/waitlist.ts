// DEPRECATED: Waitlist removed, users sign up directly via Clerk
// This file is kept for reference but should not be used in the UI

"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export type WaitlistState =
  | { success: true; message: string }
  | { success: false; message: string };

// Common spam/throwaway email domains to block
const BLOCKED_DOMAINS = [
  "10minutemail.com",
  "tempmail.com",
  "guerrillamail.com",
  "mailinator.com",
  "throwaway.email",
  "fakemail.com",
  "trashmail.com",
  "mohmal.com",
  "yopmail.com",
  "getnada.com",
];

// More robust email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function validateEmail(email: string): { valid: boolean; message?: string } {
  // Length check
  if (email.length > 254) {
    return { valid: false, message: "Email address is too long." };
  }

  // Basic format check
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, message: "Please enter a valid email address." };
  }

  // Extract domain
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) {
    return { valid: false, message: "Please enter a valid email address." };
  }

  // Check for blocked domains
  if (BLOCKED_DOMAINS.includes(domain)) {
    return { valid: false, message: "Please use a valid email address." };
  }

  // Check for suspicious patterns (multiple dots, etc.)
  if (domain.split(".").length > 4) {
    return { valid: false, message: "Please enter a valid email address." };
  }

  return { valid: true };
}

async function checkRateLimit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  email: string,
  ipAddress: string | null
): Promise<{ allowed: boolean; message?: string }> {
  // Check for recent submissions from same email (within last hour)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  
  const { data: recentSubmissions, error } = await supabase
    .from("waitlist")
    .select("created_at")
    .eq("email", email.toLowerCase())
    .gte("created_at", oneHourAgo);

  if (error) {
    console.error("Rate limit check error:", error);
    // Don't block on error, but log it
    return { allowed: true };
  }

  if (recentSubmissions && recentSubmissions.length > 0) {
    return {
      allowed: false,
      message: "You've already signed up recently. Please try again later.",
    };
  }

  // Check for rapid submissions from same IP (within last 5 minutes)
  // Note: This requires storing IP addresses. For now, we'll rely on email-based rate limiting.
  // You can add an `ip_address` column to the waitlist table if needed for more robust protection.

  return { allowed: true };
}

export async function joinWaitlist(
  _prev: WaitlistState | null,
  formData: FormData
): Promise<WaitlistState> {
  const email = formData.get("email")?.toString()?.trim();
  const userType = formData.get("user_type")?.toString()?.trim() ?? null;
  const role = formData.get("role")?.toString()?.trim() || null;

  // Get IP address for rate limiting (optional, but helpful)
  const headersList = await headers();
  const ipAddress =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    null;

  if (!email) {
    return { success: false, message: "Please enter your email." };
  }

  // Normalize email to lowercase for consistency
  const normalizedEmail = email.toLowerCase();

  // Validate email format and domain
  const emailValidation = validateEmail(normalizedEmail);
  if (!emailValidation.valid) {
    return { success: false, message: emailValidation.message || "Please enter a valid email." };
  }

  try {
    const supabase = await createClient();

    // Check rate limiting before proceeding
    const rateLimitCheck = await checkRateLimit(supabase, normalizedEmail, ipAddress);
    if (!rateLimitCheck.allowed) {
      return { success: false, message: rateLimitCheck.message || "Too many requests. Please try again later." };
    }
    
    // Build insert object - only include role if it has a value
    const insertData: {
      email: string;
      user_type: string | null;
      role?: string;
    } = {
      email: normalizedEmail,
      user_type: userType ?? null,
    };
    
    if (role && role.trim()) {
      insertData.role = role;
    }
    
    const { error, data } = await supabase.from("waitlist").insert(insertData).select();

    if (error) {
      // Duplicate email
      if (error.code === "23505") {
        return { success: false, message: "You're already on the list. We'll be in touch." };
      }
      // Column doesn't exist (role column missing)
      if (error.code === "42703" || error.message?.includes("column") || error.message?.includes("does not exist")) {
        console.error("Database schema error:", error);
        return { 
          success: false, 
          message: "Database setup incomplete. Please run migrations in Supabase." 
        };
      }
      // Table doesn't exist
      if (error.code === "42P01" || error.message?.includes("relation") || error.message?.includes("does not exist")) {
        console.error("Table missing error:", error);
        return { 
          success: false, 
          message: "Waitlist table not found. Please run migrations in Supabase." 
        };
      }
      // RLS policy blocking
      if (error.code === "42501" || error.message?.includes("policy") || error.message?.includes("permission")) {
        console.error("RLS policy error:", error);
        return { 
          success: false, 
          message: "Permission denied. Check RLS policies in Supabase." 
        };
      }
      
      console.error("Waitlist insert error:", error);
      return { 
        success: false, 
        message: `Error: ${error.message || "Something went wrong. Check console for details."}` 
      };
    }

    return { success: true, message: "You're on the list. We'll reach out when we launch." };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { 
      success: false, 
      message: `Unexpected error: ${err instanceof Error ? err.message : "Unknown error"}` 
    };
  }
}
