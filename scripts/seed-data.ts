/**
 * Seed data script for ShiftCrew MVP
 * Run with: npm run seed
 * 
 * This script creates:
 * - 10 LA restaurants
 * - 25-30 job listings
 * - 40-50 realistic reviews
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

const restaurants = [
  {
    name: "The Ivy",
    address: "113 N Robertson Blvd",
    city: "Los Angeles",
    neighborhood: "West Hollywood",
    cuisine_type: "American",
  },
  {
    name: "Nobu Malibu",
    address: "22706 Pacific Coast Hwy",
    city: "Malibu",
    neighborhood: "Malibu",
    cuisine_type: "Japanese",
  },
  {
    name: "Republique",
    address: "624 S La Brea Ave",
    city: "Los Angeles",
    neighborhood: "Mid-City",
    cuisine_type: "French",
  },
  {
    name: "Bestia",
    address: "2121 E 7th Pl",
    city: "Los Angeles",
    neighborhood: "Arts District",
    cuisine_type: "Italian",
  },
  {
    name: "Gjelina",
    address: "1429 Abbot Kinney Blvd",
    city: "Venice",
    neighborhood: "Venice",
    cuisine_type: "California",
  },
  {
    name: "Providence",
    address: "5955 Melrose Ave",
    city: "Los Angeles",
    neighborhood: "Hollywood",
    cuisine_type: "Seafood",
  },
  {
    name: "Majordomo",
    address: "1725 Naud St",
    city: "Los Angeles",
    neighborhood: "Chinatown",
    cuisine_type: "Korean",
  },
  {
    name: "Guerilla Tacos",
    address: "2000 E 7th St",
    city: "Los Angeles",
    neighborhood: "Arts District",
    cuisine_type: "Mexican",
  },
  {
    name: "Sqirl",
    address: "720 N Virgil Ave",
    city: "Los Angeles",
    neighborhood: "Silver Lake",
    cuisine_type: "Breakfast",
  },
  {
    name: "Animal",
    address: "435 N Fairfax Ave",
    city: "Los Angeles",
    neighborhood: "Fairfax",
    cuisine_type: "American",
  },
];

const jobTitles = [
  "Server",
  "Line Cook",
  "Bartender",
  "Host/Hostess",
  "Sous Chef",
  "Prep Cook",
  "Food Runner",
  "Busser",
  "Barback",
  "Dishwasher",
];

const payRanges = [
  { min: 18, max: 25, type: "hourly", range: "$18-25/hr" },
  { min: 20, max: 30, type: "hourly", range: "$20-30/hr" },
  { min: 22, max: 28, type: "hourly", range: "$22-28/hr" },
  { min: 16, max: 22, type: "hourly", range: "$16-22/hr" },
  { min: 50, max: 60, type: "salary", range: "$50k-60k/year" },
  { min: 45, max: 55, type: "salary", range: "$45k-55k/year" },
  { min: 15, max: 20, type: "hourly+tips", range: "$15-20/hr + tips" },
];

const reviewPros = [
  "Great tips, especially on weekends",
  "Management is supportive and understanding",
  "Team is like family, everyone helps each other",
  "Good work-life balance, flexible scheduling",
  "Free shift meals, quality food",
  "Opportunity to learn from experienced chefs",
  "Fast-paced but organized kitchen",
  "Regulars are friendly and tip well",
  "Clean kitchen, good safety standards",
  "Opportunities for advancement",
];

const reviewCons = [
  "Can get very busy, stressful during rush",
  "Management sometimes cuts hours early",
  "Some toxic coworkers, high turnover",
  "Long hours, hard to get time off",
  "No health insurance for part-time",
  "Kitchen can be disorganized during peak times",
  "Tips vary wildly day to day",
  "Some customers can be difficult",
  "Physical work, on your feet all shift",
  "Not enough staff, often short-handed",
];

async function seedRestaurants() {
  console.log("Seeding restaurants...");
  const { data, error } = await supabase
    .from("restaurants")
    .insert(restaurants)
    .select();

  if (error) {
    console.error("Error seeding restaurants:", error);
    throw error;
  }

  console.log(`✅ Created ${data.length} restaurants`);
  return data;
}

async function seedJobs(restaurantIds: string[]) {
  console.log("Seeding jobs...");
  const jobs = [];

  // Create 2-4 jobs per restaurant
  for (const restaurantId of restaurantIds) {
    const numJobs = Math.floor(Math.random() * 3) + 2; // 2-4 jobs
    for (let i = 0; i < numJobs; i++) {
      const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      const pay = payRanges[Math.floor(Math.random() * payRanges.length)];
      const daysAgo = Math.floor(Math.random() * 14); // Posted 0-14 days ago

      jobs.push({
        restaurant_id: restaurantId,
        title,
        description: `Looking for an experienced ${title.toLowerCase()} to join our team. Must have ${Math.floor(Math.random() * 5) + 1} years of experience. Fast-paced environment, great team culture.`,
        pay_range: pay.range,
        pay_min: pay.min,
        pay_max: pay.max,
        pay_type: pay.type,
        source: "indeed",
        source_url: `https://indeed.com/viewjob?jk=${Math.random().toString(36).substring(7)}`,
        status: "active",
        posted_date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  }

  const { data, error } = await supabase.from("jobs").insert(jobs).select();

  if (error) {
    console.error("Error seeding jobs:", error);
    throw error;
  }

  console.log(`✅ Created ${data.length} jobs`);
  return data;
}

async function seedReviews(restaurantIds: string[]) {
  console.log("Seeding reviews...");
  
  // First, create some fake users for reviews
  const fakeUsers = [];
  for (let i = 0; i < 20; i++) {
    fakeUsers.push({
      clerk_user_id: `fake_user_${i}`,
      email: `reviewer${i}@example.com`,
      name: `Reviewer ${i}`,
      role: "worker",
      position: jobTitles[Math.floor(Math.random() * jobTitles.length)],
    });
  }

  const { data: users, error: usersError } = await supabase
    .from("users")
    .insert(fakeUsers)
    .select();

  if (usersError && !usersError.message.includes("duplicate")) {
    console.error("Error creating fake users:", usersError);
    // Continue anyway - might already exist
  }

  const userIds = users?.map((u) => u.id) || [];

  const reviews = [];
  
  // Create 3-6 reviews per restaurant
  for (const restaurantId of restaurantIds) {
    const numReviews = Math.floor(Math.random() * 4) + 3; // 3-6 reviews
    const usedUserIds = new Set<string>();

    for (let i = 0; i < numReviews; i++) {
      // Pick a user that hasn't reviewed this restaurant yet
      let userId = userIds[Math.floor(Math.random() * userIds.length)];
      let attempts = 0;
      while (usedUserIds.has(userId) && attempts < 10) {
        userId = userIds[Math.floor(Math.random() * userIds.length)];
        attempts++;
      }
      usedUserIds.add(userId);

      const position = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      const ratingPay = Math.floor(Math.random() * 3) + 2; // 2-5
      const ratingCulture = Math.floor(Math.random() * 3) + 2; // 2-5
      const ratingManagement = Math.floor(Math.random() * 3) + 2; // 2-5
      const ratingWorklife = Math.floor(Math.random() * 3) + 2; // 2-5

      const pros = reviewPros[Math.floor(Math.random() * reviewPros.length)];
      const cons = reviewCons[Math.floor(Math.random() * reviewCons.length)];

      reviews.push({
        user_id: userId,
        restaurant_id: restaurantId,
        position,
        rating_pay: ratingPay,
        rating_culture: ratingCulture,
        rating_management: ratingManagement,
        rating_worklife: ratingWorklife,
        pros,
        cons,
        verified: Math.random() > 0.3, // 70% verified
      });
    }
  }

  const { data, error } = await supabase.from("reviews").insert(reviews).select();

  if (error) {
    console.error("Error seeding reviews:", error);
    throw error;
  }

  console.log(`✅ Created ${data.length} reviews`);
  return data;
}

async function main() {
  console.log("🌱 Starting seed process...\n");

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    // await supabase.from("reviews").delete();
    // await supabase.from("saved_jobs").delete();
    // await supabase.from("jobs").delete();
    // await supabase.from("restaurants").delete();

    const restaurantsData = await seedRestaurants();
    const restaurantIds = restaurantsData.map((r) => r.id);

    const jobsData = await seedJobs(restaurantIds);
    await seedReviews(restaurantIds);

    console.log("\n✅ Seed completed successfully!");
    console.log(`   - ${restaurantsData.length} restaurants`);
    console.log(`   - ${jobsData.length} jobs`);
    console.log(`   - Reviews created (ratings will auto-update)`);
  } catch (error) {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  }
}

main();
