/**
 * Update existing reviews to be more positive
 * Run with: npx tsx scripts/update-reviews-positive.ts
 * 
 * This script updates:
 * - Ratings to be higher (3-5 range, weighted towards 4-5)
 * - Pros to be more positive
 * - Cons to be more balanced/constructive
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const positivePros = [
  "Amazing tips, especially on weekends - can make $300+ on a good night",
  "Management is incredibly supportive and understanding",
  "Team is like family, everyone helps each other out",
  "Great work-life balance, very flexible scheduling",
  "Free shift meals, and the food quality is excellent",
  "Amazing opportunity to learn from world-class chefs",
  "Fast-paced but well-organized kitchen",
  "Regulars are super friendly and tip generously",
  "Spotless kitchen, excellent safety standards",
  "Clear opportunities for advancement and growth",
  "Fun, energetic atmosphere - never a dull moment",
  "Great benefits package including health insurance",
  "Management really values employee feedback",
  "Consistent schedule, reliable hours",
  "Staff parties and team building events",
  "Competitive pay with regular raises",
  "Positive work culture, minimal drama",
  "Good training program for new hires",
];

const balancedCons = [
  "Can get very busy during peak hours (but tips make it worth it)",
  "Occasionally short-staffed on busy nights",
  "Physical work - on your feet all shift",
  "Tips can vary day to day (but weekends are great)",
  "Some customers can be challenging (but most are great)",
  "Fast-paced environment (good for those who like it busy)",
  "Weekend shifts are mandatory (but that's when the money is)",
  "Kitchen can get hot during summer months",
  "Need to be flexible with schedule changes",
  "Learning curve can be steep at first",
];

function getRandomPositiveRating(): number {
  // Weighted towards 4s and 5s
  const rand = Math.random();
  if (rand < 0.4) return 5; // 40% chance of 5
  if (rand < 0.7) return 4; // 30% chance of 4
  return 3; // 30% chance of 3
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

async function updateReviews() {
  console.log("🔄 Fetching existing reviews...");
  
  const { data: reviews, error: fetchError } = await supabase
    .from("reviews")
    .select("*");

  if (fetchError) {
    console.error("Error fetching reviews:", fetchError);
    throw fetchError;
  }

  if (!reviews || reviews.length === 0) {
    console.log("No reviews found to update.");
    return;
  }

  console.log(`Found ${reviews.length} reviews to update\n`);

  let updated = 0;
  let errors = 0;

  for (const review of reviews) {
    const updates = {
      rating_pay: getRandomPositiveRating(),
      rating_culture: getRandomPositiveRating(),
      rating_management: getRandomPositiveRating(),
      rating_worklife: getRandomPositiveRating(),
      pros: getRandomItem(positivePros),
      cons: getRandomItem(balancedCons),
    };

    const { error } = await supabase
      .from("reviews")
      .update(updates)
      .eq("id", review.id);

    if (error) {
      console.error(`Error updating review ${review.id}:`, error);
      errors++;
    } else {
      updated++;
      if (updated % 10 === 0) {
        console.log(`Updated ${updated}/${reviews.length} reviews...`);
      }
    }
  }

  console.log(`\n✅ Update complete!`);
  console.log(`   - Successfully updated: ${updated} reviews`);
  if (errors > 0) {
    console.log(`   - Errors: ${errors} reviews`);
  }
  console.log(`\nNote: Restaurant ratings will auto-update via trigger.`);
}

async function main() {
  console.log("🌱 Starting review update process...\n");

  try {
    await updateReviews();
  } catch (error) {
    console.error("\n❌ Update failed:", error);
    process.exit(1);
  }
}

main();
