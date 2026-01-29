import { DollarSign, Users, Award, TrendingDown, UtensilsCrossed, Coffee, ChefHat } from "lucide-react";

// Hero illustration - Restaurant workers
export function HeroIllustration() {
  return (
    <div className="mx-auto mt-12 flex max-w-md items-center justify-center gap-4 md:mt-16">
      <div className="flex -space-x-3">
        {/* Server */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-green-100 shadow-xl">
          <Users className="h-10 w-10 text-green-600" />
        </div>
        {/* Cook */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-orange-100 shadow-xl">
          <ChefHat className="h-10 w-10 text-orange-600" />
        </div>
        {/* Bartender */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-blue-100 shadow-xl">
          <Coffee className="h-10 w-10 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

// Problem illustrations
export function MoneyProblemIllustration() {
  return (
    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 shadow-md">
      <TrendingDown className="h-10 w-10 text-red-500" />
    </div>
  );
}

export function CultureProblemIllustration() {
  return (
    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50 shadow-md">
      <Users className="h-10 w-10 text-orange-500" />
    </div>
  );
}

export function ReputationProblemIllustration() {
  return (
    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 shadow-md">
      <Award className="h-10 w-10 text-red-500" />
    </div>
  );
}

// Solution illustrations - Enhanced versions
export function PayIllustration() {
  return (
    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-50 shadow-lg">
      <div className="relative">
        <DollarSign className="h-10 w-10 text-green-600" />
        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600">
          <span className="text-xs font-bold text-white">✓</span>
        </div>
      </div>
    </div>
  );
}

export function CultureIllustration() {
  return (
    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 shadow-lg">
      <div className="relative">
        <Users className="h-10 w-10 text-blue-600" />
        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
          <span className="text-xs font-bold text-white">✓</span>
        </div>
      </div>
    </div>
  );
}

export function ReputationIllustration() {
  return (
    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50 shadow-lg">
      <div className="relative">
        <Award className="h-10 w-10 text-orange-600" />
        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600">
          <span className="text-xs font-bold text-white">✓</span>
        </div>
      </div>
    </div>
  );
}

// Decorative elements
export function DecorativeDots() {
  return (
    <div className="absolute right-0 top-0 -z-10 h-64 w-64 opacity-5">
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="50" cy="50" r="2" fill="currentColor" />
        <circle cx="100" cy="50" r="2" fill="currentColor" />
        <circle cx="150" cy="50" r="2" fill="currentColor" />
        <circle cx="50" cy="100" r="2" fill="currentColor" />
        <circle cx="100" cy="100" r="2" fill="currentColor" />
        <circle cx="150" cy="100" r="2" fill="currentColor" />
        <circle cx="50" cy="150" r="2" fill="currentColor" />
        <circle cx="100" cy="150" r="2" fill="currentColor" />
        <circle cx="150" cy="150" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}
