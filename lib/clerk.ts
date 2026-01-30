import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return null;
    }

    // Get or create user in Supabase
    const supabase = await createClient();
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_user_id", userId)
      .single();

    if (error && error.code === "PGRST116") {
      // User doesn't exist in Supabase, create them
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      const name = clerkUser.firstName || clerkUser.lastName
        ? `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim()
        : null;

      if (!email) {
        return null;
      }

      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          clerk_user_id: userId,
          email: email,
          name: name,
          role: null, // No role set initially - user must go through onboarding
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating user:", {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint,
          fullError: JSON.stringify(insertError, Object.getOwnPropertyNames(insertError)),
        });
        return null;
      }

      return newUser;
    }

    if (error) {
      console.error("Error fetching user:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      });
      return null;
    }

    return user;
  } catch (error) {
    // Clerk not configured or auth failed - return null
    return null;
  }
}

export async function requireAuth() {
  const { redirect } = await import("next/navigation");
  
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect("/sign-up?message=Sign up to access this feature");
    }

    const user = await getCurrentUser();
    if (!user) {
      redirect("/sign-up?message=Sign up to access this feature");
    }

    return user;
  } catch (error) {
    redirect("/sign-up?message=Sign up to access this feature");
  }
}
